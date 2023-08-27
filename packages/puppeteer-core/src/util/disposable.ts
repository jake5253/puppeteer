/**
 * Copyright 2023 Google Inc. All rights reserved.
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

// TODO: Once explicit resource management stabilizes, remove this file... It's
// going to be a few years.
import 'disposablestack/auto';

declare class DisposableStack {
  constructor();

  /**
   * Gets a value indicating whether the stack has been disposed.
   */
  get disposed(): boolean;

  /**
   * Alias for `[Symbol.dispose]()`.
   */
  dispose(): void;

  /**
   * Adds a resource to the top of the stack. Has no effect if provided `null`
   * or `undefined`.
   */
  use<T>(value: T): T;

  /**
   * Adds a non-disposable resource and a disposal callback to the top of the
   * stack.
   */
  adopt<T>(value: T, onDispose: (value: T) => void): T;

  /**
   * Adds a disposal callback to the top of the stack.
   */
  defer(onDispose: () => void): void;

  /**
   * Moves all resources currently in this stack into a new `DisposableStack`.
   */
  move(): DisposableStack;

  /**
   * Disposes of resources within this object.
   */
  [Symbol.dispose](): void;
}

const Symbol = globalThis.Symbol;

export {Symbol, DisposableStack};
