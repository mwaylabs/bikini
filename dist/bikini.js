/*!
* Project:   Bikini - Everything a model needs
* Copyright: (c) 2015 M-Way Solutions GmbH.
* Version:   0.8.4
* Date:      Wed Nov 04 2015 10:07:25
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
/// <reference path="../core/livedata.d.ts"/>
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * @description A Static Debug Class
         * @example ````js
         * window.Relution.setDebug(true);
         * ````
         */
        var Debug = (function () {
            function Debug() {
            }
            /**
             * @descriptions logs the messages to the console
             * @param color
             * @param message
             */
            Debug.log = function (color, message) {
                if (Relution.LiveData.isDebugMode()) {
                    console.log("%c%s", "color: " + color + "; font-size: " + this.fontSize + ";font-weight: normal;", message);
                }
            };
            /**
             * @name trace
             * @param message
             */
            Debug.trace = function (message) {
                this.log('#378c13', message);
            };
            /**
             * @name warning
             * @param message
             */
            Debug.warning = function (message) {
                this.log('#e69138', message);
            };
            /**
             * @name info
             * @param message
             */
            Debug.info = function (message) {
                this.log('#00f', message);
            };
            /**
             * @name error
             * @param message
             */
            Debug.error = function (message) {
                this.log('#f00', message);
            };
            /**
             * set the fontSize
             * @type {string}
             */
            Debug.fontSize = '12px';
            return Debug;
        })();
        LiveData.Debug = Debug;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));

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

/**
 *
 * @module Relution.LiveData.Date
 *
 * @extends Relution.LiveData._Object
 */
Relution.LiveData.Date = {

  /**
   * This method is used to create a new instance of Relution.LiveData.Date based on the data
   * library moment.js.
   *
   * @returns {Object}
   */
  create: function () {
    var m = moment.apply(this, arguments);
    return _.extend(m, this);
  }
};

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
            }
            /**
             * evaluates the expression on a target object.
             *
             * @param obj to evaluate expression on.
             * @param arg options object.
             * @return{any} result of evaluating expression on object.
             */
            JsonPath.prototype.evaluate = function (obj, arg) {
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
                return this[filter.operation + 'Op'].apply(this, arguments);
            };
            return FilterVisitorBase;
        })();
        LiveData.FilterVisitorBase = FilterVisitorBase;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));

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
         * compiles a JsonFilterFn from a given Filter tree.
         *
         * @param filter tree being compiled.
         * @return {function} a JsonFilterFn function.
         */
        function jsonFilter(filter) {
            return new JsonFilterVisitor().visit(filter);
        }
        LiveData.jsonFilter = jsonFilter;
        /**
         * compiles a Filter tree into a JsonFilterFn.
         */
        var JsonFilterVisitor = (function (_super) {
            __extends(JsonFilterVisitor, _super);
            function JsonFilterVisitor() {
                _super.apply(this, arguments);
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
                            if (val !== undefined && val !== null && val.toString().indexOf(contains) >= 0) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return value !== undefined && value !== null && value.toString().indexOf(contains) >= 0;
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
                            if (val == filter.value) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return value == filter.value;
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
                return this.enum(filter);
            };
            JsonFilterVisitor.prototype.longEnum = function (filter) {
                return this.enum(filter);
            };
            JsonFilterVisitor.prototype.stringMap = function (filter) {
                var expression = new LiveData.JsonPath(filter.fieldName);
                var property = filter.key && new LiveData.JsonPath(filter.key);
                var expected = filter.value;
                if (!property && (expected === undefined || expected === null)) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value === undefined || value === null;
                    };
                }
                else if (!property) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        return value == expected;
                    };
                }
                else if (expected === undefined || expected === null) {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        var val = property.evaluate(value);
                        return val === undefined || val === null;
                    };
                }
                else {
                    return function (obj) {
                        var value = expression.evaluate(obj);
                        var val = property.evaluate(value);
                        return val == expected;
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
                var regexp = like.replace(/%/g, '.*');
                var pattern = new RegExp(regexp);
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
                            if (pattern.test(val)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        // simple case
                        return pattern.test(value);
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
            return SortField;
        })();
        LiveData.SortField = SortField;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));

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
        function jsonCompare(arg) {
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
            var comparator = new SortOrderComparator(sortOrder);
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
            function SortOrderComparator(sortOrder) {
                this.sortOrder = sortOrder;
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
                    var cmp = SortOrderComparator.compare1(val1, val2);
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
            SortOrderComparator.compare1 = function (val1, val2) {
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
                    for (var i = filters.length; i >= 0;) {
                        if (GetQuery.isAndFilter(filters[i])) {
                            Array.prototype.splice.apply(filters, Array.prototype.concat([i, 1], filters[i].filters));
                        }
                        else {
                            --i;
                        }
                    }
                }
                if (this.fields) {
                    // not an unsorted unique to have resulting array sorted
                    Array.prototype.sort.apply(this.fields);
                    this.fields = _.unique(this.fields, true);
                }
            };
            return GetQuery;
        })();
        LiveData.GetQuery = GetQuery;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));


// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module Relution.LiveData.Field
 *
 */

/**
 * Field describing a data attribute
 *
 * contains functions to comperate, detect and convert data type
 *
 * @param options
 * @constructor
 */
Relution.LiveData.Field = function (options) {
  this.merge(options);
  this.initialize.apply(this, arguments);
};

Relution.LiveData.Field.extend = Relution.LiveData.extend;
Relution.LiveData.Field.create = Relution.LiveData.create;
Relution.LiveData.Field.design = Relution.LiveData.design;

