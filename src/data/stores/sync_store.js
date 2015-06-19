// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

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
 *
 */

Relution.LiveData.SyncStore = Relution.LiveData.Store.extend({

  _type: 'Relution.LiveData.SyncStore',

  _selector: null,

  endpoints: {},

  options: null,

  localStore: Relution.LiveData.WebSqlStore,

  useLocalStore: true,
  useSocketNotify: true,
  useOfflineChanges: true,

  typeMapping: {
    'binary': 'text',
    'date': 'string'
  },

  initialize: function (options) {
    Relution.LiveData.Store.prototype.initialize.apply(this, arguments);
    this.options = this.options || {};

    this.options.useLocalStore = this.useLocalStore;
    this.options.useSocketNotify = this.useSocketNotify;
    this.options.useOfflineChanges = this.useOfflineChanges;
    this.options.socketPath = this.socketPath;
    this.options.localStore = this.localStore;
    this.options.typeMapping = this.typeMapping;
    if (this.options.useSocketNotify && typeof io !== 'object') {
      console.log('Socket.IO not present !!');
      this.options.useSocketNotify = false;
    }
    _.extend(this.options, options || {});
  },

  initCollection: function (collection) {
    console.log('Relution.LiveData.SyncStore.initCollection');
    var url = collection.getUrlRoot();
    if (url.charAt(url.length - 1) !== '/') {
      url += '/';
    }
    var entity = this.getEntity(collection.entity);
    if (url && entity) {
      var name = entity.name;
      var hash = Relution.LiveData.URLUtil.hashLocation(url);
      var credentials = entity.credentials || collection.credentials;
      var user = credentials && credentials.username ? credentials.username : '';
      var channel = name + user + hash;
      collection.channel = channel;

      // get or create endpoint for this url
      var endpoint = this.endpoints[hash];
      if (!endpoint) {
        var href = Relution.LiveData.URLUtil.getLocation(url);
        endpoint = {};
        endpoint.isConnected = false;
        endpoint.baseUrl = url;
        endpoint.readUrl = collection.getUrl();
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
      collection.endpoint = endpoint;

      if (this.options.useSocketNotify) {
        // otherwise application code must fetch to update collection explicitly
        collection.listenTo(this, 'sync:' + endpoint.channel, this.onMessageCollection, collection);
      }
    }
  },

  getEndpoint: function (url) {
    if (url) {
      var hash = Relution.LiveData.URLUtil.hashLocation(url);
      return this.endpoints[hash];
    }
  },

  createLocalStore: function (endpoint) {
    if (this.options.useLocalStore) {
      var entities = {};
      entities[endpoint.entity.name] = _.extend(new Relution.LiveData.Entity(endpoint.entity), {
        name: endpoint.channel
      });
      return this.options.localStore.create({
        entities: entities
      });
    }
  },

  /**
   * @description Here we save the changes in a Message local websql
   * @param endpoint {string}
   * @returns {*}
   */
  createMsgCollection: function (endpoint) {
    if (this.options.useOfflineChanges) {
      var entity = 'msg-' + endpoint.channel;
      var entities = {};
      entities[entity] = new Relution.LiveData.Entity({
        name: entity,
        idAttribute: 'id'
      });
      var messages = Relution.LiveData.Collection.design({
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
  },

  createSocket: function (endpoint, name) {
    console.log('Relution.LiveData.SyncStore.createSocket');
    if (this.options.useSocketNotify && endpoint && endpoint.socketPath) {
      var that = this;
      var url = endpoint.host;
      var path = endpoint.path;
      var href = Relution.LiveData.URLUtil.getLocation(url);
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
      var connectVo = {
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
        console.log('socket.io: disconnect');
        return that.onDisconnect(endpoint).done();
      });
      endpoint.socket.on(endpoint.channel, that.onMessageStore.bind(that, endpoint));
      return endpoint.socket;
    }
  },

  _bindChannel: function (endpoint, name) {
    console.log('Relution.LiveData.SyncStore._bindChannel');
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
  },

  getLastMessageTime: function (channel) {
    if (!this.lastMesgTime) {
      this.lastMesgTime = {};
    } else if (this.lastMesgTime[channel] !== undefined) {
      return this.lastMesgTime[channel];
    }
    var time = localStorage.getItem('__' + channel + 'lastMesgTime') || 0;
    this.lastMesgTime[channel] = time;
    return time;
  },

  setLastMessageTime: function (channel, time) {
    if (!time || time > this.getLastMessageTime(channel)) {
      localStorage.setItem('__' + channel + 'lastMesgTime', time);
      this.lastMesgTime[channel] = time;
    }
  },

  onConnect: function (endpoint) {
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
  },

  onDisconnect: function (endpoint) {
    if (!endpoint.isConnected) {
      return Q.resolve();
    }

    endpoint.isConnected = false;
    var that = this;
    return Q.resolve(function () {
      if (endpoint.socket && endpoint.socket.socket) {
        endpoint.socket.socket.onDisconnect();
      }
    }).finally(function () {
      if (!endpoint.isConnected) {
        that.trigger('disconnect:' + endpoint.channel);
      }
    });
  },

  _fixMessage: function (endpoint, msg) {
    if (msg.data && !msg.data[endpoint.entity.idAttribute] && msg.data._id) {
      msg.data[endpoint.entity.idAttribute] = msg.data._id; // server bug!
    } else if (!msg.data && msg.method === 'delete' && msg[endpoint.entity.idAttribute]) {
      msg.data = {};
      msg.data[endpoint.entity.idAttribute] = msg[endpoint.entity.idAttribute]; // server bug!
    }
  },

  onMessageStore: function (endpoint, msg) {
    // this is called by the store itself for a particular endpoint!
    var that = this;
    if (!msg || !msg.method) {
      return Q.reject('no message or method given');
    }
    this._fixMessage(endpoint, msg);

    var channel = endpoint.channel;
    if (endpoint.localStore) {
      // first update the local store by forming a model and invoking sync
      var options = _.defaults({
        store: endpoint.localStore,
        entity: endpoint.entity
      }, that.options);
      var model = new Relution.LiveData.Model(msg.data, _.extend({
        parse: true
      }, options));
      return endpoint.localStore.sync(msg.method, model, _.extend(options, {
        merge: msg.method === 'patch',
        success: function (result) {
          // update all collections listening
          that.trigger('sync:' + channel, msg); // onMessageCollection
        },
        error: function (error) {
          // report error as event on store
          that.trigger('error:' + channel, error);
        }
      })).then(function () {
        if (msg.time) {
          that.setLastMessageTime(channel, msg.time);
        }
      }).thenResolve(msg);
    } else {
      // just update all collections listening
      return Q.resolve(function () {
        return that.trigger('sync:' + channel, msg); // onMessageCollection
      });
    }
  },

  onMessageCollection: function (msg) {
    // this is a collection listening on channel events of store here!
    var options = {
      collection: this,
      entity: this.entity,
      merge: msg.method === 'patch',
      parse: true,
      fromMessage: true
    };
    var id = this.modelId(msg.data);
    if (id === 'all') {
      this.reset(msg.data || {}, options);
      return;
    }

    var model = id && this.get(id);
    switch (msg.method) {
      case 'create':
      case 'update':
        if (!model) {
          // create model in case it does not exist
          model = new options.collection.model(msg.data, options);
          if (model.validationError) {
            this.trigger('invalid', this, model.validationError, options);
          } else {
            this.add(model, options);
          }
          break;
        }
        /* falls through */
      case 'patch':
        if (model) {
          // update model unless it is filtered
          model.set(msg.data, options);
        }
        break;
      case 'delete':
        if (model) {
          // remove model unless it is filtered
          this.remove(model, options);
        }
        break;
    }
  },

  sync: function (method, model, options) {
    console.log('Relution.LiveData.SyncStore.sync');
    options = options || {};

    var endpoint;
    try {
      endpoint = this.getEndpoint(model.getUrlRoot() /*throws urlError*/);
      if (!endpoint) {
        throw new Error('no endpoint');
      }
    } catch(error) {
      return Q.reject(this.handleError(options, error) || error);
    }

    if (Relution.LiveData.isModel(model) && !model.id) {
      model.set(model.idAttribute, new Relution.LiveData.ObjectID().toHexString());
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
  },

  _addMessage: function (method, model, options, endpoint) {
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
  },

  _emitMessage: function (endpoint, msg, options, model, qMessage) {
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

    q.finally(function () {
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
  },

  _ajaxMessage: function (endpoint, msg, options, model) {
    var channel = endpoint.channel;
    var that = this;
    var url = Relution.LiveData.isModel(model) || msg.method !== 'read' ? endpoint.baseUrl : endpoint.readUrl;
    if (msg.id && msg.method !== 'create') {
      url += (url.charAt(url.length - 1) === '/' ? '' : '/' ) + msg.id;
    }
    console.log('ajaxMessage ' + msg.method + ' ' + url);
    return model.sync(msg.method, model, {
      // must not take arbitrary options as these won't be replayed on reconnect
      url: url,
      attrs: msg.data,
      store: {},
      // error propagation
      error: that.options.error
    });
  },

  _applyResponse: function (qXHR, endpoint, msg, options, model) {
    var channel = endpoint.channel;
    var that = this;
    return qXHR.then(function (data) {
      // delete on server does not respond a body
      if(!data && msg.method === 'delete') {
        data = msg.data;
      }

      // update local store state
      if (data) {
        // no data if server asks not to alter state
        // that.setLastMessageTime(channel, msg.time);
        var promises = [];
        if (msg.method !== 'read') {
          promises.push(that.onMessageStore(endpoint, data === msg.data ? msg : _.defaults({
            data: data // just accepts new data
          }, msg)));
        } else if (Relution.LiveData.isCollection(model) && _.isArray(data)) {
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
                  promises.push(that.onMessageStore(endpoint, {
                    id: id,
                    method: 'update',
                    data: d
                  }));
                }
              } else {
                // create the item
                promises.push(that.onMessageStore(endpoint, {
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
            promises.push(that.onMessageStore(endpoint, {
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
              promises.push(that.onMessageStore(endpoint, {
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
  },

  fetchChanges: function (endpoint) {
    var that = this;
    var channel = endpoint ? endpoint.channel : '';
    var time = that.getLastMessageTime(channel);
    if (endpoint && endpoint.baseUrl && channel && time) {
      var changes = new Relution.LiveData.Collection();
      return changes.fetch({
        url: endpoint.baseUrl + 'changes/' + time,
        success: function (model, response, options) {
          changes.each(function (change) {
            var msg = change.attributes;
            that.onMessageStore(endpoint, msg);
          });
          return response || options.xhr;
        },
        credentials: endpoint.credentials
      });
    } else {
      return Q.resolve();
    }
  },

  fetchServerInfo: function (endpoint) {
    var that = this;
    if (endpoint && endpoint.baseUrl) {
      var info = new Relution.LiveData.Model();
      var time = that.getLastMessageTime(endpoint.channel);
      var url = endpoint.baseUrl;
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
  },

  _sendMessages: function (endpoint) {
    if (!endpoint || !endpoint.messages) {
      return Q.resolve();
    }

    var that = this;
    return endpoint.messages.fetch().then(function next() {
      if (endpoint.messages.models.length <= 0) {
        return;
      }

      var message = endpoint.messages.models[0];
      var msg = message.attributes;
      var channel = message.get('channel');
      if (!msg || !channel) {
        return message.destroy();
      }
      that._fixMessage(endpoint, msg);

      var remoteOptions = {
        urlRoot: endpoint.baseUrl,
        store: {} // really go to remote server
      };
      var localOptions = {
        // just affect local store
        store: endpoint.localStore
      };
      var model = new Relution.LiveData.Model(msg.data, {
        idAttribute: endpoint.entity.idAttribute,
        entity: endpoint.entity,
      });
      console.log('sendMessage ' + model.id);
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
  },

  storeMessage: function (endpoint, qMsg) {
    return qMsg.then(function (msg) {
      var options;
      var id = endpoint.messages.modelId(msg);
      console.log('storeMessage ' + id);
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
  },

  removeMessage: function (endpoint, msg, qMessage) {
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
      console.log('removeMessage ' + message.id);
      return message.destroy();
    });
  },

  clear: function (collection) {
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

});