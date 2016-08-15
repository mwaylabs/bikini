/**
 * SortOrderComparator.ts
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
/// <reference path="SortOrder.ts" />
/// <reference path="JsonPath.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * compiles a JsonCompareFn from a given SortOrder.
         *
         * @param arg defining the SortOrder being compiled.
         * @return {function} a JsonCompareFn function compatible to Array.sort().
         */
        function jsonCompare(arg, options) {
            var sortOrder;
            if (typeof arg === 'string') {
                sortOrder = new LiveData.SortOrder();
                sortOrder.fromJSON.apply(sortOrder, arguments);
            }
            else if (_.isArray(arg)) {
                sortOrder = new LiveData.SortOrder();
                sortOrder.fromJSON.call(sortOrder, arg);
            }
            else {
                sortOrder = arg;
            }
            var comparator = new SortOrderComparator(sortOrder, options);
            return _.bind(comparator.compare, comparator);
        }
        LiveData.jsonCompare = jsonCompare;
        /**
         * compiled SortOrder for comparison of objects.
         *
         * @see SortOrder
         */
        var SortOrderComparator = (function () {
            /**
             * constructs a compiled SortOrder for object comparison.
             *
             * @param sortOrder to realize.
             */
            function SortOrderComparator(sortOrder, options) {
                this.sortOrder = sortOrder;
                this.options = {
                    casesensitive: false
                };
                if (options) {
                    _.extend(this.options, options);
                }
                this.expressions = new Array(sortOrder.sortFields.length);
                for (var i = 0; i < this.expressions.length; ++i) {
                    this.expressions[i] = new LiveData.JsonPath(sortOrder.sortFields[i].name);
                }
            }
            /**
             * compares objects in a way compatible to Array.sort().
             *
             * @param o1 left operand.
             * @param o2 right operand.
             * @return {number} indicating relative ordering of operands.
             */
            SortOrderComparator.prototype.compare = function (o1, o2) {
                for (var i = 0; i < this.sortOrder.sortFields.length; ++i) {
                    var expression = this.expressions[i];
                    var val1 = expression.evaluate(o1);
                    var val2 = expression.evaluate(o2);
                    var cmp = this.compare1(val1, val2);
                    if (cmp !== 0) {
                        return this.sortOrder.sortFields[i].ascending ? +cmp : -cmp;
                    }
                }
                return 0;
            };
            /**
             * compares values in a way compatible to Array.sort().
             *
             * @param o1 left operand.
             * @param o2 right operand.
             * @return {number} indicating relative ordering of operands.
             */
            SortOrderComparator.prototype.compare1 = function (val1, val2) {
                if (!val1 || !val2) {
                    // null/undefined case
                    if (val2) {
                        return -1;
                    }
                    if (val1) {
                        return +1;
                    }
                }
                else if (Array.isArray(val1) || Array.isArray(val2)) {
                    // array case
                    var items1 = Array.isArray(val1) ? val1 : [val1];
                    var items2 = Array.isArray(val2) ? val2 : [val2];
                    var length = Math.max(items1.length, items2.length);
                    for (var i = 0; i < length; ++i) {
                        var c = this.compare1(items1[i], items2[i]);
                        if (c !== 0) {
                            return c;
                        }
                    }
                }
                else {
                    // comparision case
                    if (!this.options.casesensitive) {
                        if (typeof val1 === 'string') {
                            val1 = val1.toLowerCase();
                        }
                        if (typeof val2 === 'string') {
                            val2 = val2.toLowerCase();
                        }
                    }
                    // value case
                    if (val1 < val2) {
                        return -1;
                    }
                    if (val1 > val2) {
                        return +1;
                    }
                }
                return 0;
            };
            return SortOrderComparator;
        }());
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SortOrderComparator.js.map