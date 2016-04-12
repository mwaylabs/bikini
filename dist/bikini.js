/*!
* Project:   Bikini - Everything a model needs
* Copyright: (c) 2016 M-Way Solutions GmbH.
* Version:   0.8.4
* Date:      Tue Apr 12 2016 09:36:09
* License:   https://raw.githubusercontent.com/mwaylabs/bikini/master/MIT-LICENSE.txt
*/
(function (global, Backbone, _, $, Q, jsonPath) {
// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * Defines the general namespace
 *
 * @type {Object}
 */
var Relution;
if (typeof exports !== 'undefined') {
  Relution = {
    LiveData: exports
  };
} else {
  Relution = global.Relution = global.Relution || {};
  Relution.LiveData = {};
}

/**
 * Version number of current release
 * @type {String}
 */
Relution.LiveData.Version = Relution.LiveData.version = '0.8.4';

/**
 * Created by Pascal Brewing
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
/* jshint quotmark: false */
var Relution;
(function (Relution) {
    /**
     * @description A DebugConsole Class
     * @example ````js
     * window.Relution.setDebug(true);
     * ````
     */
    var DebugConsole = (function () {
        function DebugConsole(enabled, fontSize) {
            if (enabled === void 0) { enabled = false; }
            if (fontSize === void 0) { fontSize = '12px'; }
            this.enabled_ = enabled;
            this.fontSize_ = fontSize;
            this.reset();
        }
        DebugConsole.STUB = function () {
            // empty by intention
        };
        DebugConsole.prototype.reset = function () {
            // uses bound functions to avoid browsers outputting incorrect line numbers
            if (this.enabled_) {
                this.log = _.bind(console.log, console, '%c%s');
                this.trace = _.bind(console.trace, console, '%c%s', "color: #378c13; font-size: " + this.fontSize_ + ";font-weight: normal;");
                this.debug = _.bind(console.trace, console, '%c%s', "color: #008c13; font-size: " + this.fontSize_ + ";font-weight: normal;");
                this.warn = _.bind(console.warn, console, '%c%s', "color: #e69138; font-size: " + this.fontSize_ + ";font-weight: normal;");
                this.info = _.bind(console.info, console, '%c%s', "color: #00f; font-size: " + this.fontSize_ + ";font-weight: normal;");
                this.error = _.bind(console.error, console, '%c%s', "color: #f00; font-size: " + this.fontSize_ + ";font-weight: normal;");
            }
            else {
                this.log = DebugConsole.STUB;
                this.trace = DebugConsole.STUB;
                this.debug = DebugConsole.STUB;
                this.warn = DebugConsole.STUB;
                this.info = DebugConsole.STUB;
                this.error = DebugConsole.STUB;
            }
            this.warning = this.warn; // alias only
        };
        Object.defineProperty(DebugConsole.prototype, "enabled", {
            get: function () {
                return this.enabled_;
            },
            set: function (enabled) {
                if (this.enabled_ !== enabled) {
                    this.enabled_ = enabled;
                    this.reset();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugConsole.prototype, "fontSize", {
            get: function () {
                return this.fontSize_;
            },
            set: function (fontSize) {
                if (this.fontSize_ !== fontSize) {
                    this.fontSize_ = fontSize;
                    this.reset();
                }
            },
            enumerable: true,
            configurable: true
        });
        DebugConsole.DebugConsole = DebugConsole;
        return DebugConsole;
    })();
    Relution.DebugConsole = DebugConsole;
    Relution.Debug = new DebugConsole();
    function isDebugMode() {
        return Relution.Debug.enabled;
    }
    Relution.isDebugMode = isDebugMode;
    function setDebug(enabled) {
        Relution.Debug.enabled = enabled;
        return Relution.Debug;
    }
    Relution.setDebug = setDebug;
    var LiveData;
    (function (LiveData) {
        LiveData.Debug = Relution.Debug;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=Debug.js.map
/**
 * Created by Thomas Beckmann
 * Copyright (c)
 * 2016
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    /**
     * subtype of Error thrown by assert() in case AssertionCheck fails.
     */
    var AssertionError = (function (_super) {
        __extends(AssertionError, _super);
        function AssertionError(message) {
            _super.call(this, message);
        }
        return AssertionError;
    })(Error);
    Relution.AssertionError = AssertionError;
    /**
     * evaluates given check expression as a strong invariant never ever violated.
     *
     * <p>
     * Use assert to ensure an assumption at runtime. When running with assertions enabled, the check expression is
     * evaluated immediately. A check expression evaluating to false signals a violation of invariant that should never
     * happen. If it does, a hard error is output unconditionally to the console and an AssertionError is thrown.
     * </p>
     * <p>
     * Do not use assertions as a means of ordinary error checking. Here are some valid examples of assertions:
     * <pre>
     *     assert(() => Date.now() > 0, 'current time millis can not be before 1970 start of time!');
     *     assert(() => total_price >= item_price, 'total is sum of individal prices and thus can not be less than each one!');
     *     assert(() => num*num >= 0, 'squared num is less than zero!');
     * </pre>
     * </p>
     *
     * @param check expression validating an assumption of the calling code, typically an arrow-function expression.
     * @param message optional explanation of disaster.
       */
    function assert(check, message) {
        if (Relution.assertions === undefined ? Relution.isDebugMode() : Relution.assertions) {
            if (!check()) {
                var error = new AssertionError(message || (check.toSource()));
                if (Relution.isDebugMode()) {
                    Relution.Debug.error('Assertion failed: ' + error.message, error);
                }
                else {
                    console.error('Assertion failed: ' + error.message, error);
                }
                throw error;
            }
        }
    }
    Relution.assert = assert;
    /**
     * used in catch-blocks or Promise rejection callbacks to ensure the caught value is an Error.
     *
     * @param error to check.
     * @param message of disaster.
     * @return {any} value evaluating to true stating error is an instance of Error.
       */
    function assertIsError(error, message) {
        assert(function () { return _.isError(error); }, message);
        return error;
    }
    Relution.assertIsError = assertIsError;
})(Relution || (Relution = {}));
//# sourceMappingURL=Assert.js.map
// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

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

/**
 * options passed to Collection.fetch() preventing backbone.js from consuming the response.
 *
 * This can be used when fetching large quantities of data and just the store and attached
 * collections are to be updated. By merging these options in and the server response is
 * not used to update the collection fetched itself.
 */
Relution.LiveData.bareboneOptions = Object.freeze({
  // indicates not to rely on Collection contents to aware code, not used by backbone.js
  barebone: true,

  // prevents any mutation of the Collection contents
  add: false,
  remove: false,
  merge: false,

  // does not resort once the response data arrives
  sort: false,

  // omits events from being fired
  silent: true
});

Relution.LiveData.http = Backbone.ajax;

Backbone.ajax = function ajax(options) {
  var superAjax = options && options.ajax || Relution.LiveData.http;
  return superAjax.apply(this, arguments);
};

Relution.LiveData.ajax = function ajax(options) {
  var that = this;
  var args = arguments;

  var fnSuccess = options.success;
  delete options.success;
  var fnError = options.error;
  delete options.error;

  options.method = options.type;  // set method because some ajax libs need this
  var promise = Relution.LiveData.Security.logon.apply(this, arguments).then(function () {
    var superAjax = that.super_ && that.super_.ajax || Relution.LiveData.http;
    var xhr = superAjax.apply(that, args);
    if (!xhr) {
      return Q.reject(new Error('ajax failed'));
    }

    promise.xhr = xhr;
    options.xhr = xhr;
    if (Q.isPromiseAlike(xhr) && typeof xhr.catch === 'function') {
      // promise-based XHR
      return xhr.then(function onSuccess (response) {
        // AJAX success function( Anything data, String textStatus, jqXHR jqXHR )
        if (fnSuccess) {
          fnSuccess(response.data, response.status, response);
        }
        return Q.resolve(response.data);
      }, function onError (response) {
        // AJAX error function( jqXHR jqXHR, String textStatus, String errorThrown )
        response.responseText = response.statusText;  // jQuery compatibility
        response.responseJSON = response.data;        // jQuery compatibility
        if (fnError) {
          fnError(response, response.statusText, response.data);
        }
        return Q.reject(response);
      });
    } else {
      // jQuery-based XHR
      var q = Q.defer();
      xhr.success(function onSuccess(data, textStatus, jqXHR) {
        var result;
        if (fnSuccess) {
          result = fnSuccess.apply(this, arguments);
        }
        q.resolve(data);
        return result;
      });
      xhr.error(function onError (jqXHR, textStatus, errorThrown) {
        var result;
        if (fnError) {
          result = fnError.apply(this, arguments);
        }
        q.reject(jqXHR);
        return result;
      });
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


// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

// ===========================================================================
//
// Relution.LiveData.ObjectId uses code from meteor.js
// https://github.com/meteor/meteor/blob/master/packages/minimongo
//
// Thanks for sharing!
//
// ===========================================================================

// m_require('core/foundation/object.js');
/**
 *
 * @module Relution.LiveData.ObjectID
 *
 */
Relution.LiveData.ObjectID = function (hexString) {
  Relution.LiveData.ObjectID.counter = Relution.LiveData.ObjectID.counter || parseInt(Math.random() * Math.pow(16, 6));
  Relution.LiveData.ObjectID.machineId = Relution.LiveData.ObjectID.machineId || parseInt(Math.random() * Math.pow(16, 6));
  Relution.LiveData.ObjectID.processId = Relution.LiveData.ObjectID.processId || parseInt(Math.random() * Math.pow(16, 4));
  this._ObjectID(hexString);
};

Relution.LiveData.ObjectID._looksLikeObjectID = function (str) {
  return str.length === 24 && str.match(/^[0-9a-f]*$/);
};

_.extend(Relution.LiveData.ObjectID.prototype, {

  _str: '',

  _ObjectID: function (hexString) {
    //random-based impl of Mongo ObjectID
    if (hexString) {
      hexString = hexString.toLowerCase();
      if (!Relution.LiveData.ObjectID._looksLikeObjectID(hexString)) {
        throw new Error('Invalid hexadecimal string for creating an ObjectID');
      }
      // meant to work with _.isEqual(), which relies on structural equality
      this._str = hexString;
    } else {

      this._str =
        this._hexString(8, new Date().getTime() / 1000) +     // a 4-byte value from the Unix timestamp
        this._hexString(6, Relution.LiveData.ObjectID.machineId) +          // a 3-byte machine identifier
        this._hexString(4, Relution.LiveData.ObjectID.processId) +          // a 2-byte process identifier
        this._hexString(6, Relution.LiveData.ObjectID.counter++);   // a 3-byte counter, starting with a random value.
    }
    return this._str;
  },

  _hexString: function (len, num) {
    num = num || parseInt(Math.random() * Math.pow(16, len));
    var str = num.toString(16);
    while (str.length < len) {
      str = '0' + str;
    }
    return str.substr(0, len);
  },

  toString: function () {
    return 'ObjectID(\'' + this._str + '\')';
  },

  equals: function (other) {
    return other instanceof this._ObjectID && this.valueOf() === other.valueOf();
  },

  clone: function () {
    return new Relution.LiveData.ObjectID(this._str);
  },

  typeName: function () {
    return 'oid';
  },

  getTimestamp: function () {
    return parseInt(this._str.substr(0, 8), 16) * 1000;
  },

  getMachineId: function () {
    return parseInt(this._str.substr(8, 6), 16);
  },

  getProcessId: function () {
    return parseInt(this._str.substr(14, 4), 16);
  },

  getCounter: function () {
    return parseInt(this._str.substr(18, 6), 16);
  },

  valueOf: function () {
    return this._str;
  },

  toJSON: function () {
    return this._str;
  },

  toHexString: function () {
    return this._str;
  },

  // Is this selector just shorthand for lookup by _id?
  _selectorIsId: function (selector) {
    return (typeof selector === 'string') ||
      (typeof selector === 'number') ||
      selector instanceof Relution.LiveData.ObjectId;
  },

  // Is the selector just lookup by _id (shorthand or not)?
  _selectorIsIdPerhapsAsObject: function (selector) {
    return this._selectorIsId(selector) || (selector && typeof selector === 'object' && selector._id && this._selectorIsId(selector._id) && _.size(selector) === 1);
  },

  // If this is a selector which explicitly constrains the match by ID to a finite
  // number of documents, returns a list of their IDs.  Otherwise returns
  // null. Note that the selector may have other restrictions so it may not even
  // match those document!  We care about $in and $and since those are generated
  // access-controlled update and remove.
  _idsMatchedBySelector: function (selector) {
    // Is the selector just an ID?
    if (this._selectorIsId(selector)) {
      return [selector];
    }
    if (!selector) {
      return null;
    }

    // Do we have an _id clause?
    if (_.has(selector, '_id')) {
      // Is the _id clause just an ID?
      if (this._selectorIsId(selector._id)) {
        return [selector._id];
      }
      // Is the _id clause {_id: {$in: ["x", "y", "z"]}}?
      if (selector._id && selector._id.$in && _.isArray(selector._id.$in) && !_.isEmpty(selector._id.$in) && _.all(selector._id.$in, this._selectorIsId)) {
        return selector._id.$in;
      }
      return null;
    }

    // If this is a top-level $and, and any of the clauses constrain their
    // documents, then the whole selector is constrained by any one clause's
    // constraint. (Well, by their intersection, but that seems unlikely.)
    if (selector.$and && _.isArray(selector.$and)) {
      for (var i = 0; i < selector.$and.length; ++i) {
        var subIds = this._idsMatchedBySelector(selector.$and[i]);
        if (subIds) {
          return subIds;
        }
      }
    }

    return null;
  }
});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

// Returns a unique identifier

/**
 *
 * @module Relution.LiveData.UniqueId
 *
 * @type {*}
 * @extends Relution.LiveData._Object
 */
Relution.LiveData.UniqueId = Relution.LiveData._Object.design({
  uuid: function (len, radix) {
    // based on Robert Kieffer's randomUUID.js at http://www.broofa.com
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];
    //len = len ? len : 32;
    radix = radix || chars.length;
    var i;

    if (len) {
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }
});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * This prototype defines decoding and encoding mechanisms based on the Base64 algorithm. You
 * normally don't call this object respectively its methods directly, but let Relution.LiveData.Cypher handle
 * this.
 * @module Relution.LiveData.Base64
 *
 * @extends Relution.LiveData._Object
 */
Relution.LiveData.Base64 = Relution.LiveData._Object.design(/** @scope Relution.LiveData.Base64.prototype */ {

  /**
   * The type of this object.
   *
   * @type String
   */
  type: 'Relution.LiveData.Base64',

  /**
   * The key string for the base 64 decoding and encoding.
   *
   * @type String
   */
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  /**
   * This method encodes a given binary input, using the base64 encoding.
   *
   * @param {String} input The binary to be encoded. (e.g. an requested image)
   * @returns {String} The base64 encoded string.
   */
  encodeBinary: function (input) {
    var output = '';
    var bytebuffer;
    var encodedCharIndexes = new Array(4);
    var inx = 0;
    var paddingBytes = 0;

    while (inx < input.length) {
      // Fill byte buffer array
      bytebuffer = new Array(3);
      for (var jnx = 0; jnx < bytebuffer.length; jnx++) {
        if (inx < input.length) {
          bytebuffer[jnx] = input.charCodeAt(inx++) & 0xff;
        } // throw away high-order byte, as documented at: https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
        else {
          bytebuffer[jnx] = 0;
        }
      }

      // Get each encoded character, 6 bits at a time
      // index 1: first 6 bits
      encodedCharIndexes[0] = bytebuffer[0] >> 2;
      // index 2: second 6 bits (2 least significant bits from input byte 1 + 4 most significant bits from byte 2)
      encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
      // index 3: third 6 bits (4 least significant bits from input byte 2 + 2 most significant bits from byte 3)
      encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
      // index 3: forth 6 bits (6 least significant bits from input byte 3)
      encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

      // Determine whether padding happened, and adjust accordingly
      paddingBytes = inx - (input.length - 1);
      switch (paddingBytes) {
        case 2:
          // Set last 2 characters to padding char
          encodedCharIndexes[3] = 64;
          encodedCharIndexes[2] = 64;
          break;
        case 1:
          // Set last character to padding char
          encodedCharIndexes[3] = 64;
          break;
        default:
          break; // No padding - proceed
      }
      // Now we will grab each appropriate character out of our keystring
      // based on our index array and append it to the output string
      for (jnx = 0; jnx < encodedCharIndexes.length; jnx++) {
        output += this._keyStr.charAt(encodedCharIndexes[jnx]);
      }
    }
    return output;
  },

  /**
   * This method encodes a given input string, using the base64 encoding.
   *
   * @param {String} input The string to be encoded.
   * @returns {String} The base64 encoded string.
   */
  encode: function (input) {
    var output = '';
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Relution.LiveData.Cypher.utf8Encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output += this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }

    return output;
  },

  binaryEncode: function (input) {
    var output = '';
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output += this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }

    return output;
  },

  /**
   * This method decodes a given input string, using the base64 decoding.
   *
   * @param {String} input The string to be decoded.
   * @returns {String} The base64 decoded string.
   */
  decode: function (input) {
    var output = '';
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    return Relution.LiveData.Cypher.utf8Decode(output);
  }

});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * This prototype defines a hashing mechanism based on the SHA256 algorithm. You normally
 * don't call this object respectively its methods directly, but let Relution.LiveData.Cypher handle
 * this.
 * @module Relution.LiveData.SHA256
 *
 * @extends Relution.LiveData._Object
 */
Relution.LiveData.SHA256 = Relution.LiveData._Object.design(/** @scope Relution.LiveData.SHA256.prototype */ {

  /**
   * The type of this object.
   *
   * @type String
   */
  type: 'Relution.LiveData.SHA256',

  /**
   * Defines the bits per input character: 8 - ASCII, 16 - Unicode
   *
   * @type Number
   */
  chrsz: 8,

  /**
   * Defines the hex output format: 0 - lowercase, 1 - uppercase
   *
   * @type Number
   */
  hexcase: 0,

  /**
   * This method is called from the 'outside world', controls the hashing and
   * finally returns the hash value.
   *
   * @param {String} input The input string to be hashed.
   * @returns {String} The sha256 hashed string.
   */
  hash: function (input) {
    input = Relution.LiveData.Cypher.utf8Encode(input);
    return this.binb2hex(this.coreSha256(this.str2binb(input), input.length * this.chrsz));
  },

  /**
   * @private
   */
  safeAdd: function (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  },

  /**
   * @private
   */
  S: function (X, n) {
    return ( X >>> n ) | (X << (32 - n));
  },

  /**
   * @private
   */
  R: function (X, n) {
    return ( X >>> n );
  },

  /**
   * @private
   */
  Ch: function (x, y, z) {
    return ((x & y) ^ ((~x) & z));
  },

  /**
   * @private
   */
  Maj: function (x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  },

  /**
   * @private
   */
  Sigma0256: function (x) {
    return (this.S(x, 2) ^ this.S(x, 13) ^ this.S(x, 22));
  },

  /**
   * @private
   */
  Sigma1256: function (x) {
    return (this.S(x, 6) ^ this.S(x, 11) ^ this.S(x, 25));
  },

  /**
   * @private
   */
  Gamma0256: function (x) {
    return (this.S(x, 7) ^ this.S(x, 18) ^ this.R(x, 3));
  },

  /**
   * @private
   */
  Gamma1256: function (x) {
    return (this.S(x, 17) ^ this.S(x, 19) ^ this.R(x, 10));
  },

  /**
   * @private
   */
  coreSha256: function (m, l) {
    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for (i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (j = 0; j < 64; j++) {
        if (j < 16) {
          W[j] = m[j + i];
        } else {
          W[j] = this.safeAdd(this.safeAdd(this.safeAdd(this.Gamma1256(W[j - 2]), W[j - 7]), this.Gamma0256(W[j - 15])), W[j - 16]);
        }

        T1 = this.safeAdd(this.safeAdd(this.safeAdd(this.safeAdd(h, this.Sigma1256(e)), this.Ch(e, f, g)), K[j]), W[j]);
        T2 = this.safeAdd(this.Sigma0256(a), this.Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = this.safeAdd(d, T1);
        d = c;
        c = b;
        b = a;
        a = this.safeAdd(T1, T2);
      }

      HASH[0] = this.safeAdd(a, HASH[0]);
      HASH[1] = this.safeAdd(b, HASH[1]);
      HASH[2] = this.safeAdd(c, HASH[2]);
      HASH[3] = this.safeAdd(d, HASH[3]);
      HASH[4] = this.safeAdd(e, HASH[4]);
      HASH[5] = this.safeAdd(f, HASH[5]);
      HASH[6] = this.safeAdd(g, HASH[6]);
      HASH[7] = this.safeAdd(h, HASH[7]);
    }
    return HASH;
  },

  /**
   * @private
   */
  str2binb: function (str) {
    var bin = [];
    var mask = (1 << this.chrsz) - 1;
    for (var i = 0; i < str.length * this.chrsz; i += this.chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (24 - i % 32);
    }
    return bin;
  },

  /**
   * @private
   */
  binb2hex: function (binarray) {
    var hexTab = this.hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    var str = '';
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8  )) & 0xF);
    }
    return str;
  }

});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * Relution.LiveData.Cypher defines a prototype for handling decoding, encoding and hashing of string
 * based values.
 * @module Relution.LiveData.Cypher
 *
 * @extends Relution.LiveData._Object
 */
Relution.LiveData.Cypher = Relution.LiveData._Object.design(/** @scope Relution.LiveData.Cypher.prototype */ {

  /**
   * The type of this object.
   *
   * @type String
   */
  type: 'Relution.LiveData.Cypher',

  /**
   * The default decoder.
   *
   * @type Relution.LiveData.Base64
   */
  defaultDecoder: Relution.LiveData.Base64,

  /**
   * The default encoder.
   *
   * @type Relution.LiveData.Base64
   */

  defaultEncoder: Relution.LiveData.Base64,

  /**
   * The default hash algorithm.
   *
   * @type Relution.LiveData.SHA256
   */

  defaultHasher: Relution.LiveData.SHA256,

  /**
   * This method is the one that initiates the decoding of a given string, based on either
   * the default decoder or a custom decoder.
   *
   * @param {String} input The input string to be decoded.
   * @param {Object} algorithm The algorithm object containing a decode method.
   * @returns {String} The decoded string.
   */
  decode: function (input, algorithm) {

    if (algorithm && algorithm.decode) {
      return algorithm.decode(input);
    } else {
      return this.defaultDecoder.decode(input);
    }

  },

  /**
   * This method is the one that initiates the encoding of a given string, based on either
   * the default encoder or a custom encoder.
   *
   * @param {String} input The input string to be decoded.
   * @param {Object} algorithm The algorithm object containing a encode method.
   * @returns {String} The encoded string.
   */
  encode: function (input, algorithm) {

    if (algorithm && algorithm.encode) {
      return algorithm.encode(input);
    } else {
      return this.defaultEncoder.encode(input);
    }

  },

  /**
   * This method is the one that initiates the hashing of a given string, based on either
   * the default hashing algorithm or a custom hashing algorithm.
   *
   * @param {String} input The input string to be hashed.
   * @param {Object} algorithm The algorithm object containing a hash method.
   * @returns {String} The hashed string.
   */
  hash: function (input, algorithm) {

    if (algorithm && algorithm.hash) {
      return algorithm.hash(input);
    } else {
      return this.defaultHasher.hash(input);
    }

  },

  /**
   * Private method for UTF-8 encoding
   *
   * @private
   * @param {String} string The string to be encoded.
   * @returns {String} The utf8 encoded string.
   */
  utf8Encode: function (string) {
    string = string.replace(/\r\n/g, '\n');
    var utf8String = '';

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utf8String += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utf8String += String.fromCharCode((c >> 6) | 192);
        utf8String += String.fromCharCode((c & 63) | 128);
      } else {
        utf8String += String.fromCharCode((c >> 12) | 224);
        utf8String += String.fromCharCode(((c >> 6) & 63) | 128);
        utf8String += String.fromCharCode((c & 63) | 128);
      }

    }

    return utf8String;
  },

  /**
   * Private method for UTF-8 decoding
   *
   * @private
   * @param {String} string The string to be decoded.
   * @returns {String} The utf8 decoded string.
   */
  utf8Decode: function (utf8String) {
    var string = '';
    var i;
    var c;
    var c1;
    var c2;
    var c3;
    i = c = c1 = c2 = 0;

    while (i < utf8String.length) {

      c = utf8String.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utf8String.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utf8String.charCodeAt(i + 1);
        c3 = utf8String.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    }

    return string;
  }

});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

// Returns a unique identifier

/**
 *
 * @module Relution.LiveData.URLUtil
 *
 * @type {*}
 * @extends Relution.LiveData._Object
 */
Relution.LiveData.URLUtil = Relution.LiveData._Object.design({
  /*
   url = "http://example.com:3000/pathname/?search=test#hash";

   location.protocol; // => "http:"
   location.host;     // => "example.com:3000"
   location.hostname; // => "example.com"
   location.port;     // => "3000"
   location.pathname; // => "/pathname/"
   location.hash;     // => "#hash"
   location.search;   // => "?search=test"
   */
  getLocation: function (url) {
    var location = document.createElement('a');
    location.href = url || this.url;
    // IE doesn't populate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    if (location.host === '') {
      location.href = location.href;
    }
    return location;
  },

  resolveLocation: function (str) {
    return this.getLocation(str).toString();
  },

  hashLocation: function (str) {
    return this._hashCode(this.resolveLocation(str));
  },

  _hashCode: function () {
    var hash = 0;
    for (var i = 0; i < arguments.length; ++i) {
      var str = arguments[i] || '';
      for (var j = 0, l = str.length; j < l; ++j) {
        var char = str.charCodeAt(j);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
      }
    }
    return hash;
  }
});


/**
 * JsonPath.ts
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
/* jshint -W061: eval can be harmful. */
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * compiled JSON path expression.
         *
         * @see http://goessner.net/articles/JsonPath/
         */
        var JsonPath = (function () {
            /**
             * constructs a compiled expression.
             *
             * @param expression to compile.
             */
            function JsonPath(expression) {
                this.expression = jsonPath.eval(null, expression, {
                    resultType: 'PATH'
                }) || expression;
                this.simple = /^\w+$/.test(this.expression);
            }
            /**
             * evaluates the expression on a target object.
             *
             * @param obj to evaluate expression on.
             * @param arg options object.
             * @return{any} result of evaluating expression on object.
             */
            JsonPath.prototype.evaluate = function (obj, arg) {
                if (!arg && this.simple) {
                    // fastpath
                    return obj && obj[this.expression];
                }
                var result = jsonPath.eval(obj, this.expression, arg || {
                    wrap: false
                });
                // when result is false it might indicate a missing value, we differentiate by requesting the path here
                if (arg || result !== false || jsonPath.eval(obj, this.expression, {
                    resultType: 'PATH',
                    wrap: false
                })) {
                    return result;
                }
                // intentionally we do not return a value here...
            };
            return JsonPath;
        })();
        LiveData.JsonPath = JsonPath;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=JsonPath.js.map
/**
 * Filter.ts
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
//# sourceMappingURL=Filter.js.map
/**
 * FilterVisitor.ts
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
/// <reference path="Filter.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        var FilterVisitorBase = (function () {
            function FilterVisitorBase() {
            }
            FilterVisitorBase.prototype.visit = function (filter) {
                return this[filter.type].apply(this, arguments);
            };
            FilterVisitorBase.prototype.logOp = function (filter) {
                return this[filter.operation.toLowerCase() + 'Op'].apply(this, arguments);
            };
            return FilterVisitorBase;
        })();
        LiveData.FilterVisitorBase = FilterVisitorBase;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=FilterVisitor.js.map
/**
 * JsonFilterVisitor.ts
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
/* jshint curly: false */
/* jshint eqeqeq: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/* jshint -W018: Confusing use of '!' */
/// <reference path="FilterVisitor.ts" />
/// <reference path="JsonPath.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * compiles a JsonFilterFn from a given Filter tree.
         *
         * @param filter tree being compiled.
         * @param options customizing the matching, entirely optional.
         * @return {function} a JsonFilterFn function.
         */
        function jsonFilter(filter, options) {
            return new JsonFilterVisitor(options).visit(filter);
        }
        LiveData.jsonFilter = jsonFilter;
        /**
         * compiles a Filter tree into a JsonFilterFn.
         */
        var JsonFilterVisitor = (function (_super) {
            __extends(JsonFilterVisitor, _super);
            function JsonFilterVisitor(options) {
                _super.call(this);
                this.options = {
                    casesensitive: false
                };
                if (options) {
                    _.extend(this.options, options);
                }
            }
            JsonFilterVisitor.prototype.containsString = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var contains = filter.contains;
                if (contains === undefined || contains === null) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                var testFn;
                if (this.options.casesensitive) {
                    // case-sensitive
                    testFn = function (val) {
                        return val.toString().indexOf(contains) >= 0;
                    };
                }
                else {
                    // case-insensitive (RegExp-based)
                    var pattern = contains.replace(/([\.\\\[\]\+\^\$\(\)\*\?\{\}\,\!])/g, '\\$1');
                    var regexp = new RegExp(pattern, 'i');
                    testFn = function (val) {
                        return regexp.test(val.toString());
                    };
                }
                return function (obj) {
                    var value = expression.evaluate(obj);
                    if (value === undefined || value === null) {
                        // null/undefined case
                        return false;
                    }
                    else if (_.isArray(value)) {
                        // array case
                        for (var i = 0; i < value.length; ++i) {
                            var val = value[i];
                            if (val !== undefined && val !== null && testFn(val)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return testFn(value);
                    }
                };
            };
            JsonFilterVisitor.prototype.string = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var expected = filter.value;
                if (expected === undefined || expected === null) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                var testFn;
                if (this.options.casesensitive) {
                    // case-sensitive
                    testFn = function (val) {
                        return val == expected;
                    };
                }
                else {
                    // case-insensitive (RegExp-based)
                    var pattern = expected.replace(/([\.\\\[\]\+\^\$\(\)\*\?\{\}\,\!])/g, '\\$1');
                    var regexp = new RegExp('^' + pattern + '$', 'i');
                    testFn = function (val) {
                        return regexp.test(val.toString());
                    };
                }
                return function (obj) {
                    var value = expression.evaluate(obj);
                    if (value === undefined || value === null) {
                        // null/undefined case
                        return false;
                    }
                    else if (_.isArray(value)) {
                        // array case
                        for (var i = 0; i < value.length; ++i) {
                            var val = value[i];
                            if (val !== undefined && val !== null && testFn(val)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return testFn(value);
                    }
                };
            };
            JsonFilterVisitor.prototype.range = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var min = filter.min;
                var max = filter.max;
                if (min === undefined || min === null) {
                    if (max === undefined || max === null) {
                        return function (obj) {
                            var value = expression.evaluate(obj);
                            return !!value;
                        };
                    }
                    else {
                        return function (obj) {
                            var value = expression.evaluate(obj);
                            return !!value && value <= max;
                        };
                    }
                }
                else if (min === max) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return !!value && value == min;
                    };
                }
                else {
                    if (max === undefined || max === null) {
                        return function (obj) {
                            var value = expression.evaluate(obj);
                            return !!value && value >= min;
                        };
                    }
                    else {
                        return function (obj) {
                            var value = expression.evaluate(obj);
                            return !!value && value <= max && value >= min;
                        };
                    }
                }
            };
            JsonFilterVisitor.prototype.longRange = function (filter) {
                return this.range(filter);
            };
            JsonFilterVisitor.prototype.dateRange = function (filter) {
                return this.range(filter);
            };
            JsonFilterVisitor.prototype.stringRange = function (filter) {
                // not case-insensitive in WebSQL and we want same behavior here!
                return this.range(filter);
            };
            JsonFilterVisitor.prototype.doubleRange = function (filter) {
                return this.range(filter);
            };
            JsonFilterVisitor.prototype.boolean = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var expected = filter.value;
                return function (obj) {
                    var value = expression.evaluate(obj);
                    return !!value === expected;
                };
            };
            JsonFilterVisitor.prototype.enum = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var values = filter.values;
                if (!values) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return !value;
                    };
                }
                else {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return values.indexOf(value) >= 0;
                    };
                }
            };
            JsonFilterVisitor.prototype.stringEnum = function (filter) {
                // not case-insensitive in WebSQL and we want same behavior here!
                return this.enum(filter);
            };
            JsonFilterVisitor.prototype.longEnum = function (filter) {
                return this.enum(filter);
            };
            JsonFilterVisitor.prototype.stringMap = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var property = filter.key !== undefined && filter.key !== null && new LiveData.JsonPath(filter.key);
                var expected = filter.value;
                var testFn;
                if (expected !== undefined && expected !== null) {
                    if (this.options.casesensitive) {
                        // case-sensitive
                        testFn = function (val) {
                            return val == expected;
                        };
                    }
                    else {
                        // case-insensitive (RegExp-based)
                        var pattern = expected.replace(/([\.\\\[\]\+\^\$\(\)\*\?\{\}\,\!])/g, '\\$1');
                        var regexp = new RegExp('^' + pattern + '$', 'i');
                        testFn = function (val) {
                            return regexp.test(val.toString());
                        };
                    }
                }
                if (!property && !testFn) {
                    // no key and no value --> at least one entry in dictionary
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value && _.keys(value).length > 0;
                    };
                }
                else if (!property) {
                    // no key but some value
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        if (value) {
                            for (var key in value) {
                                var val = value[key];
                                if (val !== undefined && val !== null && testFn(val)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };
                }
                else if (expected === undefined || expected === null) {
                    // key but no value --> any value will do
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        var val = property.evaluate(value);
                        return val !== undefined && val !== null;
                    };
                }
                else {
                    // key and value --> must have exact entry
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        var val = property.evaluate(value);
                        return val !== undefined && val !== null && testFn(val);
                    };
                }
            };
            JsonFilterVisitor.prototype.like = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var like = filter.like;
                if (like === undefined || like === null) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                var pattern = like.replace(/([\.\\\[\]\+\^\$\(\)\*\?\{\}\,\!])/g, '\\$1').replace(/%/g, '.*');
                var regexp;
                if (this.options.casesensitive) {
                    regexp = new RegExp('^' + pattern + '$');
                }
                else {
                    regexp = new RegExp('^' + pattern + '$', 'i');
                }
                return function (obj) {
                    var value = expression.evaluate(obj);
                    if (value === undefined || value === null) {
                        // null/undefined case
                        return false;
                    }
                    else if (_.isArray(value)) {
                        // array case
                        for (var i = 0; i < value.length; ++i) {
                            var val = value[i];
                            if (regexp.test(val)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return regexp.test(value);
                    }
                };
            };
            JsonFilterVisitor.prototype.null = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                if (filter.isNull) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                else {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value !== undefined && value !== null;
                    };
                }
            };
            JsonFilterVisitor.prototype.filters = function (filter) {
                // build filter functions
                var filters = new Array(filter.filters.length);
                for (var i = 0; i < filters.length; ++i) {
                    filters[i] = this.visit(filter.filters[i]);
                }
                return filters;
            };
            JsonFilterVisitor.prototype.andOp = function (filter) {
                var filters = this.filters(filter);
                return function (obj) {
                    for (var i = 0; i < filters.length; ++i) {
                        var filter = filters[i];
                        if (!filter(obj)) {
                            return false;
                        }
                    }
                    return true;
                };
            };
            JsonFilterVisitor.prototype.orOp = function (filter) {
                var filters = this.filters(filter);
                return function (obj) {
                    for (var i = 0; i < filters.length; ++i) {
                        var filter = filters[i];
                        if (filter(obj)) {
                            return true;
                        }
                    }
                    return false;
                };
            };
            JsonFilterVisitor.prototype.nandOp = function (filter) {
                var filters = this.filters(filter);
                return function (obj) {
                    for (var i = 0; i < filters.length; ++i) {
                        var filter = filters[i];
                        if (!filter(obj)) {
                            return true;
                        }
                    }
                    return false;
                };
            };
            JsonFilterVisitor.prototype.norOp = function (filter) {
                var filters = this.filters(filter);
                return function (obj) {
                    for (var i = 0; i < filters.length; ++i) {
                        var filter = filters[i];
                        if (filter(obj)) {
                            return false;
                        }
                    }
                    return true;
                };
            };
            return JsonFilterVisitor;
        })(LiveData.FilterVisitorBase);
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=JsonFilterVisitor.js.map
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
             * formats a string such as '+name,-id'.
             *
             * @return {string} representation of SortOrder, may be the empty string when this is empty.
               */
            SortOrder.prototype.toString = function () {
                var str = '';
                var length = this.sortFields.length;
                for (var i = 0; i < length; ++i) {
                    if (i > 0) {
                        str += ',';
                    }
                    str += this.sortFields[i].toString();
                }
                return str;
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
            /**
             * formats a string such as '+name'.
             *
             * @return {string} such as '+name'.
             */
            SortField.prototype.toString = function () {
                return this.ascending ? '+' + this.name : '-' + this.name;
            };
            return SortField;
        })();
        LiveData.SortField = SortField;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SortOrder.js.map
