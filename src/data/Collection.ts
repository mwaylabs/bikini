// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt
/* jshint indent: 4 */
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/// <reference path="../core/livedata.d.ts" />
/// <reference path="../utility/Debug.ts" />
/// <reference path="stores/Store.ts" />
/// <reference path="Model.ts" />
/// <reference path="stores/SyncContext.ts" />

module Relution.LiveData {

  interface CollectionSortOptions extends Backbone.Silenceable {
    sort?: any
  }

  /**
   * The Relution.LiveData.Collection can be used like a Backbone Collection,
   *
   * but there are some enhancements to fetch, save and delete the
   * contained models from or to other "data stores".
   *
   * see LocalStorageStore, WebSqlStore or SyncStore for examples
   *
   * @module Relution.LiveData.Collection
   *
   * @type {*}
   * @extends Backbone.Collection
   *
   */
  export class Collection extends Backbone.Collection {

    public _type;
    public isCollection;
    public model;
    public entity;
    public options;

    public store: Store;
    public syncContext: SyncContext;
    public credentials: any;

    public endpoint: any;
    public channel: string;

    public static extend = Backbone.Collection.extend;
    public static create = Relution.LiveData.create;
    public static design = Relution.LiveData.design;

    public constructor(models?: any, options?: any) {
      super(models, options);

      if (this.url && this.url.charAt(this.url.length - 1) !== '/') {
        this.url += '/';
      }

      this.init(options);
    }

    protected init(models?: any, options?: any) {
      options = options || {};
      this.store = options.store || this.store || (this.model ? this.model.prototype.store : null);
      this.entity = options.entity || this.entity || (this.model ? this.model.prototype.entity : null);
      this.options = options.options || this.options;

      var entity = this.entity || this.entityFromUrl(this.url);
      if (entity) {
        this.entity = Relution.LiveData.Entity.from(entity, {model: this.model, typeMapping: options.typeMapping});
      }
      this._updateUrl();

      if (this.store && _.isFunction(this.store.initCollection)) {
        this.store.initCollection(this, options);
      }
    }

    public ajax(options: any) {
      return Relution.LiveData.ajax.apply(this, arguments);
    }
    public sync(method: string, model: Backbone.ModelBase, options?: any) {
      return Relution.LiveData.sync.apply(this, arguments);
    }

    public entityFromUrl(url) {
      if (url) {
        var location = document.createElement('a');
        location.href = url || this.url;
        // IE doesn't populate all link properties when setting .href with a relative URL,
        // however .href will return an absolute URL which then can be used on itself
        // to populate these additional fields.
        if (location.host === '') {
          location.href = location.href;
        }

        // extract last path part as entity name
        var parts = location.pathname.match(/([^\/]+)\/?$/);
        if (parts && parts.length > 1) {
          return parts[-1];
        }
      }
    }

    public sort(options?: CollectionSortOptions) {
      if (_.isObject(options && options.sort)) {
        this.comparator = Relution.LiveData.DataSelector.compileSort(options.sort);
      }
      return super.sort.apply(this, arguments);
    }

    public select(options) {
      var selector = options && options.query ? Relution.LiveData.DataSelector.create(options.query) : null;
      var collection = Collection.create(null, {model: this.model});

      if (options && options.sort) {
        collection.comparator = Relution.LiveData.DataSelector.compileSort(options.sort);
      }

      this.each(function (model) {
        if (!selector || selector.matches(model.attributes)) {
          collection.add(model);
        }
      });
      return collection;
    }

    public destroy(options) {
      options = options || {};
      var success = options.success;
      if (this.length > 0) {
        options.success = function () {
          if (this.length === 0 && success) {
            success();
          }
        };
        var model;
        while ((model = this.first())) {
          this.sync('delete', model, options);
          this.remove(model);
        }
      } else if (success) {
        success();
      }
    }