_.extend(Relution.LiveData.Field.prototype, Relution.LiveData._Object, {

  /**
   * The type of this object.
   *
   * @type String
   */
  _type: 'Relution.LiveData.Field',

  name: null,

  type: null,

  index: null,

  defaultValue: undefined,

  length: null,

  required: false,

  persistent: true,

  initialize: function () {
  },

  /**
   * merge field properties into this instance
   *
   * @param obj
   */
  merge: function (obj) {
    obj = _.isString(obj) ? {type: obj} : (obj || {});

    this.name = !_.isUndefined(obj.name) ? obj.name : this.name;
    this.type = !_.isUndefined(obj.type) ? obj.type : this.type;
    this.index = !_.isUndefined(obj.index) ? obj.index : this.index;
    this.defaultValue = !_.isUndefined(obj.defaultValue) ? obj.defaultValue : this.defaultValue;
    this.length = !_.isUndefined(obj.length) ? obj.length : this.length;
    this.required = !_.isUndefined(obj.required) ? obj.required : this.required;
    this.persistent = !_.isUndefined(obj.persistent) ? obj.persistent : this.persistent;
  },

  /**
   * converts the give value into the required data type
   *
   * @param value
   * @param type
   * @returns {*}
   */
  transform: function (value, type) {
    type = type || this.type;
    try {
      if (_.isUndefined(value)) {
        return this.defaultValue;
      }
      if (type === Relution.LiveData.DATA.TYPE.STRING || type === Relution.LiveData.DATA.TYPE.TEXT) {
        if (_.isObject(value)) {
          return JSON.stringify(value);
        } else {
          return _.isNull(value) ? 'null' : value.toString();
        }
      } else if (type === Relution.LiveData.DATA.TYPE.INTEGER) {
        return parseInt(value);
      } else if (type === Relution.LiveData.DATA.TYPE.BOOLEAN) {
        return value === true || value === 'true'; // true, 1, "1" or "true"
      } else if (type === Relution.LiveData.DATA.TYPE.FLOAT) {
        return parseFloat(value);
      } else if (type === Relution.LiveData.DATA.TYPE.OBJECT || type === Relution.LiveData.DATA.TYPE.ARRAY) {
        if (!_.isObject(value)) {
          return _.isString(value) ? JSON.parse(value) : null;
        }
      } else if (type === Relution.LiveData.DATA.TYPE.DATE) {
        if (!Relution.LiveData.Date.isPrototypeOf(value)) {
          var date = value ? Relution.LiveData.Date.create(value) : null;
          return date && date.isValid() ? date : null;
        }
      } else if (type === Relution.LiveData.DATA.TYPE.OBJECTID) {
        if (!Relution.LiveData.ObjectID.prototype.isPrototypeOf(value)) {
          return _.isString(value) ? new Relution.LiveData.ObjectID(value) : null;
        }
      }
      return value;
    } catch (e) {
      Relution.LiveData.Debug.error('Failed converting value! ' + e.message);
    }
  },

  /**
   * check to values to be equal for the type of this field
   *
   * @param a
   * @param b
   * @returns {*}
   */
  equals: function (a, b) {
    var v1 = this.transform(a);
    var v2 = this.transform(b);
    return this._equals(v1, v2, _.isArray(v1));
  },

  /**
   * check if this field holds binary data
   *
   * @param obj
   * @returns {boolean|*}
   */
  isBinary: function (obj) {
    return (typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array) || (obj && obj.$Uint8ArrayPolyfill);
  },

  /**
   * detect the type of a given value
   *
   * @param v
   * @returns {*}
   */
  detectType: function (v) {
    if (_.isNumber(v)) {
      return Relution.LiveData.DATA.TYPE.FLOAT;
    }
    if (_.isString(v)) {
      return Relution.LiveData.DATA.TYPE.STRING;
    }
    if (_.isBoolean(v)) {
      return Relution.LiveData.DATA.TYPE.BOOLEAN;
    }
    if (_.isArray(v)) {
      return Relution.LiveData.DATA.TYPE.ARRAY;
    }
    if (_.isNull(v)) {
      return Relution.LiveData.DATA.TYPE.NULL;
    }
    if (_.isDate(v) || Relution.LiveData.Date.isPrototypeOf(v)) {
      return Relution.LiveData.DATA.TYPE.DATE;
    }
    if (Relution.LiveData.ObjectID.prototype.isPrototypeOf(v)) {
      return Relution.LiveData.DATA.TYPE.OBJECTID;
    }
    if (this.isBinary(v)) {
      return Relution.LiveData.DATA.TYPE.BINARY;
    }
    return Relution.LiveData.DATA.TYPE.OBJECT;
  },

  /**
   * returns the sort order for the given type, used by sorting different type
   *
   * @param type
   * @returns {number}
   */
  typeOrder: function (type) {
    switch (type) {
      case Relution.LiveData.DATA.TYPE.NULL   :
        return 0;
      case Relution.LiveData.DATA.TYPE.FLOAT  :
        return 1;
      case Relution.LiveData.DATA.TYPE.STRING :
        return 2;
      case Relution.LiveData.DATA.TYPE.OBJECT :
        return 3;
      case Relution.LiveData.DATA.TYPE.ARRAY  :
        return 4;
      case Relution.LiveData.DATA.TYPE.BINARY :
        return 5;
      case Relution.LiveData.DATA.TYPE.DATE   :
        return 6;
    }
    return -1;
  },

  _equals: function (a, b, keyOrderSensitive) {
    var that = this;
    var i;
    if (a === b) {
      return true;
    }
    if (!a || !b) { // if either one is false, they'd have to be === to be equal
      return false;
    }
    if (!(_.isObject(a) && _.isObject(b))) {
      return false;
    }
    if (a instanceof Date && b instanceof Date) {
      return a.valueOf() === b.valueOf();
    }
    if (this.isBinary(a) && this.isBinary(b)) {
      if (a.length !== b.length) {
        return false;
      }
      for (i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
    if (_.isFunction(a.equals)) {
      return a.equals(b);
    }
    if (_.isArray(a)) {
      if (!_.isArray(b)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      for (i = 0; i < a.length; i++) {
        if (!that.equals(a[i], b[i], keyOrderSensitive)) {
          return false;
        }
      }
      return true;
    }
    // fall back to structural equality of objects
    var ret;
    if (keyOrderSensitive) {
      var bKeys = [];
      _.each(b, function (val, x) {
        bKeys.push(x);
      });
      i = 0;
      ret = _.all(a, function (val, x) {
        if (i >= bKeys.length) {
          return false;
        }
        if (x !== bKeys[i]) {
          return false;
        }
        if (!that.equals(val, b[bKeys[i]], keyOrderSensitive)) {
          return false;
        }
        i++;
        return true;
      });
      return ret && i === bKeys.length;
    } else {
      i = 0;
      ret = _.all(a, function (val, key) {
        if (!_.has(b, key)) {
          return false;
        }
        if (!that.equals(val, b[key], keyOrderSensitive)) {
          return false;
        }
        i++;
        return true;
      });
      return ret && _.size(b) === i;
    }
  },

  /**
   * compare two values of unknown type according to BSON ordering
   * semantics. (as an extension, consider 'undefined' to be less than
   * any other value.) return negative if a is less, positive if b is
   * less, or 0 if equal
   *
   * @param a
   * @param b
   * @returns {*}
   * @private
   */
  _cmp: function (a, b) {
    if (a === undefined) {
      return b === undefined ? 0 : -1;
    }
    if (b === undefined) {
      return 1;
    }
    var i = 0;
    var ta = this.detectType(a);
    var tb = this.detectType(b);
    var oa = this.typeOrder(ta);
    var ob = this.typeOrder(tb);
    if (oa !== ob) {
      return oa < ob ? -1 : 1;
    }
    if (ta !== tb) {
      throw new Error('Missing type coercion logic in _cmp');
    }
    if (ta === 7) { // ObjectID
      // Convert to string.
      ta = tb = 2;
      a = a.toHexString();
      b = b.toHexString();
    }
    if (ta === Relution.LiveData.DATA.TYPE.DATE) {
      // Convert to millis.
      ta = tb = 1;
      a = a.getTime();
      b = b.getTime();
    }
    if (ta === Relution.LiveData.DATA.TYPE.FLOAT) {
      return a - b;
    }
    if (tb === Relution.LiveData.DATA.TYPE.STRING) {
      return a < b ? -1 : (a === b ? 0 : 1);
    }
    if (ta === Relution.LiveData.DATA.TYPE.OBJECT) {
      // this could be much more efficient in the expected case ...
      var toArray = function (obj) {
        var ret = [];
        for (var key in obj) {
          ret.push(key);
          ret.push(obj[key]);
        }
        return ret;
      };
      return this._cmp(toArray(a), toArray(b));
    }
    if (ta === Relution.LiveData.DATA.TYPE.ARRAY) { // Array
      for (i = 0; ; i++) {
        if (i === a.length) {
          return (i === b.length) ? 0 : -1;
        }
        if (i === b.length) {
          return 1;
        }
        var s = this._cmp(a[i], b[i]);
        if (s !== 0) {
          return s;
        }
      }
    }
    if (ta === Relution.LiveData.DATA.TYPE.BINARY) {
      if (a.length !== b.length) {
        return a.length - b.length;
      }
      for (i = 0; i < a.length; i++) {
        if (a[i] < b[i]) {
          return -1;
        }
        if (a[i] > b[i]) {
          return 1;
        }
      }
      return 0;
    }
    if (ta === Relution.LiveData.DATA.TYPE.BOOLEAN) {
      if (a) {
        return b ? 0 : 1;
      }
      return b ? -1 : 0;
    }
    if (ta === Relution.LiveData.DATA.TYPE.NULL) {
      return 0;
    }
//        if( ta === Relution.LiveData.DATA.TYPE.REGEXP ) {
//            throw Error("Sorting not supported on regular expression");
//        } // XXX
//        if( ta === 13 ) // javascript code
//        {
//            throw Error("Sorting not supported on Javascript code");
//        } // XXX
    throw new Error('Unknown type to sort');
  }
});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module Relution.LiveData.Entity
 *
 */

/**
 * Holds description about fields and other entity properties.
 * Also helper functions for field and transform operations
 * @module Relution.LiveData.Entity
 *
 * @param options
 * @constructor
 */
Relution.LiveData.Entity = function (options) {
  var fields = this.fields;
  this.fields = {};
  this._mergeFields(fields);
  options = options || {};
  if (options.fields) {
    this._mergeFields(options.fields);
  }
  this.typeMapping = options.typeMapping || this.typeMapping;
  var collection = options.collection;
  var model = options.model || (collection ? collection.prototype.model : null);
  this.idAttribute = options.idAttribute || this.idAttribute || (model ? model.prototype.idAttribute : '');
  this._updateFields(this.typeMapping);
  this.initialize.apply(this, arguments);
};

/**
 * create a new entity from an other entity or given properties
 *
 * @param entity
 * @param options
 * @returns {*}
 */
Relution.LiveData.Entity.from = function (entity, options) {
  // is not an instance of Relution.LiveData.Entity
  if (!Relution.LiveData.Entity.prototype.isPrototypeOf(entity)) {
    // if this is a prototype of an entity, create an instance
    if (_.isFunction(entity) &&
      Relution.LiveData.Entity.prototype.isPrototypeOf(entity.prototype)) {
      var Entity = entity;
      entity = new Entity(options);
    } else {
      if (typeof entity === 'string') {
        entity = {
          name: entity
        };
      }
      // if this is just a config create a new Entity
      var E = Relution.LiveData.Entity.extend(entity);
      entity = new E(options);
    }
  } else if (options && options.typeMapping) {
    entity._updateFields(options.typeMapping);
  }
  return entity;
};

Relution.LiveData.Entity.extend = Relution.LiveData.extend;
Relution.LiveData.Entity.create = Relution.LiveData.create;
Relution.LiveData.Entity.design = Relution.LiveData.design;

_.extend(Relution.LiveData.Entity.prototype, Relution.LiveData._Object, {

  /**
   * The type of this object.
   *
   * @type String
   */
  _type: 'Relution.LiveData.Entity',

  /**
   * Entity name, used for tables or collections
   *
   * @type String
   */
  name: '',

  /**
   * idAttribute, should be the same as in the corresponding model
   *
   * @type String
   */
  idAttribute: '',

  /**
   *
   *
   * @type Object
   */
  fields: {},

  /**
   * initialize function will be called after creating an entity
   */
  initialize: function () {
  },

  /**
   * get the field list of this entity
   *
   * @returns {Object}
   */
  getFields: function () {
    return this.fields;
  },

  /**
   * get a specified field from this entity
   *
   * @param fieldKey
   * @returns Relution.LiveData.Field instance
   */
  getField: function (fieldKey) {
    return this.fields[fieldKey];
  },

  /**
   * get the translated name of a field
   *
   * @param fieldKey
   * @returns String
   */
  getFieldName: function (fieldKey) {
    var field = this.getField(fieldKey);
    return field && field.name ? field.name : fieldKey;
  },

  /**
   * get the primary key of this entity
   *
   * @returns String
   */
  getKey: function () {
    return this.idAttribute || Relution.LiveData.Model.idAttribute;
  },

  /**
   * get a list of keys for this entity
   *
   * @returns {Array}
   */
  getKeys: function () {
    return this.splitKey(this.getKey());
  },

  /**
   * Splits a comma separated list of keys to a key array
   *
   * @returns {Array} array of keys
   */
  splitKey: function (key) {
    var keys = [];
    if (_.isString(key)) {
      _.each(key.split(','), function (key) {
        var k = key.trim();
        if (k) {
          keys.push(k);
        }
      });
    }
    return keys;
  },

  /**
   * merge a new list of fields into the exiting fields
   *
   * @param newFields
   * @private
   */
  _mergeFields: function (newFields) {
    if (!_.isObject(this.fields)) {
      this.fields = {};
    }
    var that = this;
    if (_.isObject(newFields)) {
      _.each(newFields, function (value, key) {
        if (!that.fields[key]) {
          that.fields[key] = new Relution.LiveData.Field(value);
        } else {
          that.fields[key].merge(value);
        }
      });
    }
  },

  /**
   * check and update missing properties of fields
   *
   * @param typeMapping
   * @private
   */
  _updateFields: function (typeMapping) {
    var that = this;
    _.each(this.fields, function (value, key) {
      if (!value.persistent) {
        // remove unused properties
        delete that.fields[key];
      } else {
        // add missing names
        if (!value.name) {
          value.name = key;
        }
        // apply default type conversions
        if (typeMapping && typeMapping[value.type]) {
          value.type = typeMapping[value.type];
        }
      }
    });
  },

  /**
   * transform the given data to attributes
   * considering the field specifications
   *
   * @param data
   * @param id
   * @param fields
   * @returns {*}
   */
  toAttributes: function (data, id, fields) {
    fields = fields || this.fields;
    if (data && !_.isEmpty(fields)) {
      // map field names
      var value, attributes = {};
      _.each(fields, function (field, key) {
        value = _.isFunction(data.get) ? data.get(field.name) : data[field.name];
        attributes[key] = value;
      });
      return attributes;
    }
    return data;
  },

  /**
   * transform the given attributes to the destination data format
   * considering the field specifications
   *
   * @param attrs
   * @param fields
   * @returns {*}
   */
  fromAttributes: function (attrs, fields) {
    fields = fields || this.fields;
    if (attrs && !_.isEmpty(fields)) {
      var data = {};
      _.each(fields, function (field, key) {
        var value = _.isFunction(attrs.get) ? attrs.get(key) : attrs[key];
        value = field.transform(value);
        if (!_.isUndefined(value)) {
          data[field.name] = value;
        }
      });
      return data;
    }
    return attrs;
  },

  /**
   * set the id of the given model or attributes
   *
   * @param attrs
   * @param id
   * @returns {*}
   */
  setId: function (attrs, id) {
    if (attrs && id) {
      var key = this.getKey() || attrs.idAttribute;
      if (key) {
        if (_.isFunction(attrs.set)) {
          attrs.set(key, id);
        } else {
          attrs[key] = id;
        }
      }
    }
    return attrs;
  },

  /**
   * get the id of the given model or attributes
   *
   * @param attrs
   * @returns {*|Object|key|*}
   */
  getId: function (attrs) {
    if (attrs) {
      var key = this.getKey() || attrs.idAttribute;
      if (key) {
        return _.isFunction(attrs.get) ? attrs.get(key) : attrs[key];
      }
    }
  }
});

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

/**
 *
 * @module Relution.LiveData.Model
 *
 * @type {*}
 * @extends Backbone.Model
 */
Relution.LiveData.Model = Backbone.Model.extend({
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

Relution.LiveData.Model.create = Relution.LiveData.create;
Relution.LiveData.Model.design = Relution.LiveData.design;

_.extend(Relution.LiveData.Model.prototype, Relution.LiveData._Object, {

  _type: 'Relution.LiveData.Model',

  isModel: true,

  entity: null,

  defaults: {},

  changedSinceSync: {},

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
      this.entity = Relution.LiveData.Entity.from(this.entity, {model: this.constructor, typeMapping: options.typeMapping});
      this.idAttribute = this.entity.idAttribute || this.idAttribute;
    }
    this.credentials = this.credentials || (this.collection ? this.collection.credentials : null) || options.credentials;
    this.on('change', this.onChange, this);
    this.on('sync', this.onSync, this);
  },

  ajax: Relution.LiveData.ajax,
  sync: Relution.LiveData.sync,

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

  /*
  toJSON: function (options) {
    options = options || {};
    var entity = options.entity || this.entity;
    if (Relution.LiveData.isEntity(entity)) {
      return entity.fromAttributes(options.attrs || this.attributes);
    }
    return options.attrs || _.clone(this.attributes);
  },

  parse: function (resp, options) {
    options = options || {};
    var entity = options.entity || this.entity;
    if (Relution.LiveData.isEntity(entity)) {
      return entity.toAttributes(resp);
    }
    return resp;
  }
  */

});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * The Relution.LiveData.Collection can be used like a Backbone Collection,
 *
 * but there are some enhancements to fetch, save and delete the
 * contained models from or to other "data stores".
 *
 * see LocalStorageStore, WebSqlStore or SyncStore for examples
 *
 * @module Relution.LiveData.Collection
 *
 * @type {*}
 * @extends Backbone.Collection
 *
 */
Relution.LiveData.Collection = Backbone.Collection.extend({

  constructor: function (options) {
    console.log('Collection', options);
    if (this.url && this.url.charAt(this.url.length - 1) !== '/') {
      this.url += '/';
    }
    this.init(options);
    Backbone.Collection.apply(this, arguments);
  }
});

Relution.LiveData.Collection.create = Relution.LiveData.create;
Relution.LiveData.Collection.design = Relution.LiveData.design;

_.extend(Relution.LiveData.Collection.prototype, Relution.LiveData._Object, {

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
  },

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
  fetchMore: function (options) {
    if (!this.syncContext) {
      return Q.reject(new Error('no context'));
    }

    return this.syncContext.fetchMore(this, options);
  },

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
  fetchNext: function (options) {
    if (!this.syncContext) {
      return Q.reject(new Error('no context'));
    }

    return this.syncContext.fetchNext(this, options);
  },

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
  fetchPrev: function (options) {
    if (!this.syncContext) {
      return Q.reject(new Error('no context'));
    }

    return this.syncContext.fetchPrev(this, options);
  }

});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

// Relution.LiveData.DataSelector uses code from meteor.js
// https://github.com/meteor/meteor/tree/master/packages/minimongo
//
// Thanks for sharing!

/**
 *
 * @module Relution.LiveData.DataSelector
 *
 * @type {*}
 * @extends Relution.LiveData._Object
 */
Relution.LiveData.DataSelector = Relution.LiveData._Object.design({

  _type: 'Relution.LiveData.DataSelector',

  _selector: null,

  create: function (docSelector) {
    var selector = this.design({
      _selector: null
    });
    selector.init(docSelector);
    return selector;
  },

  init: function (docSelector) {
    this._selector = this.compileSelector(docSelector);
  },

  matches: function (value) {
    if (_.isFunction(this._selector)) {
      return this._selector(value);
    }
    return false;
  },

  hasOperators: function (valueSelector) {
    var theseAreOperators;
    for (var selKey in valueSelector) {
      var thisIsOperator = selKey.substr(0, 1) === '$';
      if (theseAreOperators === undefined) {
        theseAreOperators = thisIsOperator;
      } else if (theseAreOperators !== thisIsOperator) {
        throw new Error('Inconsistent selector: ' + valueSelector);
      }
    }
    return !!theseAreOperators;  // {} has no operators
  },

  // Given a selector, return a function that takes one argument, a
  // document, and returns true if the document matches the selector,
  // else false.
  compileSelector: function (selector) {
    // you can pass a literal function instead of a selector
    if (_.isFunction(selector)) {
      return function (doc) {
        return selector.call(doc);
      };
    }

    // shorthand -- scalars match _id
    if (this._selectorIsId(selector)) {
      return function (record) {
        var id = _.isFunction(record.getId) ? record.getId() : (record._id || record.id);
        return Relution.LiveData.Field.prototype.equals(id, selector);
      };
    }

    // protect against dangerous selectors.  falsey and {_id: falsey} are both
    // likely programmer error, and not what you want, particularly for
    // destructive operations.
    if (!selector || (('_id' in selector) && !selector._id)) {
      return function (doc) {
        return false;
      };
    }

    // Top level can't be an array or true or binary.
    if (_.isBoolean(selector) || _.isArray(selector) || Relution.LiveData.Field.prototype.isBinary(selector)) {
      throw new Error('Invalid selector: ' + selector);
    }

    return this.compileDocSelector(selector);
  },

  // The main compilation function for a given selector.
  compileDocSelector: function (docSelector) {
    var that = Relution.LiveData.DataSelector;
    var perKeySelectors = [];
    _.each(docSelector, function (subSelector, key) {
      if (key.substr(0, 1) === '$') {
        // Outer operators are either logical operators (they recurse back into
        // this function), or $where.
        if (!_.has(that.LOGICAL_OPERATORS, key)) {
          throw new Error('Unrecognized logical operator: ' + key);
        }
        perKeySelectors.push(that.LOGICAL_OPERATORS[key](subSelector));
      } else {
        var lookUpByIndex = that._makeLookupFunction(key);
        var valueSelectorFunc = that.compileValueSelector(subSelector);
        perKeySelectors.push(function (doc) {
          var branchValues = lookUpByIndex(doc);
          // We apply the selector to each 'branched' value and return true if any
          // match. This isn't 100% consistent with MongoDB; eg, see:
          // https://jira.mongodb.org/browse/SERVER-8585
          return _.any(branchValues, valueSelectorFunc);
        });
      }
    });

    return function (record) {
      var doc = _.isFunction(record.getData) ? record.getData() : record;
      return _.all(perKeySelectors, function (f) {
        return f(doc);
      });
    };
  },

  compileValueSelector: function (valueSelector) {
    var that = Relution.LiveData.DataSelector;
    if (valueSelector === null) {  // undefined or null
      return function (value) {
        return that._anyIfArray(value, function (x) {
          return x === null;  // undefined or null
        });
      };
    }

    // Selector is a non-null primitive (and not an array or RegExp either).
    if (!_.isObject(valueSelector)) {
      return function (value) {
        return that._anyIfArray(value, function (x) {
          return x === valueSelector;
        });
      };
    }

    if (_.isRegExp(valueSelector)) {
      return function (value) {
        if (_.isUndefined(value)) {
          return false;
        }
        return that._anyIfArray(value, function (x) {
          return valueSelector.test(x);
        });
      };
    }

    // Arrays match either identical arrays or arrays that contain it as a value.
    if (_.isArray(valueSelector)) {
      return function (value) {
        if (!_.isArray(value)) {
          return false;
        }
        return that._anyIfArrayPlus(value, function (x) {
          return that._equal(valueSelector, x);
        });
      };
    }

    // It's an object, but not an array or regexp.
    if (this.hasOperators(valueSelector)) {
      var operatorFunctions = [];
      _.each(valueSelector, function (operand, operator) {
        if (!_.has(that.VALUE_OPERATORS, operator)) {
          throw new Error('Unrecognized operator: ' + operator);
        }
        operatorFunctions.push(that.VALUE_OPERATORS[operator](operand, valueSelector.$options));
      });
      return function (value) {
        return _.all(operatorFunctions, function (f) {
          return f(value);
        });
      };
    }

    // It's a literal; compare value (or element of value array) directly to the
    // selector.
    return function (value) {
      return that._anyIfArray(value, function (x) {
        return that._equal(valueSelector, x);
      });
    };
  },

  // _makeLookupFunction(key) returns a lookup function.
  //
  // A lookup function takes in a document and returns an array of matching
  // values.  This array has more than one element if any segment of the key other
  // than the last one is an array.  ie, any arrays found when doing non-final
  // lookups result in this function 'branching'; each element in the returned
  // array represents the value found at this branch. If any branch doesn't have a
  // final value for the full key, its element in the returned list will be
  // undefined. It always returns a non-empty array.
  //
  // _makeLookupFunction('a.x')({a: {x: 1}}) returns [1]
  // _makeLookupFunction('a.x')({a: {x: [1]}}) returns [[1]]
  // _makeLookupFunction('a.x')({a: 5})  returns [undefined]
  // _makeLookupFunction('a.x')({a: [{x: 1},
  //                                 {x: [2]},
  //                                 {y: 3}]})
  //   returns [1, [2], undefined]
  _makeLookupFunction: function (key) {
    var dotLocation = key.indexOf('.');
    var first, lookupRest, nextIsNumeric;
    if (dotLocation === -1) {
      first = key;
    } else {
      first = key.substr(0, dotLocation);
      var rest = key.substr(dotLocation + 1);
      lookupRest = this._makeLookupFunction(rest);
      // Is the next (perhaps final) piece numeric (ie, an array lookup?)
      nextIsNumeric = /^\d+(\.|$)/.test(rest);
    }

    return function (doc) {
      if (doc === null) { // null or undefined
        return [undefined];
      }
      var firstLevel = doc[first];

      // We don't 'branch' at the final level.
      if (!lookupRest) {
        return [firstLevel];
      }

      // It's an empty array, and we're not done: we won't find anything.
      if (_.isArray(firstLevel) && firstLevel.length === 0) {
        return [undefined];
      }

      // For each result at this level, finish the lookup on the rest of the key,
      // and return everything we find. Also, if the next result is a number,
      // don't branch here.
      //
      // Technically, in MongoDB, we should be able to handle the case where
      // objects have numeric keys, but Mongo doesn't actually handle this
      // consistently yet itself, see eg
      // https://jira.mongodb.org/browse/SERVER-2898
      // https://github.com/mongodb/mongo/blob/master/jstests/array_match2.js
      if (!_.isArray(firstLevel) || nextIsNumeric) {
        firstLevel = [firstLevel];
      }
      return Array.prototype.concat.apply([], _.map(firstLevel, lookupRest));
    };
  },

  _anyIfArray: function (x, f) {
    if (_.isArray(x)) {
      return _.any(x, f);
    }
    return f(x);
  },

  _anyIfArrayPlus: function (x, f) {
    if (f(x)) {
      return true;
    }
    return _.isArray(x) && _.any(x, f);
  },

  // Is this selector just shorthand for lookup by _id?
  _selectorIsId: function (selector) {
    return _.isString(selector) || _.isNumber(selector);
  },

  // deep equality test: use for literal document and array matches
  _equal: function (a, b) {
    return Relution.LiveData.Field.prototype._equals(a, b, true);
  },

  _cmp: function (a, b) {
    return Relution.LiveData.Field.prototype._cmp(a, b);
  },

  LOGICAL_OPERATORS: {
    '$and': function (subSelector) {
      if (!_.isArray(subSelector) || _.isEmpty(subSelector)) {
        throw new Error('$and/$or/$nor must be nonempty array');
      }
      var subSelectorFunctions = _.map(subSelector, Relution.LiveData.DataSelector.compileDocSelector);
      return function (doc) {
        return _.all(subSelectorFunctions, function (f) {
          return f(doc);
        });
      };
    },

    '$or': function (subSelector) {
      if (!_.isArray(subSelector) || _.isEmpty(subSelector)) {
        throw new Error('$and/$or/$nor must be nonempty array');
      }
      var subSelectorFunctions = _.map(subSelector, Relution.LiveData.DataSelector.compileDocSelector);
      return function (doc) {
        return _.any(subSelectorFunctions, function (f) {
          return f(doc);
        });
      };
    },

    '$nor': function (subSelector) {
      if (!_.isArray(subSelector) || _.isEmpty(subSelector)) {
        throw new Error('$and/$or/$nor must be nonempty array');
      }
      var subSelectorFunctions = _.map(subSelector, Relution.LiveData.DataSelector.compileDocSelector);
      return function (doc) {
        return _.all(subSelectorFunctions, function (f) {
          return !f(doc);
        });
      };
    },

    '$where': function (selectorValue) {
      if (!_.isFunction(selectorValue)) {
        var value = selectorValue;
        selectorValue = function () {
          return value;
        };
      }
      return function (doc) {
        return selectorValue.call(doc);
      };
    }
  },

  VALUE_OPERATORS: {
    '$in': function (operand) {
      if (!_.isArray(operand)) {
        throw new Error('Argument to $in must be array');
      }
      return function (value) {
        return Relution.LiveData.DataSelector._anyIfArrayPlus(value, function (x) {
          return _.any(operand, function (operandElt) {
            return Relution.LiveData.DataSelector._equal(operandElt, x);
          });
        });
      };
    },

    '$all': function (operand) {
      if (!_.isArray(operand)) {
        throw new Error('Argument to $all must be array');
      }
      return function (value) {
        if (!_.isArray(value)) {
          return false;
        }
        return _.all(operand, function (operandElt) {
          return _.any(value, function (valueElt) {
            return Relution.LiveData.DataSelector._equal(operandElt, valueElt);
          });
        });
      };
    },

    '$lt': function (operand) {
      return function (value) {
        return Relution.LiveData.DataSelector._anyIfArray(value, function (x) {
          return Relution.LiveData.DataSelector._cmp(x, operand) < 0;
        });
      };
    },

    '$lte': function (operand) {
      return function (value) {
        return Relution.LiveData.DataSelector._anyIfArray(value, function (x) {
          return Relution.LiveData.DataSelector._cmp(x, operand) <= 0;
        });
      };
    },

    '$gt': function (operand) {
      return function (value) {
        return Relution.LiveData.DataSelector._anyIfArray(value, function (x) {
          return Relution.LiveData.DataSelector._cmp(x, operand) > 0;
        });
      };
    },

    '$gte': function (operand) {
      return function (value) {
        return Relution.LiveData.DataSelector._anyIfArray(value, function (x) {
          return Relution.LiveData.DataSelector._cmp(x, operand) >= 0;
        });
      };
    },

    '$ne': function (operand) {
      return function (value) {
        return !Relution.LiveData.DataSelector._anyIfArrayPlus(value, function (x) {
          return Relution.LiveData.DataSelector._equal(x, operand);
        });
      };
    },

    '$nin': function (operand) {
      if (!_.isArray(operand)) {
        throw new Error('Argument to $nin must be array');
      }
      var inFunction = this.VALUE_OPERATORS.$in(operand);
      return function (value) {
        // Field doesn't exist, so it's not-in operand
        if (value === undefined) {
          return true;
        }
        return !inFunction(value);
      };
    },

    '$exists': function (operand) {
      return function (value) {
        return operand === (value !== undefined);
      };
    },
    '$mod': function (operand) {
      var divisor = operand[0], remainder = operand[1];
      return function (value) {
        return Relution.LiveData.DataSelector._anyIfArray(value, function (x) {
          return x % divisor === remainder;
        });
      };
    },

    '$size': function (operand) {
      return function (value) {
        return _.isArray(value) && operand === value.length;
      };
    },

    '$type': function (operand) {
      return function (value) {
        // A nonexistent field is of no type.
        if (_.isUndefined(value)) {
          return false;
        }
        return Relution.LiveData.DataSelector._anyIfArray(value, function (x) {
          return Relution.LiveData.Field.prototype.detectType(x) === operand;
        });
      };
    },

    '$regex': function (operand, options) {

      if (_.isUndefined(options)) {
        // Options passed in $options (even the empty string) always overrides
        // options in the RegExp object itself.

        // Be clear that we only support the JS-supported options, not extended
        // ones (eg, Mongo supports x and s). Ideally we would implement x and s
        // by transforming the regexp, but not today...
        if (/[^gim]/.test(options)) {
          throw new Error('Only the i, m, and g regexp options are supported');
        }

        var regexSource = _.isRegExp(operand) ? operand.source : operand;
        operand = new RegExp(regexSource, options);
      } else if (!_.isRegExp(operand)) {
        operand = new RegExp(operand);
      }

      return function (value) {
        if (_.isUndefined(value)) {
          return false;
        }
        return Relution.LiveData.DataSelector._anyIfArray(value, function (x) {
          return operand.test(x);
        });
      };
    },

    '$options': function (operand) {
      // evaluation happens at the $regex function above
      return function (value) {
        return true;
      };
    },

    '$elemMatch': function (operand) {
      var matcher = Relution.LiveData.DataSelector.compileDocSelector(operand);
      return function (value) {
        if (!_.isArray(value)) {
          return false;
        }
        return _.any(value, function (x) {
          return matcher(x);
        });
      };
    },

    '$not': function (operand) {
      var matcher = Relution.LiveData.DataSelector.compileDocSelector(operand);
      return function (value) {
        return !matcher(value);
      };
    }
  },

  // Give a sort spec, which can be in any of these forms:
  //   {'key1': 1, 'key2': -1}
  //   [['key1', 'asc'], ['key2', 'desc']]
  //   ['key1', ['key2', 'desc']]
  //
  // (.. with the first form being dependent on the key enumeration
  // behavior of your javascript VM, which usually does what you mean in
  // this case if the key names don't look like integers ..)
  //
  // return a function that takes two objects, and returns -1 if the
  // first object comes first in order, 1 if the second object comes
  // first, or 0 if neither object comes before the other.

  compileSort: function (spec) {
    var sortSpecParts = [];

    if (_.isArray(spec)) {
      for (var i = 0; i < spec.length; i++) {
        if (typeof spec[i] === 'string') {
          sortSpecParts.push({
            lookup: this._makeLookupFunction(spec[i]),
            ascending: true
          });
        } else {
          sortSpecParts.push({
            lookup: this._makeLookupFunction(spec[i][0]),
            ascending: spec[i][1] !== 'desc'
          });
        }
      }
    } else if (typeof spec === 'object') {
      for (var key in spec) {
        sortSpecParts.push({
          lookup: this._makeLookupFunction(key),
          ascending: spec[key] >= 0
        });
      }
    } else {
      throw new Error('Bad sort specification: ', JSON.stringify(spec));
    }

    if (sortSpecParts.length === 0) {
      return function () {
        return 0;
      };
    }

    // reduceValue takes in all the possible values for the sort key along various
    // branches, and returns the min or max value (according to the bool
    // findMin). Each value can itself be an array, and we look at its values
    // too. (ie, we do a single level of flattening on branchValues, then find the
    // min/max.)
    var reduceValue = function (branchValues, findMin) {
      var reduced;
      var first = true;
      // Iterate over all the values found in all the branches, and if a value is
      // an array itself, iterate over the values in the array separately.
      _.each(branchValues, function (branchValue) {
        // Value not an array? Pretend it is.
        if (!_.isArray(branchValue)) {
          branchValue = [branchValue];
        }
        // Value is an empty array? Pretend it was missing, since that's where it
        // should be sorted.
        if (_.isArray(branchValue) && branchValue.length === 0) {
          branchValue = [undefined];
        }
        _.each(branchValue, function (value) {
          // We should get here at least once: lookup functions return non-empty
          // arrays, so the outer loop runs at least once, and we prevented
          // branchValue from being an empty array.
          if (first) {
            reduced = value;
            first = false;
          } else {
            // Compare the value we found to the value we found so far, saving it
            // if it's less (for an ascending sort) or more (for a descending
            // sort).
            var cmp = Relution.LiveData.DataSelector._cmp(reduced, value);
            if ((findMin && cmp > 0) || (!findMin && cmp < 0)) {
              reduced = value;
            }
          }
        });
      });
      return reduced;
    };

    return function (a, b) {
      a = a.attributes ? a.attributes : a;
      b = b.attributes ? b.attributes : b;
      for (var i = 0; i < sortSpecParts.length; ++i) {
        var specPart = sortSpecParts[i];
        var aValue = reduceValue(specPart.lookup(a), specPart.ascending);
        var bValue = reduceValue(specPart.lookup(b), specPart.ascending);
        var compare = Relution.LiveData.DataSelector._cmp(aValue, bValue);
        if (compare !== 0) {
          return specPart.ascending ? compare : -compare;
        }
      }
      return 0;
    };
  }

});

// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module Relution.LiveData.SqlSelector
 *
 * @type {*}
 * @extends Relution.LiveData.DataSelector
 */
Relution.LiveData.SqlSelector = Relution.LiveData.DataSelector.design({

  _type: 'Relution.LiveData.SqlSelector',

  _selector: null,
  _query: null,
  _entity: null,

  create: function (docSelector, entity) {
    var selector = this.extend({
      _entity: entity,
      _selector: null,
      _query: null
    });
    selector.init(docSelector);

    return selector;
  },

  init: function (docSelector) {
    this._selector = this.compileSelector(docSelector);
    this._query = this.buildSqlQuery(docSelector);
  },

  buildStatement: function (obj) {
    return this._query;
  },

  buildSqlQuery: function (selector, connector) {
    // you can pass a literal function instead of a selector
    if (selector instanceof Function) {
      return '';
    }

    // shorthand -- sql
    if (_.isString(selector)) {
      return selector;
    }

    // protect against dangerous selectors.  falsey and {_id: falsey} are both
    // likely programmer error, and not what you want, particularly for
    // destructive operations.
    if (!selector || (('_id' in selector) && !selector._id)) {
      return '1=2';
    }

    // Top level can't be an array or true or binary.
    if (_.isBoolean(selector) || _.isArray(selector) || Relution.LiveData.DataField.isBinary(selector)) {
      throw new Error('Invalid selector: ' + selector);
    }

    return this.buildSqlWhere(selector)();
  },

  // The main compilation function for a given selector.
  buildSqlWhere: function (docSelector) {
    var where = '';
    var that = this;
    var perKeySelectors = [];
    _.each(docSelector, function (subSelector, key) {
      if (key.substr(0, 1) === '$') {
        // Outer operators are either logical operators (they recurse back into
        // this function), or $where.
        perKeySelectors.push(that.buildLogicalOperator(key, subSelector));
      } else {
        var valueLookup = that.buildLookup(key);
        var valueSelector = that.buildValueSelector(subSelector);
        if (_.isFunction(valueSelector)) {
          perKeySelectors.push(function () {
            return valueSelector(valueLookup);
          });
        }
      }
    });

    return function () {
      var sql = '';
      _.each(perKeySelectors, function (f) {
        if (_.isFunction(f)) {
          sql += f.call(that);
        }
      });
      return sql;
    };
  },

  buildValueSelector: function (valueSelector) {
    var that = this;
    if (valueSelector === null) {  // undefined or null
      return function (key) {
        return key + ' IS NULL';
      };
    }

    // Selector is a non-null primitive (and not an array or RegExp either).
    if (!_.isObject(valueSelector)) {
      return function (key) {
        return key + ' = ' + that.buildValue(valueSelector);
      };
    }

    if (_.isRegExp(valueSelector)) {
      var regEx = valueSelector.toString();
      var match = regEx.match(/\/[\^]?([^^.*$'+()]*)[\$]?\//);
      if (match && match.length > 1) {
        var prefix = regEx.indexOf('/^') < 0 ? '%' : '';
        var suffix = regEx.indexOf('$/') < 0 ? '%' : '';
        return function (key) {
          return key + ' LIKE "' + prefix + match[1] + suffix + '"';
        };
      }
      return null;
    }

    // Arrays match either identical arrays or arrays that contain it as a value.
    if (_.isArray(valueSelector)) {
      return null;
    }

    // It's an object, but not an array or regexp.
    if (this.hasOperators(valueSelector)) {
      var operatorFunctions = [];
      _.each(valueSelector, function (operand, operator) {
        if (!_.has(that.VALUE_OPERATORS, operator)) {
          throw new Error('Unrecognized operator: ' + operator);
        }
        operatorFunctions.push(that.VALUE_OPERATORS[operator](operand, that));
      });
      return function (key) {
        return that.LOGICAL_OPERATORS.$and(operatorFunctions, key);
      };
    }

    // It's a literal; compare value (or element of value array) directly to the
    // selector.
    return function (key) {
      return key + ' = ' + that.buildValue(valueSelector);
    };
  },

  buildLookup: function (key) {
    var field = this._entity ? this._entity.getField(key) : null;
    key = field && field.name ? field.name : key;
    return '"' + key + '"';
  },

  buildValue: function (value) {
    if (_.isString(value)) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  },

  buildLogicalOperator: function (operator, subSelector) {
    if (!_.has(this.LOGICAL_OPERATORS, operator)) {
      throw new Error('Unrecognized logical operator: ' + operator);
    } else {
      if (!_.isArray(subSelector) || _.isEmpty(subSelector)) {
        throw new Error('$and/$or/$nor must be nonempty array');
      }
      var subSelectorFunction = _.map(subSelector, this.buildSqlWhere, this);
      var that = this;
      return function (key) {
        return that.LOGICAL_OPERATORS[operator](subSelectorFunction, key);
      };
    }
  },

  LOGICAL_OPERATORS: {
    '$and': function (subSelectorFunction, key) {
      var sql = '';
      var count = 0;
      _.each(subSelectorFunction, function (f) {
        var s = f !== null ? f(key) : '';
        if (s) {
          count++;
          sql += sql ? ' AND ' + s : s;
        }
      });
      return count > 1 ? '( ' + sql + ' )' : sql;
    },
    '$or': function (subSelectorFunction, key) {
      var sql = '';
      var miss = false;
      _.each(subSelectorFunction, function (f) {
        var s = f !== null ? f(key) : '';
        miss |= !s;
        sql += sql && s ? ' OR ' + s : s;
      });
      return miss ? '' : '( ' + sql + ' )';
    },
    '$nor': function (subSelectorFunction, key) {
      var sql = '';
      var miss = false;
      _.each(subSelectorFunction, function (f) {
        var s = f !== null ? f(key) : '';
        miss |= !s;
        sql += sql && s ? ' OR ' + s : s;
      });
      return miss ? '' : 'NOT ( ' + sql + ' )';
    }
  },

  VALUE_OPERATORS: {

    '$in': function (operand) {
      return null;
    },

    '$all': function (operand) {
      return null;
    },

    '$lt': function (operand, that) {
      return function (key) {
        return key + ' < ' + that.buildValue(operand);
      };
    },

    '$lte': function (operand, that) {
      return function (key) {
        return key + ' <= ' + that.buildValue(operand);
      };
    },

    '$gt': function (operand, that) {
      return function (key) {
        return key + ' > ' + that.buildValue(operand);
      };
    },

    '$gte': function (operand, that) {
      return function (key) {
        return key + '' > '' + that.buildValue(operand);
      };
    },

    '$ne': function (operand, that) {
      return function (key) {
        return key + ' <> ' + that.buildValue(operand);
      };
    },

    '$nin': function (operand) {
      return null;
    },

    '$exists': function (operand, that) {
      return function (key) {
        return key + ' IS NOT NULL';
      };
    },

    '$mod': function (operand) {
      return null;
    },

    '$size': function (operand) {
      return null;
    },

    '$type': function (operand) {
      return null;
    },

    '$regex': function (operand, options) {
      return null;
    },
    '$options': function (operand) {
      return null;
    },

    '$elemMatch': function (operand) {
      return null;
    },

    '$not': function (operand, that) {
      var matcher = that.buildSqlWhere(operand);
      return function (key) {
        return 'NOT (' + matcher(key) + ')';
      };
    }
  }
});

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
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * Base class to build a custom data store.
         *
         * See: Relution.LiveData.LocalStorageStore, Relution.LiveData.WebSqlStore and Relution.LiveData.SyncStore
         *
         * @module Relution.LiveData.Store
         */
        var Store = (function () {
            function Store(options) {
                this.options = _.extend({
                    name: '',
                    entities: {},
                    typeMapping: (function () {
                        var map = {};
                        map[LiveData.DATA.TYPE.OBJECTID] = LiveData.DATA.TYPE.STRING;
                        map[LiveData.DATA.TYPE.DATE] = LiveData.DATA.TYPE.STRING;
                        map[LiveData.DATA.TYPE.BINARY] = LiveData.DATA.TYPE.TEXT;
                        return map;
                    })()
                }, options);
                console.log('Store', options);
                this.setEntities(this.options.entities);
            }
            Store.prototype.setEntities = function (entities) {
                this.entities = {};
                for (var name in entities) {
                    var entity = LiveData.Entity.from(entities[name], {
                        store: this,
                        typeMapping: this.options.typeMapping
                    });
                    entity.name = entity.name || name;
                    // connect collection and model to this store
                    var collection = entity.collection || LiveData.Collection.extend({ model: LiveData.Model.extend({}) });
                    var model = collection.prototype.model;
                    // set new entity and name
                    collection.prototype.entity = model.prototype.entity = name;
                    collection.prototype.store = model.prototype.store = this;
                    entity.idAttribute = entity.idAttribute || model.prototype.idAttribute;
                    this.entities[name] = entity;
                }
            };
            Store.prototype.getEntity = function (obj) {
                if (obj) {
                    var entity = obj.entity || obj;
                    var name = _.isString(entity) ? entity : entity.name;
                    if (name) {
                        return this.entities[name] || (entity && entity.name ? entity : { name: name });
                    }
                }
            };
            Store.prototype.getCollection = function (entity) {
                if (_.isString(entity)) {
                    entity = this.entities[entity];
                }
                if (entity && entity.collection) {
                    if (LiveData.Collection.prototype.isPrototypeOf(entity.collection)) {
                        return entity.collection;
                    }
                    else {
                        return new entity.collection();
                    }
                }
            };
            Store.prototype.createModel = function (entity, attrs) {
                if (_.isString(entity)) {
                    entity = this.entities[entity];
                }
                if (entity && entity.collection) {
                    var Model = entity.collection.model || entity.collection.prototype.model;
                    if (Model) {
                        return new Model(attrs);
                    }
                }
            };
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
            Store.prototype.initModel = function (model) {
                // may be overwritten
            };
            Store.prototype.initCollection = function (collection) {
                // may be overwritten
            };
            Store.prototype.initEntity = function (entity) {
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
                if (collection && !collection.models && !collection.attributes && !options) {
                    options = collection;
                }
                if ((!collection || (!collection.models && !collection.attributes)) && options && options.entity) {
                    collection = this.getCollection(options.entity);
                }
                if (collection && collection.fetch) {
                    var opts = _.extend({}, options || {}, { store: this });
                    return collection.fetch(opts);
                }
            };
            Store.prototype.create = function (collection, model, options) {
                if (collection && !collection.models && !options) {
                    model = collection;
                    options = model;
                }
                if ((!collection || !collection.models) && options && options.entity) {
                    collection = this.getCollection(options.entity);
                }
                if (collection && collection.create) {
                    var opts = _.extend({}, options || {}, { store: this });
                    collection.create(model, opts);
                }
            };
            Store.prototype.save = function (model, attr, options) {
                if (model && !model.attributes && !options) {
                    attr = model;
                    options = attr;
                }
                if ((!model || !model.attributes) && options && options.entity) {
                    model = this.createModel(options.entity);
                }
                if (model && model.save) {
                    var opts = _.extend({}, options || {}, { store: this });
                    model.save(attr, opts);
                }
            };
            Store.prototype.destroy = function (model, options) {
                if (model && model.destroy) {
                    var opts = _.extend({}, options || {}, { store: this });
                    model.destroy(opts);
                }
            };
            Store.prototype._checkEntity = function (obj, entity) {
                if (!LiveData.isEntity(entity)) {
                    var error = Store.CONST.ERROR_NO_ENTITY;
                    Relution.LiveData.Debug.error(error);
                    this.handleError(obj, error);
                    return false;
                }
                return true;
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
            Store.extend = LiveData.extend;
            Store.create = LiveData.create;
            Store.design = LiveData.design;
            Store.CONST = {
                ERROR_NO_ENTITY: 'No valid entity specified. ',
                ERROR_NO_DATA: 'No data passed. ',
                ERROR_LOAD_DATA: 'Error while loading data from store. ',
                ERROR_SAVE_DATA: 'Error while saving data to the store. ',
                ERROR_LOAD_IDS: 'Error while loading ids from store. ',
                ERROR_SAVE_IDS: 'Error while saving ids to the store. '
            };
            return Store;
        })();
        LiveData.Store = Store;
        _.extend(Store.prototype, Backbone.Events, LiveData._Object);
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));

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
         * The Relution.LiveData.AbstractSqlStore can be used to store model collection into
         * the webSql database
         *
         * @module Relution.LiveData.AbstractSqlStore
         *
         *
         */
        var AbstractSqlStore = (function (_super) {
            __extends(AbstractSqlStore, _super);
            function AbstractSqlStore(options) {
                _super.call(this, _.extend({
                    name: 'relution-livedata',
                    size: 1024 * 1024,
                    version: '1.0',
                    security: '',
                    typeMapping: (function () {
                        var map = {};
                        map[LiveData.DATA.TYPE.OBJECTID] = LiveData.DATA.TYPE.STRING;
                        map[LiveData.DATA.TYPE.DATE] = LiveData.DATA.TYPE.STRING;
                        map[LiveData.DATA.TYPE.OBJECT] = LiveData.DATA.TYPE.TEXT;
                        map[LiveData.DATA.TYPE.ARRAY] = LiveData.DATA.TYPE.TEXT;
                        map[LiveData.DATA.TYPE.BINARY] = LiveData.DATA.TYPE.TEXT;
                        return map;
                    })(),
                    sqlTypeMapping: (function () {
                        var map = {};
                        map[LiveData.DATA.TYPE.STRING] = 'varchar(255)';
                        map[LiveData.DATA.TYPE.TEXT] = 'text';
                        map[LiveData.DATA.TYPE.OBJECT] = 'text';
                        map[LiveData.DATA.TYPE.ARRAY] = 'text';
                        map[LiveData.DATA.TYPE.FLOAT] = 'float';
                        map[LiveData.DATA.TYPE.INTEGER] = 'integer';
                        map[LiveData.DATA.TYPE.DATE] = 'varchar(255)';
                        map[LiveData.DATA.TYPE.BOOLEAN] = 'boolean';
                        return map;
                    })()
                }, options));
                this.db = null;
                this.dataField = {
                    name: 'data',
                    type: 'text',
                    required: true
                };
                this.idField = {
                    name: 'id',
                    type: 'string',
                    required: true
                };
                var that = this;
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
                if (this.entities) {
                    for (var name in this.entities) {
                        var entity = this.entities[name];
                        sql.push(this._sqlDropTable(entity.name));
                        sql.push(this._sqlCreateTable(entity));
                    }
                }
                return sql;
            };
            AbstractSqlStore.prototype._sqlDropTable = function (name) {
                return 'DROP TABLE IF EXISTS \'' + name + '\'';
            };
            AbstractSqlStore.prototype._isAutoincrementKey = function (entity, key) {
                if (entity && key) {
                    var column = this.getField(entity, key);
                    return column && column.type === LiveData.DATA.TYPE.INTEGER;
                }
            };
            AbstractSqlStore.prototype._sqlPrimaryKey = function (entity, keys) {
                if (keys && keys.length === 1) {
                    var field = this.getField(entity, keys[0]);
                    if (this._isAutoincrementKey(entity, keys[0])) {
                        return field.name + ' INTEGER PRIMARY KEY ASC AUTOINCREMENT UNIQUE';
                    }
                    else {
                        return this._dbAttribute(field) + ' PRIMARY KEY ASC UNIQUE';
                    }
                }
                return '';
            };
            AbstractSqlStore.prototype._sqlConstraint = function (entity, keys) {
                if (keys && keys.length > 1) {
                    return 'PRIMARY KEY (' + keys.join(',') + ') ON CONFLICT REPLACE';
                }
                return '';
            };
            AbstractSqlStore.prototype._sqlCreateTable = function (entity) {
                var that = this;
                var keys = entity.getKeys();
                var primaryKey = keys.length === 1 ? this._sqlPrimaryKey(entity, keys) : '';
                var constraint = keys.length > 1 ? this._sqlConstraint(entity, keys) : (entity.constraint || '');
                var columns = '';
                var fields = this.getFields(entity);
                _.each(fields, function (field) {
                    // skip primary key as it is defined manually above
                    if (!primaryKey || field !== fields[keys[0]]) {
                        // only add valid types
                        var attr = that._dbAttribute(field);
                        if (attr) {
                            columns += (columns ? ', ' : '') + attr;
                        }
                    }
                });
                if (!columns) {
                    columns = this._dbAttribute(this.dataField);
                }
                var sql = 'CREATE TABLE IF NOT EXISTS \'' + entity.name + '\' (';
                sql += primaryKey ? primaryKey + ', ' : '';
                sql += columns;
                sql += constraint ? ', ' + constraint : '';
                sql += ');';
                return sql;
            };
            AbstractSqlStore.prototype._sqlDelete = function (options, entity) {
                var sql = 'DELETE FROM \'' + entity.name + '\'';
                var where = this._sqlWhere(options, entity) || this._sqlWhereFromData(options, entity);
                if (where) {
                    sql += ' WHERE ' + where;
                }
                sql += options.and ? ' AND ' + options.and : '';
                return sql;
            };
            AbstractSqlStore.prototype._sqlWhere = function (options, entity) {
                this._selector = null;
                var sql = '';
                if (_.isString(options.where)) {
                    sql = options.where;
                }
                else if (_.isObject(options.where)) {
                    this._selector = LiveData.SqlSelector.create(options.where, entity);
                    sql = this._selector.buildStatement();
                }
                return sql;
            };
            AbstractSqlStore.prototype._sqlWhereFromData = function (options, entity) {
                var that = this;
                var ids = [];
                if (options && options.models && entity && entity.idAttribute) {
                    var id, key = entity.idAttribute;
                    var field = this.getField(entity, key);
                    _.each(options.models, function (model) {
                        id = model.id;
                        if (!_.isUndefined(id)) {
                            ids.push(that._sqlValue(id, field));
                        }
                    });
                    if (ids.length > 0) {
                        return key + ' IN (' + ids.join(',') + ')';
                    }
                }
                return '';
            };
            AbstractSqlStore.prototype._sqlSelect = function (options, entity) {
                if (options.syncContext) {
                    // new code
                    var sql = 'SELECT ';
                    sql += '*';
                    sql += ' FROM \'' + entity.name + '\'';
                    return sql;
                }
                var sql = 'SELECT ';
                if (options.fields) {
                    if (options.fields.length > 1) {
                        sql += options.fields.join(', ');
                    }
                    else if (options.fields.length === 1) {
                        sql += options.fields[0];
                    }
                }
                else {
                    sql += '*';
                }
                sql += ' FROM \'' + entity.name + '\'';
                if (options.join) {
                    sql += ' JOIN ' + options.join;
                }
                if (options.leftJoin) {
                    sql += ' LEFT JOIN ' + options.leftJoin;
                }
                var where = this._sqlWhere(options, entity) || this._sqlWhereFromData(options, entity);
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
            AbstractSqlStore.prototype.blubber = function () {
            };
            AbstractSqlStore.prototype._sqlValue = function (value, field) {
                var type = field && field.type ? field.type : LiveData.Field.prototype.detectType(value);
                if (type === LiveData.DATA.TYPE.INTEGER || type === LiveData.DATA.TYPE.FLOAT) {
                    return value;
                }
                else if (type === LiveData.DATA.TYPE.BOOLEAN) {
                    return value ? '1' : '0';
                }
                else if (type === LiveData.DATA.TYPE.NULL) {
                    return 'NULL';
                }
                value = LiveData.Field.prototype.transform(value, LiveData.DATA.TYPE.STRING);
                value = value.replace(/"/g, '""');
                return '"' + value + '"';
            };
            AbstractSqlStore.prototype._dbAttribute = function (field) {
                if (field && field.name) {
                    var type = this.options.sqlTypeMapping[field.type];
                    var isReqStr = field.required ? ' NOT NULL' : '';
                    if (type) {
                        return field.name + ' ' + type.toUpperCase() + isReqStr;
                    }
                }
            };
            AbstractSqlStore.prototype._dropTable = function (options) {
                var entity = this.getEntity(options);
                entity.db = null;
                if (this._checkDb(options) && entity) {
                    var sql = this._sqlDropTable(entity.name);
                    // reset flag
                    this._executeTransaction(options, [sql]);
                }
            };
            AbstractSqlStore.prototype._createTable = function (options) {
                var entity = this.getEntity(options);
                entity.db = this.db;
                if (this._checkDb(options) && this._checkEntity(options, entity)) {
                    var sql = this._sqlCreateTable(entity);
                    // reset flag
                    this._executeTransaction(options, [sql]);
                }
            };
            AbstractSqlStore.prototype._checkTable = function (options, callback) {
                var entity = this.getEntity(options);
                var that = this;
                if (entity && !entity.db) {
                    this._createTable({
                        success: function () {
                            callback();
                        },
                        error: function (error) {
                            this.handleError(options, error);
                        },
                        entity: entity
                    });
                }
                else {
                    callback();
                }
            };
            AbstractSqlStore.prototype._insertOrReplace = function (model, options) {
                var entity = this.getEntity(options);
                var models = LiveData.isCollection(model) ? model.models : [model];
                if (this._checkDb(options) && this._checkEntity(options, entity) && this._checkData(options, models)) {
                    var isAutoInc = this._isAutoincrementKey(entity, entity.getKey());
                    var statements = [];
                    var sqlTemplate = 'INSERT OR REPLACE INTO \'' + entity.name + '\' (';
                    for (var i = 0; i < models.length; i++) {
                        var amodel = models[i];
                        var statement = ''; // the actual sql insert string with values
                        if (!isAutoInc && !amodel.id && amodel.idAttribute) {
                            amodel.set(amodel.idAttribute, new LiveData.ObjectID().toHexString());
                        }
                        var value = options.attrs || amodel.attributes;
                        var args, keys;
                        if (!_.isEmpty(entity.fields)) {
                            value = entity.fromAttributes(value);
                            args = _.values(value);
                            keys = _.keys(value);
                        }
                        else {
                            args = [amodel.id, JSON.stringify(value)];
                            keys = [this.idField.name, this.dataField.name];
                        }
                        if (args.length > 0) {
                            var values = new Array(args.length).join('?,') + '?';
                            var columns = '\'' + keys.join('\',\'') + '\'';
                            statement += sqlTemplate + columns + ') VALUES (' + values + ');';
                            statements.push({ statement: statement, arguments: args });
                        }
                    }
                    this._executeTransaction(options, statements, model.toJSON());
                }
            };
            AbstractSqlStore.prototype._select = function (model, options) {
                var entity = this.getEntity(options);
                if (this._checkDb(options) && this._checkEntity(options, entity)) {
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
                                if (!_.isEmpty(entity.fields) || !that._hasDefaultFields(item)) {
                                    attrs = entity.toAttributes(item);
                                }
                                else {
                                    try {
                                        attrs = JSON.parse(item.data);
                                    }
                                    catch (e) {
                                        that.trigger('error', e);
                                        continue;
                                    }
                                }
                                if (!that._selector || that._selector.matches(attrs)) {
                                    if (isCollection) {
                                        result.push(attrs);
                                    }
                                    else {
                                        result = attrs;
                                        break;
                                    }
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
                var entity = this.getEntity(options);
                var models = LiveData.isCollection(model) ? model.models : [model];
                if (this._checkDb(options) && this._checkEntity(options, entity)) {
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
            AbstractSqlStore.prototype._hasDefaultFields = function (item) {
                return _.every(_.keys(item), function (key) {
                    return key === this.idField.name || key === this.dataField.name;
                }, this);
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
            AbstractSqlStore.prototype.getFields = function (entity) {
                if (!_.isEmpty(entity.fields)) {
                    return entity.fields;
                }
                else {
                    var fields = {};
                    var idAttribute = entity.idAttribute || 'id';
                    fields[idAttribute] = this.idField;
                    fields.data = this.dataField;
                    return fields;
                }
            };
            AbstractSqlStore.prototype.getField = function (entity, key) {
                return this.getFields(entity)[key];
            };
            return AbstractSqlStore;
        })(LiveData.Store);
        LiveData.AbstractSqlStore = AbstractSqlStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));

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
         *      idAttribute: 'id',
         *      fields: {
         *          id:          { type: Relution.LiveData.DATA.TYPE.STRING,  required: true, index: true },
         *          sureName:    { name: 'USERNAME', type: Relution.LiveData.DATA.TYPE.STRING },
         *          firstName:   { type: Relution.LiveData.DATA.TYPE.STRING,  length: 200 },
         *          age:         { type: Relution.LiveData.DATA.TYPE.INTEGER }
         *      }
         * });
         *
         *
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
                debugger;
                /* openDatabase(db_name, version, description, estimated_size, callback) */
                if (!this.db) {
                    try {
                        if (!global.openDatabase) {
                            error = 'Your browser does not support WebSQL databases.';
                        }
                        else {
                            this.db = global.openDatabase(this.options.name, '', '', this.options.size);
                            if (this.entities) {
                                for (var key in this.entities) {
                                    this._createTable({ entity: this.entities[key] });
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
                        }, function (msg) {
                            that.handleError(options, msg, lastSql);
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
            return WebSqlStore;
        })(LiveData.AbstractSqlStore);
        LiveData.WebSqlStore = WebSqlStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));

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
         *      idAttribute: 'id',
         *      fields: {
         *          id:          { type: Relution.LiveData.DATA.TYPE.STRING,  required: true, index: true },
         *          sureName:    { name: 'USERNAME', type: Relution.LiveData.DATA.TYPE.STRING },
         *          firstName:   { type: Relution.LiveData.DATA.TYPE.STRING,  length: 200 },
         *          age:         { type: Relution.LiveData.DATA.TYPE.INTEGER }
         *      }
         * });
         * 0 (default): Documents - visible to iTunes and backed up by iCloud
         * 1: Library - backed up by iCloud, NOT visible to iTunes
         * 2: Library/LocalDatabase - NOT visible to iTunes and NOT backed up by iCloud
         *
         */
        var CipherSqlStore = (function (_super) {
            __extends(CipherSqlStore, _super);
            function CipherSqlStore(options) {
                _super.call(this, _.extend({
                    name: 'relution-livedata',
                    security: null
                }, options));
                if (options && !options.security) {
                    return console.error('security Key is required on a CipherSqlStore');
                }
                console.log('CipherSqlStore', options);
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
            CipherSqlStore.prototype._openDb = function (options) {
                var error, dbError;
                debugger;
                /* openDatabase(db_name, version, description, estimated_size, callback) */
                if (!this.db) {
                    try {
                        if (!global.openDatabase) {
                            error = 'Your browser does not support WebSQL databases.';
                        }
                        else {
                            this.db = global.openDatabase(this.options.name, '', '', this.options.size);
                            if (this.entities) {
                                for (var key in this.entities) {
                                    this._createTable({ entity: this.entities[key] });
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
            CipherSqlStore.prototype._updateDb = function (options) {
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
                        }, function (msg) {
                            that.handleError(options, msg, lastSql);
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
            return CipherSqlStore;
        })(LiveData.AbstractSqlStore);
        LiveData.CipherSqlStore = CipherSqlStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));

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
/// <reference path="SyncContext.ts" />
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
                    localStore: LiveData.CipherSqlStore,
                    useLocalStore: true,
                    useSocketNotify: true,
                    useOfflineChanges: true,
                    socketPath: '',
                    typeMapping: (function () {
                        var map = {};
                        map[LiveData.DATA.BINARY] = 'text';
                        map[LiveData.DATA.TEXT] = 'string';
                        return map;
                    })()
                }, options));
                this.endpoints = {};
                console.log('SyncStore', options);
                if (this.options.useSocketNotify && typeof io !== 'object') {
                    Relution.LiveData.Debug.warning('Socket.IO not present !!');
                    this.options.useSocketNotify = false;
                }
            }
            SyncStore.prototype.initEndpoint = function (model, modelType) {
                Relution.LiveData.Debug.info('Relution.LiveData.SyncStore.initEndpoint');
                var urlRoot = model.getUrlRoot();
                var entity = this.getEntity(model.entity);
                if (urlRoot && entity) {
                    var name = entity.name;
                    var hash = LiveData.URLUtil.hashLocation(urlRoot);
                    var credentials = entity.credentials || model.credentials || this.options.credentials;
                    var user = credentials && credentials.username ? credentials.username : '';
                    var channel = name + user + hash;
                    model.channel = channel;
                    // get or create endpoint for this url
                    var endpoint = this.endpoints[hash];
                    if (!endpoint) {
                        var href = LiveData.URLUtil.getLocation(urlRoot);
                        endpoint = {};
                        endpoint.model = modelType;
                        endpoint.isConnected = false;
                        endpoint.urlRoot = urlRoot;
                        endpoint.host = href.protocol + '//' + href.host;
                        endpoint.path = href.pathname;
                        endpoint.entity = entity;
                        endpoint.channel = channel;
                        endpoint.credentials = credentials;
                        endpoint.socketPath = this.options.socketPath;
                        endpoint.localStore = this.createLocalStore(endpoint);
                        endpoint.messages = this.createMsgCollection(endpoint);
                        endpoint.socket = this.createSocket(endpoint, name);
                        endpoint.info = this.fetchServerInfo(endpoint);
                        this.endpoints[hash] = endpoint;
                    }
                    return endpoint;
                }
            };
            SyncStore.prototype.initModel = function (model) {
                Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.initModel');
                model.endpoint = this.initEndpoint(model, model.constructor);
            };
            SyncStore.prototype.initCollection = function (collection) {
                Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.initCollection');
                collection.endpoint = this.initEndpoint(collection, collection.model);
            };
            SyncStore.prototype.getEndpoint = function (url) {
                if (url) {
                    var hash = LiveData.URLUtil.hashLocation(url);
                    return this.endpoints[hash];
                }
            };
            SyncStore.prototype.createLocalStore = function (endpoint) {
                if (this.options.useLocalStore) {
                    var entities = {};
                    entities[endpoint.entity.name] = _.extend(new LiveData.Entity(endpoint.entity), {
                        name: endpoint.channel,
                        idAttribute: endpoint.model.prototype.idAttribute // see Collection.modelId() of backbone.js
                    });
                    return this.options.localStore.create({
                        entities: entities
                    });
                }
            };
            /**
             * @description Here we save the changes in a Message local websql
             * @param endpoint {string}
             * @returns {*}
             */
            SyncStore.prototype.createMsgCollection = function (endpoint) {
                if (this.options.useOfflineChanges) {
                    var entity = 'msg-' + endpoint.channel;
                    var entities = {};
                    entities[entity] = new LiveData.Entity({
                        name: entity,
                        idAttribute: 'id'
                    });
                    var messages = LiveData.Collection.design({
                        entity: entity,
                        store: this.options.localStore.create({
                            entities: entities
                        })
                    });
                    if (endpoint.isConnected) {
                        this._sendMessages(endpoint);
                    }
                    return messages;
                }
            };
            SyncStore.prototype.createSocket = function (endpoint, name) {
                Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.createSocket');
                if (this.options.useSocketNotify && endpoint && endpoint.socketPath) {
                    var that = this;
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
                        that._bindChannel(endpoint, name);
                        return that.onConnect(endpoint).done();
                    });
                    endpoint.socket.on('disconnect', function () {
                        Relution.LiveData.Debug.info('socket.io: disconnect');
                        return that.onDisconnect(endpoint).done();
                    });
                    endpoint.socket.on(endpoint.channel, _.bind(this.onMessage, this, endpoint));
                    return endpoint.socket;
                }
            };
            SyncStore.prototype._bindChannel = function (endpoint, name) {
                Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore._bindChannel');
                var that = this;
                if (endpoint && endpoint.socket) {
                    var channel = endpoint.channel;
                    var socket = endpoint.socket;
                    var time = this.getLastMessageTime(channel);
                    name = name || endpoint.entity.name;
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
                if (endpoint.isConnected) {
                    return Q.resolve();
                }
                endpoint.isConnected = true;
                var that = this;
                return this.fetchChanges(endpoint).then(function () {
                    return that._sendMessages(endpoint);
                }).finally(function () {
                    if (endpoint.isConnected) {
                        that.trigger('connect:' + endpoint.channel);
                    }
                });
            };
            SyncStore.prototype.onDisconnect = function (endpoint) {
                if (!endpoint.isConnected) {
                    return Q.resolve();
                }
                endpoint.isConnected = false;
                var that = this;
                return Q.fcall(function () {
                    if (endpoint.socket && endpoint.socket.socket) {
                        endpoint.socket.socket.onDisconnect();
                    }
                }).finally(function () {
                    if (!endpoint.isConnected) {
                        that.trigger('disconnect:' + endpoint.channel);
                    }
                });
            };
            SyncStore.prototype._fixMessage = function (endpoint, msg) {
                if (msg.data && !msg.data[endpoint.entity.idAttribute] && msg.data._id) {
                    msg.data[endpoint.entity.idAttribute] = msg.data._id; // server bug!
                }
                else if (!msg.data && msg.method === 'delete' && msg[endpoint.entity.idAttribute]) {
                    msg.data = {};
                    msg.data[endpoint.entity.idAttribute] = msg[endpoint.entity.idAttribute]; // server bug!
                }
            };
            SyncStore.prototype.onMessage = function (endpoint, msg) {
                // this is called by the store itself for a particular endpoint!
                var that = this;
                if (!msg || !msg.method) {
                    return Q.reject('no message or method given');
                }
                this._fixMessage(endpoint, msg);
                var q;
                var channel = endpoint.channel;
                if (endpoint.localStore) {
                    // first update the local store by forming a model and invoking sync
                    var options = _.defaults({
                        store: endpoint.localStore,
                        entity: endpoint.entity
                    }, that.options);
                    var model = new endpoint.model(msg.data, _.extend({
                        parse: true
                    }, options));
                    q = endpoint.localStore.sync(msg.method, model, _.extend(options, {
                        merge: msg.method === 'patch',
                        success: function (result) {
                            // update all collections listening
                            that.trigger('sync:' + channel, msg); // SyncContext.onMessage
                        },
                        error: function (error) {
                            // report error as event on store
                            that.trigger('error:' + channel, error);
                        }
                    }));
                }
                else {
                    // just update all collections listening
                    q = Q.fcall(function () {
                        return that.trigger('sync:' + channel, msg) || msg; // SyncContext.onMessage
                    });
                }
                // finally set the message time
                return q.then(function (result) {
                    if (msg.time) {
                        that.setLastMessageTime(channel, msg.time);
                    }
                    return result;
                }).thenResolve(msg);
            };
            SyncStore.prototype.sync = function (method, model, options) {
                Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.sync');
                options = options || {};
                try {
                    var endpoint = model.endpoint || this.getEndpoint(model.getUrlRoot() /*throws urlError*/);
                    if (!endpoint) {
                        throw new Error('no endpoint');
                    }
                    if (LiveData.isCollection(model)) {
                        // collections can be filtered, etc.
                        if (method === 'read') {
                            var syncContext = options.syncContext; // sync can be called by SyncContext itself when paging results
                            if (!syncContext) {
                                // capture GetQuery options
                                syncContext = new LiveData.SyncContext(options, model.options, this.options // static options of this store realize filtering client/server
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
                        if (method === 'create' && !model.id) {
                            model.set(model.idAttribute, new LiveData.ObjectID().toHexString());
                        }
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
                        var that = this;
                        return endpoint.localStore.sync(method, model, opts).then(function (resp) {
                            // backbone success callback alters the collection now
                            resp = that.handleSuccess(options, resp) || resp;
                            if (endpoint.socket) {
                                // no need to fetch changes as we got a websocket, that is either connected or attempts reconnection
                                return resp;
                            }
                            // load changes only (will happen AFTER success callback is invoked,
                            // but returned promise will resolve only after changes were processed.
                            return that.fetchChanges(endpoint).catch(function (error) {
                                that.trigger('error:' + channel, error); // can not do much about it...
                            }).thenResolve(resp); // caller expects original XHR response as changes body data is NOT compatible
                        }, function () {
                            // fall-back to loading full data set
                            return that._addMessage(method, model, options, endpoint);
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
                var that = this;
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
                            storeMsg = false;
                            break;
                    }
                    var msg = {
                        _id: model.id,
                        id: model.id,
                        method: method,
                        data: data,
                        channel: endpoint.channel
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
                        return that._emitMessage(endpoint, msg, options, model, qMessage);
                    });
                }
            };
            SyncStore.prototype._emitMessage = function (endpoint, msg, options, model, qMessage) {
                var that = this;
                var channel = endpoint.channel;
                var qAjax = this._ajaxMessage(endpoint, msg, options, model);
                var q = qAjax;
                if (qMessage) {
                    // following takes care of offline change store
                    q = q.then(function (data) {
                        // success, remove message stored, if any
                        return that.removeMessage(endpoint, msg, qMessage).then(data, function (error) {
                            that.trigger('error:' + channel, error); // can not do much about it...
                            return data;
                        }).thenResolve(data); // resolve again yielding data
                    }, function (xhr) {
                        // failure eventually caught by offline changes
                        if (!xhr.responseText && that.options.useOfflineChanges) {
                            // this seams to be only a connection problem, so we keep the message and call success
                            return Q.resolve(msg.data);
                        }
                        else {
                            // keep rejection as is
                            return Q.reject.apply(Q, arguments);
                        }
                    });
                }
                q = this._applyResponse(q, endpoint, msg, options, model);
                return q.finally(function () {
                    // do some connection handling
                    return qAjax.then(function () {
                        // trigger reconnection when disconnected
                        if (!endpoint.isConnected) {
                            return that.onConnect(endpoint);
                        }
                    }, function (xhr) {
                        // trigger disconnection when disconnected
                        if (!xhr.responseText && endpoint.isConnected) {
                            return that.onDisconnect(endpoint);
                        }
                    });
                });
            };
            SyncStore.prototype._ajaxMessage = function (endpoint, msg, options, model) {
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
                        if (queryIndex >= 0) {
                            url += collectionUrl.substr(queryIndex);
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
                });
            };
            SyncStore.prototype._applyResponse = function (qXHR, endpoint, msg, options, model) {
                var channel = endpoint.channel;
                var that = this;
                var clientTime = new Date().getTime();
                return qXHR.then(function (data) {
                    // delete on server does not respond a body
                    if (!data && msg.method === 'delete') {
                        data = msg.data;
                    }
                    // update local store state
                    if (data) {
                        // no data if server asks not to alter state
                        // that.setLastMessageTime(channel, msg.time);
                        var promises = [];
                        var dataIds;
                        if (msg.method !== 'read') {
                            promises.push(that.onMessage(endpoint, data === msg.data ? msg : _.defaults({
                                data: data // just accepts new data
                            }, msg)));
                        }
                        else if (LiveData.isCollection(model) && _.isArray(data)) {
                            // synchronize the collection contents with the data read
                            var syncIds = {};
                            model.models.forEach(function (m) {
                                syncIds[m.id] = m;
                            });
                            dataIds = {};
                            data.forEach(function (d) {
                                if (d) {
                                    var id = d[endpoint.entity.idAttribute] || d._id;
                                    dataIds[id] = d;
                                    var m = syncIds[id];
                                    if (m) {
                                        // update the item
                                        delete syncIds[id]; // so that it is deleted below
                                        if (!_.isEqual(_.pick.call(m, m.attributes, Object.keys(d)), d)) {
                                            // above checked that all attributes in d are in m with equal values and found some mismatch
                                            promises.push(that.onMessage(endpoint, {
                                                id: id,
                                                method: 'update',
                                                data: d
                                            }));
                                        }
                                    }
                                    else {
                                        // create the item
                                        promises.push(that.onMessage(endpoint, {
                                            id: id,
                                            method: 'create',
                                            data: d
                                        }));
                                    }
                                }
                            });
                            Object.keys(syncIds).forEach(function (id) {
                                // delete the item
                                var m = syncIds[id];
                                promises.push(that.onMessage(endpoint, {
                                    id: id,
                                    method: 'delete',
                                    data: m.attributes
                                }));
                            });
                        }
                        else {
                            // trigger an update to load the data read
                            var array = _.isArray(data) ? data : [data];
                            for (var i = 0; i < array.length; i++) {
                                data = array[i];
                                if (data) {
                                    promises.push(that.onMessage(endpoint, {
                                        id: data[endpoint.entity.idAttribute] || data._id,
                                        method: 'update',
                                        data: data
                                    }));
                                }
                            }
                        }
                        return Q.all(promises).then(function () {
                            // delayed till operations complete
                            if (!dataIds) {
                                return data;
                            }
                            // when collection was updated only pass data of models that were synced on to the success callback,
                            // as the callback will set the models again causing our sorting and filtering to be without effect.
                            var response = [];
                            for (var i = model.models.length; i-- > 0;) {
                                var m = model.models[i];
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
                        that.setLastMessageTime(endpoint.channel, clientTime);
                    }
                    // invoke success callback, if any
                    return that.handleSuccess(options, response) || response;
                }, function (error) {
                    // invoke error callback, if any
                    return that.handleError(options, error) || Q.reject(error);
                });
            };
            SyncStore.prototype.fetchChanges = function (endpoint) {
                var that = this;
                var channel = endpoint ? endpoint.channel : '';
                var time = that.getLastMessageTime(channel);
                if (endpoint && endpoint.urlRoot && channel && time) {
                    var changes = new endpoint.messages.constructor();
                    return changes.fetch({
                        url: endpoint.urlRoot + 'changes/' + time,
                        store: {},
                        success: function (model, response, options) {
                            changes.each(function (change) {
                                var msg = change.attributes;
                                that.onMessage(endpoint, msg);
                            });
                            return response || options.xhr;
                        },
                        credentials: endpoint.credentials
                    });
                }
                else {
                    return Q.resolve();
                }
            };
            SyncStore.prototype.fetchServerInfo = function (endpoint) {
                var that = this;
                if (endpoint && endpoint.urlRoot) {
                    var info = new LiveData.Model();
                    var time = that.getLastMessageTime(endpoint.channel);
                    var url = endpoint.urlRoot;
                    if (url.charAt((url.length - 1)) !== '/') {
                        url += '/';
                    }
                    return info.fetch({
                        url: url + 'info',
                        success: function (model, response, options) {
                            //@todo why we set a server time here ?
                            if (!time && info.get('time')) {
                                that.setLastMessageTime(endpoint.channel, info.get('time'));
                            }
                            if (!endpoint.socketPath && info.get('socketPath')) {
                                endpoint.socketPath = info.get('socketPath');
                                var name = info.get('entity') || endpoint.entity.name;
                                if (that.options.useSocketNotify) {
                                    endpoint.socket = that.createSocket(endpoint, name);
                                }
                            }
                            return response || options.xhr;
                        },
                        credentials: endpoint.credentials
                    });
                }
            };
            SyncStore.prototype._sendMessages = function (endpoint) {
                if (!endpoint || !endpoint.messages) {
                    return Q.resolve();
                }
                var that = this;
                return endpoint.messages.fetch().then(function next(result) {
                    if (endpoint.messages.models.length <= 0) {
                        return result;
                    }
                    var message = endpoint.messages.models[0];
                    var msg = message.attributes;
                    var channel = message.get('channel');
                    if (!msg || !channel) {
                        return message.destroy();
                    }
                    that._fixMessage(endpoint, msg);
                    var remoteOptions = {
                        urlRoot: endpoint.urlRoot,
                        store: {} // really go to remote server
                    };
                    var localOptions = {
                        // just affect local store
                        store: endpoint.localStore
                    };
                    var model = new LiveData.Model(msg.data, {
                        idAttribute: endpoint.entity.idAttribute,
                        entity: endpoint.entity
                    });
                    Relution.LiveData.Debug.info('sendMessage ' + model.id);
                    return that._applyResponse(that._ajaxMessage(endpoint, msg, remoteOptions, model), endpoint, msg, remoteOptions, model).catch(function (error) {
                        // failed, eventually undo the modifications stored
                        if (!endpoint.localStore) {
                            return Q.reject(error);
                        }
                        // revert modification by reloading data
                        if (msg.id) {
                            remoteOptions.url = remoteOptions.urlRoot + (remoteOptions.urlRoot.charAt(remoteOptions.urlRoot.length - 1) === '/' ? '' : '/') + msg.id;
                        }
                        return model.fetch(remoteOptions).then(function (data) {
                            // original request failed and the code above reloaded the data to revert the local modifications, which succeeded...
                            return model.save(data, localOptions);
                        }, function (fetchResp) {
                            // original request failed and the code above tried to revert the local modifications by reloading the data, which failed as well...
                            var status = fetchResp && fetchResp.status;
                            switch (status) {
                                case 404: // NOT FOUND
                                case 401: // UNAUTHORIZED
                                case 410:
                                    // ...because the item is gone by now, maybe someone else changed it to be deleted
                                    return model.destroy(localOptions);
                                default:
                                    return Q.reject(fetchResp);
                            }
                        });
                    }).then(function () {
                        // succeeded or reverted
                        return message.destroy();
                    }).then(function (result) {
                        return next(result);
                    });
                });
            };
            SyncStore.prototype.storeMessage = function (endpoint, qMsg) {
                return qMsg.then(function (msg) {
                    var options;
                    var id = endpoint.messages.modelId(msg);
                    Relution.LiveData.Debug.info('storeMessage ' + id);
                    var message = id && endpoint.messages.get(id);
                    if (message) {
                        // use existing instance, should not be the case usually
                        options = {
                            merge: true
                        };
                    }
                    else {
                        // instantiate new model, intentionally not added to collection
                        message = new endpoint.messages.model(msg, {
                            collection: endpoint.messages,
                            store: endpoint.messages.store
                        });
                    }
                    return message.save(msg, options).thenResolve(message);
                });
            };
            SyncStore.prototype.removeMessage = function (endpoint, msg, qMessage) {
                return qMessage.then(function (message) {
                    if (!message) {
                        var id = endpoint.messages.modelId(msg);
                        if (!id) {
                            // msg is not persistent
                            return Q.resolve();
                        }
                        message = endpoint.messages.get(id);
                        if (!message) {
                            message = new endpoint.messages.model({
                                _id: msg._id,
                                id: msg.id
                            }, {
                                collection: endpoint.messages,
                                store: endpoint.messages.store
                            });
                        }
                    }
                    Relution.LiveData.Debug.trace('removeMessage ' + message.id);
                    return message.destroy();
                });
            };
            SyncStore.prototype.clear = function (collection) {
                if (collection) {
                    var endpoint = this.getEndpoint(collection.getUrlRoot());
                    if (endpoint) {
                        if (endpoint.messages) {
                            endpoint.messages.destroy();
                        }
                        collection.reset();
                        this.setLastMessageTime(endpoint.channel, '');
                    }
                }
            };
            return SyncStore;
        })(LiveData.Store);
        LiveData.SyncStore = SyncStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));

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
                if (options.limit > 0) {
                    newQuery.limit = options.limit + 1;
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
                    // restore callbacks
                    options.success = oldSuccess;
                    options.error = oldError;
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
                    // restore callbacks
                    options.success = oldSuccess;
                    options.error = oldError;
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
                var id = collection.modelId(msg.data);
                if (id === 'all') {
                    collection.reset(msg.data || {}, options);
                    return;
                }
                // update the collection
                var model = id && collection.get(id);
                switch (msg.method) {
                    case 'create':
                    case 'update':
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
                                collection.remove(model, options);
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


// Copyright (c) 2015 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

var Bikini = null;
if (global.Relution) {
  Bikini = global.Bikini = Relution.LiveData;
  Bikini.BikiniStore = Relution.LiveData.SyncStore;
}


})(this, Backbone, _, $, Q, jsonPath);
