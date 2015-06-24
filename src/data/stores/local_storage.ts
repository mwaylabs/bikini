/**
 * local_storage.ts
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
/// <reference path="store.ts" />

module Relution.LiveData {

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
  export class LocalStorageStore extends Store {

    private ids = {};

    public sync(method, model, options) {
      options = options || {};
      var that = this;
      var entity = that.getEntity(model.entity || options.entity);
      var attrs;
      if (entity && model) {
        var id = model.id || (method === 'create' ? new Relution.LiveData.ObjectID().toHexString() : null);
        attrs = options.attrs || model.toJSON(options);
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
          case 'delete' :
            that._removeItem(entity, id);
            break;
          case 'read' :
            if (id) {
              attrs = that._getItem(entity, id);
            } else {
              attrs = [];
              var ids = that._getItemIds(entity);
              for (id in ids) {
                var itemData = that._getItem(entity, id);
                if (itemData) {
                  attrs.push(itemData);
                }
              }
            }
            break;
          default:
            return;
        }
      }

      return Q.resolve(attrs).then(function (attrs) {
        if (attrs) {
          return that.handleSuccess(options, attrs) || attrs;
        } else {
          return that.handleError(options, Relution.LiveData.Store.CONST.ERROR_NO_ENTITY) || Q.reject(Relution.LiveData.Store.CONST.ERROR_NO_ENTITY);
        }
      });
    }

    public drop(options) {
      var entity = this.getEntity(options);
      if (entity && entity.name) {
        var keys = this._findAllKeys(entity);
        for (var i = 0; i < keys.length; i++) {
          localStorage.removeItem(keys[i]);
        }
        localStorage.removeItem('__ids__' + entity.name);
        this.handleSuccess(options);
      } else {
        this.handleError(options, Relution.LiveData.Store.CONST.ERROR_NO_ENTITY);
      }
    }

    private _getKey(entity, id) {
      return '_' + entity.name + '_' + id;
    }

    private _getItem(entity, id) {
      var attrs;
      if (entity && id) {
        try {
          attrs = JSON.parse(localStorage.getItem(this._getKey(entity, id)));
          if (attrs) {
            entity.setId(attrs, id); // fix id
          } else {
            this._delItemId(entity, id);
          }
        } catch (e) {
          console.error(Relution.LiveData.Store.CONST.ERROR_LOAD_DATA + e.message);
        }
      }
      return attrs;
    }

    private _setItem(entity, id, attrs) {
      if (entity && id && attrs) {
        try {
          localStorage.setItem(this._getKey(entity, id), JSON.stringify(attrs));
          this._addItemId(entity, id);
        } catch (e) {
          console.error(Relution.LiveData.Store.CONST.ERROR_SAVE_DATA + e.message);
        }
      }
    }

    private _removeItem(entity, id) {
      if (entity && id) {
        localStorage.removeItem(this._getKey(entity, id));
        this._delItemId(entity, id);
      }
    }

    private _addItemId(entity, id) {
      var ids = this._getItemIds(entity);
      if (!(id in ids)) {
        ids[id] = '';
        this._saveItemIds(entity, ids);
      }
    }

    private _delItemId(entity, id) {
      var ids = this._getItemIds(entity);
      if (id in ids) {
        delete ids[id];
        this._saveItemIds(entity, ids);
      }
    }

    private _findAllKeys(entity) {
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
    }

    private _getItemIds(entity) {
      try {
        var key = '__ids__' + entity.name;
        if (!this.ids[entity.name]) {
          this.ids[entity.name] = JSON.parse(localStorage.getItem(key)) || {};
        }
        return this.ids[entity.name];
      } catch (e) {
        console.error(Relution.LiveData.Store.CONST.ERROR_LOAD_IDS + e.message);
      }
    }

    private _saveItemIds(entity, ids) {
      try {
        var key = '__ids__' + entity.name;
        localStorage.setItem(key, JSON.stringify(ids));
      } catch (e) {
        console.error(Relution.LiveData.Store.CONST.ERROR_SAVE_IDS + e.message);
      }
    }
  }

}
