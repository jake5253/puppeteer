/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Protocol} from 'devtools-protocol';

import {JSHandle} from '../api/JSHandle.js';
import {Realm} from '../api/Realm.js';
import PuppeteerUtil from '../injected/injected.js';
import {assert} from '../util/assert.js';
import {AsyncIterableUtil} from '../util/AsyncIterableUtil.js';
import {Deferred} from '../util/Deferred.js';
import {stringifyFunction} from '../util/Function.js';

import {ARIAQueryHandler} from './AriaQueryHandler.js';
import {Binding} from './Binding.js';
import {CDPSession} from './Connection.js';
import {CDPElementHandle} from './ElementHandle.js';
import {CDPFrame} from './Frame.js';
import {FrameManager} from './FrameManager.js';
import {CDPJSHandle} from './JSHandle.js';
import {LazyArg} from './LazyArg.js';
import {LifecycleWatcher, PuppeteerLifeCycleEvent} from './LifecycleWatcher.js';
import {scriptInjector} from './ScriptInjector.js';
import {TimeoutSettings} from './TimeoutSettings.js';
import {BindingPayload, EvaluateFunc, HandleFor} from './types.js';
import {
  addPageBinding,
  createEvaluationError,
  createJSHandle,
  debugError,
  getSourcePuppeteerURLIfAvailable,
  isString,
  Mutex,
  PuppeteerURL,
  setPageContent,
  valueFromRemoteObject,
  withSourcePuppeteerURLIfNone,
} from './util.js';
import {WebWorker} from './WebWorker.js';

/**
 * @public
 */
export interface WaitForSelectorOptions {
  /**
   * Wait for the selected element to be present in DOM and to be visible, i.e.
   * to not have `display: none` or `visibility: hidden` CSS properties.
   *
   * @defaultValue `false`
   */
  visible?: boolean;
  /**
   * Wait for the selected element to not be found in the DOM or to be hidden,
   * i.e. have `display: none` or `visibility: hidden` CSS properties.
   *
   * @defaultValue `false`
   */
  hidden?: boolean;
  /**
   * Maximum time to wait in milliseconds. Pass `0` to disable timeout.
   *
   * The default value can be changed by using {@link Page.setDefaultTimeout}
   *
   * @defaultValue `30_000` (30 seconds)
   */
  timeout?: number;
  /**
   * A signal object that allows you to cancel a waitForSelector call.
   */
  signal?: AbortSignal;
}

/**
 * @internal
 */
export interface PageBinding {
  name: string;
  pptrFunction: Function;
}

