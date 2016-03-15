// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt
/* jshint indent: 4 */
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/// <reference path="../core/livedata.d.ts" />
/// <reference path="../utility/Debug.ts" />
/// <reference path="stores/Store.ts" />
/// <reference path="Collection.ts" />

module Relution.LiveData {

  /**
   * @module Relution.LiveData.Model
   *
   * @type {*}
   * @extends Backbone.Model
   */
  export class Model extends Backbone.Model {

    public _type = 'Relution.LiveData.Model';
    public isModel = true;
    public entity;
    public defaults = {};
    public changedSinceSync = {};

    public collection: Collection;
    public store: Store;
    public credentials: any;

    public endpoint: any;

    public static extend = Backbone.Model.extend;
    public static create = Relution.LiveData.create;
    public static design = Relution.LiveData.design;

    public constructor(attributes?: any, options?: any) {
      super(attributes, options);

      if (this.urlRoot && typeof this.urlRoot === 'string') {
        if (this.urlRoot.charAt(this.urlRoot.length - 1) !== '/') {
          this.urlRoot += '/';
        }
      }

      this.init(attributes, options);
    }

    protected init(attributes?: any, options?: any) {
      options = options || {};

      this.collection = options.collection || this.collection;
      this.idAttribute = options.idAttribute || this.idAttribute;
      this.store = this.store || (this.collection ? this.collection.store : null) || options.store;
      if (this.store && _.isFunction(this.store.initModel)) {
        this.store.initModel(this, options);
      }
      this.entity = this.entity || (this.collection ? this.collection.entity : null) || options.entity;
      if (this.entity) {
        this.entity = Relution.LiveData.Entity.from(this.entity, {
          model: this.constructor,
          typeMapping: options.typeMapping
        });
        this.idAttribute = this.entity.idAttribute || this.idAttribute;
      }
      this.credentials = this.credentials || (this.collection ? this.collection.credentials : null) || options.credentials;
      this.on('change', this.onChange, this);
      this.on('sync', this.onSync, this);
    }

    public ajax(options: any) {
      return Relution.LiveData.ajax.apply(this, arguments);
    }
    public sync(method: string, model: Backbone.ModelBase, options?: any) {
      return Relution.LiveData.sync.apply(this, arguments);
    }

    public onChange(model, options) {
      // For each `set` attribute, update or delete the current value.
      var attrs = model.changedAttributes();
      if (_.isObject(attrs)) {
        for (var key in attrs) {
          this.changedSinceSync[key] = attrs[key];
        }
      }
    }

    public onSync(model, options) {
      this.changedSinceSync = {};
    }

    public getUrlRoot(): string {
      if (this.urlRoot) {
        return _.isFunction(this.urlRoot) ? this.urlRoot() : this.urlRoot;
      } else if (this.collection) {
        return this.collection.getUrlRoot();
      } else if (this.url) {
        var url = _.isFunction(this.url) ? this.url() : this.url;
        if (url && this.id && url.indexOf(this.id) > 0) {
          return url.substr(0, url.indexOf(this.id));
        }
        return url;
      }
    }

  }

  _.extend(Model.prototype, _Object, {
    _type: 'Relution.LiveData.Model',
    isModel: true
  });

}
