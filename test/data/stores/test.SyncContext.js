/**
 * test.SyncContext.js
 *
 * Created by Thomas Beckmann on 01.07.2015
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

var makeApprovals;
var serverUrl;

describe('Relution.LiveData.SyncContext', function () {

  // prepare model/collection types
  var store = Relution.LiveData.SyncStore.design({
  });
  var Model = Relution.LiveData.Model.extend({
    idAttribute: 'id',
    entity: {
      name: 'approval'
    }
  });
  var Collection = Relution.LiveData.Collection.extend({
    model: Model,
    store: store,
    url: serverUrl + '/relution/livedata/approvals/'
  });

  // loads data using collection, returns promise on collection, collection is empty afterwards
  function loadCollection(collection, data) {
    return collection.fetch().then(function () {
      // delete all before running tests
      if (collection.models.length === 0)
        return collection;

      var map = [];
      collection.models.forEach(function (model) {
        return map.push(model.destroy());
      });

      return Q.all(map).then(function (destroyed) {
        assert.equal(collection.models.length, 0, 'collection must be empty initially after destroy');
        return collection;
      });
    }).then(function (collection) {
      // load sample data into fresh database
      return Q.all(data.map(function (attrs) {
        return new Model(attrs, {
          collection: collection
        }).save();
      })).then(function() {
        assert.equal(collection.models.length, 0, 'collection must be empty initially after load');
        return collection;
      });
    });
  }

  // chains async done callback completing promise chain
  function chainDone(promise, done) {
    return promise.then(function () {
      return done();
    }, function (error) {
      return done(error || 'no error given');
    }).done();
  }

  it('infinite scrolling', function (done) {
    var approvals = makeApprovals();
    var ids = [];
    approvals.forEach(function(approval){
      if (ids.indexOf(approval.id) === -1)
        ids.push(approval.id)
    });
    console.log('ids length', ids.length);
    console.log('approvals length', approvals.length);
    var collection = new Collection();
    return chainDone(loadCollection(collection, approvals), done);
  });

});