const SOURCE_URL_REGEX = /^[\040\t]*\/\/[@#] sourceURL=\s*(\S*?)\s*$/m;

/**
 * @internal
 */
export class IsolatedWorld extends Realm {
  #owner: CDPFrame | WebWorker;

  // Contains mapping from functions that should be bound to Puppeteer functions.
  #bindings = new Map<string, Binding>();

  #puppeteerUtilBindingsInstalled = false;
  #puppeteerUtil = new Deferred<JSHandle<PuppeteerUtil>>();

  #contextDescription =
    Deferred.create<Protocol.Runtime.ExecutionContextDescription>();

  #client!: CDPSession;

  constructor(owner: CDPFrame | WebWorker, timeoutSettings: TimeoutSettings) {
    super(timeoutSettings);
    this.#owner = owner;
    this.updateClient(owner.client);
  }

  updateClient(client: CDPSession): void {
    if (this.#client === client) {
      return;
    }
    this.#client = client;
    this.#clientUpdated();
  }

  #clientUpdated(): void {
    this.#client.on('Runtime.bindingCalled', this.#onBindingCalled);
  }

  get client(): CDPSession {
    return this.#client;
  }

  get #frameManager(): FrameManager {
    return this.frame()._frameManager;
  }

  frame(): CDPFrame {
    assert(this.#owner instanceof CDPFrame);
    return this.#owner;
  }

  clearContextDescription(): void {
    if (this.#puppeteerUtil.resolved()) {
      (this.#puppeteerUtil.value() as JSHandle<PuppeteerUtil>)[
        Symbol.dispose
      ]();
    }
    this.#bindings.clear();
    this.#puppeteerUtilBindingsInstalled = false;
  }

  setContextDescription(
    description: Protocol.Runtime.ExecutionContextDescription
  ): void {
    if (this.#contextDescription.finished()) {
      this.#contextDescription = new Deferred();
    }
    if (this.#puppeteerUtil.finished()) {
      this.#puppeteerUtil = new Deferred();
    }
    this.#contextDescription.resolve(description);
    void this.taskManager.rerunAll();
  }

  hasContext(): boolean {
    return this.#contextDescription.resolved();
  }

  evaluateHandle<
    Params extends unknown[],
    Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
    pageFunction: Func | string,
    ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>> {
    pageFunction = withSourcePuppeteerURLIfNone(
      this.evaluateHandle.name,
      pageFunction
    );
    return this.#evaluate(false, pageFunction, ...args);
  }

  evaluate<
    Params extends unknown[],
    Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
    pageFunction: Func | string,
    ...args: Params
  ): Promise<Awaited<ReturnType<Func>>> {
    pageFunction = withSourcePuppeteerURLIfNone(
      this.evaluate.name,
      pageFunction
    );
    return this.#evaluate(true, pageFunction, ...args);
  }

  async setContent(
    html: string,
    options: {
      timeout?: number;
      waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[];
    } = {}
  ): Promise<void> {
    const {
      waitUntil = ['load'],
      timeout = this.timeoutSettings.navigationTimeout(),
    } = options;

    await setPageContent(this, html);

    const watcher = new LifecycleWatcher(
      this.#frameManager.networkManager,
      this.frame(),
      waitUntil,
      timeout
    );
    const error = await Deferred.race<void | Error | undefined>([
      watcher.terminationPromise(),
      watcher.lifecyclePromise(),
    ]);
    watcher.dispose();
    if (error) {
      throw error;
    }
  }

  // If multiple waitFor are set up asynchronously, we need to wait for the
  // first one to set up the binding in the page before running the others.
  #mutex = new Mutex();
  async #installBinding(binding: Binding): Promise<void> {
    const {id: executionContextId} =
      await this.#contextDescription.valueOrThrow();

    if (this.#bindings.has(binding.name)) {
      return;
    }
    this.#bindings.set(binding.name, binding);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    using _ = await this.#mutex.acquire();
    try {
      await this.client.send('Runtime.addBinding', {
        name: binding.name,
        executionContextId,
      });
      await this.evaluate(addPageBinding, 'internal', binding.name);
    } catch (error) {
      // We could have tried to evaluate in a context which was already
      // destroyed. This happens, for example, if the page is navigated while
      // we are trying to add the binding
      if (error instanceof Error) {
        // Destroyed context.
        if (error.message.includes('Execution context was destroyed')) {
          return;
        }
        // Missing context.
        if (error.message.includes('Cannot find context with specified id')) {
          return;
        }
      }

      debugError(error);
    }
  }

  #onBindingCalled = async (
    event: Protocol.Runtime.BindingCalledEvent
  ): Promise<void> => {
    const {id: contextId} = await this.#contextDescription.valueOrThrow();
    let payload: BindingPayload;
    try {
      payload = JSON.parse(event.payload);
    } catch {
      // The binding was either called by something in the page or it was
      // called before our wrapper was initialized.
      return;
    }
    const {type, name, seq, args, isTrivial} = payload;
    if (type !== 'internal') {
      return;
    }
    if (event.executionContextId !== contextId) {
      return;
    }

    try {
      const binding = this.#bindings.get(name);
      assert(binding);
      await binding.run(this, seq, args, isTrivial);
    } catch (err) {
      debugError(err);
    }
  };

  async adoptBackendNode(
    backendNodeId?: Protocol.DOM.BackendNodeId
  ): Promise<JSHandle<Node>> {
    const {id: executionContextId} =
      await this.#contextDescription.valueOrThrow();
    const {object} = await this.client.send('DOM.resolveNode', {
      backendNodeId: backendNodeId,
      executionContextId,
    });
    return createJSHandle(this, object) as JSHandle<Node>;
  }

  async adoptHandle<T extends JSHandle<Node>>(handle: T): Promise<T> {
    if ((handle as unknown as CDPJSHandle<Node>).world === this) {
      // If the context has already adopted this handle, clone it so downstream
      // disposal doesn't become an issue.
      return (await handle.evaluateHandle(value => {
        return value;
        // SAFETY: We know the
      })) as unknown as T;
    }
    const nodeInfo = await this.client.send('DOM.describeNode', {
      objectId: handle.id,
    });
    return (await this.adoptBackendNode(nodeInfo.node.backendNodeId)) as T;
  }

  async transferHandle<T extends JSHandle<Node>>(handle: T): Promise<T> {
    if ((handle as unknown as CDPJSHandle<Node>).world === this) {
      return handle;
    }
    const info = await this.client.send('DOM.describeNode', {
      objectId: handle.remoteObject().objectId,
    });
    const newHandle = (await this.adoptBackendNode(
      info.node.backendNodeId
    )) as T;
    await handle.dispose();
    return newHandle;
  }

  get puppeteerUtil(): Promise<JSHandle<PuppeteerUtil>> {
    let promise = Promise.resolve() as Promise<unknown>;
    if (!this.#puppeteerUtilBindingsInstalled) {
      promise = Promise.all([
        this.#installBinding(
          new Binding(
            '__ariaQuerySelector',
            ARIAQueryHandler.queryOne as (...args: unknown[]) => unknown
          )
        ),
        this.#installBinding(
          new Binding('__ariaQuerySelectorAll', (async (
            element: CDPElementHandle<Node>,
            selector: string
          ): Promise<JSHandle<Node[]>> => {
            const results = ARIAQueryHandler.queryAll(element, selector);
            return (element as unknown as CDPJSHandle<Node>).evaluateHandle(
              (...elements) => {
                return elements;
              },
              ...(await AsyncIterableUtil.collect(results))
            );
          }) as (...args: unknown[]) => unknown)
        ),
      ]);
      this.#puppeteerUtilBindingsInstalled = true;
    }
    scriptInjector.inject(async script => {
      if (this.#puppeteerUtil.resolved()) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        using _ = this.#puppeteerUtil.value() as JSHandle<PuppeteerUtil>;
        this.#puppeteerUtil = new Deferred();
      }
      await promise;
      try {
        using handle = (await this.evaluateHandle(
          script
        )) as JSHandle<PuppeteerUtil>;
        this.#puppeteerUtil.resolve(handle.move());
      } catch (error) {
        this.#puppeteerUtil.reject(error as Error);
      }
    }, !this.#puppeteerUtil.resolved());
    return this.#puppeteerUtil.valueOrThrow();
  }

  async #evaluate<
    Params extends unknown[],
    Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
    returnByValue: true,
    pageFunction: Func | string,
    ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;
  async #evaluate<
    Params extends unknown[],
    Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
    returnByValue: false,
    pageFunction: Func | string,
    ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>>;
  async #evaluate<
    Params extends unknown[],
    Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
    returnByValue: boolean,
    pageFunction: Func | string,
    ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>> | Awaited<ReturnType<Func>>> {
    const sourceUrlComment = getSourceUrlComment(
      getSourcePuppeteerURLIfAvailable(pageFunction)?.toString() ??
        PuppeteerURL.INTERNAL_URL
    );

    const {id: contextId} = await this.#contextDescription.valueOrThrow();

    if (isString(pageFunction)) {
      const expression = pageFunction;
      const expressionWithSourceUrl = SOURCE_URL_REGEX.test(expression)
        ? expression
        : `${expression}\n${sourceUrlComment}\n`;

      const {exceptionDetails, result: remoteObject} = await this.client
        .send('Runtime.evaluate', {
          expression: expressionWithSourceUrl,
          contextId,
          returnByValue,
          awaitPromise: true,
          userGesture: true,
        })
        .catch(rewriteError);

      if (exceptionDetails) {
        throw createEvaluationError(exceptionDetails);
      }

      return returnByValue
        ? valueFromRemoteObject(remoteObject)
        : createJSHandle(this, remoteObject);
    }

    const functionDeclaration = stringifyFunction(pageFunction);
    const functionDeclarationWithSourceUrl = SOURCE_URL_REGEX.test(
      functionDeclaration
    )
      ? functionDeclaration
      : `${functionDeclaration}\n${sourceUrlComment}\n`;
    let callFunctionOnPromise;
    try {
      callFunctionOnPromise = this.client.send('Runtime.callFunctionOn', {
        functionDeclaration: functionDeclarationWithSourceUrl,
        executionContextId: contextId,
        arguments: await Promise.all(args.map(serializeArgument.bind(this))),
        returnByValue,
        awaitPromise: true,
        userGesture: true,
      });
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.startsWith('Converting circular structure to JSON')
      ) {
        error.message += ' Recursive objects are not allowed.';
      }
      throw error;
    }
    const {exceptionDetails, result: remoteObject} =
      await callFunctionOnPromise.catch(rewriteError);
    if (exceptionDetails) {
      throw createEvaluationError(exceptionDetails);
    }
    return returnByValue
      ? valueFromRemoteObject(remoteObject)
      : createJSHandle(this, remoteObject);
  }

  [Symbol.dispose](): void {
    super[Symbol.dispose]();
    this.client.off('Runtime.bindingCalled', this.#onBindingCalled);
  }
}

