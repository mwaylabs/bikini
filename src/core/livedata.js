// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

Relution.setDebug = function (args) {
  Relution.LiveData.DebugMode = args;
  return new Relution.LiveData.Debug(args);
};

Relution.LiveData.isDebugMode = function () {
  return Relution.LiveData.DebugMode;
};

/**
 * Empty function to be used when
 * no functionality is needed
 *
 * @type {Function}
 */
Relution.LiveData.f = function () {
};

Relution.LiveData.create = function (args) {
  return new this(args);
};

Relution.LiveData.design = function (obj) {
  var O = this.extend(obj || {});
  return new O();
};

Relution.LiveData.extend = Backbone.Model.extend;

Relution.LiveData.isCollection = function (collection) {
  return Backbone.Collection.prototype.isPrototypeOf(collection);
};

Relution.LiveData.isModel = function (model) {
  return Backbone.Model.prototype.isPrototypeOf(model);
};

Relution.LiveData.isEntity = function (entity) {
  return Relution.LiveData.Entity.prototype.isPrototypeOf(entity);
};

/***
 * Data type Constants.
 */
Relution.LiveData.DATA = {
  TYPE: {
    INTEGER: 'integer',
    STRING: 'string',
    TEXT: 'text',
    DATE: 'date',
    BOOLEAN: 'boolean',
    FLOAT: 'float',
    OBJECT: 'object',
    ARRAY: 'array',
    BINARY: 'binary',
    OBJECTID: 'objectid',
    NULL: 'null'
  }
};
Relution.LiveData.http = Backbone.ajax;

Backbone.ajax = function ajax(options) {
  var superAjax = options && options.ajax || Relution.LiveData.http;
  return superAjax.apply(this, arguments);
};

Relution.LiveData.ajax = function ajax(options) {
  var that = this;
  var args = arguments;
  var promise = Relution.LiveData.Security.logon.apply(this, arguments).then(function () {
    var superAjax = that.super_ && that.super_.ajax || Relution.LiveData.http;
    var xhr = superAjax.apply(that, args);
    if (!xhr) {
      return Q.reject(new Error('ajax failed'));
    }

    promise.xhr = xhr;
    if (Q.isPromiseAlike(xhr) && typeof xhr.catch === 'function') {
      return xhr;
    } else {
      var q = Q.defer();
      xhr.success(_.bind(q.resolve, q));
      xhr.error(_.bind(q.reject, q));
      options.xhr = xhr;
      return q.promise;
    }
  });
  return promise;
};

Relution.LiveData.sync = function sync(method, model, options) {
  options = options || {};
  var store = options.store || this.store;
  options.credentials = options.credentials || this.credentials || store && store.options && store.options.credentials;

  Relution.LiveData.Debug.info('Relution.LiveData.sync ' + method + ' ' + model.id);
  if (store && store.sync) {
    // store access (this is redundant model argument)
    var storeAjax = store.ajax && _.bind(store.ajax, store);
    options.ajax = options.ajax ||  storeAjax || this.ajax || Relution.LiveData.ajax;
    options.promise = store.sync.apply(store, arguments);
    return options.promise;
  } else {
    // direct access (goes via Backbone)
    var superSync = this.super_ && this.super_.sync || Backbone.sync;
    options.ajax = options.ajax ||  this.ajax || Relution.LiveData.http;
    return superSync.apply(this, arguments);
  }
};

Relution.LiveData._Object = {
  /**
   * The type of this object.
   *
   * @type String
   */
  _type: 'Relution.LiveData._Object',

  /**
   * Creates an object based on a passed prototype.
   *
   * @param {Object} proto The prototype of the new object.
   */
  _create: function (proto) {
    var F = function () {
    };
    F.prototype = proto;
    return new F();
  },

  /**
   * Includes passed properties into a given object.
   *
   * @param {Object} properties The properties to be included into the given object.
   */
  include: function (properties) {
    for (var prop in properties) {
      if (this.hasOwnProperty(prop)) {
        throw Relution.LiveData.Exception.RESERVED_WORD.getException();
      }
      this[prop] = properties[prop];
    }

    return this;
  },

  /**
   * Creates a new class and extends it with all functions of the defined super class
   * The function takes multiple input arguments. Each argument serves as additional
   * super classes - see mixins.
   *
   * @param {Object} properties The properties to be included into the given object.
   */
  design: function (properties) {
    // create the new object
    var obj = this._create(this);

    // assign the properties passed with the arguments array
    obj.include(properties);

    // return the new object
    return obj;
  },

  /**
   * Binds a method to its caller, so it is always executed within the right scope.
   *
   * @param {Object} caller The scope of the method that should be bound.
   * @param {Function} method The method to be bound.
   * @param {Object} arg One or more arguments. If more, then apply is used instead of call.
   */
  bindToCaller: function (caller, method, arg) {
    return function () {
      if (typeof method !== 'function' || typeof caller !== 'object') {
        throw Relution.LiveData.Exception.INVALID_INPUT_PARAMETER.getException();
      }
      if (Array.isArray(arg)) {
        return method.apply(caller, arg);
      }
      return method.call(caller, arg);
    };
  },

  /**
   * Calls a method defined by a handler
   *
   * @param {Object} handler A function, or an object including target and action to use with bindToCaller.
   */
  handleCallback: function (handler) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (handler) {
      var target = typeof handler.target === 'object' ? handler.target : this;
      var action = handler;
      if (typeof handler.action === 'function') {
        action = handler.action;
      } else if (typeof handler.action === 'string') {
        action = target[handler.action];
      }
      if (typeof action === 'function') {
        return this.bindToCaller(target, action, args)();
      }
    }
  }

};
