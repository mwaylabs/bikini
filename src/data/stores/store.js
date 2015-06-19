// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * Base class to build a custom data store.
 *
 * See: Relution.LiveData.LocalStorageStore, Relution.LiveData.WebSqlStore and Relution.LiveData.SyncStore
 *
 * @module Relution.LiveData.Store
 *
 */
Relution.LiveData.Store = function () {
  this.initialize.apply(this, arguments);
};

Relution.LiveData.Store.extend = Relution.LiveData.extend;
Relution.LiveData.Store.create = Relution.LiveData.create;
Relution.LiveData.Store.design = Relution.LiveData.design;

// Attach all inheritable methods to the Connector prototype.
_.extend(Relution.LiveData.Store.prototype, Backbone.Events, Relution.LiveData.Object, {

  _type: 'Relution.LiveData.Store',

  entities: null,

  options: null,

  name: '',

  typeMapping: (function () {
    var map = {};
    map [Relution.LiveData.DATA.TYPE.OBJECTID] = Relution.LiveData.DATA.TYPE.STRING;
    map [Relution.LiveData.DATA.TYPE.DATE] = Relution.LiveData.DATA.TYPE.STRING;
    map [Relution.LiveData.DATA.TYPE.BINARY] = Relution.LiveData.DATA.TYPE.TEXT;
    return map;
  })(),

  initialize: function (options) {
    options = options || {};
    this.options = this.options || {};
    this.options.name = this.name;
    this.options.typeMapping = this.typeMapping;
    this.options.entities = this.entities;
    _.extend(this.options, options || {});

    this._setEntities(options.entities || {});
  },

  _setEntities: function (entities) {
    this.entities = {};
    for (var name in entities) {
      var entity = Relution.LiveData.Entity.from(entities[name], {
        store: this,
        typeMapping: this.options.typeMapping
      });
      entity.name = entity.name || name;

      // connect collection and model to this store
      var collection = entity.collection || Relution.LiveData.Collection.extend({model: Relution.LiveData.Model.extend({})});
      var model = collection.prototype.model;
      // set new entity and name
      collection.prototype.entity = model.prototype.entity = name;
      collection.prototype.store = model.prototype.store = this;
      entity.idAttribute = entity.idAttribute || model.prototype.idAttribute;
      this.entities[name] = entity;
    }
  },

  getEntity: function (obj) {
    if (obj) {
      var entity = obj.entity || obj;
      var name = _.isString(entity) ? entity : entity.name;
      if (name) {
        return this.entities[name] || (entity && entity.name ? entity : {name: name});
      }
    }
  },

  getCollection: function (entity) {
    if (_.isString(entity)) {
      entity = this.entities[entity];
    }
    if (entity && entity.collection) {
      if (Relution.LiveData.Collection.prototype.isPrototypeOf(entity.collection)) {
        return entity.collection;
      } else {
        return new entity.collection();
      }
    }
  },

  createModel: function (entity, attrs) {
    if (_.isString(entity)) {
      entity = this.entities[entity];
    }
    if (entity && entity.collection) {
      var Model = entity.collection.model || entity.collection.prototype.model;
      if (Model) {
        return new Model(attrs);
      }
    }
  },

  getArray: function (data) {
    if (_.isArray(data)) {
      return data;
    } else if (Relution.LiveData.isCollection(data)) {
      return data.models;
    }
    return _.isObject(data) ? [data] : [];
  },

  getDataArray: function (data) {
    var array = [];
    if (_.isArray(data) || Backbone.Collection.prototype.isPrototypeOf(data)) {
      _.each(data, function (d) {
        var attrs = this.getAttributes(d);
        if (attrs) {
          array.push(attrs);
        }
      });
    } else {
      var attrs = this.getAttributes(data);
      if (attrs) {
        array.push(this.getAttributes(attrs));
      }
    }
    return array;
  },

  getAttributes: function (model) {
    if (Backbone.Model.prototype.isPrototypeOf(model)) {
      return model.attributes;
    }
    return _.isObject(model) ? model : null;
  },

  initModel: function (model) {
    // may be overwritten
  },

  initCollection: function (collection) {
    // may be overwritten
  },

  initEntity: function (entity) {
    // may be overwritten
  },

  sync: function (method, model, options) {
    // must be overwritten
    return Q.reject(new Error('not implemented!')); // purely abstract
  },

  /**
   *
   * @param collection usally a collection, but can also be a model
   * @param options
   */
  fetch: function (collection, options) {
    if (collection && !collection.models && !collection.attributes && !options) {
      options = collection;
    }
    if ((!collection || (!collection.models && !collection.attributes)) && options && options.entity) {
      collection = this.getCollection(options.entity);
    }
    if (collection && collection.fetch) {
      var opts = _.extend({}, options || {}, {store: this});
      return collection.fetch(opts);
    }
  },

  create: function (collection, model, options) {
    if (collection && !collection.models && !options) {
      model = collection;
      options = model;
    }
    if ((!collection || !collection.models) && options && options.entity) {
      collection = this.getCollection(options.entity);
    }
    if (collection && collection.create) {
      var opts = _.extend({}, options || {}, {store: this});
      collection.create(model, opts);
    }
  },

  save: function (model, attr, options) {
    if (model && !model.attributes && !options) {
      attr = model;
      options = attr;
    }
    if ((!model || !model.attributes) && options && options.entity) {
      model = this.createModel(options.entity);
    }
    if (model && model.save) {
      var opts = _.extend({}, options || {}, {store: this});
      model.save(attr, opts);
    }
  },

  destroy: function (model, options) {
    if (model && model.destroy) {
      var opts = _.extend({}, options || {}, {store: this});
      model.destroy(opts);
    }
  },

  _checkEntity: function (obj, entity) {
    if (!Relution.LiveData.isEntity(entity)) {
      var error = Relution.LiveData.Store.CONST.ERROR_NO_ENTITY;
      console.error(error);
      this.handleCallback(obj.error, error);
      this.handleCallback(obj.finish, error);
      return false;
    }
    return true;
  },

  _checkData: function (obj, data) {
    if ((!_.isArray(data) || data.length === 0) && !_.isObject(data)) {
      var error = Relution.LiveData.Store.CONST.ERROR_NO_DATA;
      console.error(error);
      this.handleCallback(obj.error, error);
      this.handleCallback(obj.finish, error);
      return false;
    }
    return true;
  },

  handleSuccess: function (obj) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (obj.success) {
      this.handleCallback.apply(this, [obj.success].concat(args));
    }
    if (obj.finish) {
      this.handleCallback.apply(this, [obj.finish].concat(args));
    }
  },

  handleError: function (obj) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (obj.error) {
      this.handleCallback.apply(this, [obj.error].concat(args));
    }
    if (obj.finish) {
      this.handleCallback.apply(this, [obj.finish].concat(args));
    }
  },

  CONST: {
    ERROR_NO_ENTITY: 'No valid entity specified. ',
    ERROR_NO_DATA: 'No data passed. ',
    ERROR_LOAD_DATA: 'Error while loading data from store. ',
    ERROR_SAVE_DATA: 'Error while saving data to the store. ',
    ERROR_LOAD_IDS: 'Error while loading ids from store. ',
    ERROR_SAVE_IDS: 'Error while saving ids to the store. '
  }

});