function rewriteError(error: Error): Protocol.Runtime.EvaluateResponse {
  if (error.message.includes('Object reference chain is too long')) {
    return {result: {type: 'undefined'}};
  }
  if (error.message.includes("Object couldn't be returned by value")) {
    return {result: {type: 'undefined'}};
  }

  if (
    error.message.endsWith('Cannot find context with specified id') ||
    error.message.endsWith('Inspected target navigated or closed')
  ) {
    throw new Error(
      'Execution context was destroyed, most likely because of a navigation.'
    );
  }
  throw error;
}

function getSourceUrlComment(url: string) {
  return `//# sourceURL=${url}`;
}

async function serializeArgument(
  this: IsolatedWorld,
  arg: unknown
): Promise<Protocol.Runtime.CallArgument> {
  if (arg instanceof LazyArg) {
    arg = await arg.get(this);
  }
  if (typeof arg === 'bigint') {
    // eslint-disable-line valid-typeof
    return {unserializableValue: `${arg.toString()}n`};
  }
  if (Object.is(arg, -0)) {
    return {unserializableValue: '-0'};
  }
  if (Object.is(arg, Infinity)) {
    return {unserializableValue: 'Infinity'};
  }
  if (Object.is(arg, -Infinity)) {
    return {unserializableValue: '-Infinity'};
  }
  if (Object.is(arg, NaN)) {
    return {unserializableValue: 'NaN'};
  }
  const objectHandle =
    arg && (arg instanceof CDPJSHandle || arg instanceof CDPElementHandle)
      ? arg
      : null;
  if (objectHandle) {
    if (objectHandle.world !== this) {
      throw new Error(
        'JSHandles can be evaluated only in the context they were created!'
      );
    }
    if (objectHandle.disposed) {
      throw new Error('JSHandle is disposed!');
    }
    if (objectHandle.remoteObject().unserializableValue) {
      return {
        unserializableValue: objectHandle.remoteObject().unserializableValue,
      };
    }
    if (!objectHandle.remoteObject().objectId) {
      return {value: objectHandle.remoteObject().value};
    }
    return {objectId: objectHandle.remoteObject().objectId};
  }
  return {value: arg};
}
