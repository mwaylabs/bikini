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
