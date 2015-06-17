// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * The Bikini.LocalStorageStore can be used to store model collection into
 * the localStorage
 *
 * @module Bikini.LocalStorageStore
 *
 * @type {*}
 * @extends Bikini.Store
 *
 * @example
 *
 * // The LocalStorageStore will save each model data as a json under his id,
 * // and keeps all id's under an extra key for faster access
 *
 * var MyCollection = Bikini.Collection.extend({
 *      store: Bikini.LocalStorageStore.create(),
 *      entity: 'myEntityName'
 * });
 *
 */
Bikini.LocalStorageStore = Bikini.Store.extend({

  _type: 'Bikini.LocalStorageStore',

  ids: {},

  sync: function (method, model, options) {
    options = options || {};
    var that = this;
    var entity = that.getEntity(model.entity || options.entity || this.entity);
    var attrs;
    if (entity && model) {
      var id = model.id || (method === 'create' ? new Bikini.ObjectID().toHexString() : null);
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

    return Q.resolve(function () {
      if (attrs) {
        return that.handleSuccess(options, attrs) || attrs;
      } else {
        return that.handleError(options, Bikini.Store.CONST.ERROR_NO_ENTITY) || Q.reject(Bikini.Store.CONST.ERROR_NO_ENTITY);
      }
    });
  },

  drop: function (options) {
    var entity = this.getEntity(options);
    if (entity && entity.name) {
      var keys = this._findAllKeys(entity);
      for (var i = 0; i < keys.length; i++) {
        localStorage.removeItem(keys[i]);
      }
      localStorage.removeItem('__ids__' + entity.name);
      this.handleSuccess(options);
    } else {
      this.handleError(options, Bikini.Store.CONST.ERROR_NO_ENTITY);
    }
  },

  _getKey: function (entity, id) {
    return '_' + entity.name + '_' + id;
  },

  _getItem: function (entity, id) {
    var attrs;
    if (entity && id) {
      try {
        attrs = JSON.parse(localStorage.getItem(this._getKey(entity, id)));
        if (attrs) {
          entity.setId(attrs, id); // fix id
        } else {
          this._delItemId(id);
        }
      } catch (e) {
        console.error(Bikini.Store.CONST.ERROR_LOAD_DATA + e.message);
      }
    }
    return attrs;
  },

  _setItem: function (entity, id, attrs) {
    if (entity && id && attrs) {
      try {
        localStorage.setItem(this._getKey(entity, id), JSON.stringify(attrs));
        this._addItemId(entity, id);
      } catch (e) {
        console.error(Bikini.Store.CONST.ERROR_SAVE_DATA + e.message);
      }
    }
  },

  _removeItem: function (entity, id) {
    if (entity && id) {
      localStorage.removeItem(this._getKey(entity, id));
      this._delItemId(entity, id);
    }
  },

  _addItemId: function (entity, id) {
    var ids = this._getItemIds(entity);
    if (!(id in ids)) {
      ids[id] = '';
      this._saveItemIds(entity, ids);
    }
  },

  _delItemId: function (entity, id) {
    var ids = this._getItemIds(entity);
    if (id in ids) {
      delete ids[id];
      this._saveItemIds(entity, ids);
    }
  },

  _findAllKeys: function (entity) {
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
  },

  _getItemIds: function (entity) {
    try {
      var key = '__ids__' + entity.name;
      if (!this.ids[entity.name]) {
        this.ids[entity.name] = JSON.parse(localStorage.getItem(key)) || {};
      }
      return this.ids[entity.name];
    } catch (e) {
      console.error(Bikini.Store.CONST.ERROR_LOAD_IDS + e.message);
    }
  },

  _saveItemIds: function (entity, ids) {
    try {
      var key = '__ids__' + entity.name;
      localStorage.setItem(key, JSON.stringify(ids));
    } catch (e) {
      console.error(Bikini.Store.CONST.ERROR_SAVE_IDS + e.message);
    }
  }
});
