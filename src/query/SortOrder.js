/**
 * SortOrder.ts
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
/// <reference path="../core/livedata.d.ts"/>
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * defines a sort order of fields.
         *
         * Caution, member fields eventually are shared by multiple instances! You may mutate member fields, but not the
         * objects and arrays referenced by them.
         */
        var SortOrder = (function () {
            /**
             * default/copy constructor.
             *
             * @param other instance to optionally initialize an independent copy of.
             */
            function SortOrder(other) {
                this.sortFields = other && other.sortFields;
            }
            /**
             * parses a JSON literal such as ['-rating', '+date', 'id'] into this instance.
             *
             * @param json data, such as ['-rating', '+date'].
             * @return {Relution.LiveData.SortOrder} this instance.
             */
            SortOrder.prototype.fromJSON = function (json) {
                this.sortFields = new Array(json.length);
                for (var i = json.length - 1; i >= 0; --i) {
                    this.sortFields[i] = new SortField().fromJSON(json[i]);
                }
                return this;
            };
            /**
             * combines an other instance such that this order is maintained by priority and equivalent elements are ordered by
             * the other order.
             *
             * You may want to optimize after merging several instances.
             *
             * @param other order to merge into this as secondary.
             */
            SortOrder.prototype.merge = function (other) {
                this.sortFields = this.sortFields.concat(other.sortFields);
            };
            /**
             * eliminates redundant sort fields that do not affect overall order.
             */
            SortOrder.prototype.optimize = function () {
                this.sortFields = _.unique(this.sortFields, false, function (sortField) {
                    return sortField.name;
                });
            };
            return SortOrder;
        })();
        LiveData.SortOrder = SortOrder;
        var SortField = (function () {
            /**
             * default/copy constructor.
             *
             * @param other instance to optionally initialize an independent copy of.
             */
            function SortField(other) {
                if (other) {
                    this.name = other.name;
                    this.ascending = other.ascending;
                }
            }
            /**
             * parses a JSON literal such as '-rating' into this instance.
             *
             * @param json data, such as '-rating'.
             * @return {Relution.LiveData.SortOrder} this instance.
             */
            SortField.prototype.fromJSON = function (json) {
                var order = json.length > 0 && json.charAt(0);
                this.name = order === '+' || order === '-' ? json.substring(1) : json;
                this.ascending = order !== '-';
                return this;
            };
            /**
             * formats a JSON literal such as 'name'.
             *
             * @return {string} JSON literal such as 'name'.
             */
            SortField.prototype.toJSON = function () {
                return this.ascending ? this.name : '-' + this.name;
            };
            return SortField;
        })();
        LiveData.SortField = SortField;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SortOrder.js.map