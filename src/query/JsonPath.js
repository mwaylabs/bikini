/**
 * JsonPath.ts
 *
 * Created by Thomas Beckmann on 22.06.2015
 * Copyright (c)
 * 2015
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
var query;
(function (query) {
    /**
     * compiled JSON path expression.
     *
     * @see http://goessner.net/articles/JsonPath/
     */
    var JsonPath = (function () {
        /**
         * constructs a compiled expression.
         *
         * @param expression to compile.
         */
        function JsonPath(expression) {
            this.expression = jsonPath({}, expression, {
                resultType: 'PATH'
            }) || expression;
        }
        /**
         * evaluates the expression on a target object.
         *
         * @param obj to evaluate expression on.
         * @param arg options object.
         * @return{any} result of evaluating expression on object.
         */
        JsonPath.prototype.evaluate = function (obj, arg) {
            return jsonPath(obj, this.expression, arg);
        };
        return JsonPath;
    })();
    query.JsonPath = JsonPath;
})(query || (query = {}));
//# sourceMappingURL=JsonPath.js.map