// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * Defines the general namespace
 *
 * @type {Object}
 */
var Bikini = null;
if( typeof exports !== 'undefined' ) {
    Bikini = exports;
} else {
    Bikini = global.Bikini = {};
}

/**
 * Version number of current release
 * @type {String}
 */
Bikini.Version = Bikini.version = '/* @echo VERSION */';

/**
 * Empty function to be used when
 * no functionality is needed
 *
 * @type {Function}
 */
Bikini.f = function() {
};

Bikini.create = function( args ) {
    return new this(args);
};

Bikini.design = function( obj ) {
    var O = this.extend(obj || {});
    return new O();
};

Bikini.extend = Backbone.Model.extend;

Bikini.isCollection = function( collection ) {
    return Backbone.Collection.prototype.isPrototypeOf(collection);
};

Bikini.isModel = function( model ) {
    return Backbone.Model.prototype.isPrototypeOf(model);
};

Bikini.isEntity = function( entity ) {
    return Bikini.Entity.prototype.isPrototypeOf(entity);
};

/***
 * Data type Constants.
 */
Bikini.DATA = {
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

Bikini.Object = {
    /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'Bikini.Object',

    /**
     * Creates an object based on a passed prototype.
     *
     * @param {Object} proto The prototype of the new object.
     */
    _create: function( proto ) {
        var F = function() {
        };
        F.prototype = proto;
        return new F();
    },

    /**
     * Includes passed properties into a given object.
     *
     * @param {Object} properties The properties to be included into the given object.
     */
    mergeProperties: function( properties ) {
        for( var prop in properties ) {
            if( this.hasOwnProperty(prop) ) {
                throw new Error('Reserved word');
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
    design: function( properties ) {
        /* create the new object */
        // var obj = Bikini.Object._create(this);
        var obj = this._create(this);

        /* assign the properties passed with the arguments array */
        obj.mergeProperties(this._normalize(properties));

        /* return the new object */
        return obj;
    },


    /**
     * Binds a method to its caller, so it is always executed within the right scope.
     *
     * @param {Object} caller The scope of the method that should be bound.
     * @param {Function} method The method to be bound.
     * @param {Object} arg One or more arguments. If more, then apply is used instead of call.
     */
    bindToCaller: function( caller, method, arg ) {
        return function() {
            if( typeof method !== 'function' || typeof caller !== 'object' ) {
                throw new Error('Invalid input parameter');
            }
            if( Array.isArray(arg) ) {
                return method.apply(caller, arg);
            }
            return method.call(caller, arg);
        };
    },

    /**
     * This method is used internally to normalize the properties object that is used
     * for extending a given object.
     *
     * @param obj
     * @returns {Object}
     * @private
     */
    _normalize: function( obj ) {
        obj = obj && typeof obj === 'object' ? obj : {};

        return obj;
    },

    /**
     * Calls a method defined by a handler
     *
     * @param {Object} handler A function, or an object including target and action to use with bindToCaller.
     */
    handleCallback: function( handler ) {
        var args = Array.prototype.slice.call(arguments, 1);
        if( handler ) {
            var target = typeof handler.target === 'object' ? handler.target : this;
            var action = handler;
            if( typeof handler.action === 'function' ) {
                action = handler.action;
            } else if( typeof handler.action === 'string' ) {
                action = target[handler.action];
            }
            if( typeof action === 'function' ) {
                return this.bindToCaller(target, action, args)();
            }
        }
    }

};

/**
 * Readable alias for true
 *
 * @type {Boolean}
 */
YES = true;

/**
 * Readable alias for false
 *
 * @type {Boolean}
 */
NO = false;
