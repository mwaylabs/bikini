// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * Defines the general namespace
 *
 * @type {Object}
 */
var M = null;
if( typeof exports !== 'undefined' ) {
    M = exports;
} else {
    M = global.M = {};
}

/**
 * Version number of current release
 * @type {String}
 */
M.Version = M.version = '/* @echo VERSION */';

/**
 * Empty function to be used when
 * no functionality is needed
 *
 * @type {Function}
 */
M.f = function() {
};

M.create = function( args ) {
    return new this(args);
};

M.design = function( obj ) {
    var O = this.extend(obj || {});
    return new O();
};

M.extend = Backbone.Model.extend;

M.isCollection = function( collection ) {
    return Backbone.Collection.prototype.isPrototypeOf(collection);
};

M.isModel = function( model ) {
    return Backbone.Model.prototype.isPrototypeOf(model);
};

M.isEntity = function( entity ) {
    return M.Entity.prototype.isPrototypeOf(entity);
};

/***
 * Data type Constants.
 */
M.DATA = {
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
