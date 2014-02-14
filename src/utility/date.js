// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module Bikini.Date
 *
 * @extends Bikini.Object
 */
Bikini.Date = {

    /**
     * This method is used to create a new instance of Bikini.Date based on the data
     * library moment.js.
     *
     * @returns {Object}
     */
    create: function() {
        var m = moment.apply(this, arguments);
        return _.extend(m, this);
    }
};
