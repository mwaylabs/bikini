# Bikini - node Test Server

For use during development of a node.js based server features.

This is a working sample implementation for generating an endpoint for the bikini client library.

It uses [express](https://github.com/visionmedia/express), [socket.io](https://github.com/Automattic/socket.io), [mongodb](https://github.com/mongodb/node-mongodb-native).

# Installation
NOTE: You will need a [MongoDB](http://www.mongodb.org/) installed. If you have made any changes to the default configuration, make sure you set them in the `mongodb_rest.js`


Fist install the dependencies via npm

    npm install


# Start up your server app
Start your MongoDB if its not already running

	mongod

Start the node server

    node server.js