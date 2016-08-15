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
/// <reference path="../../query/JsonFilterVisitor.ts" />
/// <reference path="../../query/SortOrderComparator.ts" />
/// <reference path="Store.ts" />
/// <reference path="LiveDataMessage.ts" />
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
                // compute local members
                this.pageSize = this.getQuery.limit;
                this.compareFn = this.getQuery.sortOrder && LiveData.jsonCompare(this.getQuery.sortOrder);
                this.filterFn = this.getQuery.filter && LiveData.jsonFilter(this.getQuery.filter);
            }
            /**
             * reads an additional page of data into the collection.
             *
             * When async processing is done, a more attribute is set on the options object in case additional data might be
             * available which can be loaded by calling this method again. Likewise an end attribute is set if the data is
             * fully loaded.
             *
             * @param {object} collection to load data into.
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see Collection#fetchMore()
             */
            SyncContext.prototype.fetchMore = function (collection, options) {
                var getQuery = this.getQuery;
                options = _.defaults(options || {}, {
                    limit: options.pageSize || this.pageSize || getQuery.limit,
                    sortOrder: getQuery.sortOrder,
                    filter: getQuery.filter,
                    fields: getQuery.fields
                });
                // prepare a query for the next page of data to load
                options.offset = (getQuery.offset | 0) + collection.models.length;
                // this must be set in options to state we handle it
                options.syncContext = this;
                // setup callbacks handling processing of results, do not use promises as these execute too late...
                // Notice, since we call collection.sync() directly, the signature of success/error callbacks here is ajax-style.
                // However, the user-provided callbacks are to being called backbone.js-style with collection and object.
                var oldSuccess = options.success;
                var oldError = options.error;
                options.success = function fetchMoreSuccess(models) {
                    // restore callbacks
                    options.success = oldSuccess;
                    options.error = oldError;
                    // update models
                    if (models) {
                        // add models to collection, if any
                        if (models.length <= 0) {
                            // reached the end
                            delete options.more;
                        }
                        else {
                            // read additional data
                            if (options.syncContext.compareFn) {
                                // notice, existing range of models is sorted by definition already
                                options.at = options.syncContext.insertionPoint(models[0], collection.models);
                            }
                            models = collection.add(models, options) || models;
                            // adjust query parameter
                            getQuery.limit = collection.models.length;
                            if (options.syncContext.getQuery.limit > getQuery.limit) {
                                // reached the end
                                delete options.more;
                            }
                            else {
                                // more data to load
                                options.more = true;
                                delete options.end;
                            }
                        }
                        // reached the end?
                        if (!options.more) {
                            getQuery.limit = undefined; // open end
                            options.end = true;
                        }
                    }
                    // restore query parameter
                    options.syncContext.getQuery = getQuery;
                    // call user success callback
                    if (options.success) {
                        models = options.success.call(this, collection, models, options) || models;
                    }
                    if (options.finish) {
                        models = options.finish.call(this, collection, models, options) || models;
                    }
                    return models;
                };
                options.error = function fetchMoreError(error) {
                    // restore callbacks
                    options.success = oldSuccess;
                    options.error = oldError;
                    // restore query parameter
                    options.syncContext.getQuery = getQuery;
                    // call user error callback
                    if (options.error) {
                        error = options.error.call(this, collection, error, options) || error;
                    }
                    if (options.finish) {
                        error = options.finish.call(this, collection, error, options) || error;
                    }
                    return error;
                };
                // fire up the page load
                this.getQuery = new LiveData.GetQuery(getQuery);
                this.getQuery.limit = getQuery.limit + options.limit;
                return collection.sync(options.method || 'read', collection, options);
            };
            /**
             * reads a page of data into the collection.
             *
             * When async processing is done, a next/prev attribute is set on the options object in case additional pages might
             * be available which can be loaded by calling this method again.
             *
             * @param {object} collection to load data into.
             * @param {object} options incl. offset and limit of page to retrieve.
             * @return {Promise} promise of the load operation.
             */
            SyncContext.prototype.fetchRange = function (collection, options) {
                // this must be set in options to state we handle it
                options = options || {};
                options.syncContext = this;
                // prepare a query for the page of data to load
                var oldQuery = this.getQuery;
                var newQuery = new LiveData.GetQuery(oldQuery);
                if (options.offset >= 0) {
                    newQuery.offset = options.offset;
                }
                else if (options.offset < 0) {
                    newQuery.offset = undefined;
                }
                var oldLimit = options.limit;
                if (options.limit > 0) {
                    newQuery.limit = options.limit + 1;
                    options.limit = newQuery.limit;
                }
                else if (options.limit <= 0) {
                    newQuery.limit = undefined;
                }
                // setup callbacks handling processing of results, do not use promises as these execute too late...
                // Notice, since we call collection.sync() directly, the signature of success/error callbacks here is ajax-style.
                // However, the user-provided callbacks are to being called backbone.js-style with collection and object.
                var oldSuccess = options.success;
                var oldError = options.error;
                options.success = function fetchRangeSuccess(models) {
                    // restore callbacks and limit
                    options.success = oldSuccess;
                    options.error = oldError;
                    if (oldLimit !== undefined) {
                        options.limit = oldLimit;
                    }
                    // update models
                    if (models) {
                        // add models to collection, if any
                        if (models.length > 0) {
                            // adjust query parameter
                            options.next = newQuery.limit && models.length >= newQuery.limit;
                            if (options.next) {
                                // trick here was to read one more item to see if there is more to come
                                models.length = models.length - 1;
                            }
                            // realize the page
                            models = collection.reset(models, options) || models;
                        }
                        else {
                            // reached the end
                            delete options.next;
                        }
                        options.prev = newQuery.offset > 0;
                    }
                    // call user success callback
                    if (options.success) {
                        models = options.success.call(this, collection, models, options) || models;
                    }
                    if (options.finish) {
                        models = options.finish.call(this, collection, models, options) || models;
                    }
                    return models;
                };
                options.error = function fetchMoreError(error) {
                    // restore callbacks and limit
                    options.success = oldSuccess;
                    options.error = oldError;
                    if (oldLimit !== undefined) {
                        options.limit = oldLimit;
                    }
                    // restore query parameter
                    options.syncContext.getQuery = oldQuery;
                    // call user error callback
                    if (options.error) {
                        error = options.error.call(this, collection, error, options) || error;
                    }
                    if (options.finish) {
                        error = options.finish.call(this, collection, error, options) || error;
                    }
                    return error;
                };
                // fire up the page load
                this.getQuery = newQuery;
                return collection.sync(options.method || 'read', collection, options);
            };
            /**
             * reads the next page of data into the collection.
             *
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see Collection#fetchNext()
             */
            SyncContext.prototype.fetchNext = function (collection, options) {
                options = options || {};
                options.limit = options.pageSize || this.pageSize || this.getQuery.limit;
                options.offset = (this.getQuery.offset | 0) + collection.models.length;
                return this.fetchRange(collection, options);
            };
            /**
             * reads the previous page of data into the collection.
             *
             * @param {object} options such as pageSize to retrieve.
             * @return {Promise} promise of the load operation.
             *
             * @see Collection#fetchPrev()
             */
            SyncContext.prototype.fetchPrev = function (collection, options) {
                options = options || {};
                options.limit = options.pageSize || this.pageSize || this.getQuery.limit;
                options.offset = (this.getQuery.offset | 0) - options.limit;
                return this.fetchRange(collection, options);
            };
            SyncContext.prototype.filterAttributes = function (attrs, options) {
                return this.filterFn ? attrs.filter(this.filterFn) : attrs;
            };
            SyncContext.prototype.sortAttributes = function (attrs, options) {
                return this.compareFn ? attrs.sort(this.compareFn) : attrs;
            };
            SyncContext.prototype.rangeAttributes = function (attrs, options) {
                var offset = options && options.offset || this.getQuery.offset;
                if (offset > 0) {
                    attrs.splice(0, offset);
                }
                var limit = options && options.limit || this.getQuery.limit;
                if (limit < attrs.length) {
                    attrs.length = limit;
                }
                return attrs;
            };
            SyncContext.prototype.processAttributes = function (attrs, options) {
                attrs = this.filterAttributes(attrs, options);
                attrs = this.sortAttributes(attrs, options);
                attrs = this.rangeAttributes(attrs, options);
                return attrs;
            };
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
                var newId = collection.modelId(msg.data); // modelId(attrs) missing in DefinitelyTyped definitions
                var oldId = msg.id || newId;
                if (oldId === 'all') {
                    collection.reset(msg.data || {}, options);
                    return;
                }
                // update the collection
                var model = oldId && collection.get(oldId);
                switch (msg.method) {
                    case 'create':
                    case 'update':
                        if (newId !== oldId) {
                            Relution.LiveData.Debug.warn('updating id ' + oldId + ' to ' + newId);
                        }
                        if (!model) {
                            // create model in case it does not exist
                            model = new options.collection.model(msg.data, options);
                            if (this.filterFn && !this.filterFn(model.attributes)) {
                                break; // filtered
                            }
                            if (model.validationError) {
                                collection.trigger('invalid', this, model.validationError, options);
                            }
                            else {
                                var index = collection.models.length;
                                if (this.compareFn && index > 0) {
                                    options.at = index = this.insertionPoint(model.attributes, collection.models);
                                }
                                // look at index and respect offset/limit eventually ignoring model or removing some,
                                // the not operators below cause proper handling when offset or limit is undefined...
                                /* jshint -W018 */
                                if ((!(this.getQuery.offset > 0) || index > 0) && !(index >= this.getQuery.limit)) {
                                    /* jshint +W018 */
                                    collection.add(model, options);
                                    if (this.getQuery.limit && collection.models.length > this.getQuery.limit) {
                                        collection.remove(collection.models[collection.models.length - 1], options);
                                    }
                                }
                            }
                            break;
                        }
                    /* falls through */
                    case 'patch':
                        if (model) {
                            // update model unless it is filtered
                            model.set(msg.data, options);
                            if (this.filterFn && !this.filterFn(model.attributes)) {
                                // eventually the model is filtered
                                collection.remove(model, options);
                            }
                            else if (this.compareFn) {
                                // eventually the model changes position in collection.models
                                var oldIndex = collection.models.indexOf(model);
                                this.lastInsertionPoint = oldIndex >= 0 ? oldIndex : undefined;
                                var newIndex = this.insertionPoint(model.attributes, collection.models);
                                if (oldIndex !== newIndex) {
                                    // following acts just like backbone.Collection.sort()
                                    collection.models.splice(oldIndex, 1);
                                    collection.models.splice(newIndex, 0, model);
                                    collection.trigger('sort', collection, options);
                                }
                            }
                        }
                        break;
                    case 'delete':
                        if (model) {
                            // remove model
                            collection.remove(model, options);
                        }
                        break;
                }
            };
            /**
             * computes the insertion point of attributes into models sorted by compareFn.
             *
             * This is used to compute the at-index of backbone.js add() method options when adding models to a sorted collection.
             *
             * @param attributes being inserted.
             * @param models sorted by compareFn.
             * @return {number} insertion point.
             */
            SyncContext.prototype.insertionPoint = function (attributes, models) {
                if (this.lastInsertionPoint !== undefined) {
                    // following performs two comparisons at the last insertion point to take advantage of locality,
                    // this means we don't subdivide evenly but check tiny interval at insertion position firstly...
                    var start = Math.max(0, this.lastInsertionPoint);
                    var end = Math.min(models.length, this.lastInsertionPoint + 3);
                    if (end - start > 1) {
                        // focus on (start;end] range speeding up binary searches by taking locality into account
                        var point = this.insertionPointBinarySearch(attributes, models, start, end);
                        if (point >= end) {
                            // select upper interval
                            if (point < models.length) {
                                point = this.insertionPointBinarySearch(attributes, models, point, models.length);
                            }
                        }
                        else if (point < start) {
                            // select lower interval
                            if (point > 0) {
                                point = this.insertionPointBinarySearch(attributes, models, 0, point);
                            }
                        }
                        this.lastInsertionPoint = point;
                        return point;
                    }
                }
                // locality not applicable or did not work
                this.lastInsertionPoint = this.insertionPointBinarySearch(attributes, models, 0, models.length);
                return this.lastInsertionPoint;
            };
            /**
             * performs a binary search for insertion point of attributes into models[start:end] sorted by compareFn.
             *
             * @param attributes being inserted.
             * @param models sorted by compareFn.
             * @param compare function as of Array.sort().
             * @param start inclusive index of search interval.
             * @param end exclusive index of search interval.
             * @return {number} insertion point.
             */
            SyncContext.prototype.insertionPointBinarySearch = function (attributes, models, start, end) {
                var pivot = (start + end) >> 1;
                var delta = this.compareFn(attributes, models[pivot].attributes);
                if (end - start <= 1) {
                    return delta < 0 ? pivot : pivot + 1;
                }
                else if (delta < 0) {
                    // select lower half
                    return this.insertionPointBinarySearch(attributes, models, start, pivot);
                }
                else if (delta > 0) {
                    // select upper half
                    if (++pivot < end) {
                        return this.insertionPointBinarySearch(attributes, models, pivot, end);
                    }
                }
                else {
                    // exact match
                    return pivot;
                }
            };
            return SyncContext;
        }());
        LiveData.SyncContext = SyncContext;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SyncContext.js.map