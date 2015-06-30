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

module Relution.LiveData {

  /**
   * receives change messages and updates collections.
   */
  export class SyncContext {

    /**
     * relevant parameters for paging, filtering and sorting.
     *
     * @type {Relution.LiveData.GetQuery}
     */
    private getQuery:GetQuery = new GetQuery();

    /**
     * limit of getQuery captured at construction time.
     */
    private pageSize:number;

    /**
     * used to speed up insertion point when doing consecutive insertions into sorted ranges.
     */
    private lastInsertionPoint:number;

    /**
     * when set, defines sorting of collection.
     */
    private compareFn:JsonCompareFn<any>;

    /**
     * when set, defines filtering of collection.
     */
    private filterFn:JsonFilterFn<any>;

    /**
     * captures option values forming a GetQuery.
     *
     * @param options to merge.
     * @constructor
     */
    public constructor(...options:{}[]) {
      // merge options forming a GetQuery
      options.forEach((json) => {
        if(json) {
          this.getQuery.merge(new GetQuery().fromJSON(json));
        }
      });
      this.getQuery.optimize();

      // compute local members
      this.pageSize = this.getQuery.limit;
      this.compareFn = this.getQuery.sortOrder && jsonCompare(this.getQuery.sortOrder);
      this.filterFn = this.getQuery.filter && jsonFilter(this.getQuery.filter);
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
    public fetchMore(collection, options) {
      // this must be set in options to state we handle it
      options = options || {};
      options.syncContext = this;

      // prepare a query for the next page of data to load
      var oldQuery = this.getQuery;
      var newQuery = new GetQuery(oldQuery);
      newQuery.offset = (newQuery.offset|0) + collection.models.length;
      newQuery.limit = options.pageSize || this.pageSize || newQuery.limit;

      // setup callbacks handling processing of results,
      // do not use promises as these execute too late...
      var oldSuccess = options.success;
      var oldError = options.error;
      options.success = function fetchMoreSuccess(collection, models, options) {
        // restore callbacks
        options.success = oldSuccess;
        options.error = oldError;

        // update models
        if (models) {
          if (options.syncContext.filterFn) {
            // filtering for safety, can be avoided once all stores support filtering
            models = models.filter(function(x) {
              return options.syncContext.filterFn(x.attributes);
            });
          }
          if (models.length > 0) {
            // read additional data
            if (options.syncContext.compareFn) {
              // sorting for safety, can be avoided once all stores support sorting
              models = models.sort(function(a, b) {
                return options.syncContext.compareFn(a.attributes, b.attributes);
              });
              // notice, existing range of models is sorted by definition already
              options.at = options.syncContext.insertionPoint(models[0].attributes, collection.models);
            }
            models = collection.add(models, options) || models;

            // adjust query parameter
            oldQuery.limit = collection.models.length;
            options.more = true;
          } else {
            // reached the end
            oldQuery.limit = undefined; // open end
            options.end = true;
          }
        }

        // restore query parameter
        options.syncContext.getQuery = oldQuery;

        // call user success callback
        if (options.success) {
          models = options.success.apply(this, arguments) || models;
        }
        return models;
      };
      options.error = function fetchMoreError(collection, error, options) {
        // restore callbacks
        options.success = oldSuccess;
        options.error = oldError;

        // restore query parameter
        options.syncContext.getQuery = oldQuery;

        // call user error callback
        if (options.error) {
          error = options.error.apply(this, arguments) || error;
        }
        return error;
      };

      // fire up the page load
      this.getQuery = newQuery;
      return collection.sync(options.method || 'read', collection, options);
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
    public onMessage(store:Store, collection, msg) {
      var options:any = {
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

      // update the collection
      var model = id && collection.get(id);
      switch (msg.method) {
        case 'create':
        case 'update':
          if (!model) {
            // create model in case it does not exist
            model = new options.collection.model(msg.data, options);
            if (this.filterFn && !this.filterFn(model.attributes)) {
              break; // filtered
            }
            if (model.validationError) {
              collection.trigger('invalid', this, model.validationError, options);
            } else {
              var index = collection.models.length;
              if (this.compareFn && index > 0) {
                options.at = index = this.insertionPoint(model.attributes, collection.models);
              }
              // TODO: look at index and respect offset/limit eventually ignoring model or removing some
              collection.add(model, options);
            }
            break;
          }
        /* falls through */
        case 'patch':
          if (model) {
            // update model unless it is filtered
            model.set(msg.data, options);
            if (this.filterFn && !this.filterFn(model.attributes)) {
              collection.remove(model, options);
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
    }

    /**
     * computes the insertion point of attributes into models sorted by compareFn.
     *
     * This is used to compute the at-index of backbone.js add() method options when adding models to a sorted collection.
     *
     * @param attributes being inserted.
     * @param models sorted by compareFn.
     * @return {number} insertion point.
     */
    private insertionPoint(attributes, models):number {
      if (this.lastInsertionPoint !== undefined) {
        // following performs two comparisons at the last insertion point to take advantage of locality,
        // this means we don't subdivide evenly but check tiny interval at insertion position firstly...
        var start = Math.max(0, this.lastInsertionPoint);
        var end = Math.min(models.length, this.lastInsertionPoint + 3);
        if (end - start > 1) {
          // focus on (start;end] range speeding up binary searches by taking locality into account
          var point = this.insertionPointBinarySearch(attributes, models, start, end);
          if(point >= end) {
            // select upper interval
            if (point < models.length) {
              point = this.insertionPointBinarySearch(attributes, models, point, models.length);
            }
          } else if(point < start) {
            // select lower interval
            if (point >= 0) {
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
    }

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
    private insertionPointBinarySearch(attributes, models, start, end):number {
      var pivot = (start + end) >> 1;
      var delta = this.compareFn(attributes, models[pivot].attributes);
      if (end - start <= 1) {
        return delta < 0 ? pivot : pivot + 1;
      } else if (delta < 0) {
        // select lower half
        return this.insertionPointBinarySearch(attributes, models, start, pivot);
      } else if (delta > 0) {
        // select upper half
        return this.insertionPointBinarySearch(attributes, models, pivot, end);
      } else {
        // exact match
        return pivot;
      }
    }
  }

}