    public destroyLocal() {
      var store = this.endpoint.localStore;
      var that = this;
      // DROP TABLE
      if (this.entity.name) {
        store.drop(this.entity.name);
      }
      // RESET localStorage-entry
      localStorage.setItem('__' + this.channel + 'last_msg_time', '');
      this.store.endpoints = {};
      return this.reset();
    }

    /**
     * save all containing models
     */
    public save() {
      this.each(function (model) {
        model.save();
      });
    }

    public applyFilter(callback) {
      this.trigger('filter', this.filter(callback));
    }

    public getUrlParams(url?: string): any {
      url = url || this.getUrl();
      var m = url.match(/\?([^#]*)/);
      var params = {};
      if (m && m.length > 1) {
        _.each(m[1].split('&'), function (p) {
          var a = p.split('=');
          params[a[0]] = a[1];
        });
      }
      return params;
    }

    public getUrl(): string {
      return (_.isFunction(this.url) ? this.url() : this.url) || '';
    }

    public getUrlRoot(): string {
      var url = this.getUrl();
      return url.indexOf('?') >= 0 ? url.substr(0, url.indexOf('?')) : url;
    }

    private  _updateUrl() {
      if (this.options) {
        var params = this.getUrlParams();
        this.url = this.getUrlRoot();

        if (this.options.query) {
          params.query = encodeURIComponent(JSON.stringify(this.options.query));
        }
        if (this.options.fields) {
          params.fields = encodeURIComponent(JSON.stringify(this.options.fields));
        }
        if (this.options.sort) {
          params.sort = encodeURIComponent(JSON.stringify(this.options.sort));
        }

        if (!_.isEmpty(params)) {
          this.url += '?';
          var a = [];
          for (var k in params) {
            a.push(k + (params[k] ? '=' + params[k] : ''));
          }
          this.url += a.join('&');
        }
      }
    }

    /**
     * reads an additional page of data into this collection.
     *
     * A fetch() must have been performed loading the initial set of data. This method is intended for infinite scrolling
     * implementation.
     *
     * When async processing is done, a more attribute is set on the options object in case additional data might be
     * available which can be loaded by calling this method again. Likewise an end attribute is set if the data is
     * fully loaded.
     *
     * @param {object} options such as pageSize to retrieve.
     * @return {Promise} promise of the load operation.
     *
     * @see SyncContext#fetchMore()
     */
    public fetchMore(options) {
      if (!this.syncContext) {
        return Q.reject(new Error('no context'));
      }

      return this.syncContext.fetchMore(this, options);
    }

    /**
     * reads the next page of data into this collection.
     *
     * A fetch() must have been performed loading the initial set of data. This method is intended for paging
     * implementation.
     *
     * When async processing is done, a next/prev attribute is set on the options object in case additional pages might be
     * available which can be loaded by calling the corresponding method.
     *
     * @param {object} options such as pageSize to retrieve.
     * @return {Promise} promise of the load operation.
     *
     * @see SyncContext#fetchNext()
     */
    public fetchNext(options) {
      if (!this.syncContext) {
        return Q.reject(new Error('no context'));
      }

      return this.syncContext.fetchNext(this, options);
    }

    /**
     * reads the previous page of data into this collection.
     *
     * A fetch() must have been performed loading the initial set of data. This method is intended for paging
     * implementation.
     *
     * When async processing is done, a next/prev attribute is set on the options object in case additional pages might be
     * available which can be loaded by calling the corresponding method.
     *
     * @param {object} options such as pageSize to retrieve.
     * @return {Promise} promise of the load operation.
     *
     * @see SyncContext#fetchPrev()
     */
    public fetchPrev(options) {
      if (!this.syncContext) {
        return Q.reject(new Error('no context'));
      }

      return this.syncContext.fetchPrev(this, options);
    }

  }

  _.extend(Collection.prototype, _Object, {
    _type: 'Relution.LiveData.Collection',
    isCollection: true,
    model: Model
  });

}
