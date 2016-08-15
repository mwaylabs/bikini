/**
 * Store.ts
 *
 * Created by Thomas Beckmann on 24.06.2015
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
/// <reference path="../../core/livedata.d.ts" />
/// <reference path="../../utility/Debug.ts" />
/// <reference path="../Model.ts" />
/// <reference path="../Collection.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * Base class to build a custom data store.
         *
         * See: Relution.LiveData.WebSqlStore and Relution.LiveData.SyncStore
         *
         * @module Relution.LiveData.Store
         */
        var Store = (function () {
            function Store(options) {
                Relution.LiveData.Debug.trace('Store', options);
                if (options) {
                    // copy options values into the object
                    _.extend(this, options);
                }
            }
            Store.prototype.getArray = function (data) {
                if (_.isArray(data)) {
                    return data;
                }
                else if (LiveData.isCollection(data)) {
                    return data.models;
                }
                return _.isObject(data) ? [data] : [];
            };
            Store.prototype.getDataArray = function (data) {
                var array = [];
                if (_.isArray(data) || Backbone.Collection.prototype.isPrototypeOf(data)) {
                    _.each(data, function (d) {
                        var attrs = this.getAttributes(d);
                        if (attrs) {
                            array.push(attrs);
                        }
                    });
                }
                else {
                    var attrs = this.getAttributes(data);
                    if (attrs) {
                        array.push(this.getAttributes(attrs));
                    }
                }
                return array;
            };
            Store.prototype.getAttributes = function (model) {
                if (Backbone.Model.prototype.isPrototypeOf(model)) {
                    return model.attributes;
                }
                return _.isObject(model) ? model : null;
            };
            Store.prototype.initModel = function (model, options) {
                // may be overwritten
            };
            Store.prototype.initCollection = function (collection, options) {
                // may be overwritten
            };
            Store.prototype.sync = function (method, model, options) {
                // must be overwritten
                return Q.reject(new Error('not implemented!')); // purely abstract
            };
            /**
             *
             * @param collection usally a collection, but can also be a model
             * @param options
             */
            Store.prototype.fetch = function (collection, options) {
                var opts = _.extend({}, options || {}, { store: this });
                return collection.fetch(opts);
            };
            Store.prototype.create = function (collection, model, options) {
                var opts = _.extend({}, options || {}, { store: this });
                return collection.create(model, opts);
            };
            Store.prototype.save = function (model, attr, options) {
                var opts = _.extend({}, options || {}, { store: this });
                return model.save(attr, opts);
            };
            Store.prototype.destroy = function (model, options) {
                if (model && model.destroy) {
                    var opts = _.extend({}, options || {}, { store: this });
                    model.destroy(opts);
                }
            };
            Store.prototype._checkData = function (obj, data) {
                if ((!_.isArray(data) || data.length === 0) && !_.isObject(data)) {
                    var error = Store.CONST.ERROR_NO_DATA;
                    Relution.LiveData.Debug.error(error);
                    this.handleError(obj, error);
                    return false;
                }
                return true;
            };
            Store.prototype.handleSuccess = function (obj) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (obj.success) {
                    this.handleCallback.apply(this, [obj.success].concat(args));
                }
                if (obj.finish) {
                    this.handleCallback.apply(this, [obj.finish].concat(args));
                }
            };
            Store.prototype.handleError = function (obj) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (obj.error) {
                    this.handleCallback.apply(this, [obj.error].concat(args));
                }
                if (obj.finish) {
                    this.handleCallback.apply(this, [obj.finish].concat(args));
                }
            };
            Store.prototype.close = function () {
                // nothing to do
            };
            Store.extend = LiveData.extend;
            Store.create = LiveData.create;
            Store.design = LiveData.design;
            Store.CONST = {
                ERROR_NO_DATA: 'No data passed. ',
                ERROR_LOAD_DATA: 'Error while loading data from store. ',
                ERROR_SAVE_DATA: 'Error while saving data to the store. ',
                ERROR_LOAD_IDS: 'Error while loading ids from store. ',
                ERROR_SAVE_IDS: 'Error while saving ids to the store. '
            };
            return Store;
        }());
        LiveData.Store = Store;
        // mixins
        var store = _.extend(Store.prototype, Backbone.Events, LiveData._Object, {
            _type: 'Relution.LiveData.Store',
            isModel: false,
            isCollection: false,
            name: 'relution-livedata'
        });
        Relution.assert(function () { return Store.prototype.isPrototypeOf(store); });
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=Store.js.map