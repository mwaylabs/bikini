/**
 * LocalStorageStore.ts
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
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/// <reference path="../../core/livedata.d.ts" />
/// <reference path="Store.ts" />
/// <reference path="../../utility/Debug.ts" />
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
         * The Relution.LiveData.LocalStorageStore can be used to store model collection into
         * the localStorage
         *
         * @module Relution.LiveData.LocalStorageStore
         *
         * @type {*}
         * @extends Relution.LiveData.Store
         *
         * @example
         *
         * // The LocalStorageStore will save each model data as a json under his id,
         * // and keeps all id's under an extra key for faster access
         *
         * var MyCollection = Relution.LiveData.Collection.extend({
         *      store: Relution.LiveData.LocalStorageStore.create(),
         *      entity: 'myEntityName'
         * });
         *
         */
        var LocalStorageStore = (function (_super) {
            __extends(LocalStorageStore, _super);
            function LocalStorageStore() {
                _super.apply(this, arguments);
                this.ids = {};
            }
            LocalStorageStore.prototype.sync = function (method, model, options) {
                options = _.defaults({ entity: model.entity }, options);
                var that = this;
                var entity = that.getEntity(options);
                var attrs;
                if (entity && model) {
                    var id = model.id || (method === 'create' ? new LiveData.ObjectID().toHexString() : null);
                    attrs = entity.fromAttributes(options.attrs || model.attributes);
                    switch (method) {
                        case 'patch':
                        case 'update':
                        case 'create':
                            if (method !== 'create') {
                                attrs = _.extend(that._getItem(entity, id) || {}, attrs);
                            }
                            if (model.id !== id && model.idAttribute) {
                                attrs[model.idAttribute] = id;
                            }
                            that._setItem(entity, id, attrs);
                            break;
                        case 'delete':
                            that._removeItem(entity, id);
                            break;
                        case 'read':
                            if (id) {
                                attrs = that._getItem(entity, id);
                            }
                            else {
                                attrs = [];
                                var ids = that._getItemIds(entity);
                                for (id in ids) {
                                    var itemData = that._getItem(entity, id);
                                    if (itemData) {
                                        attrs.push(itemData);
                                    }
                                }
                                if (options.syncContext) {
                                    attrs = options.syncContext.processAttributes(attrs, options);
                                }
                            }
                            break;
                        default:
                            return;
                    }
                }
                return Q.resolve(entity.toAttributes(attrs)).then(function (attrs) {
                    if (attrs) {
                        return that.handleSuccess(options, attrs) || attrs;
                    }
                    else {
                        return that.handleError(options, LiveData.Store.CONST.ERROR_NO_ENTITY) || Q.reject(LiveData.Store.CONST.ERROR_NO_ENTITY);
                    }
                });
            };
            LocalStorageStore.prototype.drop = function (options) {
                var entity = this.getEntity(options);
                if (entity && entity.name) {
                    var keys = this._findAllKeys(entity);
                    for (var i = 0; i < keys.length; i++) {
                        localStorage.removeItem(keys[i]);
                    }
                    localStorage.removeItem('__ids__' + entity.name);
                    this.handleSuccess(options);
                }
                else {
                    this.handleError(options, LiveData.Store.CONST.ERROR_NO_ENTITY);
                }
            };
            LocalStorageStore.prototype._getKey = function (entity, id) {
                return '_' + entity.name + '_' + id;
            };
            LocalStorageStore.prototype._getItem = function (entity, id) {
                var attrs;
                if (entity && id) {
                    try {
                        attrs = JSON.parse(localStorage.getItem(this._getKey(entity, id)));
                        if (attrs) {
                            entity.setId(attrs, id); // fix id
                        }
                        else {
                            this._delItemId(entity, id);
                        }
                    }
                    catch (e) {
                        Relution.LiveData.Debug.error(LiveData.Store.CONST.ERROR_LOAD_DATA + e.message);
                    }
                }
                return attrs;
            };
            LocalStorageStore.prototype._setItem = function (entity, id, attrs) {
                if (entity && id && attrs) {
                    try {
                        localStorage.setItem(this._getKey(entity, id), JSON.stringify(attrs));
                        this._addItemId(entity, id);
                    }
                    catch (e) {
                        Relution.LiveData.Debug.error(LiveData.Store.CONST.ERROR_SAVE_DATA + e.message);
                    }
                }
            };
            LocalStorageStore.prototype._removeItem = function (entity, id) {
                if (entity && id) {
                    localStorage.removeItem(this._getKey(entity, id));
                    this._delItemId(entity, id);
                }
            };
            LocalStorageStore.prototype._addItemId = function (entity, id) {
                var ids = this._getItemIds(entity);
                if (!(id in ids)) {
                    ids[id] = '';
                    this._saveItemIds(entity, ids);
                }
            };
            LocalStorageStore.prototype._delItemId = function (entity, id) {
                var ids = this._getItemIds(entity);
                if (id in ids) {
                    delete ids[id];
                    this._saveItemIds(entity, ids);
                }
            };
            LocalStorageStore.prototype._findAllKeys = function (entity) {
                var keys = [];
                var prefixItem = this._getKey(entity, '');
                if (prefixItem) {
                    var key, len = localStorage.length;
                    for (var i = 0; i < len; i++) {
                        key = localStorage.key(i);
                        if (key && key === prefixItem) {
                            keys.push(key);
                        }
                    }
                }
                return keys;
            };
            LocalStorageStore.prototype._getItemIds = function (entity) {
                try {
                    var key = '__ids__' + entity.name;
                    if (!this.ids[entity.name]) {
                        this.ids[entity.name] = JSON.parse(localStorage.getItem(key)) || {};
                    }
                    return this.ids[entity.name];
                }
                catch (e) {
                    Relution.LiveData.Debug.error(LiveData.Store.CONST.ERROR_LOAD_IDS + e.message);
                }
            };
            LocalStorageStore.prototype._saveItemIds = function (entity, ids) {
                try {
                    var key = '__ids__' + entity.name;
                    localStorage.setItem(key, JSON.stringify(ids));
                }
                catch (e) {
                    Relution.LiveData.Debug.error(LiveData.Store.CONST.ERROR_SAVE_IDS + e.message);
                }
            };
            return LocalStorageStore;
        })(LiveData.Store);
        LiveData.LocalStorageStore = LocalStorageStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=LocalStorageStore.js.map