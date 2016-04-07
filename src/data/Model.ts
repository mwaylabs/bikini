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
   * constructor function of Model.
   */
  export interface ModelCtor {
    /**
     * @see Model#constructor
     */
    new(attributes?: any, options?: any): Model;
  }

  /**
   * tests whether a given object is a Model.
   *
   * @param {object} object to check.
   * @return {boolean} whether object is a Model.
   */
  export function isModel(object): object is Model {
    if (typeof object !== 'object') {
      return false;
    } else if ('isModel' in object) {
      Relution.assert(() => object.isModel === Model.prototype.isPrototypeOf(object));
      return object.isModel;
    } else {
      return Model.prototype.isPrototypeOf(object);
    }
  }

  /**
   * @module Relution.LiveData.Model
   *
   * @type {*}
   * @extends Backbone.Model
   */
  export class Model/*<AttributesType extends Object>*/ extends Backbone.Model {

    public _type: string;         // constant 'Relution.LiveData.Model' on prototype
    public isModel: boolean;      // constant true on prototype
    public isCollection: boolean; // constant false on prototype

    public entity: string;
    public defaults = {};
    public changedSinceSync = {};

    public collection: Collection;
    public store: Store;
    public credentials: any;

    public endpoint: SyncEndpoint;

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

  // mixins
  let model = _.extend(Model.prototype, _Object, {
    _type: 'Relution.LiveData.Model',
    isModel: true,
    isCollection: false
  });
  Relution.assert(() => isModel(model));

}
