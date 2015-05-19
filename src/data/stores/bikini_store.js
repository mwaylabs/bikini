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
    this.options.query = options.query || false;
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
      var hash = this._locationBasedHashCode(url);
      var credentials = entity.credentials || collection.credentials;
      var user = credentials && credentials.username ? credentials.username : '';
      var channel = name + user + hash;
      collection.channel = channel;
      // get or create endpoint for this url
      var that = this;
      var endpoint = this.endpoints[hash];
      if (!endpoint) {
        var href = this.getLocation(url);
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
      collection.listenTo(this, endpoint.channel, this.onMessage, collection);
    }
  },

  getEndpoint: function (url) {
    console.log('Bikini.BikiniStore.getEndpoint');
    if (url) {
      var hash = this._locationBasedHashCode(url);
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
      var href = this.getLocation(url);
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
      var channel = endpoint.channel;
      endpoint.socket.on(channel, function (msg) {
        if (msg) {
          that.trigger(channel, msg);
          if (that.options.useLocalStore) {
            that.setLastMessageTime(channel, msg.time);
          }
        }
      });
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
      socket.emit('bind', {
        entity: name,
        channel: channel,
        time: time
      });
    }
  },

  getLastMessageTime: function (channel) {
    if (this.lastMesgTime !== undefined) {
      return this.lastMesgTime;
    }
    console.log('Bikini.BikiniStore.getLastMessageTime');
    this.lastMesgTime = localStorage.getItem('__' + channel + 'lastMesgTime') || 0;
    return this.lastMesgTime;
  },

  setLastMessageTime: function (channel, time) {
    if (!time || time > this.getLastMessageTime()) {
      console.log('Bikini.BikiniStore.setLastMessageTime');
      localStorage.setItem('__' + channel + 'lastMesgTime', time);
      this.lastMesgTime = time;
    }
  },

  _hashCode: function (str) {
    console.log('Bikini.BikiniStore._hashCode');
    var hash = 0, char;
    if (str.length === 0) {
      return hash;
    }
    for (var i = 0, l = str.length; i < l; i++) {
      char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },

  _locationBasedHashCode: function (str) {
    console.log('Bikini.BikiniStore._locationBasedHashCode');
    return this._hashCode(this._getLocationUrl(str));
  },

  _getLocationUrl: function (str) {
    console.log('Bikini.BikiniStore._getLocationUrl');
    return this.getLocation(str).toString();
  },

  _getLocation: function (url) {
    console.log('Bikini.BikiniStore._getLocation');
    var location = document.createElement('a');
    location.href = url || this.url;
    // IE doesn't populate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    if (location.host === '') {
      location.href = location.href;
    }
    return location;
  },

  onConnect: function (endpoint) {
    console.log('Bikini.BikiniStore.onConnect');
    if (!this.isConnected) {
      this.isConnected = true;
      this.fetchChanges(endpoint);
      this.sendMessages(endpoint);
    }
  },

  onDisconnect: function (endpoint) {
    console.log('Bikini.BikiniStore.onDisconnect');
    if (this.isConnected) {
      this.isConnected = false;
      if (endpoint.socket && endpoint.socket.socket) {
        endpoint.socket.socket.onDisconnect();
      }
    }
  },

  onMessage: function (msg) {
    console.log('Bikini.BikiniStore.onMessage');
    if (!msg) {
      return;
    }
    var localStore = this.endpoint ? this.endpoint.localStore : null;
    var attrs = null;
    var method = null;
    var id = null;
    var options = {
      store: localStore,
      entity: this.entity,
      merge: true,
      fromMessage: true,
      parse: true
    };
    if (msg.id && msg.method) {
      attrs = msg.data || {};
      method = msg.method;
      id = msg.id;
    } else if (msg.attributes) {
      attrs = msg.attributes.data;
      method = msg.attributes.method;
      id = msg.attributes.id;
    }

    switch (method) {
      case 'patch':
      case 'update':
      case 'create':
        options.patch = method === 'patch';
        var model = id ? this.get(id) : null;
        if (model) {
          model.save(attrs, options);
        } else {
          this.create(attrs, options);
        }
        break;
      case 'delete':
        if (id) {
          if (id === 'all') {
            while ((model = this.first())) {
              if (localStore) {
                localStore.sync.apply(this, [
                  'delete',
                  model,
                  {store: localStore, fromMessage: true}
                ]);
              }
              this.remove(model);
            }
            this.store.setLastMessageTime(this.endpoint.channel, '');
          } else {
            var msgModel = this.get(id);
            if (msgModel) {
              msgModel.destroy(options);
            }
          }
        }
        break;

      default:
        break;
    }

  },

  sync: function (method, model, options) {
    //debugger;
    console.log('Bikini.BikiniStore.sync');
    var that = options.store || this.store;
    if (options.fromMessage) {
      return that.handleCallback(options.success);
    }
    var endpoint = that.getEndpoint(this.getUrlRoot());
    var promise = null;
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
      } else if (method === 'read') {
        promise = that.fetchChanges(endpoint);
      }
      if (endpoint.localStore) {
        options.store = endpoint.localStore;
        endpoint.localStore.sync.apply(this, arguments);
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
          var saveAndHandleError = function(model, data) {
            // original request failed and the code below reloaded the data to revert the local modifications, which succeeded...
            that.trigger(channel, {
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
                that.trigger(channel, {
                  _id: model.id,
                  id: model.id,
                  method: 'delete'
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
              var array = _.isArray(data) ? data : [data];
              for (var i = 0; i < array.length; i++) {
                data = array[i];
                if (data) {
                  that.trigger(channel, {
                    id: data[endpoint.entity.idAttribute] || data._id,
                    method: 'update',
                    data: data
                  });
                }
              }
            } else {
              that.trigger(channel, msg);
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
          changes.each(function (msg) {
            if (msg.get('time') && msg.get('method')) {
              if (that.options.useLocalStore) {
                that.setLastMessageTime(channel, msg.get('time'));
              }
              that.trigger(channel, msg);
            }
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
          var model = that.createModel({collection: endpoint.messages}, msg.data);
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
  },

  /*
   url = "http://example.com:3000/pathname/?search=test#hash";

   location.protocol; // => "http:"
   location.host;     // => "example.com:3000"
   location.hostname; // => "example.com"
   location.port;     // => "3000"
   location.pathname; // => "/pathname/"
   location.hash;     // => "#hash"
   location.search;   // => "?search=test"
   */
  getLocation: function (url) {
    var location = document.createElement('a');
    location.href = url || this.url;
    // IE doesn't populate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    if (location.host === '') {
      location.href = location.href;
    }
    return location;
  }
});
