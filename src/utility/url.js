// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

// Returns a unique identifier

/**
 *
 * @module Bikini.URLUtil
 *
 * @type {*}
 * @extends Bikini.Object
 */
Bikini.URLUtil = Bikini.Object.design({
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
  }
});
