/**
 * JsonFilterVisitor.ts
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
/* jshint curly: false */
/* jshint eqeqeq: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/* jshint -W018: Confusing use of '!' */
/// <reference path="FilterVisitor.ts" />
/// <reference path="JsonPath.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * compiles a JsonFilterFn from a given Filter tree.
         *
         * @param filter tree being compiled.
         * @return {function} a JsonFilterFn function.
         */
        function jsonFilter(filter) {
            return new JsonFilterVisitor().visit(filter);
        }
        LiveData.jsonFilter = jsonFilter;
        /**
         * compiles a Filter tree into a JsonFilterFn.
         */
        var JsonFilterVisitor = (function (_super) {
            __extends(JsonFilterVisitor, _super);
            function JsonFilterVisitor() {
                _super.apply(this, arguments);
            }
            JsonFilterVisitor.prototype.containsString = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var contains = filter.contains;
                if (contains === undefined || contains === null) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                return function (obj) {
                    var value = expression.evaluate(obj);
                    if (value === undefined || value === null) {
                        // null/undefined case
                        return false;
                    }
                    else if (_.isArray(value)) {
                        // array case
                        for (var i = 0; i < value.length; ++i) {
                            var val = value[i];
                            if (val !== undefined && val !== null && val.toString().indexOf(contains) >= 0) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return value !== undefined && value !== null && value.toString().indexOf(contains) >= 0;
                    }
                };
            };
            JsonFilterVisitor.prototype.string = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var expected = filter.value;
                if (expected === undefined || expected === null) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                return function (obj) {
                    var value = expression.evaluate(obj);
                    if (value === undefined || value === null) {
                        // null/undefined case
                        return false;
                    }
                    else if (_.isArray(value)) {
                        // array case
                        for (var i = 0; i < value.length; ++i) {
                            var val = value[i];
                            if (val == filter.value) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return value == filter.value;
                    }
                };
            };
            JsonFilterVisitor.prototype.range = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var min = filter.min;
                var max = filter.max;
                if (min === undefined || min === null) {
                    if (max === undefined || max === null) {
                        return function (obj) {
                            var value = expression.evaluate(obj);
                            return !!value;
                        };
                    }
                    else {
                        return function (obj) {
                            var value = expression.evaluate(obj);
                            return !!value && value <= max;
                        };
                    }
                }
                else if (min === max) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return !!value && value == min;
                    };
                }
                else {
                    if (max === undefined || max === null) {
                        return function (obj) {
                            var value = expression.evaluate(obj);
                            return !!value && value >= min;
                        };
                    }
                    else {
                        return function (obj) {
                            var value = expression.evaluate(obj);
                            return !!value && value <= max && value >= min;
                        };
                    }
                }
            };
            JsonFilterVisitor.prototype.longRange = function (filter) {
                return this.range(filter);
            };
            JsonFilterVisitor.prototype.dateRange = function (filter) {
                return this.range(filter);
            };
            JsonFilterVisitor.prototype.stringRange = function (filter) {
                return this.range(filter);
            };
            JsonFilterVisitor.prototype.doubleRange = function (filter) {
                return this.range(filter);
            };
            JsonFilterVisitor.prototype.boolean = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var expected = filter.value;
                return function (obj) {
                    var value = expression.evaluate(obj);
                    return !!value === expected;
                };
            };
            JsonFilterVisitor.prototype.enum = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var values = filter.values;
                if (!values) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return !value;
                    };
                }
                else {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return values.indexOf(value) >= 0;
                    };
                }
            };
            JsonFilterVisitor.prototype.stringEnum = function (filter) {
                return this.enum(filter);
            };
            JsonFilterVisitor.prototype.longEnum = function (filter) {
                return this.enum(filter);
            };
            JsonFilterVisitor.prototype.stringMap = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var property = filter.key && new LiveData.JsonPath(filter.key);
                var expected = filter.value;
                if (!property && (expected === undefined || expected === null)) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                else if (!property) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value == expected;
                    };
                }
                else if (expected === undefined || expected === null) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        var val = property.evaluate(value);
                        return val === undefined || val === null;
                    };
                }
                else {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        var val = property.evaluate(value);
                        return val == expected;
                    };
                }
            };
            JsonFilterVisitor.prototype.like = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var like = filter.like;
                if (like === undefined || like === null) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                var regexp = like.replace(/%/g, '.*');
                var pattern = new RegExp(regexp);
                return function (obj) {
                    var value = expression.evaluate(obj);
                    if (value === undefined || value === null) {
                        // null/undefined case
                        return false;
                    }
                    else if (_.isArray(value)) {
                        // array case
                        for (var i = 0; i < value.length; ++i) {
                            var val = value[i];
                            if (pattern.test(val)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return pattern.test(value);
                    }
                };
            };
            JsonFilterVisitor.prototype.null = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                if (filter.isNull) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                else {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value !== undefined && value !== null;
                    };
                }
            };
            JsonFilterVisitor.prototype.filters = function (filter) {
                // build filter functions
                var filters = new Array(filter.filters.length);
                for (var i = 0; i < filters.length; ++i) {
                    filters[i] = this.visit(filter.filters[i]);
                }
                return filters;
            };
            JsonFilterVisitor.prototype.andOp = function (filter) {
                var filters = this.filters(filter);
                return function (obj) {
                    for (var i = 0; i < filters.length; ++i) {
                        var filter = filters[i];
                        if (!filter(obj)) {
                            return false;
                        }
                    }
                    return true;
                };
            };
            JsonFilterVisitor.prototype.orOp = function (filter) {
                var filters = this.filters(filter);
                return function (obj) {
                    for (var i = 0; i < filters.length; ++i) {
                        var filter = filters[i];
                        if (filter(obj)) {
                            return true;
                        }
                    }
                    return false;
                };
            };
            JsonFilterVisitor.prototype.nandOp = function (filter) {
                var filters = this.filters(filter);
                return function (obj) {
                    for (var i = 0; i < filters.length; ++i) {
                        var filter = filters[i];
                        if (!filter(obj)) {
                            return true;
                        }
                    }
                    return false;
                };
            };
            JsonFilterVisitor.prototype.norOp = function (filter) {
                var filters = this.filters(filter);
                return function (obj) {
                    for (var i = 0; i < filters.length; ++i) {
                        var filter = filters[i];
                        if (filter(obj)) {
                            return false;
                        }
                    }
                    return true;
                };
            };
            return JsonFilterVisitor;
        })(LiveData.FilterVisitorBase);
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
