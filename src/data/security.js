// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module Bikini.Security
 *
 * @type {{logon: Function, logonBasicAuth: Function, logonMcapAuth: Function, getHost: Function}}
 */
Bikini.Security = Bikini.Object.design({


    logon: function (options, callback) {
        var credentials = options ? options.credentials : null;
        if (credentials) {
            switch (credentials.type) {
                case 'basic':
                    return this.logonBasicAuth(options, callback);
            }
        }
        return this.handleCallback(callback);
    },

    logonBasicAuth: function (options, callback) {
        var credentials = options.credentials;
        options.beforeSend = function (xhr) {
            Bikini.Security.setBasicAuth(xhr, credentials);
        };
        return this.handleCallback(callback);
    },

    setBasicAuth: function( xhr, credentials ) {
        if( credentials && credentials.username && xhr && Bikini.Base64 ) {
            var basicAuth = Bikini.Base64.encode(encodeURIComponent(credentials.username + ':' + (credentials.password || '')));
            xhr.setRequestHeader('Authorization', 'Basic ' + basicAuth);
        }
    }

});
