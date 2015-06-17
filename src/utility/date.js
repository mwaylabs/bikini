// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module Relution.LiveData.Date
 *
 * @extends Relution.LiveData.Object
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
