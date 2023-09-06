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

import {describe, it} from 'node:test';

import expect from 'expect';

import {bound} from './decorators.js';

describe('bound', () => {
  it('should work', () => {
    class Foo {
      value = 5;

      @bound
      getValue() {
        return this.value;
      }
    }

    const foo = new Foo();
    expect(foo.getValue()).toEqual(5);

    const foo2 = new Foo();
    foo2.value = 7;
    expect(foo2.getValue()).toEqual(7);

    console.log(foo.getValue());
    // expect(foo.getValue.call(foo2)).toEqual(5);
  });
});
