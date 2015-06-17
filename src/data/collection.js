// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * The Relution.LiveData.Collection can be used like a Backbone Collection,
 *
 * but there are some enhancements to fetch, save and delete the
 * contained models from or to other "data stores".
 *
 * see LocalStorageStore, WebSqlStore or BikiniStore for examples
 *
 * @module Relution.LiveData.Collection
 *
 * @type {*}
 * @extends Backbone.Collection
 *
 */
Relution.LiveData.Collection = Backbone.Collection.extend({

  constructor: function (options) {
    if (this.url && this.url.charAt(this.url.length - 1) !== '/') {
      this.url += '/';
    }
    this.init(options);
    Backbone.Collection.apply(this, arguments);
  }
});

Relution.LiveData.Collection.create = Relution.LiveData.create;
Relution.LiveData.Collection.design = Relution.LiveData.design;

_.extend(Relution.LiveData.Collection.prototype, Relution.LiveData.Object, {

  _type: 'Relution.LiveData.Collection',

  isCollection: true,

  model: Relution.LiveData.Model,

  entity: null,

  options: null,

  init: function (options) {
    options = options || {};
    this.store = options.store || this.store || (this.model ? this.model.prototype.store : null);
    this.entity = options.entity || this.entity || (this.model ? this.model.prototype.entity : null);
    this.options = options.options || this.options;

    var entity = this.entity || this.entityFromUrl(this.url);
    if (entity) {
      this.entity = Relution.LiveData.Entity.from(entity, {model: this.model, typeMapping: options.typeMapping});
    }
    this._updateUrl();

    if (this.store && _.isFunction(this.store.initCollection)) {
      this.store.initCollection(this, options);
    }
  },

  ajax: Relution.LiveData.ajax,
  logon: Relution.LiveData.logon,
  sync: Relution.LiveData.sync,

  entityFromUrl: function (url) {
    if (url) {
      var location = document.createElement('a');
      location.href = url || this.url;
      // IE doesn't populate all link properties when setting .href with a relative URL,
      // however .href will return an absolute URL which then can be used on itself
      // to populate these additional fields.
      if (location.host === '') {
        location.href = location.href;
      }

      // extract last path part as entity name
      var parts = location.pathname.match(/([^\/]+)\/?$/);
      if (parts && parts.length > 1) {
        return parts[-1];
      }
    }
  },

  sort: function (options) {
    if (_.isObject(options && options.sort)) {
      this.comparator = Relution.LiveData.DataSelector.compileSort(options.sort);
    }
    Backbone.Collection.prototype.sort.apply(this, arguments);
  },

  select: function (options) {
    var selector = options && options.query ? Relution.LiveData.DataSelector.create(options.query) : null;
    var collection = Relution.LiveData.Collection.create(null, {model: this.model});

    if (options && options.sort) {
      collection.comparator = Relution.LiveData.DataSelector.compileSort(options.sort);
    }

    this.each(function (model) {
      if (!selector || selector.matches(model.attributes)) {
        collection.add(model);
      }
    });
    return collection;
  },

  destroy: function (options) {
    options = options || {};
    var success = options.success;
    if (this.length > 0) {
      options.success = function () {
        if (this.length === 0 && success) {
          success();
        }
      };
      var model;
      while ((model = this.first())) {
        this.sync('delete', model, options);
        this.remove(model);
      }
    } else if (success) {
      success();
    }
  },

  destroyLocal: function () {
    var store = this.endpoint.localStore;
    var that = this;
    // DROP TABLE
    if (this.entity.name) {
      store.drop(this.entity.name);
    }
    // RESET localStorage-entry
    localStorage.setItem('__' + this.channel + 'last_msg_time', '');
    this.store.endpoints = {};
    return this.reset();
  },

  /**
   * save all containing models
   */
  save: function () {
    this.each(function (model) {
      model.save();
    });
  },

  getUrlParams: function (url) {
    url = url || this.getUrl();
    var m = url.match(/\?([^#]*)/);
    var params = {};
    if (m && m.length > 1) {
      _.each(m[1].split('&'), function (p) {
        var a = p.split('=');
        params[a[0]] = a[1];
      });
    }
    return params;
  },

  getUrl: function (collection) {
    return (_.isFunction(this.url) ? this.url() : this.url) || '';
  },

  getUrlRoot: function () {
    var url = this.getUrl();
    return url ? ( url.indexOf('?') >= 0 ? url.substr(0, url.indexOf('?')) : url) : '';
  },

  applyFilter: function (callback) {
    this.trigger('filter', this.filter(callback));
  },

  _updateUrl: function () {
    var params = this.getUrlParams();
    if (this.options) {
      this.url = this.getUrlRoot();
      if (this.options.query) {
        params.query = encodeURIComponent(JSON.stringify(this.options.query));
      }
      if (this.options.fields) {
        params.fields = encodeURIComponent(JSON.stringify(this.options.fields));
      }
      if (this.options.sort) {
        params.sort = encodeURIComponent(JSON.stringify(this.options.sort));
      }
      if (!_.isEmpty(params)) {
        this.url += '?';
        var a = [];
        for (var k in params) {
          a.push(k + (params[k] ? '=' + params[k] : ''));
        }
        this.url += a.join('&');
      }
    }
  }

});
