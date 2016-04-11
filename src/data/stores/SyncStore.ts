/**
 * SyncStore.ts
 *
 * Created by Thomas Beckmann on 24.06.2015
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
/// <reference path="../../core/livedata.d.ts" />
/// <reference path="Store.ts" />
/// <reference path="WebSqlStore.ts" />
/// <reference path="CipherSqlStore.ts" />
/// <reference path="SyncContext.ts" />
/// <reference path="SyncEndpoint.ts" />
/// <reference path="LiveDataMessage.ts" />
/// <reference path="../../utility/Debug.ts" />
/// <reference path="../Model.ts" />
/// <reference path="../Collection.ts" />

module Relution.LiveData {

  /**
   * The Relution.LiveData.SyncStore is used to connect a model collection to an
   * Relution server.
   *
   * This will give you an online and offline store with live data updates.
   *
   * @module Relution.LiveData.SyncStore
   *
   * @type {*}
   * @extends Relution.LiveData.Store
   *
   * @example
   *
   * // The default configuration will save the complete model data as a json,
   * // and the offline change log to a local WebSql database, synchronize it
   * // trough REST calls with the server and receive live updates via a socket.io connection.
   *
   * var MyCollection = Relution.LiveData.Collection.extend({
   *      model: MyModel,
   *      url: 'http://myServer.io/myOrga/myApplication/myCollection',
   *      store: new Relution.LiveData.SyncStore( {
   *          useLocalStore:   true, // (default) store the data for offline use
   *          useSocketNotify: true, // (default) register at the server for live updates
   *          useOfflineChanges: true // (default) allow changes to the offline data
   *      })
   * });
   */
  export class SyncStore extends Store {

    public endpoints: {
      // map of hashed urlRoot to SyncEndpoint
      [hash: string]: SyncEndpoint;
    } = {};

    private lastMesgTime: any;
    private isConnected: boolean = false;

    public messages: Collection;
    public messagesPromise: any/*Promise<Collection>*/;

    constructor(options?:any) {
      super(_.extend({
        localStore: WebSqlStore,
        useLocalStore: true,
        useSocketNotify: true,
        useOfflineChanges: true,
        socketPath: ''
      }, options));
      Relution.LiveData.Debug.trace('SyncStore', options);
      if (this.options.useSocketNotify && typeof io !== 'object') {
        Relution.LiveData.Debug.warning('Socket.IO not present !!');
        this.options.useSocketNotify = false;
      }
    }

    initEndpoint(modelOrCollection: Model | Collection, modelType: ModelCtor): SyncEndpoint {
      var urlRoot = modelOrCollection.getUrlRoot();
      var entity = modelOrCollection.entity;
      if (urlRoot && entity) {
        var name = entity;
        var credentials = modelOrCollection.credentials || this.options.credentials;
        var hash = URLUtil.hashLocation(urlRoot);

        // get or create endpoint for this url
        var endpoint = this.endpoints[hash];
        if (!endpoint) {
          Relution.LiveData.Debug.info('Relution.LiveData.SyncStore.initEndpoint: ' + name);
          var href = URLUtil.getLocation(urlRoot);
          endpoint = new SyncEndpoint({
            entity: entity,
            modelType: modelType,
            urlRoot: urlRoot,
            socketPath: this.options.socketPath,
            credentials: credentials
          });
          this.endpoints[hash] = endpoint;

          endpoint.localStore = this.createLocalStore(endpoint);
          endpoint.priority = this.options.orderOfflineChanges && (_.lastIndexOf(this.options.orderOfflineChanges, endpoint.entity) + 1);
          this.createMsgCollection();
          endpoint.socket = this.createSocket(endpoint, name);
          endpoint.info = this.fetchServerInfo(endpoint);
        }
        return endpoint;
      }
    }

    initModel(model: Model) {
      model.endpoint = this.initEndpoint(model, <ModelCtor>model.constructor);
    }

    initCollection(collection: Collection) {
      collection.endpoint = this.initEndpoint(collection, collection.model);
    }

    getEndpoint(url: string): SyncEndpoint {
      if (url) {
        var hash = URLUtil.hashLocation(url);
        return this.endpoints[hash];
      }
    }

    createLocalStore(endpoint: SyncEndpoint) {
      if (this.options.useLocalStore) {
        var entities = {};
        entities[endpoint.entity] = endpoint.channel;
        var storeOption = {
          entities: entities
        };
        if (this.options.localStoreOptions && typeof this.options.localStoreOptions === 'object') {
          storeOption = _.clone(this.options.localStoreOptions);
          storeOption.entities = entities;
        }
        return this.options.localStore.create(storeOption);
      }
    }

    /**
     * @description Here we save the changes in a Message local websql
     * @returns {*}
     */
    createMsgCollection() {
      if (this.options.useOfflineChanges && !this.messages) {
        this.messages = Collection.design({
          model: LiveDataMessageModel,
          store: this.options.localStore.create(this.options.localStoreOptions)
        });
      }
      return this.messages;
    }

    createSocket(endpoint: SyncEndpoint, name: string) {
      if (this.options.useSocketNotify && endpoint && endpoint.socketPath) {
        Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.createSocket: ' + name);

        var that = this;
        var url = endpoint.host;
        var path = endpoint.path;
        var href = URLUtil.getLocation(url);
        if (href.port === '') {
          if (href.protocol === 'https:') {
            url += ':443';
          } else if (href.protocol === 'http:') {
            url += ':80';
          }
        }

        path = endpoint.socketPath;
        // remove leading /
        var resource = (path && path.indexOf('/') === 0) ? path.substr(1) : path;
        var connectVo:any = {
          resource: resource
        };

        if (this.options.socketQuery) {
          connectVo.query = this.options.socketQuery;
        }
        endpoint.socket = io.connect(url, connectVo);
        endpoint.socket.on('connect', function () {
          that._bindChannel(endpoint, name);
          return that.onConnect(endpoint).done();
        });
        endpoint.socket.on('disconnect', function () {
          Relution.LiveData.Debug.info('socket.io: disconnect');
          return that.onDisconnect(endpoint).done();
        });
        endpoint.socket.on(endpoint.channel, function (msg: LiveDataMessage) {
          return that.onMessage(endpoint, that._fixMessage(endpoint, msg));
        });
        return endpoint.socket;
      }
    }

    _bindChannel(endpoint: SyncEndpoint, name) {
      var that = this;
      if (endpoint && endpoint.socket) {
        Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore._bindChannel: ' + name);

        var channel = endpoint.channel;
        var socket = endpoint.socket;
        var time = this.getLastMessageTime(channel);
        name = name || endpoint.entity;
        socket.emit('bind', {
          entity: name,
          channel: channel,
          time: time
        });
      }
    }

    getLastMessageTime(channel: string) {
      if (!this.lastMesgTime) {
        this.lastMesgTime = {};
      } else if (this.lastMesgTime[channel] !== undefined) {
        return this.lastMesgTime[channel];
      }
      // the | 0 below turns strings into numbers
      var time = localStorage.getItem('__' + channel + 'lastMesgTime') || 0;
      this.lastMesgTime[channel] = time;
      return time;
    }

    setLastMessageTime(channel: string, time) {
      if (!time || time > this.getLastMessageTime(channel)) {
        localStorage.setItem('__' + channel + 'lastMesgTime', time);
        this.lastMesgTime[channel] = time;
      }
    }

    onConnect(endpoint: SyncEndpoint) {
      if (!endpoint.isConnected) {
        // when offline transmission is pending, need to wait for it to complete
        let q = Q.resolve();
        if (this.messagesPromise && this.messagesPromise.isPending()) {
          q = this.messagesPromise.catch((error) => Q.resolve());
        }

        // sync server/client changes
        endpoint.isConnected = q.then(() => {
          // next we'll fetch server-side changes
          return this.fetchChanges(endpoint).then(() => {
            // then send client-side changes
            if (!this.isConnected) {
              // restart replaying of offline messages
              this.messagesPromise = null;
              this.isConnected = true;
            }
            return this._sendMessages();
          }).catch((error) => {
            // catch without error indicates disconnection while going online
            if (!error) {
              // disconnected while sending offline changes
              return this.onDisconnect(endpoint);
            }
            return Q.reject(error);
          });
        }).finally(() => {
          // in the end, when connected still, fire an event informing client code
          if (endpoint.isConnected) {
            this.trigger('connect:' + endpoint.channel);
          }
        });
      }
      return endpoint.isConnected;
    }

    onDisconnect(endpoint: SyncEndpoint) {
      if (!endpoint.isConnected) {
        return Q.resolve();
      }
      endpoint.isConnected = null;
      this.isConnected = false;

      return Q.fcall(() => {
        if (endpoint.socket && endpoint.socket.socket) {
          endpoint.socket.socket.onDisconnect();
        }
      }).finally(() => {
        if (!endpoint.isConnected) {
          this.trigger('disconnect:' + endpoint.channel);
        }
      });
    }

    _fixMessage(endpoint: SyncEndpoint, msg: LiveDataMessage): LiveDataMessage {
      let idAttribute = endpoint.modelType.prototype.idAttribute;
      Relution.assert(() => !!idAttribute, 'no idAttribute!');

      if (msg.data && !msg.data[idAttribute] && msg.data._id) {
        msg.data[idAttribute] = msg.data._id; // server bug!
      } else if (!msg.data && msg.method === 'delete' && msg[idAttribute]) {
        msg.data = {};
        msg.data[idAttribute] = msg[idAttribute]; // server bug!
      }
      return msg;
    }

    onMessage(endpoint: SyncEndpoint, msg: LiveDataMessage) {
      // this is called by the store itself for a particular endpoint!
      var that = this;
      if (!msg || !msg.method) {
        return Q.reject('no message or method given');
      }

      var q;
      var channel = endpoint.channel;
      if (endpoint.localStore) {
        // first update the local store by forming a model and invoking sync
        var options = _.defaults({
          store: endpoint.localStore
        }, that.options);
        var model = new endpoint.modelType(msg.data, _.extend({
          parse: true
        }, options));
        if (!model.id) {
          // code below will persist with auto-assigned id but this nevertheless is a broken record
          Relution.LiveData.Debug.error('onMessage: ' + endpoint.entity + ' received data with no valid id performing ' + msg.method + '!');
        } else {
          Relution.LiveData.Debug.debug('onMessage: ' + endpoint.entity + ' ' + model.id + ' performing ' + msg.method);
        }
        q = endpoint.localStore.sync(msg.method, model, _.extend(options, {
          merge: msg.method === 'patch'
        })).then(function (result) {
          if (!msg.id || msg.id === model.id) {
            return result;
          }

          // id value was reassigned, delete record of old id
          var oldData = {};
          oldData[model.idAttribute] = msg.id;
          var oldModel = new endpoint.modelType(oldData, options);
          Relution.LiveData.Debug.debug('onMessage: ' + endpoint.entity + ' ' + model.id + ' reassigned from old record ' + oldModel.id);
          return endpoint.localStore.sync('delete', oldModel, options);
        });
      } else {
        // just update all collections listening
        q = Q.resolve(msg);
      }

      // finally set the message time
      return q.then(function () {
        if (msg.time) {
          that.setLastMessageTime(channel, msg.time);
        }

        // update all collections listening
        that.trigger('sync:' + channel, msg); // SyncContext.onMessage
        return msg;
      }, function (error) {
        // not setting message time in error case

        // report error as event on store
        that.trigger('error:' + channel, error, model);
        return msg;
      });
    }

    public sync(method: string, model: Model | Collection, options?) {
      Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.sync');
      options = options || {};
      try {
        var endpoint: SyncEndpoint = model.endpoint || this.getEndpoint(model.getUrlRoot() /*throws urlError*/);
        if (!endpoint) {
          throw new Error('no endpoint');
        }

        if (isCollection(model)) {
          // collections can be filtered, etc.
          if (method === 'read' && !options.barebone) {
            var syncContext: SyncContext = options.syncContext; // sync can be called by SyncContext itself when paging results
            if (!syncContext) {
              // capture GetQuery options
              syncContext = new SyncContext(
                options,        // dynamic options passed to fetch() implement UI filters, etc.
                model.options,  // static options on collection implement screen-specific stuff
                this.options    // static options of this store realize filtering client/server
              );
              options.syncContext = syncContext;
            }
            if (model.syncContext !== syncContext) {
              // assign a different instance
              if (model.syncContext) {
                model.stopListening(this, 'sync:' + endpoint.channel);
              }
              model.listenTo(this, 'sync:' + endpoint.channel, _.bind(syncContext.onMessage, syncContext, this, model));
              model.syncContext = syncContext;
            }
          }
        } else if (isModel(model)) {
          // offline capability requires IDs for data
          if (!model.id) {
            if (method === 'create') {
              model.set(model.idAttribute, new LiveData.ObjectID().toHexString());
            } else {
              var error = new Error('no (valid) id: ' + model.id);
              return Q.reject(this.handleError(options, error) || error);
            }
          }
        } else {
          // something is really at odds here...
          var error = new Error('target of sync is neither a model nor a collection!?!');
          return Q.reject(this.handleError(options, error) || error);
        }

        var channel = endpoint.channel;
        var time = this.getLastMessageTime(channel);
        // only send read messages if no other store can do this or for initial load
        if (method === 'read' && endpoint.localStore && time && !options.reset) {
          // read data from localStore and fetch changes remote
          var opts = _.clone(options);
          opts.store = endpoint.localStore;
          opts.entity = endpoint.entity;
          delete opts.success;
          delete opts.error;
          var that = this;
          return endpoint.localStore.sync(method, model, opts).then(function (resp) {
            // backbone success callback alters the collection now
            resp = that.handleSuccess(options, resp) || resp;
            if (endpoint.socket || options.fetchMode === 'local') {
              // no need to fetch changes as we got a websocket, that is either connected or attempts reconnection
              return resp;
            }

            // when we are disconnected, try to connect now
            if (!endpoint.isConnected) {
              var qInfo = that.fetchServerInfo(endpoint);
              if (!qInfo) {
                return resp;
              }

              return qInfo.then(function (info) {
                // trigger reconnection when disconnected
                var result;
                if (!endpoint.isConnected) {
                  result = that.onConnect(endpoint);
                }
                return result || info;
              }, function (xhr) {
                // trigger disconnection when disconnected
                var result;
                if (!xhr.responseText && endpoint.isConnected) {
                  result = that.onDisconnect(endpoint);
                }
                return result || resp;
              }).thenResolve(resp);
            }

            // load changes only (will happen AFTER success callback is invoked,
            // but returned promise will resolve only after changes were processed.
            return that.fetchChanges(endpoint).catch(function (xhr) {
              if (!xhr.responseText && endpoint.isConnected) {
                return that.onDisconnect(endpoint) || resp;
              }

              // can not do much about it...
              that.trigger('error:' + channel, xhr.responseJSON || xhr.responseText, model);
              return resp;
            }).thenResolve(resp); // caller expects original XHR response as changes body data is NOT compatible
          }, function () {
            // fall-back to loading full data set
            return that._addMessage(method, model, options, endpoint);
          });
        }

        // do backbone rest
        return this._addMessage(method, model, options, endpoint);
      } catch (error) {
        return Q.reject(this.handleError(options, error) || error);
      }
    }

    private _addMessage(method: string, model, options, endpoint: SyncEndpoint) {
      var that = this;
      if (method && model) {
        var changes = model.changedSinceSync;
        var data = null;
        var storeMsg = true;
        switch (method) {
          case 'update':
          case 'create':
            data = options.attrs || model.toJSON();
            break;

          case 'patch':
            if (_.isEmpty(changes)) {
              return;
            }
            data = model.toJSON({attrs: changes});
            break;

          case 'delete':
            break;

          default:
            Relution.assert (() => method === 'read', 'unknown method: ' + method);
            storeMsg = false;
            break;
        }
        let entity = model.entity || endpoint.entity;
        Relution.assert(() => model.entity === endpoint.entity);
        Relution.assert(() => entity.indexOf('~') < 0, 'entity name must not contain a ~ character!');
        var msg = {
          _id: entity + '~' + model.id,
          id: model.id,
          method: method,
          data: data,
          channel: endpoint.channel,
          priority: endpoint.priority
        };

        var q = Q.resolve(msg);
        var qMessage;
        if (storeMsg) {
          // store and potentially merge message
          qMessage = this.storeMessage(endpoint, q);
          q = qMessage.then(function (message) {
            // in case of merging, this result could be different
            return message.attributes;
          });
        }
        return q.then(function (msg) {
          // pass in qMessage so that deletion of stored message can be scheduled
          return that._emitMessage(endpoint, msg, options, model, qMessage);
        });
      }
    }

    private _emitMessage(endpoint: SyncEndpoint, msg: LiveDataMessage, options, model: Model | Collection, qMessage) {
      var that = this;
      var channel = endpoint.channel;
      var qAjax = this._ajaxMessage(endpoint, msg, options, model);
      var q = qAjax;

      if (qMessage) {
        // following takes care of offline change store
        q = q.then(function (data) {
          // success, remove message stored, if any
          return that.removeMessage(endpoint, msg, qMessage).then(data, function (error) {
            that.trigger('error:' + channel, error, model); // can not do much about it...
            return data;
          }).thenResolve(data); // resolve again yielding data
        }, function (xhr) {
          // failure eventually caught by offline changes
          if (!xhr) {
            // this seams to be only a connection problem, so we keep the message and call success
            return Q.resolve(msg.data);
          } else {
            // remove message stored and keep rejection as is
            return that.removeMessage(endpoint, msg, qMessage).then(xhr, function (error) {
              that.trigger('error:' + channel, error, model); // can not do much about it...
              return xhr;
            }).thenResolve(Q.reject.apply(Q, arguments));
          }
        });
      }

      q = this._applyResponse(q, endpoint, msg, options, model);

      return q.finally(function () {
        // do some connection handling
        return qAjax.then(function () {
          // trigger reconnection when disconnected
          if (!endpoint.isConnected) {
            return that.onConnect(endpoint);
          }
        }, function (xhr) {
          // trigger disconnection when disconnected
          if (!xhr && endpoint.isConnected) {
            return that.onDisconnect(endpoint);
          }
        });
      });
    }

    private _ajaxMessage(endpoint: SyncEndpoint, msg: LiveDataMessage, options, model: Model | Collection) {
      options = options || {};

      var url = options.url;
      if (!url) {
        url = endpoint.urlRoot;
        if (msg.id && msg.method !== 'create') {
          // add ID of model
          url += (url.charAt(url.length - 1) === '/' ? '' : '/' ) + msg.id;
        }
        if (msg.method === 'read' && isCollection(model)) {
          // add query of collection
          var collectionUrl = _.isFunction(model.url) ? model.url() : model.url;
          var queryIndex = collectionUrl.lastIndexOf('?');
          var getQuery = new GetQuery().fromJSON(options);
          // currently only sortOrder can be supported as we require the initial data load to yield full dataset
          getQuery.limit = null;
          getQuery.offset = null;
          getQuery.filter = null;
          getQuery.fields = null;
          var getParams = getQuery.toQueryParams();
          if (queryIndex >= 0) {
            url += collectionUrl.substr(queryIndex);
            if (getParams) {
              url += '&' + getParams;
            }
          } else {
            if (getParams) {
              url += '?' + getParams;
            }
          }
        }
      }

      Relution.LiveData.Debug.trace('ajaxMessage ' + msg.method + ' ' + url);
      var opts:any = {
        // must not take arbitrary options as these won't be replayed on reconnect
        url: url,
        attrs: msg.data,
        store: {},
        credentials: options.credentials,
        // error propagation
        error: options.error
      };
      delete options.xhr; // make sure not to use old value
      let that = this;
      return model.sync(msg.method, model, opts).then(function (data) {
        options.xhr = opts.xhr.xhr || opts.xhr;
        return data;
      }, function (xhr) {
        options.xhr = opts.xhr.xhr || opts.xhr;
        if (!xhr.responseText && that.options.useOfflineChanges) {
          // this seams to be a connection problem
          return Q.reject();
        }
        return Q.isPromise(xhr) ? xhr : Q.reject(xhr);
      });
    }

    private _applyResponse(qXHR, endpoint: SyncEndpoint, msg: LiveDataMessage, options, model) {
      var channel = endpoint.channel;
      var that = this;
      var clientTime = new Date().getTime();
      return qXHR.then(function (data) {
        // delete on server does not respond a body
        if (!data && msg.method === 'delete') {
          data = msg.data;
        }

        // update local store state
        if (data) {
          // no data if server asks not to alter state
          // that.setLastMessageTime(channel, msg.time);
          var promises = [];
          var dataIds;
          if (msg.method !== 'read') {
            promises.push(that.onMessage(endpoint, that._fixMessage(endpoint, data === msg.data ? msg : _.defaults({
              data: data // just accepts new data
            }, msg))));
          } else if (isCollection(model) && _.isArray(data)) {
            // synchronize the collection contents with the data read
            var syncIds = {};
            model.models.forEach(function (m) {
              syncIds[m.id] = m;
            });
            dataIds = {};
            data.forEach(function (d) {
              if (d) {
                var id = d[endpoint.modelType.prototype.idAttribute] || d._id;
                dataIds[id] = d;
                var m = syncIds[id];
                if (m) {
                  // update the item
                  delete syncIds[id]; // so that it is deleted below
                  if (!_.isEqual(_.pick.call(m, m.attributes, Object.keys(d)), d)) {
                    // above checked that all attributes in d are in m with equal values and found some mismatch
                    promises.push(that.onMessage(endpoint, that._fixMessage(endpoint, {
                      id: id,
                      method: 'update',
                      time: msg.time,
                      data: d
                    })));
                  }
                } else {
                  // create the item
                  promises.push(that.onMessage(endpoint, that._fixMessage(endpoint, {
                    id: id,
                    method: 'create',
                    time: msg.time,
                    data: d
                  })));
                }
              }
            });
            Object.keys(syncIds).forEach(function (id) {
              // delete the item
              var m = syncIds[id];
              promises.push(that.onMessage(endpoint, that._fixMessage(endpoint, {
                id: id,
                method: 'delete',
                time: msg.time,
                data: m.attributes
              })));
            });
          } else {
            // trigger an update to load the data read
            var array = _.isArray(data) ? data : [data];
            for (var i = 0; i < array.length; i++) {
              data = array[i];
              if (data) {
                promises.push(that.onMessage(endpoint, that._fixMessage(endpoint, {
                  id: data[endpoint.modelType.prototype.idAttribute] || data._id,
                  method: 'update',
                  time: msg.time,
                  data: data
                })));
              }
            }
          }
          return Q.all(promises).then(function () {
            // delayed till operations complete
            if (!dataIds) {
              return data;
            }

            // when collection was updated only pass data of models that were synced on to the success callback,
            // as the callback will set the models again causing our sorting and filtering to be without effect.
            var response = [];
            for (var i = model.models.length; i-- > 0;) {
              var m = model.models[i];
              if (dataIds[m.id]) {
                response.push(m.attributes);
                delete dataIds[m.id];
                if (dataIds.length <= 0) {
                  break;
                }
              }
            }
            return response.reverse();
          });
        }
      }).then(function (response) {
        if (msg.method === 'read' && isCollection(model)) {
          // TODO: extract Date header from options.xhr instead of using clientTime
          that.setLastMessageTime(endpoint.channel, clientTime);
        }
        // invoke success callback, if any
        return that.handleSuccess(options, response) || response;
      }, function (error) {
        // invoke error callback, if any
        return that.handleError(options, error) || Q.reject(error);
      });
    }

    private fetchChanges(endpoint: SyncEndpoint) {
      var that = this;
      var channel = endpoint.channel;
      if (!endpoint.urlRoot || !channel) {
        return Q.resolve();
      }

      var now = Date.now();
      var promise = endpoint.promiseFetchingChanges;
      if (promise) {
        if (promise.isPending() || now - endpoint.timestampFetchingChanges < 1000) {
          // reuse existing eventually completed request for changes
          Relution.LiveData.Debug.warning(channel + ' skipping changes request...');
          return promise;
        }
      }

      var time = that.getLastMessageTime(channel);
      if (!time) {
        Relution.LiveData.Debug.error(channel + ' can not fetch changes at this time!');
        return promise || Q.resolve();
      }

      // initiate a new request for changes
      Relution.LiveData.Debug.info(channel + ' initiating changes request...');
      var changes = new (<any>this.messages).constructor();
      promise = changes.fetch(<Backbone.CollectionFetchOptions>{
        url: endpoint.urlRoot + 'changes/' + time,
        credentials: endpoint.credentials,
        store: {}, // really go to remote server

        success: function fetchChangesSuccess(model, response, options) {
          if (changes.models.length > 0) {
            changes.each(function (change) {
              var msg:LiveDataMessage = change.attributes;
              that.onMessage(endpoint, that._fixMessage(endpoint, msg));
            });
          } else {
            // following should use server time!
            that.setLastMessageTime(channel, now);
          }
          return response || options.xhr;
        }
      });

      endpoint.promiseFetchingChanges = promise;
      endpoint.timestampFetchingChanges = now;
      return promise;
    }

    private fetchServerInfo(endpoint: SyncEndpoint) {
      var that = this;
      if (endpoint && endpoint.urlRoot) {
        var now = Date.now();
        var promise = endpoint.promiseFetchingServerInfo;
        if (promise) {
          if (promise.isPending() || now - endpoint.timestampFetchingServerInfo < 1000) {
            // reuse existing eventually completed request for changes
            Relution.LiveData.Debug.warning(endpoint.channel + ' skipping info request...');
            return promise;
          }
        }

        var info = new Model();
        var time = that.getLastMessageTime(endpoint.channel);
        var url = endpoint.urlRoot;
        if (url.charAt((url.length - 1)) !== '/') {
          url += '/';
        }
        promise = info.fetch(<Backbone.ModelFetchOptions>({
          url: url + 'info',
          success: function (model, response, options) {
            //@todo why we set a server time here ?
            if (!time && info.get('time')) {
              that.setLastMessageTime(endpoint.channel, info.get('time'));
            }
            if (!endpoint.socketPath && info.get('socketPath')) {
              endpoint.socketPath = info.get('socketPath');
              var name = info.get('entity') || endpoint.entity;
              if (that.options.useSocketNotify) {
                endpoint.socket = that.createSocket(endpoint, name);
              }
            }
            return response || options.xhr;
          },
          credentials: endpoint.credentials
        }));
        endpoint.promiseFetchingServerInfo = promise;
        endpoint.timestampFetchingServerInfo = now;
        return promise;
      }
    }

    /**
     * called when an offline change was sent to the remote server.
     *
     * <p>
     * May be overwritten to alter change message error handling behavior. The default implementation will attempt
     * reloading the server data for restoring the client state such that it reflects the server state. When this
     * succeeded, the offline change is effectively reverted and the change message is dropped.
     * </p>
     * <p>
     * An overwritten implementation may decided whether to revert failed changes based on the error reported.
     * </p>
     * <p>
     * Notice, the method is not called when the offline change failed due to a connectivity issue.
     * </p>
     *
     * @param error reported by remote server.
     * @param message change reported, attributes of type LiveDataMessage.
     * @param options context information required to access the data locally as well as remotely.
     * @return {any} Promise indicating success to drop the change message and preceed with the next change, or
     *    rejection indicating the change message is kept and retried later on.
     */
    protected processOfflineMessageResult(error: Error, message: LiveDataMessageModel, options: {
      entity: string,
      modelType: ModelCtor,
      urlRoot: string,
      localStore: Store
    }) {
      if (!error) {
        // message was processed successfully
        return Q.resolve(message);
      }

      // failed, eventually undo the modifications stored
      if (!options.localStore) {
        return Q.reject(error);
      }

      // revert modification by reloading data
      let modelType = options.modelType || Model;
      let model = new modelType(message.get('data'), {
        entity: options.entity
      });
      model.id = message.get('method') !== 'create' && message.get('id');
      let that = this;
      function triggerError() {
        // inform client application of the offline changes error
        let channel = message.get('channel');
        Relution.LiveData.Debug.error('Relution.LiveData.SyncStore.processOfflineMessageResult: triggering error for channel ' + channel + ' on store', error);
        that.trigger('error:' + channel, error, model);
      }
      let localOptions = {
        // just affect local store
        store: options.localStore
      };
      let remoteOptions:any = {
        urlRoot: options.urlRoot,
        store: {} // really go to remote server
      };
      if (model.id) {
        remoteOptions.url = remoteOptions.urlRoot + (remoteOptions.urlRoot.charAt(remoteOptions.urlRoot.length - 1) === '/' ? '' : '/' ) + model.id;
        Relution.assert(() => model.url() === remoteOptions.url);
      } else {
        // creation failed, just delete locally
        Relution.assert(() => message.get('method') === 'create');
        return model.destroy(localOptions).finally(triggerError);
      }
      return model.fetch(remoteOptions).then(function (data) {
        // original request failed and the code above reloaded the data to revert the local modifications, which succeeded...
        return model.save(data, localOptions).finally(triggerError);
      }, function (fetchResp) {
        // original request failed and the code above tried to revert the local modifications by reloading the data, which failed as well...
        var status = fetchResp && fetchResp.status;
        switch (status) {
          case 404: // NOT FOUND
          case 401: // UNAUTHORIZED
          case 410: // GONE*
            // ...because the item is gone by now, maybe someone else changed it to be deleted
            return model.destroy(localOptions); // silent regarding triggerError
          default:
            return Q.reject(fetchResp).finally(triggerError);
        }
      });
    }

    /**
     * feeds pending offline #messages to the remote server.
     *
     * <p>
     * Due to client code setting up models one at a time, this method is called multiple times during initial setup of
     * #endpoints. The first call fetches pending offline #messages, ordered by priority and time. Then the #messages
     * are send to the remote server until depleted, an error occurs, or some missing endpoint is encounted.
     * </p>
     * <p>
     * The method is triggered each time an endpoint is registered, or state changes to online for any endpoint. When
     * state changes from offline to online (disregarding endpoint) message submission is restarted by resetting the
     * #messagesPromise. Otherwise, subsequent calls chain to the end of #messagesPromise.
     * </p>
     *
     * @return {Promise} of #messages Collection, or last recent offline rejection
     * @private
     */
    private _sendMessages() {
      // not ready yet
      if (!this.messages) {
        return Q.resolve();
      }

      // endpoints indexed by entity
      let endpoints: {
        [entity: string]: SyncEndpoint;
      };

      // processes messages until none left, hitting a message of a not yet registered endpoint, or entering
      // a non-recoverable error. The promise returned resolves to this.messages when done.
      let nextMessage = () => {
        if (!this.messages.length) {
          return this.messages;
        }

        let message: LiveDataMessageModel = this.messages.models[0];
        let entity = message.id.substr(0, message.id.indexOf('~'));
        if (!entity) {
          Relution.LiveData.Debug.error('sendMessage ' + message.id + ' with no entity!');
          return message.destroy().then(nextMessage);
        }
        let endpoint = endpoints[entity];
        if (!endpoint) {
          return this.messages;
        }
        Relution.assert(() => endpoint.channel === message.get('channel'), 'channel of endpoint ' + endpoint.channel + ' does not match channel of message ' + message.get('channel'));
        let msg = this._fixMessage(endpoint, message.attributes);

        let modelType = endpoint.modelType || Model;
        let model = new modelType(msg.data, {
          entity: endpoint.entity
        });
        model.id = message.get('method') !== 'create' && message.get('id');
        let remoteOptions:any = {
          urlRoot: endpoint.urlRoot,
          store: {} // really go to remote server
        };
        if (model.id) {
          remoteOptions.url = remoteOptions.urlRoot + (remoteOptions.urlRoot.charAt(remoteOptions.urlRoot.length - 1) === '/' ? '' : '/' ) + model.id;
          Relution.assert(() => model.url() === remoteOptions.url);
        }
        Relution.LiveData.Debug.info('sendMessage ' + model.id);
        return this._applyResponse(this._ajaxMessage(endpoint, msg, remoteOptions, model), endpoint, msg, remoteOptions, model).then(() => {
          // succeeded
          return Q.when(this.processOfflineMessageResult(null, message, endpoint));
        }, (error) => {
          if (error) {
            // remote failed
            return Q.when(this.processOfflineMessageResult(error, message, endpoint));
          } else {
            // connectivity issue, keep rejection
            return Q.reject();
          }
        }).then(() => {
          // applying change succeeded or successfully recovered change
          return message.destroy();
        }).then(nextMessage);
      };

      Relution.LiveData.Debug.info('Relution.LiveData.SyncStore._sendMessages');
      if (!this.messagesPromise) {
        // initially fetch all messages
        this.messagesPromise = this.messages.fetch(<Backbone.CollectionFetchOptions>{
          sortOrder: [
            '-priority',
            '+time',
            '+id'
          ]
        });
      } else if (this.messagesPromise.isRejected()) {
        // early rejection
        return this.messagesPromise;
      } else if (!this.messages.length) {
        // no more messages
        return this.messagesPromise;
      }

      // need to index endpoints by entity
      endpoints = _.reduce(_.values(this.endpoints), (endpoints, endpoint) => {
        endpoints[endpoint.entity] = endpoint;
        return endpoints;
      }, {});

      // kick to process pending messages
      this.messagesPromise = this.messagesPromise.then(nextMessage);
      return this.messagesPromise;
    }

    private storeMessage(endpoint: SyncEndpoint, qMsg) {
      return qMsg.then((msg: LiveDataMessage) => {
        var options;
        var id = this.messages.modelId(msg);
        Relution.LiveData.Debug.info('storeMessage ' + id);
        var message = id && this.messages.get(id);
        if (message) {
          // use existing instance, should not be the case usually
          options = {
            merge: true
          };
        } else {
          // instantiate new model, intentionally not added to collection
          message = new this.messages.model(msg, {
            collection: this.messages,
            store: this.messages.store
          });
        }
        return message.save(msg, options).thenResolve(message);
      });
    }

    private removeMessage(endpoint: SyncEndpoint, msg: LiveDataMessage, qMessage) {
      return qMessage.then((message) => {
        if (!message) {
          var id = this.messages.modelId(msg);
          if (!id) {
            // msg is not persistent
            return Q.resolve();
          }

          message = this.messages.get(id);
          if (!message) {
            message = new this.messages.model({
              _id: msg._id
            }, {
              collection: this.messages,
              store: this.messages.store
            });
          }
        }

        Relution.LiveData.Debug.trace('removeMessage ' + message.id);
        return message.destroy();
      });
    }

    public clear(collection: Collection) {
      if (collection) {
        var endpoint: SyncEndpoint = this.getEndpoint(collection.getUrlRoot());
        if (endpoint) {
          if (this.messages) {
            this.messages.destroy();
          }
          collection.reset();
          this.setLastMessageTime(endpoint.channel, '');
        }
      }
    }

    /**
     * close the socket explicit
     */
    public close() {
      if (this.messages.store) {
        this.messages.store.close();
        this.messages = null;
      }

      var keys = Object.keys(this.endpoints);
      for (var i = 0, l = keys.length; i < l; i++) {
        this.endpoints[keys[i]].close();
      }
    }
  }
}
