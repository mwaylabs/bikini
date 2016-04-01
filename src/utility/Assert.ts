/**
 * Created by Thomas Beckmann
 * Copyright (c)
 * 2016
 * M-Way Solutions GmbH. All rights reserved.
 * http://www.mwaysolutions.com
 * Redistribution and use in source and binary forms, with or without
 * modification, are not permitted.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/* jshint indent: 4 */
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */

// underscore is a global symbol
declare var _;

module Relution {

  /**
   * expression validating an assumption of the calling code, typically an arrow-function expression.
   */
  export interface AssertionCheck {
    (): boolean
  }

  /**
   * subtype of Error thrown by assert() in case AssertionCheck fails.
   */
  export class AssertionError extends Error {
    public constructor(message?: string) {
      super(message);
    }
  }

  /**
   * enables/disables assertion testing at runtime.
   *
   * <p>
   * When undefined, isDebugMode() controls whether assertions are validated.
   * </p>
   */
  export let assertions: boolean;

  /**
   * evaluates given check expression as a strong invariant never ever violated.
   *
   * <p>
   * Use assert to ensure an assumption at runtime. When running with assertions enabled, the check expression is
   * evaluated immediately. A check expression evaluating to false signals a violation of invariant that should never
   * happen. If it does, a hard error is output unconditionally to the console and an AssertionError is thrown.
   * </p>
   * <p>
   * Do not use assertions as a means of ordinary error checking. Here are some valid examples of assertions:
   * <pre>
   *     assert(() => Date.now() > 0, 'current time millis can not be before 1970 start of time!');
   *     assert(() => total_price >= item_price, 'total is sum of individal prices and thus can not be less than each one!');
   *     assert(() => num*num >= 0, 'squared num is less than zero!');
   * </pre>
   * </p>
   *
   * @param check expression validating an assumption of the calling code, typically an arrow-function expression.
   * @param message optional explanation of disaster.
     */
  export function assert(check: AssertionCheck, message?: string): void {
    if (assertions === undefined ? isDebugMode() : assertions) {
      if (!check()) {
        let error = new AssertionError(message || <string>((<any>check).toSource()));
        if (isDebugMode()) {
          Debug.error('Assertion failed: ' + error.message, error);
        } else {
          console.error('Assertion failed: ' + error.message, error);
        }
        throw error;
      }
    }
  }

  /**
   * used in catch-blocks or Promise rejection callbacks to ensure the caught value is an Error.
   *
   * @param error to check.
   * @param message of disaster.
   * @return {any} value evaluating to to true stating error is an instance of Error.
     */
  export function assertIsError(error: any, message?: string): error is Error {
    assert(() => _.isError(error), message);
    return error;
  }

}
