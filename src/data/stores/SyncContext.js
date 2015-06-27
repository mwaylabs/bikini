/**
 * SyncContext.ts
 *
 * Created by Thomas Beckmann on 26.06.2015
 * Copyright (c)
 * 2015
 * M-Way Solutions GmbH. All rights reserved.
 * http://www.mwaysolutions.com
 * Redistribution and use in source and binary forms, with or without
 * modification, are not permitted.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/* jshint indent: 4 */
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/* jshint -W086: Expected a 'break' statement before 'case'. */
/// <reference path="../../core/livedata.d.ts" />
/// <reference path="../../query/GetQuery.ts" />
/// <reference path="Store.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * receives change messages and updates collections.
         */
        var SyncContext = (function () {
            /**
             * captures option values forming a GetQuery.
             *
             * @param options to merge.
             * @constructor
             */
            function SyncContext() {
                var _this = this;
                var options = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    options[_i - 0] = arguments[_i];
                }
                /**
                 * relevant parameters for paging, filtering and sorting.
                 *
                 * @type {Relution.LiveData.GetQuery}
                 */
                this.getQuery = new LiveData.GetQuery();
                // merge options forming a GetQuery
                options.forEach(function (json) {
                    if (json) {
                        _this.getQuery.merge(new LiveData.GetQuery().fromJSON(json));
                    }
                });
                this.getQuery.optimize();
            }
            /**
             * receives change messages.
             *
             * Change messages are communicated by the SyncStore indirectly triggering a sync:channel event. This happens
             * regardless of whether the change originates local or remote. The context then alters the backbone data
             * incorporating the change.
             *
             * @param store
             * @param collection
             * @param msg
             */
            SyncContext.prototype.onMessage = function (store, collection, msg) {
                var options = {
                    collection: collection,
                    entity: collection.entity,
                    merge: msg.method === 'patch',
                    parse: true,
                    fromMessage: true
                };
                var id = collection.modelId(msg.data);
                if (id === 'all') {
                    collection.reset(msg.data || {}, options);
                    return;
                }
                var model = id && collection.get(id);
                switch (msg.method) {
                    case 'create':
                    case 'update':
                        if (!model) {
                            // create model in case it does not exist
                            model = new options.collection.model(msg.data, options);
                            if (model.validationError) {
                                collection.trigger('invalid', this, model.validationError, options);
                            }
                            else {
                                collection.add(model, options);
                            }
                            break;
                        }
                    case 'patch':
                        if (model) {
                            // update model unless it is filtered
                            model.set(msg.data, options);
                        }
                        break;
                    case 'delete':
                        if (model) {
                            // remove model unless it is filtered
                            collection.remove(model, options);
                        }
                        break;
                }
            };
            return SyncContext;
        })();
        LiveData.SyncContext = SyncContext;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SyncContext.js.map