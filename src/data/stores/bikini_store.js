// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * The Bikini.BikiniStore is used to connect a model collection to an
 * bikini server.
 *
 * This will give you an online and offline store with live data updates.
 *
 * @module Bikini.BikiniStore
 *
 * @type {*}
 * @extends Bikini.Store
 *
 * @example
 *
 * // The default configuration will save the complete model data as a json,
 * // and the offline change log to a local WebSql database, synchronize it
 * // trough REST calls with the server and receive live updates via a socket.io connection.
 *
 * var MyCollection = Bikini.Collection.extend({
 *      model: MyModel,
 *      url: 'http://myBikiniServer.com:8200/bikini/myCollection',
 *      store: new Bikini.BikiniStore( {
 *          useLocalStore:   true, // (default) store the data for offline use
 *          useSocketNotify: true, // (default) register at the server for live updates
 *          useOfflineChanges: true // (default) allow changes to the offline data
 *      })
 * });
 *
 */

Bikini.BikiniStore = Bikini.Store.extend({

  _type: 'Bikini.BikiniStore',

  _selector: null,

  endpoints: {},

  options: null,

  localStore: Bikini.WebSqlStore,

  useLocalStore: true,
  useSocketNotify: true,
  useOfflineChanges: true,

  isConnected: false,

  typeMapping: {
    'binary': 'text',
    'date': 'string'
  },

  initialize: function (options) {
    //debugger;
    console.log('Bikini.BikiniStore.initialize');
    Bikini.Store.prototype.initialize.apply(this, arguments);
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

  //initModel: function (model) {
  //  console.log('Bikini.BikiniStore.initModel');
  //},

  initCollection: function (collection) {
    console.log('Bikini.BikiniStore.initCollection');
    var url = collection.getUrlRoot();
    if (url.charAt(url.length - 1) !== '/') {
      url += '/';
    }
    var entity = this.getEntity(collection.entity);
    if (url && entity) {
      var name = entity.name;
      var hash = Bikini.URLUtil.hashLocation(url);
      var credentials = entity.credentials || collection.credentials;
      var user = credentials && credentials.username ? credentials.username : '';
      var channel = name + user + hash;
      collection.channel = channel;
      // get or create endpoint for this url
      var that = this;
      var endpoint = this.endpoints[hash];
      if (!endpoint) {
        var href = Bikini.URLUtil.getLocation(url);
        endpoint = {};
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
        endpoint.socket = this.createSocket(endpoint);
        endpoint.info = this.fetchServerInfo(endpoint);
        that.endpoints[hash] = endpoint;
      }
      collection.endpoint = endpoint;
      collection.listenTo(this, 'sync:' + endpoint.channel, this.onMessageCollection, collection);
    }
  },

  getEndpoint: function (url) {
    console.log('Bikini.BikiniStore.getEndpoint');
    if (url) {
      var hash = Bikini.URLUtil.hashLocation(url);
      return this.endpoints[hash];
    }
  },

  createLocalStore: function (endpoint, idAttribute) {
    console.log('Bikini.BikiniStore.createLocalStore');
    if (this.options.useLocalStore && endpoint) {
      var entities = {};
      entities[endpoint.entity.name] = {
        name: endpoint.channel,
        idAttribute: idAttribute
      };
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
    if (this.options.useOfflineChanges && endpoint) {
      var entity = 'msg-' + endpoint.channel;
      var entities = {};
      entities[entity] = {
        name: entity,
        idAttribute: 'id'
      };
      var messages = Bikini.Collection.design({
        url: endpoint.url,
        entity: entity,
        store: this.options.localStore.create({
          entities: entities
        })
      });
      var that = this;
      messages.fetch({
        success: function () {
          if (that.isConnected) {
            that.sendMessages(endpoint);
          }
        }
      });
      return messages;
    }
  },

  createSocket: function (endpoint, name) {
    console.log('Bikini.BikiniStore.createSocket');
    //debugger;
    if (this.options.useSocketNotify && endpoint && endpoint.socketPath) {
      var that = this;
      var url = endpoint.host;
      var path = endpoint.path;
      var href = Bikini.URLUtil.getLocation(url);
      if (href.port === '') {
        if (href.protocol === 'https:') {
          url += ':443';
        } else if (href.protocol === 'http:') {
          url += ':80';
        }
      }

      //path = endpoint.socketPath || (path + (path.charAt(path.length - 1) === '/' ? '' : '/' ) + 'live');
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
        that.onConnect(endpoint);
      });
      endpoint.socket.on('disconnect', function () {
        console.log('socket.io: disconnect');
        that.onDisconnect(endpoint);
      });
      endpoint.socket.on(endpoint.channel, that.onMessageStore.bind(that, endpoint));
      return endpoint.socket;
    }
  },

  _bindChannel: function (endpoint, name) {
    console.log('Bikini.BikiniStore._bindChannel');
    var that = this;
    if (endpoint && endpoint.socket) {
      var channel = endpoint.channel;
      var socket = endpoint.socket;
      var time = this.getLastMessageTime(channel);
      name = name || endpoint.entity.name;
      socket.emit('bind:' + channel, {
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
    if (!this.isConnected) {
      this.isConnected = true;
      this.fetchChanges(endpoint);
      this.sendMessages(endpoint);
    }
  },

  onDisconnect: function (endpoint) {
    if (this.isConnected) {
      this.isConnected = false;
      if (endpoint.socket && endpoint.socket.socket) {
        endpoint.socket.socket.onDisconnect();
      }
    }
  },

  onMessageStore: function (endpoint, msg) {
    // this is called by the store itself for a particular endpoint!
    var that = this;
    if (!msg || !msg.time || !msg.method) {
      return;
    }
    if (msg.data && !msg.data[endpoint.entity.idAttribute] && msg.data._id) {
      msg.data[endpoint.entity.idAttribute] = msg.data._id; // server bug!
    } else if (!msg.data && msg.method === 'delete' && msg[endpoint.entity.idAttribute]) {
      msg.data = {};
      msg.data[endpoint.entity.idAttribute] = msg[endpoint.entity.idAttribute]; // server bug!
    }

    var channel = endpoint.channel;
    if (!endpoint.localStore) {
      // first update the local store by forming a model and invoking sync
      var options = _.defaults({
        store: endpoint.localStore,
        fromMessage: true
      }, that.options);
      var model = new Bikini.Model(msg.data, options);
      var promise = endpoint.localStore.sync(msg.method, model, _.extend(options, {
        success: function (result) {
          // update all collections listening
          that.trigger('sync:' + channel, msg); // onMessageCollection
        },
        error: function (error) {
          // report error as event on store
          that.trigger('error:' + channel, error);
        }
      })).then(function () {
        that.setLastMessageTime(channel, msg.time);
      });
    } else {
      // just update all collections listening
      that.trigger('sync:' + channel, msg); // onMessageCollection
    }
  },

  onMessageCollection: function (msg) {
    // this is a collection listening on channel events of store here!
    var options = {
      collection: this,
      entity: this.entity,
      merge: msg.method === 'patch',
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
    console.log('Bikini.BikiniStore.sync');
    var that = options.store || this.store;
    if (options.fromMessage) {
      return that.handleCallback(options.success);
    }
    var endpoint = that.getEndpoint(this.getUrlRoot());
    var promise;
    if (that && endpoint) {
      var channel = this.channel;

      if (Bikini.isModel(model) && !model.id) {
        model.set(model.idAttribute, new Bikini.ObjectID().toHexString());
      }

      var time = that.getLastMessageTime(channel);
      // only send read messages if no other store can do this
      // or for initial load
      if (method !== 'read' || !endpoint.localStore || !time) {
        // do backbone rest
        promise = that.addMessage(method, model, // we don't need to call callbacks if an other store handle this
          endpoint.localStore ? {} : options, endpoint);
      } else {
        options.store = endpoint.localStore;
        promise = endpoint.localStore.sync.apply(this, arguments);
        if (method === 'read') {
          // TODO: callbacks should fire after fetching the changes, however they are when localStore sync completes
          promise = promise.then(that.fetchChanges.bind(that, endpoint));
        }
      }
      return promise;
    }
  },

  addMessage: function (method, model, options, endpoint) {
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
        data: data
      };
      var emit = function (endpoint, msg) {
        return that.emitMessage(endpoint, msg, options, model);
      };
      if (storeMsg) {
        return this.storeMessage(endpoint, msg, emit);
      } else {
        return emit(endpoint, msg);
      }
    }
  },

  emitMessage: function (endpoint, msg, options, model) {
    var channel = endpoint.channel;
    var that = this;
    var url = Bikini.isModel(model) || msg.method !== 'read' ? endpoint.baseUrl : endpoint.readUrl;
    if (msg.id && msg.method !== 'create') {
      url += (url.charAt(url.length - 1) === '/' ? '' : '/' ) + msg.id;
    }
    return model.sync.apply(model, [msg.method, model, {
      url: url,
      error: function (xhr, status) {
        if (!xhr.responseText && that.options.useOfflineChanges) {
          // this seams to be only a connection problem, so we keep the message an call success
          that.onDisconnect(endpoint);
          that.handleCallback(options.success, msg.data);
        } else {
          // some real error
          var handleError = function () {
            // called when we want to retry on reconnect/restart, aka. the message stays in the store for future delivery
            return that.handleCallback(options.error, model, xhr.responseJSON || new Error(status), options);
          };
          var removeAndHandleError = function () {
            // called when we do not want to retry on reconnect/restart, message is to be deleted
            return that.removeMessage(endpoint, msg, handleError);
          };
          var saveAndHandleError = function (model, data) {
            // original request failed and the code below reloaded the data to revert the local modifications, which succeeded...
            that.trigger('sync:' + channel, {
              _id: model.id,
              id: model.id,
              method: 'update',
              data: data
            });
            removeAndHandleError();
            // following does NOT work as this will NOT update the collection when sending messages on reconnect!
            /*
            return model.save(data, {
              // remove message to no longer retry on reconnect/restart
              error: removeAndHandleError,
              success: removeAndHandleError,
              // just affect local store
              store: endpoint.localStore,
              entity: endpoint.entity
            });
            */
          };
          var deleteAndHandleError = function (model, fetchResp) {
            // original request failed and the code below tried to revert the local modifications by reloading the data, which failed as well...
            var status = fetchResp && fetchResp.status;
            switch (status) {
              case 404: // NOT FOUND
              case 401: // UNAUTHORIZED
              case 410: // GONE*
                // ...because the item is gone by now, maybe someone else changed it to be deleted
                that.trigger('sync:' + channel, {
                  _id: model.id,
                  id: model.id,
                  method: 'delete',
                  data: model.attributes
                });
                removeAndHandleError();
                // following does NOT work as this will NOT update the collection when sending messages on reconnect!
                /*
                model.destroy({
                  // remove message to no longer retry on reconnect/restart
                  error: removeAndHandleError,
                  success: removeAndHandleError,
                  // just affect local store
                  store: endpoint.localStore,
                  entity: endpoint.entity
                });
                */
                break;
              default:
                // reattempt operation on reconnect/restart as we are off in undefined state,
                // data can not be reloaded and yet it was not deleted, so what to do...
                console.error('don`t know how to handle ' + status + ' here!');
                handleError();
                break;
            }
          };
          if (msg.method !== 'read' && endpoint.localStore) {
            // revert modification by reloading data
            return model.fetch({
              url: url,
              error: deleteAndHandleError,
              success: saveAndHandleError,
              store: {} // really go to remote server
            });
          } else {
            // just give up and forward the error
            return removeAndHandleError();
          }
        }
      },
      success: function (data) {
        if (!that.isConnected) {
          that.onConnect(endpoint);
        }
        that.removeMessage(endpoint, msg, function (endpoint, msg) {
          if (options.success) {
            var resp = data;
            that.handleCallback(options.success, resp);
          } else if (data) {
            // no data if server asks not to alter state
            // that.setLastMessageTime(channel, msg.time);
            if (msg.method === 'read') {
              if (Bikini.isCollection(model) && _.isArray(data)) {
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
                        that.trigger('sync:' + channel, {
                          id: id,
                          method: 'update',
                          data: d
                        });
                      }
                    } else {
                      // create the item
                      that.trigger('sync:' + channel, {
                        id: id,
                        method: 'create',
                        data: d
                      });
                    }
                  }
                });
                Object.keys(ids).forEach(function (id) {
                  // delete the item
                  var m = ids[id];
                  that.trigger('sync:' + channel, {
                    id: id,
                    method: 'delete',
                    data: m.attributes
                  });
                });
              } else {
                // trigger an update to load the data read
                var array = _.isArray(data) ? data : [data];
                for (var i = 0; i < array.length; i++) {
                  data = array[i];
                  if (data) {
                    that.trigger('sync:' + channel, {
                      id: data[endpoint.entity.idAttribute] || data._id,
                      method: 'update',
                      data: data
                    });
                  }
                }
              }
            } else {
              that.trigger('sync:' + channel, msg);
            }
          }
        });
      },
      store: {}
    }]);
  },

  fetchChanges: function (endpoint) {
    var that = this;
    var channel = endpoint ? endpoint.channel : '';
    var time = that.getLastMessageTime(channel);
    if (endpoint && endpoint.baseUrl && channel && time) {
      var changes = new Bikini.Collection({});
      return changes.fetch({
        url: endpoint.baseUrl + 'changes/' + time,
        success: function (a, b, response) {
          changes.each(function (change) {
            var msg = change.attributes;
            that.onMessageStore(endpoint, msg);
          });
          return response.xhr;
        },
        credentials: endpoint.credentials
      });
    }
  },

  fetchServerInfo: function (endpoint) {
    var that = this;
    if (endpoint && endpoint.baseUrl) {
      var info = new Bikini.Model();
      var time = that.getLastMessageTime(endpoint.channel);
      var url = endpoint.baseUrl;
      if (url.charAt((url.length - 1)) !== '/') {
        url += '/';
      }
      return info.fetch({
        url: url + 'info',
        success: function (a, b, response) {
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
          return response.xhr;
        },
        credentials: endpoint.credentials
      });
    }
  },

  sendMessages: function (endpoint) {
    if (endpoint && endpoint.messages) {
      var that = this;
      endpoint.messages.each(function (message) {
        var msg;
        try {
          msg = JSON.parse(message.get('msg'));
        } catch (e) {
        }
        var channel = message.get('channel');
        if (msg && channel) {
          var model = that.createModel({
            collection: endpoint.messages
          }, msg.data);
          that.emitMessage(endpoint, msg, {
            error: that.options.error
          }, model);
        } else {
          message.destroy();
        }
      });
    }
  },

  mergeMessages: function (data, id) {
    return data;
  },

  storeMessage: function (endpoint, msg, callback) {
    if (endpoint && endpoint.messages && msg) {
      var channel = endpoint.channel;
      var message = endpoint.messages.get(msg._id);
      if (message) {
        var oldMsg = JSON.parse(message.get('msg'));
        message.save({
          msg: JSON.stringify(_.extend(oldMsg, msg))
        });
      } else {
        endpoint.messages.create({
          _id: msg._id,
          id: msg.id,
          msg: JSON.stringify(msg),
          channel: channel
        });
      }
    }
    return callback(endpoint, msg);
  },

  removeMessage: function (endpoint, msg, callback) {
    if (endpoint && endpoint.messages) {
      var message = endpoint.messages.get(msg._id);
      if (message) {
        message.destroy();
      }
    }
    return callback(endpoint, msg);
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