/**
 * SortOrderComparator.ts
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
/// <reference path="SortOrder.ts" />
/// <reference path="JsonPath.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * compiles a JsonCompareFn from a given SortOrder.
         *
         * @param arg defining the SortOrder being compiled.
         * @return {function} a JsonCompareFn function compatible to Array.sort().
         */
        function jsonCompare(arg, options) {
            var sortOrder;
            if (typeof arg === 'string') {
                sortOrder = new LiveData.SortOrder();
                sortOrder.fromJSON.apply(sortOrder, arguments);
            }
            else if (_.isArray(arg)) {
                sortOrder = new LiveData.SortOrder();
                sortOrder.fromJSON.call(sortOrder, arg);
            }
            else {
                sortOrder = arg;
            }
            var comparator = new SortOrderComparator(sortOrder, options);
            return _.bind(comparator.compare, comparator);
        }
        LiveData.jsonCompare = jsonCompare;
        /**
         * compiled SortOrder for comparison of objects.
         *
         * @see SortOrder
         */
        var SortOrderComparator = (function () {
            /**
             * constructs a compiled SortOrder for object comparison.
             *
             * @param sortOrder to realize.
             */
            function SortOrderComparator(sortOrder, options) {
                this.sortOrder = sortOrder;
                this.options = {
                    casesensitive: false
                };
                if (options) {
                    _.extend(this.options, options);
                }
                this.expressions = new Array(sortOrder.sortFields.length);
                for (var i = 0; i < this.expressions.length; ++i) {
                    this.expressions[i] = new LiveData.JsonPath(sortOrder.sortFields[i].name);
                }
            }
            /**
             * compares objects in a way compatible to Array.sort().
             *
             * @param o1 left operand.
             * @param o2 right operand.
             * @return {number} indicating relative ordering of operands.
             */
            SortOrderComparator.prototype.compare = function (o1, o2) {
                for (var i = 0; i < this.sortOrder.sortFields.length; ++i) {
                    var expression = this.expressions[i];
                    var val1 = expression.evaluate(o1);
                    var val2 = expression.evaluate(o2);
                    var cmp = this.compare1(val1, val2);
                    if (cmp !== 0) {
                        return this.sortOrder.sortFields[i].ascending ? +cmp : -cmp;
                    }
                }
                return 0;
            };
            /**
             * compares values in a way compatible to Array.sort().
             *
             * @param o1 left operand.
             * @param o2 right operand.
             * @return {number} indicating relative ordering of operands.
             */
            SortOrderComparator.prototype.compare1 = function (val1, val2) {
                if (!val1 || !val2) {
                    // null/undefined case
                    if (val2) {
                        return -1;
                    }
                    if (val1) {
                        return +1;
                    }
                }
                else if (Array.isArray(val1) || Array.isArray(val2)) {
                    // array case
                    var items1 = Array.isArray(val1) ? val1 : [val1];
                    var items2 = Array.isArray(val2) ? val2 : [val2];
                    var length = Math.max(items1.length, items2.length);
                    for (var i = 0; i < length; ++i) {
                        var c = this.compare1(items1[i], items2[i]);
                        if (c !== 0) {
                            return c;
                        }
                    }
                }
                else {
                    // comparision case
                    if (!this.options.casesensitive) {
                        if (typeof val1 === 'string') {
                            val1 = val1.toLowerCase();
                        }
                        if (typeof val2 === 'string') {
                            val2 = val2.toLowerCase();
                        }
                    }
                    // value case
                    if (val1 < val2) {
                        return -1;
                    }
                    if (val1 > val2) {
                        return +1;
                    }
                }
                return 0;
            };
            return SortOrderComparator;
        })();
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SortOrderComparator.js.map
/**
 * GetQuery.ts
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
/* jshint quotmark: false */
/// <reference path="../core/livedata.d.ts"/>
/// <reference path="Filter.ts" />
/// <reference path="SortOrder.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * general query parameters.
         *
         * Caution, member fields eventually are shared by multiple instances! You may mutate member fields, but not the
         * objects and arrays referenced by them.
         */
        var GetQuery = (function () {
            /**
             * default/copy constructor.
             *
             * @param other instance to optionally initialize an independent copy of.
             */
            function GetQuery(other) {
                if (other) {
                    this.limit = other.limit;
                    this.offset = other.offset;
                    this.sortOrder = other.sortOrder;
                    this.filter = other.filter;
                    this.fields = other.fields;
                }
            }
            Object.defineProperty(GetQuery.prototype, "min", {
                get: function () {
                    return this.offset | 0;
                },
                set: function (value) {
                    var offset = value && value !== 0 ? value : undefined;
                    if (offset !== this.offset) {
                        var max = this.max;
                        this.offset = offset;
                        this.max = max;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GetQuery.prototype, "max", {
                get: function () {
                    return this.limit ? (this.limit + this.min) : Infinity;
                },
                set: function (value) {
                    var limit = value && value !== Infinity ? (value - this.min) : undefined;
                    if (limit !== this.limit) {
                        var min = this.min;
                        this.limit = limit;
                        this.min = min;
                    }
                },
                enumerable: true,
                configurable: true
            });
            GetQuery.prototype.fromJSON = function (json) {
                this.limit = json.limit;
                this.offset = json.offset;
                this.sortOrder = json.sortOrder && new LiveData.SortOrder().fromJSON(json.sortOrder);
                this.filter = json.filter;
                this.fields = json.fields;
                return this;
            };
            GetQuery.isAndFilter = function (filter) {
                return filter.type === 'logOp' && filter.operation === 'and';
            };
            GetQuery.prototype.merge = function (other) {
                this.min = Math.max(this.min, other.min);
                this.max = Math.min(this.max, other.max);
                if (!this.sortOrder) {
                    this.sortOrder = other.sortOrder && new LiveData.SortOrder(other.sortOrder);
                }
                else if (other.sortOrder) {
                    this.sortOrder.merge(other.sortOrder);
                }
                if (!this.filter) {
                    this.filter = other.filter;
                }
                else if (other.filter) {
                    this.filter = {
                        type: 'logOp',
                        operation: 'and',
                        filters: [
                            this.filter,
                            other.filter
                        ]
                    };
                }
                if (!this.fields) {
                    this.fields = other.fields;
                }
                else if (other.fields) {
                    this.fields = this.fields.concat(other.fields);
                }
            };
            GetQuery.prototype.optimize = function () {
                if (this.sortOrder) {
                    this.sortOrder.optimize();
                }
                if (this.filter && GetQuery.isAndFilter(this.filter)) {
                    // following loop flattens nested and filters by recursively replacing them by their children
                    var filters = this.filter.filters;
                    for (var i = filters.length - 1; i >= 0; --i) {
                        if (GetQuery.isAndFilter(filters[i])) {
                            // replace current filter with nested filters
                            var nestedFilters = filters[i].filters;
                            Array.prototype.splice.apply(filters, Array.prototype.concat([i, 1], nestedFilters));
                            i += nestedFilters.length;
                        }
                    }
                }
                if (this.fields) {
                    // not an unsorted unique to have resulting array sorted
                    Array.prototype.sort.apply(this.fields);
                    this.fields = _.unique(this.fields, true);
                }
            };
            /**
             * computes query string from this instance.
             *
             * @return {string} of query parameters encoded for URIs, may be undefined if this object is empty.
             */
            GetQuery.prototype.toQueryParams = function () {
                var params = '';
                if (this.limit) {
                    params += '&limit=' + this.limit;
                }
                if (this.offset) {
                    params += '&offset=' + this.offset;
                }
                if (this.sortOrder) {
                    var sortOrder = this.sortOrder.toString();
                    if (sortOrder) {
                        params += '&sortOrder=' + encodeURIComponent(sortOrder);
                    }
                }
                if (this.filter) {
                    params += '&filter=' + encodeURIComponent(JSON.stringify(this.filter));
                }
                if (this.fields) {
                    var length = this.fields.length;
                    for (var i = 0; i < length; ++i) {
                        params += '&field=' + this.fields[i];
                    }
                }
                return params && params.substr(1);
            };
            return GetQuery;
        })();
        LiveData.GetQuery = GetQuery;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=GetQuery.js.map

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module Relution.LiveData.Security
 *
 * @type {{logon: Function, logonBasicAuth: Function, logonMcapAuth: Function, getHost: Function}}
 */
Relution.LiveData.Security = Relution.LiveData._Object.design({

  logon: _.extend(function logon(options) {
    var credentials = options && options.credentials;
    var type = credentials && credentials.type;
    var auth = type && logon[type];
    return auth ? auth.apply(this, arguments) : Q.resolve();
  }, {
    basic: function basic(options) {
      var credentials = options.credentials;
      var auth = credentials.username && Relution.LiveData.Base64.encode(encodeURIComponent(credentials.username + ':' + (credentials.password || '')));
      if (auth) {
        options.beforeSend = function (xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + auth);
        };
      }
      return Q.resolve();
    }
  })

});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt
/* jshint indent: 4 */
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/// <reference path="../core/livedata.d.ts" />
/// <reference path="../utility/Debug.ts" />
/// <reference path="stores/Store.ts" />
/// <reference path="Collection.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * tests whether a given object is a Model.
         *
         * @param {object} object to check.
         * @return {boolean} whether object is a Model.
         */
        function isModel(object) {
            if (typeof object !== 'object') {
                return false;
            }
            else if ('isModel' in object) {
                Relution.assert(function () { return object.isModel === Model.prototype.isPrototypeOf(object); });
                return object.isModel;
            }
            else {
                return Model.prototype.isPrototypeOf(object);
            }
        }
        LiveData.isModel = isModel;
        /**
         * @module Relution.LiveData.Model
         *
         * @type {*}
         * @extends Backbone.Model
         */
        var Model /*<AttributesType extends Object>*/ = (function (_super) {
            __extends(Model /*<AttributesType extends Object>*/, _super);
            function Model /*<AttributesType extends Object>*/(attributes, options) {
                _super.call(this, attributes, options);
                this.defaults = {};
                this.changedSinceSync = {};
                if (this.urlRoot && typeof this.urlRoot === 'string') {
                    if (this.urlRoot.charAt(this.urlRoot.length - 1) !== '/') {
                        this.urlRoot += '/';
                    }
                }
                this.init(attributes, options);
            }
            Model /*<AttributesType extends Object>*/.prototype.init = function (attributes, options) {
                options = options || {};
                this.collection = options.collection || this.collection;
                this.idAttribute = options.idAttribute || this.idAttribute;
                this.store = this.store || (this.collection ? this.collection.store : null) || options.store;
                if (this.store && _.isFunction(this.store.initModel)) {
                    this.store.initModel(this, options);
                }
                this.entity = this.entity || (this.collection ? this.collection.entity : null) || options.entity;
                this.credentials = this.credentials || (this.collection ? this.collection.credentials : null) || options.credentials;
                this.on('change', this.onChange, this);
                this.on('sync', this.onSync, this);
            };
            Model /*<AttributesType extends Object>*/.prototype.ajax = function (options) {
                return Relution.LiveData.ajax.apply(this, arguments);
            };
            Model /*<AttributesType extends Object>*/.prototype.sync = function (method, model, options) {
                return Relution.LiveData.sync.apply(this, arguments);
            };
            Model /*<AttributesType extends Object>*/.prototype.onChange = function (model, options) {
                // For each `set` attribute, update or delete the current value.
                var attrs = model.changedAttributes();
                if (_.isObject(attrs)) {
                    for (var key in attrs) {
                        this.changedSinceSync[key] = attrs[key];
                    }
                }
            };
            Model /*<AttributesType extends Object>*/.prototype.onSync = function (model, options) {
                this.changedSinceSync = {};
            };
            Model /*<AttributesType extends Object>*/.prototype.getUrlRoot = function () {
                if (this.urlRoot) {
                    return _.isFunction(this.urlRoot) ? this.urlRoot() : this.urlRoot;
                }
                else if (this.collection) {
                    return this.collection.getUrlRoot();
                }
                else if (this.url) {
                    var url = _.isFunction(this.url) ? this.url() : this.url;
                    if (url && this.id && url.indexOf(this.id) > 0) {
                        return url.substr(0, url.indexOf(this.id));
                    }
                    return url;
                }
            };
            Model /*<AttributesType extends Object>*/.extend = Backbone.Model.extend;
            Model /*<AttributesType extends Object>*/.create = Relution.LiveData.create;
            Model /*<AttributesType extends Object>*/.design = Relution.LiveData.design;
            return Model /*<AttributesType extends Object>*/;
        })(Backbone.Model);
        LiveData.Model /*<AttributesType extends Object>*/ = Model /*<AttributesType extends Object>*/;
        // mixins
        var model = _.extend(Model.prototype, LiveData._Object, {
            _type: 'Relution.LiveData.Model',
            isModel: true,
            isCollection: false
        });
        Relution.assert(function () { return isModel(model); });
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=Model.js.map
// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt
/* jshint indent: 4 */
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/// <reference path="../core/livedata.d.ts" />
/// <reference path="../utility/Debug.ts" />
/// <reference path="stores/Store.ts" />
/// <reference path="Model.ts" />
/// <reference path="stores/SyncContext.ts" />
/// <reference path="stores/SyncEndpoint.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * tests whether a given object is a Collection.
         *
         * @param {object} object to check.
         * @return {boolean} whether object is a Collection.
         */
        function isCollection(object) {
            if (typeof object !== 'object') {
                return false;
            }
            else if ('isCollection' in object) {
                Relution.assert(function () { return object.isCollection === Collection.prototype.isPrototypeOf(object); });
                return object.isCollection;
            }
            else {
                return Collection.prototype.isPrototypeOf(object);
            }
        }
        LiveData.isCollection = isCollection;
        /**
         * The Relution.LiveData.Collection can be used like a Backbone Collection,
         *
         * but there are some enhancements to fetch, save and delete the
         * contained models from or to other "data stores".
         *
         * see WebSqlStore or SyncStore for examples
         *
         * @module Relution.LiveData.Collection
         *
         * @type {*}
         * @extends Backbone.Collection
         *
         */
        var Collection = (function (_super) {
            __extends(Collection, _super);
            function Collection(models, options) {
                _super.call(this, models, options);
                if (this.url && this.url.charAt(this.url.length - 1) !== '/') {
                    this.url += '/';
                }
                this.init(options);
            }
            Collection.prototype.init = function (models, options) {
                options = options || {};
                this.store = options.store || this.store || (this.model ? this.model.prototype.store : null);
                this.entity = options.entity || this.entity || (this.model ? this.model.prototype.entity : null);
                this.options = options.options || this.options;
                this.entity = this.entity || this.entityFromUrl(this.url);
                this._updateUrl();
                if (this.store && _.isFunction(this.store.initCollection)) {
                    this.store.initCollection(this, options);
                }
            };
            Collection.prototype.ajax = function (options) {
                return Relution.LiveData.ajax.apply(this, arguments);
            };
            Collection.prototype.sync = function (method, model, options) {
                return Relution.LiveData.sync.apply(this, arguments);
            };
            Collection.prototype.entityFromUrl = function (url) {
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
            };
            Collection.prototype.destroy = function (options) {
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
                }
                else if (success) {
                    success();
                }
            };
            /**
             * save all containing models
             */
            Collection.prototype.save = function () {
                this.each(function (model) {
                    model.save();
                });
            };
            Collection.prototype.applyFilter = function (callback) {
                this.trigger('filter', this.filter(callback));
            };
            Collection.prototype.getUrlParams = function (url) {
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
            };
            Collection.prototype.getUrl = function () {
                return (_.isFunction(this.url) ? this.url() : this.url) || '';
            };
            Collection.prototype.getUrlRoot = function () {
                var url = this.getUrl();
                return url.indexOf('?') >= 0 ? url.substr(0, url.indexOf('?')) : url;
            };
            Collection.prototype._updateUrl = function () {
                if (this.options) {
                    var params = this.getUrlParams();
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
            };
            /**
             * reads an additional page of data into this collection.
             *
             * A fetch() must have been performed loading the initial set of data. This method is intended for infinite scrolling
             * implementation.
             *
             * When async processing is done, a more attribute is set on the options object in case additional data might be
             * available which can be loaded by calling this method again. Likewise an end attribute is set if the data is
             * fully loaded.
             *
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see SyncContext#fetchMore()
             */
            Collection.prototype.fetchMore = function (options) {
                if (!this.syncContext) {
                    return Q.reject(new Error('no context'));
                }
                return this.syncContext.fetchMore(this, options);
            };
            /**
             * reads the next page of data into this collection.
             *
             * A fetch() must have been performed loading the initial set of data. This method is intended for paging
             * implementation.
             *
             * When async processing is done, a next/prev attribute is set on the options object in case additional pages might be
             * available which can be loaded by calling the corresponding method.
             *
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see SyncContext#fetchNext()
             */
            Collection.prototype.fetchNext = function (options) {
                if (!this.syncContext) {
                    return Q.reject(new Error('no context'));
                }
                return this.syncContext.fetchNext(this, options);
            };
            /**
             * reads the previous page of data into this collection.
             *
             * A fetch() must have been performed loading the initial set of data. This method is intended for paging
             * implementation.
             *
             * When async processing is done, a next/prev attribute is set on the options object in case additional pages might be
             * available which can be loaded by calling the corresponding method.
             *
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see SyncContext#fetchPrev()
             */
            Collection.prototype.fetchPrev = function (options) {
                if (!this.syncContext) {
                    return Q.reject(new Error('no context'));
                }
                return this.syncContext.fetchPrev(this, options);
            };
            Collection.extend = Backbone.Collection.extend;
            Collection.create = Relution.LiveData.create;
            Collection.design = Relution.LiveData.design;
            return Collection;
        })(Backbone.Collection);
        LiveData.Collection = Collection;
        // mixins
        var collection = _.extend(Collection.prototype, LiveData._Object, {
            _type: 'Relution.LiveData.Collection',
            isModel: false,
            isCollection: true,
            // default model type unless overwritten
            model: LiveData.Model
        });
        Relution.assert(function () { return isCollection(collection); });
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=Collection.js.map
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
                this.options = _.extend({
                    name: ''
                }, options);
                Relution.LiveData.Debug.trace('Store', options);
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
        })();
        LiveData.Store = Store;
        // mixins
        var store = _.extend(Store.prototype, Backbone.Events, LiveData._Object, {
            _type: 'Relution.LiveData.Store',
            isModel: false,
            isCollection: false
        });
        Relution.assert(function () { return Store.prototype.isPrototypeOf(store); });
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=Store.js.map
/**
 * AbstractSqlStore.ts
 *
 * Created by Pascal Brewing on 04.11.2015
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
/* jshint -W109: Strings must use singlequote. */
/* jshint -W004: '%' is already defined. */
/// <reference path="../../core/livedata.d.ts" />
/// <reference path="Store.ts" />
/// <reference path="../../utility/Debug.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * The Relution.LiveData.AbstractSqlStore can be used to store model collection into
         * the webSql database
         *
         * @module Relution.LiveData.AbstractSqlStore
         */
        var AbstractSqlStore = (function (_super) {
            __extends(AbstractSqlStore, _super);
            function AbstractSqlStore(options) {
                _super.call(this, _.extend({
                    name: 'relution-livedata',
                    size: 1024 * 1024,
                    version: '1.0',
                    security: '',
                    entities: {}
                }, options));
                this.db = null;
                this.entities = {};
                for (var entity in this.options.entities) {
                    this.entities[entity] = {
                        table: this.options.entities[entity] || entity
                    };
                }
            }
            AbstractSqlStore.prototype.sync = function (method, model, options) {
                options = options || {};
                var that = this;
                var q = Q.defer();
                var opts = _.extend({
                    entity: model.entity || options.entity
                }, options || {}, {
                    success: function (response) {
                        var result = that.handleSuccess(options, response) || response;
                        q.resolve(result);
                        return result;
                    },
                    error: function (error) {
                        var result = that.handleError(options, error);
                        if (result) {
                            q.resolve(result);
                            return result;
                        }
                        else {
                            q.reject(error);
                        }
                    }
                });
                switch (method) {
                    case 'create':
                        that._checkTable(opts, function () {
                            that._insertOrReplace(model, opts);
                        });
                        break;
                    case 'update':
                    case 'patch':
                        that._checkTable(opts, function () {
                            that._insertOrReplace(model, opts);
                        });
                        break;
                    case 'delete':
                        that._checkTable(opts, function () {
                            that._delete(model, opts);
                        });
                        break;
                    case 'read':
                        that._checkTable(opts, function () {
                            that._select(model, opts);
                        });
                        break;
                    default:
                        break;
                }
                return q.promise;
            };
            AbstractSqlStore.prototype.select = function (options) {
                this._select(null, options);
            };
            AbstractSqlStore.prototype.drop = function (options) {
                this._dropTable(options);
            };
            AbstractSqlStore.prototype.createTable = function (options) {
                this._createTable(options);
            };
            AbstractSqlStore.prototype.execute = function (options) {
                this._executeSql(options);
            };
            AbstractSqlStore.prototype._sqlUpdateDatabase = function (oldVersion, newVersion) {
                // create sql array, simply drop and create the database
                var sql = [];
                for (var entity in this.entities) {
                    sql.push(this._sqlDropTable(entity));
                    sql.push(this._sqlCreateTable(entity));
                }
                return sql;
            };
            AbstractSqlStore.prototype._sqlDropTable = function (entity) {
                return "DROP TABLE IF EXISTS '" + this.entities[entity].table + "';";
            };
            AbstractSqlStore.prototype._sqlCreateTable = function (entity) {
                return "CREATE TABLE IF NOT EXISTS '" + this.entities[entity].table + "' (id VARCHAR(255) NOT NULL PRIMARY KEY ASC UNIQUE, data TEXT NOT NULL);";
            };
            AbstractSqlStore.prototype._sqlDelete = function (options, entity) {
                var sql = 'DELETE FROM \'' + this.entities[entity].table + '\'';
                var where = this._sqlWhereFromData(options, entity);
                if (where) {
                    sql += ' WHERE ' + where;
                }
                else {
                    Relution.assert(function () { return false; }, 'attempt of deletion without where clause');
                }
                sql += options.and ? ' AND ' + options.and : '';
                return sql;
            };
            AbstractSqlStore.prototype._sqlWhereFromData = function (options, entity) {
                if (options && options.models && entity) {
                    var ids = [];
                    var that = this;
                    _.each(options.models, function (model) {
                        if (!model.isNew()) {
                            ids.push(that._sqlValue(model.id));
                        }
                    });
                    if (ids.length > 0) {
                        return 'id IN (' + ids.join(',') + ')';
                    }
                }
                return '';
            };
            AbstractSqlStore.prototype._sqlSelect = function (options, entity) {
                if (options.syncContext) {
                    // new code
                    var sql = 'SELECT ';
                    sql += '*';
                    sql += ' FROM \'' + this.entities[entity].table + '\'';
                    return sql;
                }
                var sql = 'SELECT ';
                sql += '*';
                sql += ' FROM \'' + this.entities[entity].table + '\'';
                var where = this._sqlWhereFromData(options, entity);
                if (where) {
                    sql += ' WHERE ' + where;
                }
                if (options.order) {
                    sql += ' ORDER BY ' + options.order;
                }
                if (options.limit) {
                    sql += ' LIMIT ' + options.limit;
                }
                if (options.offset) {
                    sql += ' OFFSET ' + options.offset;
                }
                return sql;
            };
            AbstractSqlStore.prototype._sqlValue = function (value) {
                value = _.isNull(value) ? 'null' : _.isObject(value) ? JSON.stringify(value) : value.toString();
                value = value.replace(/"/g, '""');
                return '"' + value + '"';
            };
            AbstractSqlStore.prototype._dropTable = function (options) {
                var entity = options.entity;
                if (entity in this.entities && this.entities[entity].created !== false) {
                    if (this._checkDb(options)) {
                        var sql = this._sqlDropTable(entity);
                        // reset flag
                        this._executeTransaction(options, [sql]);
                    }
                }
                else {
                    // no need dropping as table was not created
                    this.handleSuccess(options);
                }
            };
            AbstractSqlStore.prototype._createTable = function (options) {
                var entity = options.entity;
                if (!(entity in this.entities)) {
                    this.entities[entity] = {
                        table: entity
                    };
                }
                if (this._checkDb(options)) {
                    var sql = this._sqlCreateTable(entity);
                    // reset flag
                    this._executeTransaction(options, [sql]);
                }
            };
            AbstractSqlStore.prototype._checkTable = function (options, callback) {
                var that = this;
                var entity = options.entity;
                if (entity && (!this.entities[entity] || this.entities[entity].created === false)) {
                    this._createTable({
                        success: function () {
                            that.entities[entity].created = true;
                            callback();
                        },
                        error: function (error) {
                            that.handleError(options, error);
                        },
                        entity: entity
                    });
                }
                else {
                    // we know it's created already
                    callback();
                }
            };
            AbstractSqlStore.prototype._insertOrReplace = function (model, options) {
                var entity = options.entity;
                var models = LiveData.isCollection(model) ? model.models : [model];
                if (this._checkDb(options) && this._checkData(options, models)) {
                    var statements = [];
                    var sqlTemplate = 'INSERT OR REPLACE INTO \'' + this.entities[entity].table + '\' (';
                    for (var i = 0; i < models.length; i++) {
                        var amodel = models[i];
                        var statement = ''; // the actual sql insert string with values
                        if (!amodel.id) {
                            amodel.set(amodel.idAttribute, new LiveData.ObjectID().toHexString());
                        }
                        var value = options.attrs || amodel.attributes;
                        var keys = ['id', 'data'];
                        var args = [amodel.id, JSON.stringify(value)];
                        if (args.length > 0) {
                            var values = new Array(args.length).join('?,') + '?';
                            var columns = '\'' + keys.join('\',\'') + '\'';
                            statement += sqlTemplate + columns + ') VALUES (' + values + ');';
                            statements.push({
                                statement: statement,
                                arguments: args
                            });
                        }
                    }
                    this._executeTransaction(options, statements, model.toJSON());
                }
            };
            AbstractSqlStore.prototype._select = function (model, options) {
                var entity = options.entity;
                if (this._checkDb(options)) {
                    var lastStatement;
                    var isCollection = !LiveData.isModel(model);
                    var result;
                    if (isCollection) {
                        result = [];
                    }
                    else {
                        options.models = [model];
                    }
                    var stm = this._sqlSelect(options, entity);
                    var that = this;
                    this.db.readTransaction(function (t) {
                        var statement = stm.statement || stm;
                        var args = stm.arguments;
                        lastStatement = statement;
                        Relution.LiveData.Debug.info('sql statement: ' + statement);
                        if (args) {
                            Relution.LiveData.Debug.trace('arguments: ' + JSON.stringify(args));
                        }
                        t.executeSql(statement, args, function (tx, res) {
                            var len = res.rows.length; //, i;
                            for (var i = 0; i < len; i++) {
                                var item = res.rows.item(i);
                                var attrs;
                                try {
                                    attrs = JSON.parse(item.data);
                                }
                                catch (e) {
                                    that.trigger('error', e);
                                    continue;
                                }
                                if (isCollection) {
                                    result.push(attrs);
                                }
                                else {
                                    result = attrs;
                                    break;
                                }
                            }
                        }, function (t, e) {
                            // error
                            Relution.LiveData.Debug.error('webSql error: ' + e.message);
                        });
                    }, function (sqlError) {
                        Relution.LiveData.Debug.error('WebSql Syntax Error: ' + sqlError.message);
                        that.handleError(options, sqlError.message, lastStatement);
                    }, function () {
                        if (result) {
                            if (options.syncContext) {
                                result = options.syncContext.processAttributes(result, options);
                            }
                            that.handleSuccess(options, result);
                        }
                        else {
                            that.handleError(options, 'no result');
                        }
                    });
                }
            };
            AbstractSqlStore.prototype._delete = function (model, options) {
                var entity = options.entity;
                var models = LiveData.isCollection(model) ? model.models : [model];
                if (this._checkDb(options)) {
                    options.models = models;
                    var sql = this._sqlDelete(options, entity);
                    // reset flag
                    this._executeTransaction(options, [sql], model.toJSON());
                }
            };
            AbstractSqlStore.prototype._executeSql = function (options) {
                if (options.sql) {
                    this._executeTransaction(options, [options.sql]);
                }
            };
            AbstractSqlStore.prototype._executeTransaction = function (options, statements, result) {
                var error;
                var lastStatement;
                if (this._checkDb(options)) {
                    var that = this;
                    try {
                        /* transaction has 3 parameters: the transaction callback, the error callback and the success callback */
                        this.db.transaction(function (t) {
                            _.each(statements, function (stm) {
                                var statement = stm.statement || stm;
                                var args = stm.arguments;
                                lastStatement = statement;
                                Relution.LiveData.Debug.info('sql statement: ' + statement);
                                if (args) {
                                    Relution.LiveData.Debug.trace('    arguments: ' + JSON.stringify(args));
                                }
                                t.executeSql(statement, args);
                            });
                        }, function (sqlError) {
                            Relution.LiveData.Debug.error(sqlError.message);
                            that.handleError(options, sqlError.message, lastStatement);
                        }, function () {
                            that.handleSuccess(options, result);
                        });
                    }
                    catch (e) {
                        Relution.LiveData.Debug.error(e.message);
                        error = e;
                    }
                }
                if (error) {
                    this.handleError(options, error, lastStatement);
                }
            };
            AbstractSqlStore.prototype._checkDb = function (options) {
                // has to be initialized first
                if (!this.db) {
                    var error = 'db handler not initialized.';
                    Relution.LiveData.Debug.error(error);
                    this.handleError(options, error);
                    return false;
                }
                return true;
            };
            return AbstractSqlStore;
        })(LiveData.Store);
        LiveData.AbstractSqlStore = AbstractSqlStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=AbstractSqlStore.js.map
/**
 * WebSqlStore.ts
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
/// <reference path="AbstractSqlStore.ts" />
/// <reference path="../../utility/Debug.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * The Relution.LiveData.WebSqlStore can be used to store model collection into
         * the webSql database
         *
         * @module Relution.LiveData.WebSqlStore
         *
         * @type {*}
         * @extends Relution.LiveData.Store
         *
         * @example
         *
         * // The default configuration will save the complete model data as json
         * // into a database column with the name "data"
         *
         * var MyCollection = Relution.LiveData.Collection.extend({
         *      model: MyModel,
         *      entity: 'MyTableName',
         *      store: new Relution.LiveData.WebSqlStorageStore()
         * });
         *
         * // If you want to use specific columns you can specify the fields
         * // in the entity of your model like this:
         *
         * var MyModel = Relution.LiveData.Model.extend({
         *      idAttribute: 'id'
         * });
         */
        var WebSqlStore = (function (_super) {
            __extends(WebSqlStore, _super);
            function WebSqlStore(options) {
                _super.call(this, _.extend({
                    name: 'relution-livedata',
                    size: 1024 * 1024,
                    version: '1.0',
                    security: ''
                }, options));
                var that = this;
                this._openDb({
                    error: function (error) {
                        Relution.LiveData.Debug.error(error);
                        that.trigger('error', error);
                    }
                });
            }
            /**
             * @private
             */
            WebSqlStore.prototype._openDb = function (options) {
                var error, dbError;
                /* openDatabase(db_name, version, description, estimated_size, callback) */
                if (!this.db) {
                    try {
                        if (!global.openDatabase) {
                            error = 'Your browser does not support WebSQL databases.';
                        }
                        else {
                            this.db = global.openDatabase(this.options.name, '', '', this.options.size);
                            if (this.entities) {
                                for (var entity in this.entities) {
                                    this._createTable({ entity: entity });
                                }
                            }
                        }
                    }
                    catch (e) {
                        dbError = e;
                    }
                }
                if (this.db) {
                    if (this.options.version && this.db.version !== this.options.version) {
                        this._updateDb(options);
                    }
                    else {
                        this.handleSuccess(options, this.db);
                    }
                }
                else if (dbError === 2 || dbError === '2') {
                    // Version number mismatch.
                    this._updateDb(options);
                }
                else {
                    if (!error && dbError) {
                        error = dbError;
                    }
                    this.handleSuccess(options, error);
                }
            };
            WebSqlStore.prototype._updateDb = function (options) {
                var error;
                var lastSql;
                var that = this;
                try {
                    if (!this.db) {
                        this.db = global.openDatabase(this.options.name, '', '', this.options.size);
                    }
                    try {
                        var arSql = this._sqlUpdateDatabase(this.db.version, this.options.version);
                        this.db.changeVersion(this.db.version, this.options.version, function (tx) {
                            _.each(arSql, function (sql) {
                                Relution.LiveData.Debug.info('sql statement: ' + sql);
                                lastSql = sql;
                                tx.executeSql(sql);
                            });
                        }, function (err) {
                            if (!lastSql && that.db.version === that.options.version) {
                                // not a real error, concurrent migration attempt completed already
                                that.handleSuccess(options, that.db);
                            }
                            else {
                                that.handleError(options, err.message, lastSql);
                            }
                        }, function () {
                            that.handleSuccess(options, that.db);
                        });
                    }
                    catch (e) {
                        error = e.message;
                        Relution.LiveData.Debug.error('webSql change version failed, DB-Version: ' + this.db.version);
                    }
                }
                catch (e) {
                    error = e.message;
                }
                if (error) {
                    this.handleError(options, error);
                }
            };
            WebSqlStore.prototype.close = function () {
                Relution.LiveData.Debug.info('WebSQL Store close');
                if (this.db) {
                    this.db = null;
                }
            };
            return WebSqlStore;
        })(LiveData.AbstractSqlStore);
        LiveData.WebSqlStore = WebSqlStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=WebSqlStore.js.map
/**
 * CipherSqlStore.ts
 *
 * Created by Pascal Brewing on 04.11.2015
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
/// <reference path="AbstractSqlStore.ts" />
/// <reference path="../../utility/Debug.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * The Relution.LiveData.CipherSqlStore can be used to store model collection into
         * the webSql database
         *
         * @module Relution.LiveData.CipherSqlStore
         *
         * @type {*}
         * @extends Relution.LiveData.AbstractSqlStore
         *
         * @example
         *
         * // The default configuration will save the complete model data as json
         * // into a database column with the name "data"
         *
         * var MyCollection = Relution.LiveData.Collection.extend({
         *      model: MyModel,
         *      entity: 'MyTableName',
         *      store: new Relution.LiveData.CipherSqlStore()
         * });
         *
         * // If you want to use specific columns you can specify the fields
         * // in the entity of your model like this:
         *
         * var MyModel = Relution.LiveData.Model.extend({
         *      idAttribute: 'id'
         * });
         * 0 (default): Documents - visible to iTunes and backed up by iCloud
         * 1: Library - backed up by iCloud, NOT visible to iTunes
         * 2: Library/LocalDatabase - NOT visible to iTunes and NOT backed up by iCloud
         */
        var CipherSqlStore = (function (_super) {
            __extends(CipherSqlStore, _super);
            function CipherSqlStore(options) {
                _super.call(this, _.extend({
                    name: 'relution-livedata',
                    size: 1024 * 1024,
                    security: null
                }, options));
                if (options && !options.security) {
                    throw new Error('security Key is required on a CipherSqlStore');
                }
                Relution.LiveData.Debug.trace('CipherSqlStore', options);
                var self = this;
                this._openDb({
                    error: function (error) {
                        Relution.LiveData.Debug.error(error);
                        self.trigger('error', error);
                    }
                });
            }
            /**
             * The new location option is used to select the database subdirectory location (iOS only) with the following choices:
             *
             * 0 (default): Documents - visible to iTunes and backed up by iCloud
             * 1: Library - backed up by iCloud, NOT visible to iTunes
             * 2: Library/LocalDatabase - NOT visible to iTunes and NOT backed up by iCloud
             *
             * @private
             */
            CipherSqlStore.prototype._openDb = function (errorCallback) {
                var error, dbError;
                if (this.options && !this.options.security) {
                    return Relution.LiveData.Debug.error('A CipherSqlStore need a Security Token!', this.options);
                }
                /* openDatabase(db_name, version, description, estimated_size, callback) */
                if (!this.db) {
                    try {
                        if (!global.sqlitePlugin) {
                            error = 'Your browser does not support SQLite plugin.';
                        }
                        else {
                            this.db = global.sqlitePlugin.openDatabase({ name: this.options.name, key: this.options.security, location: 2 });
                            if (this.entities) {
                                for (var entity in this.entities) {
                                    this._createTable({ entity: entity });
                                }
                            }
                        }
                    }
                    catch (e) {
                        dbError = e;
                    }
                }
                if (this.db) {
                    if (this.options.version && this.db.version !== this.options.version) {
                        this._updateDb(errorCallback);
                    }
                    else {
                        this.handleSuccess(errorCallback, this.db);
                    }
                }
                else if (dbError === 2 || dbError === '2') {
                    // Version number mismatch.
                    this._updateDb(errorCallback);
                }
                else {
                    if (!error && dbError) {
                        error = dbError;
                    }
                    this.handleSuccess(errorCallback, error);
                }
            };
            CipherSqlStore.prototype._updateDb = function (options) {
                var error;
                var lastSql;
                var that = this;
                try {
                    if (!this.db) {
                        this.db = global.sqlitePlugin.openDatabase({ name: this.options.name, key: this.options.security, location: 2 });
                    }
                    try {
                        var arSql = this._sqlUpdateDatabase(this.db.version, this.options.version);
                        Relution.LiveData.Debug.warning('sqlcipher cant change the version its still not supported check out https://github.com/litehelpers/Cordova-sqlcipher-adapter#other-limitations');
                    }
                    catch (e) {
                        error = e.message;
                        Relution.LiveData.Debug.error('webSql change version failed, DB-Version: ' + this.db.version);
                    }
                }
                catch (e) {
                    error = e.message;
                }
                if (error) {
                    this.handleError(options, error);
                }
            };
            /**
             * @description close the exist database
             */
            CipherSqlStore.prototype.close = function () {
                if (this.db) {
                    this.db.close();
                }
            };
            return CipherSqlStore;
        })(LiveData.AbstractSqlStore);
        LiveData.CipherSqlStore = CipherSqlStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=CipherSqlStore.js.map
/**
 * LiveDataMessage.ts
 *
 * Created by Thomas Beckmann on 07.12.2015
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
/// <reference path="SyncContext.ts" />
/// <reference path="../../utility/Debug.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * message packed into a Model.
         *
         * @module Relution.LiveData.LiveDataMessage
         *
         * @type {*}
         */
        var LiveDataMessageModel = (function (_super) {
            __extends(LiveDataMessageModel, _super);
            function LiveDataMessageModel() {
                _super.apply(this, arguments);
            }
            return LiveDataMessageModel;
        })(LiveData.Model);
        LiveData.LiveDataMessageModel = LiveDataMessageModel;
        // mixins
        var msgmodel = _.extend(LiveDataMessageModel.prototype, {
            _type: 'Relution.LiveData.LiveDataMessageModel',
            entity: '__msg__',
            idAttribute: '_id'
        });
        Relution.assert(function () { return new msgmodel({ _id: 'check' }).id === 'check'; });
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=LiveDataMessage.js.map
/**
 * SyncEndpoint.ts
 *
 * Created by Thomas Beckmann on 07.12.2015
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
/// <reference path="SyncContext.ts" />
/// <reference path="../Model.ts" />
/// <reference path="../Collection.ts" />
/// <reference path="../../utility/Debug.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * The Relution.LiveData.SyncEndpoint manages connection of Relution.LiveData.SyncStory to one collection.
         *
         * @module Relution.LiveData.SyncEndpoint
         *
         * @type {*}
         */
        var SyncEndpoint = (function () {
            function SyncEndpoint(options) {
                this.isConnected = null;
                this.entity = options.entity;
                this.modelType = options.modelType;
                this.urlRoot = options.urlRoot;
                this.socketPath = options.socketPath;
                this.credentials = options.credentials;
                var href = LiveData.URLUtil.getLocation(options.urlRoot);
                this.host = href.protocol + '//' + href.host;
                this.path = href.pathname;
                var name = options.entity;
                var user = options.credentials && options.credentials.username ? options.credentials.username : '';
                var hash = LiveData.URLUtil.hashLocation(options.urlRoot);
                this.channel = name + user + hash;
            }
            /**
             * close the endpoint explicit.
             */
            SyncEndpoint.prototype.close = function () {
                if (this.socket) {
                    this.socket.socket.close();
                    this.socket = null;
                }
                if (this.localStore) {
                    this.localStore.close();
                    this.localStore = null;
                }
            };
            return SyncEndpoint;
        })();
        LiveData.SyncEndpoint = SyncEndpoint;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SyncEndpoint.js.map
/**
 * SyncStore.ts
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
/// <reference path="WebSqlStore.ts" />
/// <reference path="CipherSqlStore.ts" />
/// <reference path="SyncContext.ts" />
/// <reference path="SyncEndpoint.ts" />
/// <reference path="LiveDataMessage.ts" />
/// <reference path="../../utility/Debug.ts" />
/// <reference path="../Model.ts" />
/// <reference path="../Collection.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * The Relution.LiveData.SyncStore is used to connect a model collection to an
         * Relution server.
         *
         * This will give you an online and offline store with live data updates.
         *
         * @module Relution.LiveData.SyncStore
         *
         * @type {*}
         * @extends Relution.LiveData.Store
         *
         * @example
         *
         * // The default configuration will save the complete model data as a json,
         * // and the offline change log to a local WebSql database, synchronize it
         * // trough REST calls with the server and receive live updates via a socket.io connection.
         *
         * var MyCollection = Relution.LiveData.Collection.extend({
         *      model: MyModel,
         *      url: 'http://myServer.io/myOrga/myApplication/myCollection',
         *      store: new Relution.LiveData.SyncStore( {
         *          useLocalStore:   true, // (default) store the data for offline use
         *          useSocketNotify: true, // (default) register at the server for live updates
         *          useOfflineChanges: true // (default) allow changes to the offline data
         *      })
         * });
         */
        var SyncStore = (function (_super) {
            __extends(SyncStore, _super);
            function SyncStore(options) {
                _super.call(this, _.extend({
                    localStore: LiveData.WebSqlStore,
                    useLocalStore: true,
                    useSocketNotify: true,
                    useOfflineChanges: true,
                    socketPath: ''
                }, options));
                this.endpoints = {};
                /**
                 * when set, indicates which entity caused a disconnection.
                 *
                 * <p>
                 * This is set to an entity name to limit which entity may cause a change to online state again.
                 * </p>
                 *
                 * @type {string}
                 */
                this.disconnectedEntity = 'all';
                Relution.LiveData.Debug.trace('SyncStore', options);
                if (this.options.useSocketNotify && typeof io !== 'object') {
                    Relution.LiveData.Debug.warning('Socket.IO not present !!');
                    this.options.useSocketNotify = false;
                }
            }
            SyncStore.prototype.initEndpoint = function (modelOrCollection, modelType) {
                var urlRoot = modelOrCollection.getUrlRoot();
                var entity = modelOrCollection.entity;
                if (urlRoot && entity) {
                    // get or create endpoint for this url
                    var credentials = modelOrCollection.credentials || this.options.credentials;
                    var endpoint = this.endpoints[entity];
                    if (!endpoint) {
                        Relution.LiveData.Debug.info('Relution.LiveData.SyncStore.initEndpoint: ' + name);
                        endpoint = new LiveData.SyncEndpoint({
                            entity: entity,
                            modelType: modelType,
                            urlRoot: urlRoot,
                            socketPath: this.options.socketPath,
                            credentials: credentials
                        });
                        this.endpoints[entity] = endpoint;
                        endpoint.localStore = this.createLocalStore(endpoint);
                        endpoint.priority = this.options.orderOfflineChanges && (_.lastIndexOf(this.options.orderOfflineChanges, endpoint.entity) + 1);
                        this.createMsgCollection();
                        endpoint.socket = this.createSocket(endpoint, entity);
                        endpoint.info = this.fetchServerInfo(endpoint);
                    }
                    else {
                        // configuration can not change, must recreate store instead...
                        Relution.assert(function () { return endpoint.urlRoot === urlRoot; }, 'can not change urlRoot, must recreate store instead!');
                        Relution.assert(function () { return JSON.stringify(endpoint.credentials) === JSON.stringify(credentials); }, 'can not change credentials, must recreate store instead!');
                    }
                    return endpoint;
                }
            };
            SyncStore.prototype.initModel = function (model) {
                model.endpoint = this.initEndpoint(model, model.constructor);
            };
            SyncStore.prototype.initCollection = function (collection) {
                collection.endpoint = this.initEndpoint(collection, collection.model);
            };
            SyncStore.prototype.getEndpoint = function (modelOrCollection) {
                var endpoint = this.endpoints[modelOrCollection.entity];
                if (endpoint) {
                    Relution.assert(function () {
                        // checks that modelOrCollection uses a model inheriting from the one of the endpoint
                        var modelType = LiveData.isCollection(modelOrCollection) ? modelOrCollection.model : modelOrCollection.constructor;
                        return modelType === endpoint.modelType || modelType.prototype instanceof endpoint.modelType;
                    }, 'wrong type of model!');
                    return endpoint;
                }
            };
            SyncStore.prototype.createLocalStore = function (endpoint) {
                if (this.options.useLocalStore) {
                    var entities = {};
                    entities[endpoint.entity] = endpoint.channel;
                    var storeOption = {
                        entities: entities
                    };
                    if (this.options.localStoreOptions && typeof this.options.localStoreOptions === 'object') {
                        storeOption = _.clone(this.options.localStoreOptions);
                        storeOption.entities = entities;
                    }
                    return this.options.localStore.create(storeOption);
                }
            };
            /**
             * @description Here we save the changes in a Message local websql
             * @returns {*}
             */
            SyncStore.prototype.createMsgCollection = function () {
                if (this.options.useOfflineChanges && !this.messages) {
                    this.messages = LiveData.Collection.design({
                        model: LiveData.LiveDataMessageModel,
                        store: this.options.localStore.create(this.options.localStoreOptions)
                    });
                }
                return this.messages;
            };
            SyncStore.prototype.createSocket = function (endpoint, name) {
                var _this = this;
                if (this.options.useSocketNotify && endpoint && endpoint.socketPath) {
                    Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.createSocket: ' + name);
                    var url = endpoint.host;
                    var path = endpoint.path;
                    var href = LiveData.URLUtil.getLocation(url);
                    if (href.port === '') {
                        if (href.protocol === 'https:') {
                            url += ':443';
                        }
                        else if (href.protocol === 'http:') {
                            url += ':80';
                        }
                    }
                    path = endpoint.socketPath;
                    // remove leading /
                    var resource = (path && path.indexOf('/') === 0) ? path.substr(1) : path;
                    var connectVo = {
                        resource: resource
                    };
                    if (this.options.socketQuery) {
                        connectVo.query = this.options.socketQuery;
                    }
                    endpoint.socket = io.connect(url, connectVo);
                    endpoint.socket.on('connect', function () {
                        _this._bindChannel(endpoint, name);
                        return _this.onConnect(endpoint).done();
                    });
                    endpoint.socket.on('disconnect', function () {
                        Relution.LiveData.Debug.info('socket.io: disconnect');
                        return _this.onDisconnect(endpoint).done();
                    });
                    endpoint.socket.on(endpoint.channel, function (msg) {
                        return _this.onMessage(endpoint, _this._fixMessage(endpoint, msg));
                    });
                    return endpoint.socket;
                }
            };
            SyncStore.prototype._bindChannel = function (endpoint, name) {
                if (endpoint && endpoint.socket) {
                    Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore._bindChannel: ' + name);
                    var channel = endpoint.channel;
                    var socket = endpoint.socket;
                    var time = this.getLastMessageTime(channel);
                    name = name || endpoint.entity;
                    socket.emit('bind', {
                        entity: name,
                        channel: channel,
                        time: time
                    });
                }
            };
            SyncStore.prototype.getLastMessageTime = function (channel) {
                if (!this.lastMesgTime) {
                    this.lastMesgTime = {};
                }
                else if (this.lastMesgTime[channel] !== undefined) {
                    return this.lastMesgTime[channel];
                }
                // the | 0 below turns strings into numbers
                var time = localStorage.getItem('__' + channel + 'lastMesgTime') || 0;
                this.lastMesgTime[channel] = time;
                return time;
            };
            SyncStore.prototype.setLastMessageTime = function (channel, time) {
                if (!time || time > this.getLastMessageTime(channel)) {
                    localStorage.setItem('__' + channel + 'lastMesgTime', time);
                    this.lastMesgTime[channel] = time;
                }
            };
            SyncStore.prototype.onConnect = function (endpoint) {
                var _this = this;
                if (!endpoint.isConnected) {
                    // when offline transmission is pending, need to wait for it to complete
                    var q = Q.resolve(undefined);
                    if (this.messagesPromise && this.messagesPromise.isPending()) {
                        q = this.messagesPromise.catch(function (error) { return Q.resolve(undefined); });
                    }
                    // sync server/client changes
                    endpoint.isConnected = q.then(function () {
                        // next we'll fetch server-side changes
                        return _this.fetchChanges(endpoint).then(function () {
                            // then send client-side changes
                            if (_this.disconnectedEntity === 'all' || _this.disconnectedEntity === endpoint.entity) {
                                // restart replaying of offline messages
                                _this.messagesPromise = null;
                                _this.disconnectedEntity = null;
                            }
                            return _this._sendMessages();
                        }).catch(function (error) {
                            // catch without error indicates disconnection while going online
                            if (!error) {
                                // disconnected while sending offline changes
                                return _this.onDisconnect(endpoint);
                            }
                            return Q.reject(error);
                        });
                    }).finally(function () {
                        // in the end, when connected still, fire an event informing client code
                        if (endpoint.isConnected) {
                            _this.trigger('connect:' + endpoint.channel);
                        }
                    });
                }
                return endpoint.isConnected;
            };
            SyncStore.prototype.onDisconnect = function (endpoint) {
                var _this = this;
                if (!endpoint.isConnected) {
                    return Q.resolve(undefined);
                }
                endpoint.isConnected = null;
                if (!this.disconnectedEntity) {
                    this.disconnectedEntity = 'all';
                }
                return Q.fcall(function () {
                    if (endpoint.socket && endpoint.socket.socket) {
                        endpoint.socket.socket.onDisconnect();
                    }
                    return undefined;
                }).finally(function () {
                    if (!endpoint.isConnected) {
                        _this.trigger('disconnect:' + endpoint.channel);
                    }
                });
            };
            SyncStore.prototype._fixMessage = function (endpoint, msg) {
                var idAttribute = endpoint.modelType.prototype.idAttribute;
                Relution.assert(function () { return !!idAttribute; }, 'no idAttribute!');
                if (msg.data && !msg.data[idAttribute] && msg.data._id) {
                    msg.data[idAttribute] = msg.data._id; // server bug!
                }
                else if (!msg.data && msg.method === 'delete' && msg[idAttribute]) {
                    msg.data = {};
                    msg.data[idAttribute] = msg[idAttribute]; // server bug!
                }
                return msg;
            };
            SyncStore.prototype.onMessage = function (endpoint, msg) {
                var _this = this;
                // this is called by the store itself for a particular endpoint!
                if (!msg || !msg.method) {
                    return Q.reject(new Error('no message or method given'));
                }
                var q;
                var channel = endpoint.channel;
                if (endpoint.localStore) {
                    // first update the local store by forming a model and invoking sync
                    var options = _.defaults({
                        store: endpoint.localStore
                    }, this.options);
                    var model = new endpoint.modelType(msg.data, _.extend({
                        parse: true
                    }, options));
                    if (!model.id) {
                        // code below will persist with auto-assigned id but this nevertheless is a broken record
                        Relution.LiveData.Debug.error('onMessage: ' + endpoint.entity + ' received data with no valid id performing ' + msg.method + '!');
                    }
                    else {
                        Relution.LiveData.Debug.debug('onMessage: ' + endpoint.entity + ' ' + model.id + ' performing ' + msg.method);
                    }
                    q = endpoint.localStore.sync(msg.method, model, _.extend(options, {
                        merge: msg.method === 'patch'
                    })).then(function (result) {
                        if (!msg.id || msg.id === model.id) {
                            return result;
                        }
                        // id value was reassigned, delete record of old id
                        var oldData = {};
                        oldData[model.idAttribute] = msg.id;
                        var oldModel = new endpoint.modelType(oldData, options);
                        Relution.LiveData.Debug.debug('onMessage: ' + endpoint.entity + ' ' + model.id + ' reassigned from old record ' + oldModel.id);
                        return endpoint.localStore.sync('delete', oldModel, options);
                    });
                }
                else {
                    // just update all collections listening
                    q = Q.resolve(msg);
                }
                // finally set the message time
                return q.then(function () {
                    if (msg.time) {
                        _this.setLastMessageTime(channel, msg.time);
                    }
                    // update all collections listening
                    _this.trigger('sync:' + channel, msg); // SyncContext.onMessage
                    return msg;
                }, function (error) {
                    // not setting message time in error case
                    // report error as event on store
                    _this.trigger('error:' + channel, error, model);
                    return msg;
                });
            };
            SyncStore.prototype.sync = function (method, model, options) {
                var _this = this;
                Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.sync');
                options = options || {};
                try {
                    var endpoint = model.endpoint || this.getEndpoint(model);
                    if (!endpoint) {
                        throw new Error('no endpoint');
                    }
                    if (LiveData.isCollection(model)) {
                        // collections can be filtered, etc.
                        if (method === 'read' && !options.barebone) {
                            var syncContext = options.syncContext; // sync can be called by SyncContext itself when paging results
                            if (!syncContext) {
                                // capture GetQuery options
                                syncContext = new LiveData.SyncContext(options, // dynamic options passed to fetch() implement UI filters, etc.
                                model.options, // static options on collection implement screen-specific stuff
                                this.options // static options of this store realize filtering client/server
                                );
                                options.syncContext = syncContext;
                            }
                            if (model.syncContext !== syncContext) {
                                // assign a different instance
                                if (model.syncContext) {
                                    model.stopListening(this, 'sync:' + endpoint.channel);
                                }
                                model.listenTo(this, 'sync:' + endpoint.channel, _.bind(syncContext.onMessage, syncContext, this, model));
                                model.syncContext = syncContext;
                            }
                        }
                    }
                    else if (LiveData.isModel(model)) {
                        // offline capability requires IDs for data
                        if (!model.id) {
                            if (method === 'create') {
                                model.set(model.idAttribute, new LiveData.ObjectID().toHexString());
                            }
                            else {
                                var error = new Error('no (valid) id: ' + model.id);
                                return Q.reject(this.handleError(options, error) || error);
                            }
                        }
                    }
                    else {
                        // something is really at odds here...
                        var error = new Error('target of sync is neither a model nor a collection!?!');
                        return Q.reject(this.handleError(options, error) || error);
                    }
                    var channel = endpoint.channel;
                    var time = this.getLastMessageTime(channel);
                    // only send read messages if no other store can do this or for initial load
                    if (method === 'read' && endpoint.localStore && time && !options.reset) {
                        // read data from localStore and fetch changes remote
                        var opts = _.clone(options);
                        opts.store = endpoint.localStore;
                        opts.entity = endpoint.entity;
                        delete opts.success;
                        delete opts.error;
                        return endpoint.localStore.sync(method, model, opts).then(function (resp) {
                            // backbone success callback alters the collection now
                            resp = _this.handleSuccess(options, resp) || resp;
                            if (endpoint.socket || options.fetchMode === 'local') {
                                // no need to fetch changes as we got a websocket, that is either connected or attempts reconnection
                                return resp;
                            }
                            // when we are disconnected, try to connect now
                            if (!endpoint.isConnected) {
                                var qInfo = _this.fetchServerInfo(endpoint);
                                if (!qInfo) {
                                    return resp;
                                }
                                return qInfo.then(function (info) {
                                    // trigger reconnection when disconnected
                                    var result;
                                    if (!endpoint.isConnected) {
                                        result = _this.onConnect(endpoint);
                                    }
                                    return result || info;
                                }, function (xhr) {
                                    // trigger disconnection when disconnected
                                    var result;
                                    if (!xhr.responseText && endpoint.isConnected) {
                                        result = _this.onDisconnect(endpoint);
                                    }
                                    return result || resp;
                                }).thenResolve(resp);
                            }
                            // load changes only (will happen AFTER success callback is invoked,
                            // but returned promise will resolve only after changes were processed.
                            return _this.fetchChanges(endpoint).catch(function (xhr) {
                                if (!xhr.responseText && endpoint.isConnected) {
                                    return _this.onDisconnect(endpoint) || resp;
                                }
                                // can not do much about it...
                                _this.trigger('error:' + channel, xhr.responseJSON || xhr.responseText, model);
                                return resp;
                            }).thenResolve(resp); // caller expects original XHR response as changes body data is NOT compatible
                        }, function () {
                            // fall-back to loading full data set
                            return _this._addMessage(method, model, options, endpoint);
                        });
                    }
                    // do backbone rest
                    return this._addMessage(method, model, options, endpoint);
                }
                catch (error) {
                    return Q.reject(this.handleError(options, error) || error);
                }
            };
            SyncStore.prototype._addMessage = function (method, model, options, endpoint) {
                var _this = this;
                if (method && model) {
                    var changes = model.changedSinceSync;
                    var data = null;
                    var storeMsg = true;
                    switch (method) {
                        case 'update':
                        case 'create':
                            data = options.attrs || model.toJSON();
                            break;
                        case 'patch':
                            if (_.isEmpty(changes)) {
                                return;
                            }
                            data = model.toJSON({ attrs: changes });
                            break;
                        case 'delete':
                            break;
                        default:
                            Relution.assert(function () { return method === 'read'; }, 'unknown method: ' + method);
                            storeMsg = false;
                            break;
                    }
                    var entity = model.entity || endpoint.entity;
                    Relution.assert(function () { return model.entity === endpoint.entity; });
                    Relution.assert(function () { return entity.indexOf('~') < 0; }, 'entity name must not contain a ~ character!');
                    var msg = {
                        _id: entity + '~' + model.id,
                        id: model.id,
                        method: method,
                        data: data,
                        //channel: endpoint.channel, // channel is hacked in by storeMessage(), we don't want to use this anymore
                        priority: endpoint.priority,
                        time: Date.now()
                    };
                    var q = Q.resolve(msg);
                    var qMessage;
                    if (storeMsg) {
                        // store and potentially merge message
                        qMessage = this.storeMessage(endpoint, q);
                        q = qMessage.then(function (message) {
                            // in case of merging, this result could be different
                            return message.attributes;
                        });
                    }
                    return q.then(function (msg) {
                        // pass in qMessage so that deletion of stored message can be scheduled
                        return _this._emitMessage(endpoint, msg, options, model, qMessage);
                    });
                }
            };
            SyncStore.prototype._emitMessage = function (endpoint, msg, options, model, qMessage) {
                var _this = this;
                var channel = endpoint.channel;
                var qAjax = this._ajaxMessage(endpoint, msg, options, model);
                var q = qAjax;
                if (qMessage) {
                    // following takes care of offline change store
                    q = q.then(function (data) {
                        // success, remove message stored, if any
                        return _this.removeMessage(endpoint, msg, qMessage).then(data, function (error) {
                            _this.trigger('error:' + channel, error, model); // can not do much about it...
                            return data;
                        }).thenResolve(data); // resolve again yielding data
                    }, function (xhr) {
                        // failure eventually caught by offline changes
                        if (!xhr) {
                            // this seams to be only a connection problem, so we keep the message and call success
                            return Q.resolve(msg.data);
                        }
                        else {
                            // remove message stored and keep rejection as is
                            return _this.removeMessage(endpoint, msg, qMessage).then(xhr, function (error) {
                                _this.trigger('error:' + channel, error, model); // can not do much about it...
                                return xhr;
                            }).thenReject(xhr);
                        }
                    });
                }
                q = this._applyResponse(q, endpoint, msg, options, model);
                return q.finally(function () {
                    // do some connection handling
                    return qAjax.then(function () {
                        // trigger reconnection when disconnected
                        if (!endpoint.isConnected) {
                            return _this.onConnect(endpoint);
                        }
                    }, function (xhr) {
                        // trigger disconnection when disconnected
                        if (!xhr && endpoint.isConnected) {
                            return _this.onDisconnect(endpoint);
                        }
                    });
                });
            };
            SyncStore.prototype._ajaxMessage = function (endpoint, msg, options, model) {
                var _this = this;
                options = options || {};
                var url = options.url;
                if (!url) {
                    url = endpoint.urlRoot;
                    if (msg.id && msg.method !== 'create') {
                        // add ID of model
                        url += (url.charAt(url.length - 1) === '/' ? '' : '/') + msg.id;
                    }
                    if (msg.method === 'read' && LiveData.isCollection(model)) {
                        // add query of collection
                        var collectionUrl = _.isFunction(model.url) ? model.url() : model.url;
                        var queryIndex = collectionUrl.lastIndexOf('?');
                        var getQuery = new LiveData.GetQuery().fromJSON(options);
                        // currently only sortOrder can be supported as we require the initial data load to yield full dataset
                        getQuery.limit = null;
                        getQuery.offset = null;
                        getQuery.filter = null;
                        getQuery.fields = null;
                        var getParams = getQuery.toQueryParams();
                        if (queryIndex >= 0) {
                            url += collectionUrl.substr(queryIndex);
                            if (getParams) {
                                url += '&' + getParams;
                            }
                        }
                        else {
                            if (getParams) {
                                url += '?' + getParams;
                            }
                        }
                    }
                }
                Relution.LiveData.Debug.trace('ajaxMessage ' + msg.method + ' ' + url);
                var opts = {
                    // must not take arbitrary options as these won't be replayed on reconnect
                    url: url,
                    attrs: msg.data,
                    store: {},
                    credentials: options.credentials,
                    // error propagation
                    error: options.error
                };
                delete options.xhr; // make sure not to use old value
                return model.sync(msg.method, model, opts).then(function (data) {
                    options.xhr = opts.xhr.xhr || opts.xhr;
                    return data;
                }, function (xhr) {
                    options.xhr = opts.xhr.xhr || opts.xhr;
                    if (!xhr.responseText && _this.options.useOfflineChanges) {
                        // this seams to be a connection problem
                        return Q.reject();
                    }
                    return Q.isPromise(xhr) ? xhr : Q.reject(xhr);
                });
            };
            SyncStore.prototype._applyResponse = function (qXHR, endpoint, msg, options, model) {
                var _this = this;
                var channel = endpoint.channel;
                var clientTime = new Date().getTime();
                return qXHR.then(function (data) {
                    // delete on server does not respond a body
                    if (!data && msg.method === 'delete') {
                        data = msg.data;
                    }
                    // update local store state
                    if (data) {
                        // no data if server asks not to alter state
                        // this.setLastMessageTime(channel, msg.time);
                        var promises = [];
                        var dataIds;
                        if (msg.method !== 'read') {
                            promises.push(_this.onMessage(endpoint, _this._fixMessage(endpoint, data === msg.data ? msg : _.defaults({
                                data: data // just accepts new data
                            }, msg))));
                        }
                        else if (LiveData.isCollection(model) && Array.isArray(data)) {
                            // synchronize the collection contents with the data read
                            var syncIds = {};
                            model.models.forEach(function (m) {
                                syncIds[m.id] = m;
                            });
                            dataIds = {};
                            data.forEach(function (d) {
                                if (d) {
                                    var id = d[endpoint.modelType.prototype.idAttribute] || d._id;
                                    dataIds[id] = d;
                                    var m = syncIds[id];
                                    if (m) {
                                        // update the item
                                        delete syncIds[id]; // so that it is deleted below
                                        if (!_.isEqual(_.pick.call(m, m.attributes, Object.keys(d)), d)) {
                                            // above checked that all attributes in d are in m with equal values and found some mismatch
                                            promises.push(_this.onMessage(endpoint, _this._fixMessage(endpoint, {
                                                id: id,
                                                method: 'update',
                                                time: msg.time,
                                                data: d
                                            })));
                                        }
                                    }
                                    else {
                                        // create the item
                                        promises.push(_this.onMessage(endpoint, _this._fixMessage(endpoint, {
                                            id: id,
                                            method: 'create',
                                            time: msg.time,
                                            data: d
                                        })));
                                    }
                                }
                            });
                            Object.keys(syncIds).forEach(function (id) {
                                // delete the item
                                var m = syncIds[id];
                                promises.push(_this.onMessage(endpoint, _this._fixMessage(endpoint, {
                                    id: id,
                                    method: 'delete',
                                    time: msg.time,
                                    data: m.attributes
                                })));
                            });
                        }
                        else {
                            // trigger an update to load the data read
                            var array = Array.isArray(data) ? data : [data];
                            for (var i = 0; i < array.length; i++) {
                                data = array[i];
                                if (data) {
                                    promises.push(_this.onMessage(endpoint, _this._fixMessage(endpoint, {
                                        id: data[endpoint.modelType.prototype.idAttribute] || data._id,
                                        method: 'update',
                                        time: msg.time,
                                        data: data
                                    })));
                                }
                            }
                        }
                        return Q.all(promises).then(function () {
                            // delayed till operations complete
                            if (!dataIds) {
                                return data;
                            }
                            Relution.assert(function () { return LiveData.isCollection(model); });
                            // when collection was updated only pass data of models that were synced on to the success callback,
                            // as the callback will set the models again causing our sorting and filtering to be without effect.
                            var response = [];
                            var models = LiveData.isCollection(model) ? model.models : [model];
                            for (var i = models.length; i-- > 0;) {
                                var m = models[i];
                                if (dataIds[m.id]) {
                                    response.push(m.attributes);
                                    delete dataIds[m.id];
                                    if (dataIds.length <= 0) {
                                        break;
                                    }
                                }
                            }
                            return response.reverse();
                        });
                    }
                }).then(function (response) {
                    if (msg.method === 'read' && LiveData.isCollection(model)) {
                        // TODO: extract Date header from options.xhr instead of using clientTime
                        _this.setLastMessageTime(endpoint.channel, clientTime);
                    }
                    // invoke success callback, if any
                    return _this.handleSuccess(options, response) || response;
                }, function (error) {
                    // invoke error callback, if any
                    return _this.handleError(options, error) || Q.reject(error);
                });
            };
            SyncStore.prototype.fetchChanges = function (endpoint, force) {
                var _this = this;
                var channel = endpoint.channel;
                if (!endpoint.urlRoot || !channel) {
                    return Q.resolve(undefined);
                }
                var now = Date.now();
                var promise = endpoint.promiseFetchingChanges;
                if (promise && !force) {
                    if (promise.isPending() || now - endpoint.timestampFetchingChanges < 1000) {
                        // reuse existing eventually completed request for changes
                        Relution.LiveData.Debug.warning(channel + ' skipping changes request...');
                        return promise;
                    }
                }
                var time = this.getLastMessageTime(channel);
                if (!time) {
                    Relution.LiveData.Debug.error(channel + ' can not fetch changes at this time!');
                    return promise || Q.resolve(undefined);
                }
                // initiate a new request for changes
                Relution.LiveData.Debug.info(channel + ' initiating changes request...');
                var changes = new this.messages.constructor();
                promise = Q(changes.fetch({
                    url: endpoint.urlRoot + 'changes/' + time,
                    credentials: endpoint.credentials,
                    store: {},
                    success: function (model, response, options) {
                        if (changes.models.length > 0) {
                            changes.each(function (change) {
                                var msg = change.attributes;
                                _this.onMessage(endpoint, _this._fixMessage(endpoint, msg));
                            });
                        }
                        else {
                            // following should use server time!
                            _this.setLastMessageTime(channel, now);
                        }
                        return response || options.xhr;
                    }
                })).thenResolve(changes);
                endpoint.promiseFetchingChanges = promise;
                endpoint.timestampFetchingChanges = now;
                return promise;
            };
            SyncStore.prototype.fetchServerInfo = function (endpoint) {
                var _this = this;
                if (endpoint && endpoint.urlRoot) {
                    var now = Date.now();
                    var promise = endpoint.promiseFetchingServerInfo;
                    if (promise) {
                        if (promise.isPending() || now - endpoint.timestampFetchingServerInfo < 1000) {
                            // reuse existing eventually completed request for changes
                            Relution.LiveData.Debug.warning(endpoint.channel + ' skipping info request...');
                            return promise;
                        }
                    }
                    var info = new LiveData.Model();
                    var time = this.getLastMessageTime(endpoint.channel);
                    var url = endpoint.urlRoot;
                    if (url.charAt((url.length - 1)) !== '/') {
                        url += '/';
                    }
                    promise = Q(info.fetch(({
                        url: url + 'info',
                        success: function (model, response, options) {
                            //@todo why we set a server time here ?
                            if (!time && info.get('time')) {
                                _this.setLastMessageTime(endpoint.channel, info.get('time'));
                            }
                            if (!endpoint.socketPath && info.get('socketPath')) {
                                endpoint.socketPath = info.get('socketPath');
                                var name = info.get('entity') || endpoint.entity;
                                if (_this.options.useSocketNotify) {
                                    endpoint.socket = _this.createSocket(endpoint, name);
                                }
                            }
                            return response || options.xhr;
                        },
                        credentials: endpoint.credentials
                    }))).thenResolve(info);
                    endpoint.promiseFetchingServerInfo = promise;
                    endpoint.timestampFetchingServerInfo = now;
                    return promise;
                }
            };
            /**
             * called when an offline change was sent to the remote server.
             *
             * <p>
             * May be overwritten to alter change message error handling behavior. The default implementation will attempt
             * reloading the server data for restoring the client state such that it reflects the server state. When this
             * succeeded, the offline change is effectively reverted and the change message is dropped.
             * </p>
             * <p>
             * An overwritten implementation may decided whether to revert failed changes based on the error reported.
             * </p>
             * <p>
             * Notice, the method is not called when the offline change failed due to a connectivity issue.
             * </p>
             *
             * @param error reported by remote server.
             * @param message change reported, attributes of type LiveDataMessage.
             * @param options context information required to access the data locally as well as remotely.
             * @return {any} Promise indicating success to drop the change message and proceed with the next change, or
             *    rejection indicating the change message is kept and retried later on.
             */
            SyncStore.prototype.processOfflineMessageResult = function (error, message, options) {
                var _this = this;
                if (!error) {
                    // message was processed successfully
                    if (!this.options.useSocketNotify) {
                        // when not using sockets, fetch changes now
                        var endpoint = this.endpoints[options.entity];
                        if (endpoint) {
                            // will pull the change caused by the offline message and update the message time,
                            // so that we avoid the situation where the change caused by replaying the offline
                            // change results in a conflict later on...
                            return this.fetchChanges(endpoint, true);
                        }
                    }
                    return Q.resolve(message);
                }
                // failed, eventually undo the modifications stored
                if (!options.localStore) {
                    return Q.reject(error);
                }
                // revert modification by reloading data
                var modelType = options.modelType || LiveData.Model;
                var model = new modelType(message.get('data'), {
                    entity: options.entity
                });
                model.id = message.get('method') !== 'create' && message.get('id');
                var triggerError = function () {
                    // inform client application of the offline changes error
                    var channel = message.get('channel');
                    Relution.LiveData.Debug.error('Relution.LiveData.SyncStore.processOfflineMessageResult: triggering error for channel ' + channel + ' on store', error);
                    if (!options.silent) {
                        _this.trigger('error:' + channel, error, model);
                    }
                };
                var localOptions = {
                    // just affect local store
                    store: options.localStore
                };
                var remoteOptions = {
                    urlRoot: options.urlRoot,
                    store: {} // really go to remote server
                };
                if (model.id) {
                    remoteOptions.url = remoteOptions.urlRoot + (remoteOptions.urlRoot.charAt(remoteOptions.urlRoot.length - 1) === '/' ? '' : '/') + model.id;
                    Relution.assert(function () { return model.url() === remoteOptions.url; });
                }
                else {
                    // creation failed, just delete locally
                    Relution.assert(function () { return message.get('method') === 'create'; });
                    return model.destroy(localOptions).finally(triggerError);
                }
                return model.fetch(remoteOptions).then(function (data) {
                    // original request failed and the code above reloaded the data to revert the local modifications, which succeeded...
                    return model.save(data, localOptions).finally(triggerError);
                }, function (fetchResp) {
                    // original request failed and the code above tried to revert the local modifications by reloading the data, which failed as well...
                    var status = fetchResp && fetchResp.status;
                    switch (status) {
                        case 404: // NOT FOUND
                        case 401: // UNAUTHORIZED
                        case 410:
                            // ...because the item is gone by now, maybe someone else changed it to be deleted
                            return model.destroy(localOptions); // silent regarding triggerError
                        default:
                            return Q.reject(fetchResp).finally(triggerError);
                    }
                });
            };
            /**
             * feeds pending offline #messages to the remote server.
             *
             * <p>
             * Due to client code setting up models one at a time, this method is called multiple times during initial setup of
             * #endpoints. The first call fetches pending offline #messages, ordered by priority and time. Then the #messages
             * are send to the remote server until depleted, an error occurs, or some missing endpoint is encounted.
             * </p>
             * <p>
             * The method is triggered each time an endpoint is registered, or state changes to online for any endpoint. When
             * state changes from offline to online (disregarding endpoint) message submission is restarted by resetting the
             * #messagesPromise. Otherwise, subsequent calls chain to the end of #messagesPromise.
             * </p>
             *
             * @return {Promise} of #messages Collection, or last recent offline rejection
             * @private
             */
            SyncStore.prototype._sendMessages = function () {
                var _this = this;
                // not ready yet
                if (!this.messages) {
                    return Q.resolve(undefined);
                }
                // processes messages until none left, hitting a message of a not yet registered endpoint, or entering
                // a non-recoverable error. The promise returned resolves to this.messages when done.
                var nextMessage = function () {
                    if (!_this.messages.length) {
                        return _this.messages;
                    }
                    var message = _this.messages.models[0];
                    var entity = message.id.substr(0, message.id.indexOf('~'));
                    if (!entity) {
                        Relution.LiveData.Debug.error('sendMessage ' + message.id + ' with no entity!');
                        return message.destroy().then(nextMessage);
                    }
                    var endpoint = _this.endpoints[entity];
                    if (!endpoint) {
                        return _this.messages;
                    }
                    Relution.assert(function () { return endpoint.channel === message.get('channel'); }, 'channel of endpoint ' + endpoint.channel + ' does not match channel of message ' + message.get('channel'));
                    var msg = _this._fixMessage(endpoint, message.attributes);
                    var modelType = endpoint.modelType || LiveData.Model;
                    var model = new modelType(msg.data, {
                        entity: endpoint.entity
                    });
                    model.id = message.get('method') !== 'create' && message.get('id');
                    var remoteOptions = {
                        urlRoot: endpoint.urlRoot,
                        store: {} // really go to remote server
                    };
                    if (model.id) {
                        remoteOptions.url = remoteOptions.urlRoot + (remoteOptions.urlRoot.charAt(remoteOptions.urlRoot.length - 1) === '/' ? '' : '/') + model.id;
                        Relution.assert(function () { return model.url() === remoteOptions.url; });
                    }
                    Relution.LiveData.Debug.info('sendMessage ' + model.id);
                    var offlineOptions = {
                        entity: endpoint.entity,
                        modelType: endpoint.modelType,
                        urlRoot: endpoint.urlRoot,
                        localStore: endpoint.localStore
                    };
                    return _this._applyResponse(_this._ajaxMessage(endpoint, msg, remoteOptions, model), endpoint, msg, remoteOptions, model).then(function () {
                        // succeeded
                        return _this.processOfflineMessageResult(null, message, offlineOptions);
                    }, function (error) {
                        if (error) {
                            // remote failed
                            return Q(_this.processOfflineMessageResult(error, message, offlineOptions)).catch(function (error) {
                                // explicitly disconnect due to error in endpoint
                                _this.disconnectedEntity = endpoint.entity;
                                return _this.onDisconnect(endpoint).thenReject(error);
                            });
                        }
                        else {
                            // connectivity issue, keep rejection
                            return Q.reject();
                        }
                    }).then(function () {
                        // applying change succeeded or successfully recovered change
                        return message.destroy();
                    }).then(nextMessage);
                };
                Relution.LiveData.Debug.info('Relution.LiveData.SyncStore._sendMessages');
                var q = this.messagesPromise;
                if (!q) {
                    // initially fetch all messages
                    q = Q(this.messages.fetch({
                        sortOrder: [
                            '-priority',
                            '+time',
                            '+id'
                        ]
                    }));
                }
                else if (this.messagesPromise.isRejected()) {
                    // early rejection
                    return this.messagesPromise;
                }
                else if (!this.messages.length) {
                    // no more messages
                    return this.messagesPromise;
                }
                // kick to process pending messages
                this.messagesPromise = q.then(nextMessage);
                return this.messagesPromise;
            };
            SyncStore.prototype.storeMessage = function (endpoint, qMsg) {
                var _this = this;
                return qMsg.then(function (msg) {
                    var options;
                    var id = _this.messages.modelId(msg);
                    Relution.LiveData.Debug.info('storeMessage ' + id);
                    var message = id && _this.messages.get(id);
                    if (message) {
                        // use existing instance, should not be the case usually
                        options = {
                            merge: true
                        };
                    }
                    else {
                        // instantiate new model, intentionally not added to collection
                        message = new _this.messages.model(msg, {
                            collection: _this.messages,
                            store: _this.messages.store
                        });
                        message.set('channel', endpoint.channel);
                    }
                    return Q(message.save(msg, options)).thenResolve(message);
                });
            };
            SyncStore.prototype.removeMessage = function (endpoint, msg, qMessage) {
                var _this = this;
                return qMessage.then(function (message) {
                    if (!message) {
                        var id = _this.messages.modelId(msg);
                        if (!id) {
                            // msg is not persistent
                            return Q.resolve(undefined);
                        }
                        message = _this.messages.get(id);
                        if (!message) {
                            message = new _this.messages.model({
                                _id: msg._id
                            }, {
                                collection: _this.messages,
                                store: _this.messages.store
                            });
                        }
                    }
                    Relution.LiveData.Debug.trace('removeMessage ' + message.id);
                    return message.destroy();
                });
            };
            SyncStore.prototype.clear = function (collection) {
                if (collection) {
                    var endpoint = this.getEndpoint(collection);
                    if (endpoint) {
                        if (this.messages) {
                            this.messages.destroy();
                        }
                        collection.reset();
                        this.setLastMessageTime(endpoint.channel, '');
                    }
                }
            };
            /**
             * close the socket explicit
             */
            SyncStore.prototype.close = function () {
                if (this.messages.store) {
                    this.messages.store.close();
                    this.messages = null;
                }
                var keys = Object.keys(this.endpoints);
                for (var i = 0, l = keys.length; i < l; i++) {
                    this.endpoints[keys[i]].close();
                }
            };
            return SyncStore;
        })(LiveData.Store);
        LiveData.SyncStore = SyncStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SyncStore.js.map
/**
 * SyncContext.ts
 *
 * Created by Thomas Beckmann on 26.06.2015
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
/* jshint -W086: Expected a 'break' statement before 'case'. */
/// <reference path="../../core/livedata.d.ts" />
/// <reference path="../../query/GetQuery.ts" />
/// <reference path="../../query/JsonFilterVisitor.ts" />
/// <reference path="../../query/SortOrderComparator.ts" />
/// <reference path="Store.ts" />
/// <reference path="LiveDataMessage.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * receives change messages and updates collections.
         */
        var SyncContext = (function () {
            /**
             * captures option values forming a GetQuery.
             *
             * @param options to merge.
             * @constructor
             */
            function SyncContext() {
                var _this = this;
                var options = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    options[_i - 0] = arguments[_i];
                }
                /**
                 * relevant parameters for paging, filtering and sorting.
                 *
                 * @type {Relution.LiveData.GetQuery}
                 */
                this.getQuery = new LiveData.GetQuery();
                // merge options forming a GetQuery
                options.forEach(function (json) {
                    if (json) {
                        _this.getQuery.merge(new LiveData.GetQuery().fromJSON(json));
                    }
                });
                this.getQuery.optimize();
                // compute local members
                this.pageSize = this.getQuery.limit;
                this.compareFn = this.getQuery.sortOrder && LiveData.jsonCompare(this.getQuery.sortOrder);
                this.filterFn = this.getQuery.filter && LiveData.jsonFilter(this.getQuery.filter);
            }
            /**
             * reads an additional page of data into the collection.
             *
             * When async processing is done, a more attribute is set on the options object in case additional data might be
             * available which can be loaded by calling this method again. Likewise an end attribute is set if the data is
             * fully loaded.
             *
             * @param {object} collection to load data into.
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see Collection#fetchMore()
             */
            SyncContext.prototype.fetchMore = function (collection, options) {
                var getQuery = this.getQuery;
                options = _.defaults(options || {}, {
                    limit: options.pageSize || this.pageSize || getQuery.limit,
                    sortOrder: getQuery.sortOrder,
                    filter: getQuery.filter,
                    fields: getQuery.fields
                });
                // prepare a query for the next page of data to load
                options.offset = (getQuery.offset | 0) + collection.models.length;
                // this must be set in options to state we handle it
                options.syncContext = this;
                // setup callbacks handling processing of results, do not use promises as these execute too late...
                // Notice, since we call collection.sync() directly, the signature of success/error callbacks here is ajax-style.
                // However, the user-provided callbacks are to being called backbone.js-style with collection and object.
                var oldSuccess = options.success;
                var oldError = options.error;
                options.success = function fetchMoreSuccess(models) {
                    // restore callbacks
                    options.success = oldSuccess;
                    options.error = oldError;
                    // update models
                    if (models) {
                        // add models to collection, if any
                        if (models.length <= 0) {
                            // reached the end
                            delete options.more;
                        }
                        else {
                            // read additional data
                            if (options.syncContext.compareFn) {
                                // notice, existing range of models is sorted by definition already
                                options.at = options.syncContext.insertionPoint(models[0], collection.models);
                            }
                            models = collection.add(models, options) || models;
                            // adjust query parameter
                            getQuery.limit = collection.models.length;
                            if (options.syncContext.getQuery.limit > getQuery.limit) {
                                // reached the end
                                delete options.more;
                            }
                            else {
                                // more data to load
                                options.more = true;
                                delete options.end;
                            }
                        }
                        // reached the end?
                        if (!options.more) {
                            getQuery.limit = undefined; // open end
                            options.end = true;
                        }
                    }
                    // restore query parameter
                    options.syncContext.getQuery = getQuery;
                    // call user success callback
                    if (options.success) {
                        models = options.success.call(this, collection, models, options) || models;
                    }
                    if (options.finish) {
                        models = options.finish.call(this, collection, models, options) || models;
                    }
                    return models;
                };
                options.error = function fetchMoreError(error) {
                    // restore callbacks
                    options.success = oldSuccess;
                    options.error = oldError;
                    // restore query parameter
                    options.syncContext.getQuery = getQuery;
                    // call user error callback
                    if (options.error) {
                        error = options.error.call(this, collection, error, options) || error;
                    }
                    if (options.finish) {
                        error = options.finish.call(this, collection, error, options) || error;
                    }
                    return error;
                };
                // fire up the page load
                this.getQuery = new LiveData.GetQuery(getQuery);
                this.getQuery.limit = getQuery.limit + options.limit;
                return collection.sync(options.method || 'read', collection, options);
            };
            /**
             * reads a page of data into the collection.
             *
             * When async processing is done, a next/prev attribute is set on the options object in case additional pages might
             * be available which can be loaded by calling this method again.
             *
             * @param {object} collection to load data into.
             * @param {object} options incl. offset and limit of page to retrieve.
             * @return {Promise} promise of the load operation.
             */
            SyncContext.prototype.fetchRange = function (collection, options) {
                // this must be set in options to state we handle it
                options = options || {};
                options.syncContext = this;
                // prepare a query for the page of data to load
                var oldQuery = this.getQuery;
                var newQuery = new LiveData.GetQuery(oldQuery);
                if (options.offset >= 0) {
                    newQuery.offset = options.offset;
                }
                else if (options.offset < 0) {
                    newQuery.offset = undefined;
                }
                var oldLimit = options.limit;
                if (options.limit > 0) {
                    newQuery.limit = options.limit + 1;
                    options.limit = newQuery.limit;
                }
                else if (options.limit <= 0) {
                    newQuery.limit = undefined;
                }
                // setup callbacks handling processing of results, do not use promises as these execute too late...
                // Notice, since we call collection.sync() directly, the signature of success/error callbacks here is ajax-style.
                // However, the user-provided callbacks are to being called backbone.js-style with collection and object.
                var oldSuccess = options.success;
                var oldError = options.error;
                options.success = function fetchRangeSuccess(models) {
                    // restore callbacks and limit
                    options.success = oldSuccess;
                    options.error = oldError;
                    if (oldLimit !== undefined) {
                        options.limit = oldLimit;
                    }
                    // update models
                    if (models) {
                        // add models to collection, if any
                        if (models.length > 0) {
                            // adjust query parameter
                            options.next = newQuery.limit && models.length >= newQuery.limit;
                            if (options.next) {
                                // trick here was to read one more item to see if there is more to come
                                models.length = models.length - 1;
                            }
                            // realize the page
                            models = collection.reset(models, options) || models;
                        }
                        else {
                            // reached the end
                            delete options.next;
                        }
                        options.prev = newQuery.offset > 0;
                    }
                    // call user success callback
                    if (options.success) {
                        models = options.success.call(this, collection, models, options) || models;
                    }
                    if (options.finish) {
                        models = options.finish.call(this, collection, models, options) || models;
                    }
                    return models;
                };
                options.error = function fetchMoreError(error) {
                    // restore callbacks and limit
                    options.success = oldSuccess;
                    options.error = oldError;
                    if (oldLimit !== undefined) {
                        options.limit = oldLimit;
                    }
                    // restore query parameter
                    options.syncContext.getQuery = oldQuery;
                    // call user error callback
                    if (options.error) {
                        error = options.error.call(this, collection, error, options) || error;
                    }
                    if (options.finish) {
                        error = options.finish.call(this, collection, error, options) || error;
                    }
                    return error;
                };
                // fire up the page load
                this.getQuery = newQuery;
                return collection.sync(options.method || 'read', collection, options);
            };
            /**
             * reads the next page of data into the collection.
             *
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see Collection#fetchNext()
             */
            SyncContext.prototype.fetchNext = function (collection, options) {
                options = options || {};
                options.limit = options.pageSize || this.pageSize || this.getQuery.limit;
                options.offset = (this.getQuery.offset | 0) + collection.models.length;
                return this.fetchRange(collection, options);
            };
            /**
             * reads the previous page of data into the collection.
             *
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see Collection#fetchPrev()
             */
            SyncContext.prototype.fetchPrev = function (collection, options) {
                options = options || {};
                options.limit = options.pageSize || this.pageSize || this.getQuery.limit;
                options.offset = (this.getQuery.offset | 0) - options.limit;
                return this.fetchRange(collection, options);
            };
            SyncContext.prototype.filterAttributes = function (attrs, options) {
                return this.filterFn ? attrs.filter(this.filterFn) : attrs;
            };
            SyncContext.prototype.sortAttributes = function (attrs, options) {
                return this.compareFn ? attrs.sort(this.compareFn) : attrs;
            };
            SyncContext.prototype.rangeAttributes = function (attrs, options) {
                var offset = options && options.offset || this.getQuery.offset;
                if (offset > 0) {
                    attrs.splice(0, offset);
                }
                var limit = options && options.limit || this.getQuery.limit;
                if (limit < attrs.length) {
                    attrs.length = limit;
                }
                return attrs;
            };
            SyncContext.prototype.processAttributes = function (attrs, options) {
                attrs = this.filterAttributes(attrs, options);
                attrs = this.sortAttributes(attrs, options);
                attrs = this.rangeAttributes(attrs, options);
                return attrs;
            };
            /**
             * receives change messages.
             *
             * Change messages are communicated by the SyncStore indirectly triggering a sync:channel event. This happens
             * regardless of whether the change originates local or remote. The context then alters the backbone data
             * incorporating the change.
             *
             * @param store
             * @param collection
             * @param msg
             */
            SyncContext.prototype.onMessage = function (store, collection, msg) {
                var options = {
                    collection: collection,
                    entity: collection.entity,
                    merge: msg.method === 'patch',
                    parse: true,
                    fromMessage: true
                };
                var newId = collection.modelId(msg.data); // modelId(attrs) missing in DefinitelyTyped definitions
                var oldId = msg.id || newId;
                if (oldId === 'all') {
                    collection.reset(msg.data || {}, options);
                    return;
                }
                // update the collection
                var model = oldId && collection.get(oldId);
                switch (msg.method) {
                    case 'create':
                    case 'update':
                        if (newId !== oldId) {
                            Relution.LiveData.Debug.warn('updating id ' + oldId + ' to ' + newId);
                        }
                        if (!model) {
                            // create model in case it does not exist
                            model = new options.collection.model(msg.data, options);
                            if (this.filterFn && !this.filterFn(model.attributes)) {
                                break; // filtered
                            }
                            if (model.validationError) {
                                collection.trigger('invalid', this, model.validationError, options);
                            }
                            else {
                                var index = collection.models.length;
                                if (this.compareFn && index > 0) {
                                    options.at = index = this.insertionPoint(model.attributes, collection.models);
                                }
                                // look at index and respect offset/limit eventually ignoring model or removing some,
                                // the not operators below cause proper handling when offset or limit is undefined...
                                /* jshint -W018 */
                                if ((!(this.getQuery.offset > 0) || index > 0) && !(index >= this.getQuery.limit)) {
                                    /* jshint +W018 */
                                    collection.add(model, options);
                                    if (this.getQuery.limit && collection.models.length > this.getQuery.limit) {
                                        collection.remove(collection.models[collection.models.length - 1], options);
                                    }
                                }
                            }
                            break;
                        }
                    /* falls through */
                    case 'patch':
                        if (model) {
                            // update model unless it is filtered
                            model.set(msg.data, options);
                            if (this.filterFn && !this.filterFn(model.attributes)) {
                                // eventually the model is filtered
                                collection.remove(model, options);
                            }
                            else if (this.compareFn) {
                                // eventually the model changes position in collection.models
                                var oldIndex = collection.models.indexOf(model);
                                this.lastInsertionPoint = oldIndex >= 0 ? oldIndex : undefined;
                                var newIndex = this.insertionPoint(model.attributes, collection.models);
                                if (oldIndex !== newIndex) {
                                    // following acts just like backbone.Collection.sort()
                                    collection.models.splice(oldIndex, 1);
                                    collection.models.splice(newIndex, 0, model);
                                    collection.trigger('sort', collection, options);
                                }
                            }
                        }
                        break;
                    case 'delete':
                        if (model) {
                            // remove model
                            collection.remove(model, options);
                        }
                        break;
                }
            };
            /**
             * computes the insertion point of attributes into models sorted by compareFn.
             *
             * This is used to compute the at-index of backbone.js add() method options when adding models to a sorted collection.
             *
             * @param attributes being inserted.
             * @param models sorted by compareFn.
             * @return {number} insertion point.
             */
            SyncContext.prototype.insertionPoint = function (attributes, models) {
                if (this.lastInsertionPoint !== undefined) {
                    // following performs two comparisons at the last insertion point to take advantage of locality,
                    // this means we don't subdivide evenly but check tiny interval at insertion position firstly...
                    var start = Math.max(0, this.lastInsertionPoint);
                    var end = Math.min(models.length, this.lastInsertionPoint + 3);
                    if (end - start > 1) {
                        // focus on (start;end] range speeding up binary searches by taking locality into account
                        var point = this.insertionPointBinarySearch(attributes, models, start, end);
                        if (point >= end) {
                            // select upper interval
                            if (point < models.length) {
                                point = this.insertionPointBinarySearch(attributes, models, point, models.length);
                            }
                        }
                        else if (point < start) {
                            // select lower interval
                            if (point > 0) {
                                point = this.insertionPointBinarySearch(attributes, models, 0, point);
                            }
                        }
                        this.lastInsertionPoint = point;
                        return point;
                    }
                }
                // locality not applicable or did not work
                this.lastInsertionPoint = this.insertionPointBinarySearch(attributes, models, 0, models.length);
                return this.lastInsertionPoint;
            };
            /**
             * performs a binary search for insertion point of attributes into models[start:end] sorted by compareFn.
             *
             * @param attributes being inserted.
             * @param models sorted by compareFn.
             * @param compare function as of Array.sort().
             * @param start inclusive index of search interval.
             * @param end exclusive index of search interval.
             * @return {number} insertion point.
             */
            SyncContext.prototype.insertionPointBinarySearch = function (attributes, models, start, end) {
                var pivot = (start + end) >> 1;
                var delta = this.compareFn(attributes, models[pivot].attributes);
                if (end - start <= 1) {
                    return delta < 0 ? pivot : pivot + 1;
                }
                else if (delta < 0) {
                    // select lower half
                    return this.insertionPointBinarySearch(attributes, models, start, pivot);
                }
                else if (delta > 0) {
                    // select upper half
                    if (++pivot < end) {
                        return this.insertionPointBinarySearch(attributes, models, pivot, end);
                    }
                }
                else {
                    // exact match
                    return pivot;
                }
            };
            return SyncContext;
        })();
        LiveData.SyncContext = SyncContext;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SyncContext.js.map

// Copyright (c) 2015 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

var Bikini = null;
if (global.Relution) {
  Bikini = global.Bikini = Relution.LiveData;
  Bikini.BikiniStore = Relution.LiveData.SyncStore;
}


})(this, Backbone, _, $, Q, jsonPath);
