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
/// <reference path="SyncContext.ts" />
/// <reference path="../../utility/Debug.ts" />

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

    private endpoints = {};

    private lastMesgTime:any;

    constructor(options?:any) {

      super(_.extend({
        localStore: WebSqlStore,

        useLocalStore: true,
        useSocketNotify: true,
        useOfflineChanges: true,
        socketPath: '',

        typeMapping: (function () {
          var map = {};
          map[DATA.BINARY] = 'text';
          map[DATA.TEXT] = 'string';
          return map;
        })()
      }, options));

      if (this.options.useSocketNotify && typeof io !== 'object') {
        Relution.LiveData.Debug.warning('Socket.IO not present !!');
        this.options.useSocketNotify = false;
      }
    }

    initEndpoint(model, modelType) {
      Relution.LiveData.Debug.info('Relution.LiveData.SyncStore.initEndpoint');
      var urlRoot = model.getUrlRoot();
      var entity = this.getEntity(model.entity);
      if (urlRoot && entity) {
        var name = entity.name;
        var hash = URLUtil.hashLocation(urlRoot);
        var credentials = entity.credentials || model.credentials || this.options.credentials;
        var user = credentials && credentials.username ? credentials.username : '';
        var channel = name + user + hash;
        model.channel = channel;

        // get or create endpoint for this url
        var endpoint = this.endpoints[hash];
        if (!endpoint) {
          var href = URLUtil.getLocation(urlRoot);
          endpoint = {};
          endpoint.model = modelType;
          endpoint.isConnected = false;
          endpoint.urlRoot = urlRoot;
          endpoint.host = href.protocol + '//' + href.host;
          endpoint.path = href.pathname;
          endpoint.entity = entity;
          endpoint.channel = channel;
          endpoint.credentials = credentials;
          endpoint.socketPath = this.options.socketPath;
          endpoint.localStore = this.createLocalStore(endpoint);
          endpoint.messages = this.createMsgCollection(endpoint);
          endpoint.socket = this.createSocket(endpoint, name);
          endpoint.info = this.fetchServerInfo(endpoint);
          this.endpoints[hash] = endpoint;
        }
        return endpoint;
      }
    }

    initModel(model) {
      Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.initModel');
      model.endpoint = this.initEndpoint(model, model.constructor);
    }

    initCollection(collection) {
      Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.initCollection');
      collection.endpoint = this.initEndpoint(collection, collection.model);
    }

    getEndpoint(url) {
      if (url) {
        var hash = URLUtil.hashLocation(url);
        return this.endpoints[hash];
      }
    }

    createLocalStore(endpoint) {
      if (this.options.useLocalStore) {
        var entities = {};
        entities[endpoint.entity.name] = _.extend(new Entity(endpoint.entity), {
          name: endpoint.channel,
          idAttribute: endpoint.model.prototype.idAttribute // see Collection.modelId() of backbone.js
        });
        return this.options.localStore.create({
          entities: entities
        });
      }
    }

    /**
     * @description Here we save the changes in a Message local websql
     * @param endpoint {string}
     * @returns {*}
     */
    createMsgCollection(endpoint) {
      if (this.options.useOfflineChanges) {
        var entity = 'msg-' + endpoint.channel;
        var entities = {};
        entities[entity] = new Entity({
          name: entity,
          idAttribute: 'id'
        });
        var messages = Collection.design({
          entity: entity,
          store: this.options.localStore.create({
            entities: entities
          })
        });
        if (endpoint.isConnected) {
          this._sendMessages(endpoint);
        }
        return messages;
      }
    }

    createSocket(endpoint, name) {
      Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.createSocket');
      if (this.options.useSocketNotify && endpoint && endpoint.socketPath) {
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
        endpoint.socket.on(endpoint.channel, _.bind(this.onMessage, this, endpoint));
        return endpoint.socket;
      }
    }

    _bindChannel(endpoint, name) {
      Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore._bindChannel');
      var that = this;
      if (endpoint && endpoint.socket) {
        var channel = endpoint.channel;
        var socket = endpoint.socket;
        var time = this.getLastMessageTime(channel);
        name = name || endpoint.entity.name;
        socket.emit('bind', {
          entity: name,
          channel: channel,
          time: time
        });
      }
    }

    getLastMessageTime(channel) {
      if (!this.lastMesgTime) {
        this.lastMesgTime = {};
      } else if (this.lastMesgTime[channel] !== undefined) {
        return this.lastMesgTime[channel];
      }
      // the | 0 below turns strings into numbers
      var time = localStorage.getItem('__' + channel + 'lastMesgTime') | 0 || 0;
      this.lastMesgTime[channel] = time;
      return time;
    }

    setLastMessageTime(channel, time) {
      if (!time || time > this.getLastMessageTime(channel)) {
        localStorage.setItem('__' + channel + 'lastMesgTime', time);
        this.lastMesgTime[channel] = time;
      }
    }

    onConnect(endpoint) {
      if (endpoint.isConnected) {
        return Q.resolve();
      }

      endpoint.isConnected = true;
      var that = this;
      return this.fetchChanges(endpoint).then(function () {
        return that._sendMessages(endpoint);
      }).finally(function () {
        if (endpoint.isConnected) {
          that.trigger('connect:' + endpoint.channel);
        }
      });
    }

    onDisconnect(endpoint) {
      if (!endpoint.isConnected) {
        return Q.resolve();
      }

      endpoint.isConnected = false;
      var that = this;
      return Q.fcall(function () {
        if (endpoint.socket && endpoint.socket.socket) {
          endpoint.socket.socket.onDisconnect();
        }
      }).finally(function () {
        if (!endpoint.isConnected) {
          that.trigger('disconnect:' + endpoint.channel);
        }
      });
    }

    _fixMessage(endpoint, msg) {
      if (msg.data && !msg.data[endpoint.entity.idAttribute] && msg.data._id) {
        msg.data[endpoint.entity.idAttribute] = msg.data._id; // server bug!
      } else if (!msg.data && msg.method === 'delete' && msg[endpoint.entity.idAttribute]) {
        msg.data = {};
        msg.data[endpoint.entity.idAttribute] = msg[endpoint.entity.idAttribute]; // server bug!
      }
    }

    onMessage(endpoint, msg) {
      // this is called by the store itself for a particular endpoint!
      var that = this;
      if (!msg || !msg.method) {
        return Q.reject('no message or method given');
      }
      this._fixMessage(endpoint, msg);

      var q;
      var channel = endpoint.channel;
      if (endpoint.localStore) {
        // first update the local store by forming a model and invoking sync
        var options = _.defaults({
          store: endpoint.localStore,
          entity: endpoint.entity
        }, that.options);
        var model = new endpoint.model(msg.data, _.extend({
          parse: true
        }, options));
        q = endpoint.localStore.sync(msg.method, model, _.extend(options, {
          merge: msg.method === 'patch',
          success: function (result) {
            // update all collections listening
            that.trigger('sync:' + channel, msg); // SyncContext.onMessage
          },
          error: function (error) {
            // report error as event on store
            that.trigger('error:' + channel, error);
          }
        }));
      } else {
        // just update all collections listening
        q = Q.fcall(function () {
          return that.trigger('sync:' + channel, msg); // SyncContext.onMessage
        });
      }

      // finally set the message time
      return q.then(function () {
        if (msg.time) {
          that.setLastMessageTime(channel, msg.time);
        }
      }).thenResolve(msg);
    }

    public sync(method, model, options) {
      Relution.LiveData.Debug.trace('Relution.LiveData.SyncStore.sync');
      options = options || {};
      try {
        var endpoint = model.endpoint || this.getEndpoint(model.getUrlRoot() /*throws urlError*/);
        if (!endpoint) {
          throw new Error('no endpoint');
        }

        if (isCollection(model)) {
          // collections can be filtered, etc.
          if (method === 'read') {
            var syncContext = options.syncContext; // sync can be called by SyncContext itself when paging results
            if (!syncContext) {
              // capture GetQuery options
              syncContext = new SyncContext(
                options,        // dynamic options passed to fetch() implement UI filters, etc.
                model.options,  // static options on collection implement screen-specific stuff
                this.options    // static options of this store realize filtering client/server
              );
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
          if (method === 'create' && !model.id) {
            model.set(model.idAttribute, new ObjectID().toHexString());
          }
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
            // load changes only (will happen AFTER success callback is invoked,
            // but returned promise will resolve only after changes were processed.
            // This is because backbone success callback alters the collection...
            return that.fetchChanges(endpoint).catch(function (error) {
              that.trigger('error:' + channel, error); // can not do much about it...
            }).thenResolve(that.handleSuccess(options, resp) || resp); // caller expects original XHR response as changes body data is NOT compatible
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

    private _addMessage(method, model, options, endpoint) {
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
            storeMsg = false;
            break;
        }
        var msg = {
          _id: model.id,
          id: model.id,
          method: method,
          data: data,
          channel: endpoint.channel
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

    private _emitMessage(endpoint, msg, options, model, qMessage) {
      var that = this;
      var channel = endpoint.channel;
      var qAjax = this._ajaxMessage(endpoint, msg, options, model);
      var q = qAjax;

      if (qMessage) {
        // following takes care of offline change store
        q = q.then(function (data) {
          // success, remove message stored, if any
          return that.removeMessage(endpoint, msg, qMessage).then(data, function (error) {
            that.trigger('error:' + channel, error); // can not do much about it...
            return data;
          }).thenResolve(data); // resolve again yielding data
        }, function (xhr) {
          // failure eventually caught by offline changes
          if (!xhr.responseText && that.options.useOfflineChanges) {
            // this seams to be only a connection problem, so we keep the message and call success
            return Q.resolve(msg.data);
          } else {
            // keep rejection as is
            return Q.reject.apply(Q, arguments);
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
          if (!xhr.responseText && endpoint.isConnected) {
            return that.onDisconnect(endpoint);
          }
        });
      });
    }

    private _ajaxMessage(endpoint, msg, options, model) {
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

          if (queryIndex >= 0) {
            url += collectionUrl.substr(queryIndex);
          }
        }
      }

      Relution.LiveData.Debug.trace('ajaxMessage ' + msg.method + ' ' + url);
      return model.sync(msg.method, model, {
        // must not take arbitrary options as these won't be replayed on reconnect
        url: url,
        attrs: msg.data,
        store: {},
        credentials: options.credentials,
        // error propagation
        error: options.error
      });
    }

    private _applyResponse(qXHR, endpoint, msg, options, model) {
      var channel = endpoint.channel;
      var that = this;
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
          if (msg.method !== 'read') {
            promises.push(that.onMessage(endpoint, data === msg.data ? msg : _.defaults({
              data: data // just accepts new data
            }, msg)));
          } else if (isCollection(model) && _.isArray(data)) {
            // synchronize the collection contents with the data read
            var ids = {};
            model.models.forEach(function (m) {
              ids[m.id] = m;
            });
            data.forEach(function (d) {
              if (d) {
                var id = d[endpoint.entity.idAttribute] || d._id;
                var m = ids[id];
                if (m) {
                  // update the item
                  delete ids[id]; // so that it is deleted below
                  if (!_.isEqual(_.pick.call(m, m.attributes, Object.keys(d)), d)) {
                    // above checked that all attributes in d are in m with equal values and found some mismatch
                    promises.push(that.onMessage(endpoint, {
                      id: id,
                      method: 'update',
                      data: d
                    }));
                  }
                } else {
                  // create the item
                  promises.push(that.onMessage(endpoint, {
                    id: id,
                    method: 'create',
                    data: d
                  }));
                }
              }
            });
            Object.keys(ids).forEach(function (id) {
              // delete the item
              var m = ids[id];
              promises.push(that.onMessage(endpoint, {
                id: id,
                method: 'delete',
                data: m.attributes
              }));
            });
          } else {
            // trigger an update to load the data read
            var array = _.isArray(data) ? data : [data];
            for (var i = 0; i < array.length; i++) {
              data = array[i];
              if (data) {
                promises.push(that.onMessage(endpoint, {
                  id: data[endpoint.entity.idAttribute] || data._id,
                  method: 'update',
                  data: data
                }));
              }
            }
          }
          return Q.all(promises).thenResolve(data); // delayed till operations complete
        }
      }).then(function (response) {
        // invoke success callback, if any
        return that.handleSuccess(options, response) || response;
      }, function (error) {
        // invoke error callback, if any
        return that.handleError(options, error) || Q.reject(error);
      });
    }

    private fetchChanges(endpoint) {
      var that = this;
      var channel = endpoint ? endpoint.channel : '';
      var time = that.getLastMessageTime(channel);
      if (endpoint && endpoint.urlRoot && channel && time) {
        var changes = new endpoint.messages.constructor();
        return changes.fetch({
          url: endpoint.urlRoot + 'changes/' + time,
          store: {}, // really go to remote server
          success: function (model, response, options) {
            changes.each(function (change) {
              var msg = change.attributes;
              that.onMessage(endpoint, msg);
            });
            return response || options.xhr;
          },
          credentials: endpoint.credentials
        });
      } else {
        return Q.resolve();
      }
    }

    private fetchServerInfo(endpoint) {
      var that = this;
      if (endpoint && endpoint.urlRoot) {
        var info = new Model();
        var time = that.getLastMessageTime(endpoint.channel);
        var url = endpoint.urlRoot;
        if (url.charAt((url.length - 1)) !== '/') {
          url += '/';
        }
        return info.fetch({
          url: url + 'info',
          success: function (model, response, options) {
            //@todo why we set a server time here ?
            if (!time && info.get('time')) {
              that.setLastMessageTime(endpoint.channel, info.get('time'));
            }
            if (!endpoint.socketPath && info.get('socketPath')) {
              endpoint.socketPath = info.get('socketPath');
              var name = info.get('entity') || endpoint.entity.name;
              if (that.options.useSocketNotify) {
                endpoint.socket = that.createSocket(endpoint, name);
              }
            }
            return response || options.xhr;
          },
          credentials: endpoint.credentials
        });
      }
    }

    private _sendMessages(endpoint) {
      if (!endpoint || !endpoint.messages) {
        return Q.resolve();
      }

      var that = this;
      return endpoint.messages.fetch().then(function next(result) {
        if (endpoint.messages.models.length <= 0) {
          return result;
        }

        var message = endpoint.messages.models[0];
        var msg = message.attributes;
        var channel = message.get('channel');
        if (!msg || !channel) {
          return message.destroy();
        }
        that._fixMessage(endpoint, msg);

        var remoteOptions:any = {
          urlRoot: endpoint.urlRoot,
          store: {} // really go to remote server
        };
        var localOptions = {
          // just affect local store
          store: endpoint.localStore
        };
        var model = new Model(msg.data, {
          idAttribute: endpoint.entity.idAttribute,
          entity: endpoint.entity,
        });
        Relution.LiveData.Debug.info('sendMessage ' + model.id);
        return that._applyResponse(that._ajaxMessage(endpoint, msg, remoteOptions, model), endpoint, msg, remoteOptions, model).catch(function (error) {
          // failed, eventually undo the modifications stored
          if (!endpoint.localStore) {
            return Q.reject(error);
          }

          // revert modification by reloading data
          if (msg.id) {
            remoteOptions.url = remoteOptions.urlRoot + (remoteOptions.urlRoot.charAt(remoteOptions.urlRoot.length - 1) === '/' ? '' : '/' ) + msg.id;
          }
          return model.fetch(remoteOptions).then(function (data) {
            // original request failed and the code above reloaded the data to revert the local modifications, which succeeded...
            return model.save(data, localOptions);
          }, function (fetchResp) {
            // original request failed and the code above tried to revert the local modifications by reloading the data, which failed as well...
            var status = fetchResp && fetchResp.status;
            switch (status) {
              case 404: // NOT FOUND
              case 401: // UNAUTHORIZED
              case 410: // GONE*
                // ...because the item is gone by now, maybe someone else changed it to be deleted
                return model.destroy(localOptions);
              default:
                return Q.reject(fetchResp);
            }
          });
        }).then(function () {
          // succeeded or reverted
          return message.destroy();
        }).then(function (result) {
          return next(result);
        });
      });
    }

    private storeMessage(endpoint, qMsg) {
      return qMsg.then(function (msg) {
        var options;
        var id = endpoint.messages.modelId(msg);
        Relution.LiveData.Debug.info('storeMessage ' + id);
        var message = id && endpoint.messages.get(id);
        if (message) {
          // use existing instance, should not be the case usually
          options = {
            merge: true
          };
        } else {
          // instantiate new model, intentionally not added to collection
          message = new endpoint.messages.model(msg, {
            collection: endpoint.messages,
            store: endpoint.messages.store
          });
        }
        return message.save(msg, options).thenResolve(message);
      });
    }

    private removeMessage(endpoint, msg, qMessage) {
      return qMessage.then(function (message) {
        if (!message) {
          var id = endpoint.messages.modelId(msg);
          if (!id) {
            // msg is not persistent
            return Q.resolve();
          }

          message = endpoint.messages.get(id);
          if (!message) {
            message = new endpoint.messages.model({
              _id: msg._id,
              id: msg.id
            }, {
              collection: endpoint.messages,
              store: endpoint.messages.store
            });
          }
        }

        Relution.LiveData.Debug.trace('removeMessage ' + message.id);
        return message.destroy();
      });
    }

    public clear(collection) {
      if (collection) {
        var endpoint = this.getEndpoint(collection.getUrlRoot());
        if (endpoint) {
          if (endpoint.messages) {
            endpoint.messages.destroy();
          }
          collection.reset();
          this.setLastMessageTime(endpoint.channel, '');
        }
      }
    }

  }

}