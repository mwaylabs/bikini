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
  this.timeout(60000);

  // prepare model/collection types
  var store = new Relution.LiveData.SyncStore({
  });
  var Model = Relution.LiveData.Model.extend({
    idAttribute: 'id',
    entity: 'approval'
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
      return Q.all(collection.models.slice().map(function (model) {
        return model.destroy();
      })).then(function () {
        assert.equal(collection.models.length, 0, 'collection must be empty initially after destroy');
        return collection;
      });
    }).then(function (collection) {
      // load sample data into fresh database
      return Q.all(data.map(function (attrs) {
        return new Model(attrs, {
          collection: collection
        }).save();
      })).then(function () {
        assert.equal(collection.models.length, data.length, 'collection was updated by async events');
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

  var qApprovals;

  function loadApprovals() {
    if (!qApprovals) {
      var approvals = makeApprovals();
      var collection = new Collection();
      qApprovals = loadCollection(collection, approvals).then(function () {
        collection.stopListening(); // no longer live
        return approvals.sort(function (a, b) {
          return a.id.localeCompare(b.id);
        });
      });
    }
    return qApprovals;
  }

  it('preloads sample data', function (done) {
    return chainDone(loadApprovals(), done);
  });

  it('infinite scrolling', function (done) {
    var approvals;
    var collection = new Collection();
    var counter = 10;
    return chainDone(loadApprovals().then(function (data) {
      approvals = data;
      var options = {
        limit: counter,
        sortOrder: [ 'id' ]
      };
      return collection.fetch(options).thenResolve(options);
    }).then(function scroll(options) {
      assert.equal(collection.models.length, counter, 'number of models retrieved so far');
      assert.deepEqual(collection.models.map(function (x) {
        delete x.attributes._time; // server adds this, we don't want it
        return x.attributes;
      }), approvals.slice(0, counter), 'elements are fetched properly');
      if (options.end) {
        return options;
      }
      return collection.fetchMore(options).then(function (results) {
        if (results.length === 0) {
          assert.equal(options.end, true, 'at end of scrolling');
        } else {
          var oldCounter = counter;
          counter = Math.min(approvals.length, counter + 10);
          assert.equal(results.length, counter - oldCounter, 'number of results returned');
          assert.equal(options.more, true, 'can scroll more');
        }
        return options;
      }).then(scroll);
    }), done);
  });

  it('next/prev paging', function (done) {
    var approvals;
    var collection = new Collection();
    var i = 0;
    return chainDone(loadApprovals().then(function (data) {
      approvals = data;
      var options = {
        limit: 1,
        sortOrder: [ 'id' ]
      };
      return collection.fetch(options).thenResolve(options);
    }).then(function next(options) {
      assert.equal(collection.models.length, 1, 'number of models retrieved so far');
      assert.deepEqual(collection.models.map(function (x) {
        delete x.attributes._time; // server adds this, we don't want it
        return x.attributes;
      }), approvals.slice(i, i + 1), 'element fetched properly');
      if (!options.next && i > 1) {
        return options;
      }
      ++i;
      return collection.fetchNext(options).then(function (results) {
        assert.equal(options.prev, true, 'can page prev');
        assert.equal(results.length, 1, 'number of results returned');
        assert.equal(options.next, i + 1 < approvals.length, 'can page next');
        return options;
      }).then(next);
    }).then(function prev(options) {
      assert.equal(options.prev, i > 0, 'can page prev');
      assert.equal(options.next, i + 1 < approvals.length, 'can page next');
      if (!options.prev) {
        return options;
      }
      return collection.fetchPrev(options).then(function (results) {
        assert.equal(results.length, 1, 'number of results returned');
        assert.equal(collection.models.length, 1, 'number of models retrieved so far');
        assert.deepEqual(collection.models.map(function (x) {
          delete x.attributes._time; // server adds this, we don't want it
          return x.attributes;
        }), approvals.slice(i - 1, i), 'element fetched properly');
        --i;
        return options;
      }).then(prev);
    }), done);
  });

});
