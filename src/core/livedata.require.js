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
