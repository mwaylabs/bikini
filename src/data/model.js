// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module Bikini.Model
 *
 * @type {*}
 * @extends Backbone.Model
 */
Bikini.Model = Backbone.Model.extend({
  constructor: function (attributes, options) {
    if (this.url && typeof this.url === 'string') {
      if (this.url.charAt(this.url.length - 1) !== '/') {
        this.url += '/';
      }
    }
    this.init(attributes, options);
    Backbone.Model.apply(this, arguments);
  }
});

Bikini.Model.create = Bikini.create;
Bikini.Model.design = Bikini.design;

_.extend(Bikini.Model.prototype, Bikini.Object, {

  _type: 'Bikini.Model',

  isModel: YES,

  entity: null,

  defaults: {},

  changedSinceSync: {},

  logon: Bikini.Security.logon,

  init: function (attributes, options) {
    options = options || {};

    this.collection = options.collection || this.collection;
    this.idAttribute = options.idAttribute || this.idAttribute;
    this.store = this.store || (this.collection ? this.collection.store : null) || options.store;
    if (this.store && _.isFunction(this.store.initModel)) {
      this.store.initModel(this, options);
    }
    this.entity = this.entity || (this.collection ? this.collection.entity : null) || options.entity;
    if (this.entity) {
      this.entity = Bikini.Entity.from(this.entity, {model: this.constructor, typeMapping: options.typeMapping});
      this.idAttribute = this.entity.idAttribute || this.idAttribute;
    }
    this.credentials = this.credentials || (this.collection ? this.collection.credentials : null) || options.credentials;
    this.on('change', this.onChange, this);
    this.on('sync', this.onSync, this);
  },

  sync: function (method, model, options) {
    options = options || {};
    options.credentials = options.credentials || this.credentials;
    var store = (options.store ? options.store : null) || this.store;
    var that = this;
    var args = arguments;

    return this.logon(options, function (result) {
      if (store && _.isFunction(store.sync)) {
        return store.sync.apply(that, args);
      } else {
        return Backbone.sync.apply(that, args);
      }
    });
  },

  onChange: function (model, options) {
    // For each `set` attribute, update or delete the current value.
    var attrs = model.changedAttributes();
    if (_.isObject(attrs)) {
      for (var key in attrs) {
        this.changedSinceSync[key] = attrs[key];
      }
    }
  },

  onSync: function (model, options) {
    this.changedSinceSync = {};
  },

  getUrlRoot: function () {
    if (this.urlRoot) {
      return _.isFunction(this.urlRoot) ? this.urlRoot() : this.urlRoot;
    } else if (this.collection) {
      return this.collection.getUrlRoot();
    } else if (this.url) {
      var url = _.isFunction(this.url) ? this.url() : this.url;
      if (url && this.id && url.indexOf(this.id) > 0) {
        return url.substr(0, url.indexOf(this.id));
      }
      return url;
    }
  },

  toJSON: function (options) {
    options = options || {};
    var entity = options.entity || this.entity;
    if (Bikini.isEntity(entity)) {
      return entity.fromAttributes(options.attrs || this.attributes);
    }
    return options.attrs || _.clone(this.attributes);
  },

  parse: function (resp, options) {
    options = options || {};
    var entity = options.entity || this.entity;
    if (Bikini.isEntity(entity)) {
      return entity.toAttributes(resp);
    }
    return resp;
  }

});
