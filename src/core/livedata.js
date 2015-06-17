// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * Defines the general namespace
 *
 * @type {Object}
 */
var Relution;
if (typeof exports !== 'undefined') {
  Relution = {};
} else {
  Relution = global.Relution = global.Relution || {};
}
Relution.LiveData = {};

/**
 * Version number of current release
 * @type {String}
 */
Relution.LiveData.Version = Relution.LiveData.version = '/* @echo VERSION */';

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

Relution.LiveData.ajax = function ajax(url, options) {
  var superAjax = this.super_ && this.super_.ajax || Backbone.ajax;
  var xhr = superAjax.apply(this, arguments);
  if (xhr) {
    var q = Q.defer();
    xhr.success(q.resolve.bind(q));
    xhr.error(q.reject.bind(q));
    q.promise.xhr = xhr;
    return q.promise;
  }
};

Relution.LiveData.logon = function logon(options) {
  Relution.LiveData.logon = Relution.LiveData.Security.logon;
  return Relution.LiveData.Security.logon.apply(this, arguments);
};

Relution.LiveData.sync = function sync(method, model, options) {
  options = options || {};
  var store = options.store || this.store;
  options.credentials = options.credentials || this.credentials || store && store.credentials;
  options.logon = options.logon || this.logon || store && store.logon || Relution.LiveData.logon;

  var that = this;
  var args = arguments;
  var superSync = store && store.sync ? store.sync.bind(store) : this.super_ && this.super_.sync || Backbone.sync;
  return options.logon.call(this, options).then(function innerSync(result) {
    // when calling sync of store, the that argument is replaced by the store due to bind above
    return superSync.apply(that, args) || result;
  });
};

Relution.LiveData.Object = {
  /**
   * The type of this object.
   *
   * @type String
   */
  _type: 'Relution.LiveData.Object',

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
