

exports.listen = function(server, resource) {

    var io = require('socket.io').listen( server, { resource: resource } );

    // enable ore default transports
    io.set('transports', [
        'websocket',
        'xhr-polling',
        'jsonp-polling'
    ]);
    var livedata = {

        io: io,

        bindings: {},

        live: io.sockets.authorization(function (handshakeData, callback) {

            handshakeData.name = handshakeData.query.name;
            callback(null, true);

        }).on('connection', function (socket) {

            socket.on('bind', function(binding) {
                if (binding && binding.entity && binding.channel) {
                    var entity  = binding.entity;
                    var channel = binding.channel;
                    livedata.bindings[channel] = binding;

                    // listen to this channel
                    socket.on(channel, function(msg, fn) {
                        livedata.handleMessage(entity, msg, function(data, error) {

                            // if the response is an object message has succeeded
                            if (typeof data === 'object') {
                                msg.data = data;
                                msg.time = new Date().getTime();
                                msg.id   = data._id;
                                if (msg.method != 'read') {
                                    socket.broadcast.emit(channel, msg);
                                }
                            } else if (!error) {
                                error = typeof data === 'string' ? data : 'error processing message!';
                            }
                            // callback to the client, send error if failed
                            fn(msg, error);
                        });
                    });

                    // send update messages, saved since time
                    if (binding && binding.time) {
                        livedata.readMessages(entity, binding.time, function(msg) {
                            if (msg) {
                                socket.emit(channel, msg);
                            }
                        });
                    }
                }
            });
        }),

        handleMessage: function(entity, msg, callback) {
            if (msg && msg.method && msg.id && msg.data) {
                if (typeof callback === 'function') {
                    callback(msg.data);
                }
            }
        },

        sendMessage: function(entity, msg) {
            if (entity && msg && msg.method) {
                for (var channel in livedata.bindings) {
                    if (livedata.bindings[channel].entity === entity) {
                        io.sockets.emit(channel, msg);
                    }
                }
            }
        },

        readMessages: function(entity, time, callback) {
        }
    };

    return livedata;
};