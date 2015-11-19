/**
 * GetQuery.ts
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
/* jshint quotmark: false */
/// <reference path="../core/livedata.d.ts"/>
/// <reference path="Filter.ts" />
/// <reference path="SortOrder.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * general query parameters.
         *
         * Caution, member fields eventually are shared by multiple instances! You may mutate member fields, but not the
         * objects and arrays referenced by them.
         */
        var GetQuery = (function () {
            /**
             * default/copy constructor.
             *
             * @param other instance to optionally initialize an independent copy of.
             */
            function GetQuery(other) {
                if (other) {
                    this.limit = other.limit;
                    this.offset = other.offset;
                    this.sortOrder = other.sortOrder;
                    this.filter = other.filter;
                    this.fields = other.fields;
                }
            }
            Object.defineProperty(GetQuery.prototype, "min", {
                get: function () {
                    return this.offset | 0;
                },
                set: function (value) {
                    var offset = value && value !== 0 ? value : undefined;
                    if (offset !== this.offset) {
                        var max = this.max;
                        this.offset = offset;
                        this.max = max;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GetQuery.prototype, "max", {
                get: function () {
                    return this.limit ? (this.limit + this.min) : Infinity;
                },
                set: function (value) {
                    var limit = value && value !== Infinity ? (value - this.min) : undefined;
                    if (limit !== this.limit) {
                        var min = this.min;
                        this.limit = limit;
                        this.min = min;
                    }
                },
                enumerable: true,
                configurable: true
            });
            GetQuery.prototype.fromJSON = function (json) {
                this.limit = json.limit;
                this.offset = json.offset;
                this.sortOrder = json.sortOrder && new LiveData.SortOrder().fromJSON(json.sortOrder);
                this.filter = json.filter;
                this.fields = json.fields;
                return this;
            };
            GetQuery.isAndFilter = function (filter) {
                return filter.type === 'logOp' && filter.operation === 'and';
            };
            GetQuery.prototype.merge = function (other) {
                this.min = Math.max(this.min, other.min);
                this.max = Math.min(this.max, other.max);
                if (!this.sortOrder) {
                    this.sortOrder = other.sortOrder && new LiveData.SortOrder(other.sortOrder);
                }
                else if (other.sortOrder) {
                    this.sortOrder.merge(other.sortOrder);
                }
                if (!this.filter) {
                    this.filter = other.filter;
                }
                else if (other.filter) {
                    this.filter = {
                        type: 'logOp',
                        operation: 'and',
                        filters: [
                            this.filter,
                            other.filter
                        ]
                    };
                }
                if (!this.fields) {
                    this.fields = other.fields;
                }
                else if (other.fields) {
                    this.fields = this.fields.concat(other.fields);
                }
            };
            GetQuery.prototype.optimize = function () {
                if (this.sortOrder) {
                    this.sortOrder.optimize();
                }
                if (this.filter && GetQuery.isAndFilter(this.filter)) {
                    // following loop flattens nested and filters by recursively replacing them by their children
                    var filters = this.filter.filters;
                    for (var i = filters.length; i >= 0;) {
                        if (GetQuery.isAndFilter(filters[i])) {
                            Array.prototype.splice.apply(filters, Array.prototype.concat([i, 1], filters[i].filters));
                        }
                        else {
                            --i;
                        }
                    }
                }
                if (this.fields) {
                    // not an unsorted unique to have resulting array sorted
                    Array.prototype.sort.apply(this.fields);
                    this.fields = _.unique(this.fields, true);
                }
            };
            return GetQuery;
        })();
        LiveData.GetQuery = GetQuery;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=GetQuery.js.map