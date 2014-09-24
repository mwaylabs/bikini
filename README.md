# Bikini

**Everything a model needs.**

[![Build Status](https://travis-ci.org/mwaylabs/bikini.svg?branch=v0.5.2)](https://travis-ci.org/mwaylabs/bikini)

## What is Bikini

**Bikini** lets you treat  being **offline** as a status. Not as an error.

You're developing a webapp for mobile browsers? You're damn right here!

With Bikini the user won't even notice that he is offline.
It also improves the user experience by decreasing response latency.

Another cool feature of Bikini is that it keeps your app in sync. This allows you to build high collaborative apps by using [socket.io](http://socket.io/).

Bikini is build on top of [Backbone.js](http://backbonejs.org/) which gives your web application structure.

![mcap mobility platform](http://blog.mwaysolutions.com/wp-content/uploads/2013/12/mway_bikini_blog04.jpg)

You should also have a lot at the [introducing blog-post about Bikini](http://blog.mwaysolutions.com/2013/12/20/offlineonline-synchronization-with-bikini-all-a-model-needs/).

## How to use
Using Bikini is like taking candy from a baby.

```
cd into your project
```

*install bikini via bower*, this will handle all dependencies for you and lets you easily update the library.
```
bower install -S bikini
```
add the libraries to your `.html` file
```html
<script src="bower_components/jquery/jquery.js"></script>
<script src="bower_components/underscore/underscore.js"></script>
<script src="bower_components/socket.io-client/socket.io.js"></script>
<script src="bower_components/backbone/backbone.js"></script>
<script src="bower_components/bikini/bikini.js"></script>
```

*now, let's set up the magic*

first, we need to define our Model and the according Collection
```js
// Configure the Model
// Attribute key to identify the data
var MyBikiniServiceModel = Bikini.Model.extend({
    idAttribute: '_id'
});

// Tell the collection the endpoint url and which model it should use.
// The entity is used for retrieving local stored data
var MyBikiniServiceCollection = Bikini.Collection.extend({
    model: MyBikiniServiceModel,
    entity: 'myBikiniService',
    url: 'http://nerds.mway.io:8200/bikini/contacts',
});
```


To fetch data, you can simply call the Backbonejs function fetch()
```js
var myCollection = new MyBikiniServiceCollection();
myBikiniServiceCollection.fetch();
```

You can listen to all the common Backbonejs events such as `sync`.
```js
myCollection.on('sync', function() {
    console.log(arguments);
});
```

### Event reference
See [backbonejs-events](http://backbonejs.org/#Events) for detailed information.

## Using Bikini with AngularJS
You are building your application with [AngularJS](https://angularjs.org/)? No problem. We provide a thin wrapper between Bikini and AngularJS.
All you need to do is to insert "[bikangular.js](mwaylabs/bikini/blob/master/bikangular/bikangular.js)".

```html
<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/underscore/underscore.js"></script>
<script src="bower_components/socket.io-client/socket.io.js"></script>
<script src="bower_components/backbone/backbone.js"></script>
<script src="bower_components/bikini/dist/bikini.js"></script>
<script src="bower_components/bikini/dist/bikangular.js"></script>
```

The reason for this wrapper is that if you are using AngularJS you are usally familiar with [Kris Kowal's Q-Promises](https://github.com/kriskowal/q). But since Bikini relies on Backbone, and Backbone uses jQuery to make requests, we get [jQuery-Promises](http://api.jquery.com/category/deferred-object/) if we make any requests. Also, AngularJS will not notice if any changes happend (2-way-binding).

We were able to fix that by using Angulars `$http` to perform requests.

## Contributing

### Get the Code

```bash

git clone git@github.com:mwaylabs/bikini.git
cd bikini
```

### Initialize Project

The script basicly checks if node is installed. Then `npm install` and `bower install` is called followed by setup of git hooks.

```bash
./init-repo.sh
```
### Test if it works

run the test command

```bash
npm test
```
