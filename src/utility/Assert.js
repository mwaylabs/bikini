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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    /**
     * subtype of Error thrown by assert() in case AssertionCheck fails.
     */
    var AssertionError = (function (_super) {
        __extends(AssertionError, _super);
        function AssertionError(message) {
            _super.call(this, message);
        }
        return AssertionError;
    })(Error);
    Relution.AssertionError = AssertionError;
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
    function assert(check, message) {
        if (Relution.assertions === undefined ? Relution.isDebugMode() : Relution.assertions) {
            if (!check()) {
                var error = new AssertionError(message || (check.toSource()));
                if (Relution.isDebugMode()) {
                    Relution.Debug.error('Assertion failed: ' + error.message, error);
                }
                else {
                    console.error('Assertion failed: ' + error.message, error);
                }
                throw error;
            }
        }
    }
    Relution.assert = assert;
    /**
     * used in catch-blocks or Promise rejection callbacks to ensure the caught value is an Error.
     *
     * @param error to check.
     * @param message of disaster.
     * @return {any} value evaluating to true stating error is an instance of Error.
       */
    function assertIsError(error, message) {
        assert(function () { return _.isError(error); }, message);
        return error;
    }
    Relution.assertIsError = assertIsError;
})(Relution || (Relution = {}));
//# sourceMappingURL=Assert.js.map