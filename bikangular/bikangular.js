(function() {
    'use strict';
    angular.module('mwCollection', []).run([
        '$http',
        function($http) {
            Backbone.ajax = Bikini.ajax = function(options) {
                // Ignore notifications for given response codes
				if (options.data) {
					var requestData = JSON.parse(options.data);
					options.ignoreHandleResponseCodes = requestData.ignoreHandleResponseCodes;
				}
                // Set HTTP Verb as 'method'
                options.method = options.type;

                // Set headers
                options.headers  = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };
                // Use angulars $http implementation for requests
                return $http.apply(angular, [options]).success(options.success).error(options.error);
            };
        }
    ]).factory('MwCollection', [
        'MwModel',
        function(MwModel) {
            return Bikini.Collection.extend({
                model: MwModel,
                parse: function(response) {
                    this.total = response.length;
                    return response;
                }
            });
        }
    ]).factory('MwModel', [
        '$rootScope',
        function($rootScope) {
            return Bikini.Model.extend({
                idAttribute: 'uuid',
                initialize: function() {
                    // When a model gets removed, make sure to decrement the total count on the collection
                    this.on('destroy', function() {
                        if (this.collection.total && this.collection.total > 0) {
                            this.collection.total--;
                        }
                    }, this);
                },
                set: function() {
                    var callSet = Backbone.Model.prototype.set.apply(this, arguments);
                    // Trigger digest cycle to make calls to set recognizable by angular
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                    return callSet;
                },
                selected: false,
                toggleSelect: function() {
                    if (!this.selectDisabled()) {
                        this.selected = !this.selected;
                    }
                },
                selectDisabled: function() {
                    return false;
                }
            });
        }
    ]);
}());
