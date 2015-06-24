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
