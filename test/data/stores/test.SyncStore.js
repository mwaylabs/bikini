describe('Relution.LiveData.SyncStore', function() {
  this.timeout(5000 * 1000);

  var TEST = {
    data: {
      firstName: 'Max',
      sureName: 'Mustermann',
      age: 33
    }
  };
  it('creating store', function() {

    assert.isString(serverUrl, 'Server url is defined.');

    assert.isFunction(Relution.LiveData.SyncStore, 'Relution.LiveData.SyncStore is defined');

    TEST.store = Relution.LiveData.SyncStore.design({
      useLocalStore: true,
      useSocketNotify: false
    });

    assert.isObject(TEST.store, 'store successfully created.');
  });

  it('creating collection', function() {

    assert.isFunction(Relution.LiveData.Collection, 'Relution.LiveData.Collection is defined');

    TEST.TestModel = Relution.LiveData.Model.extend({
      idAttribute: '_id',
      entity: 'test'
    });

    assert.isFunction(TEST.TestModel, 'TestModel model successfully extended.');

    TEST.url = serverUrl + '/relution/livedata/test/';

    TEST.TestsModelCollection = Relution.LiveData.Collection.extend({
      model: TEST.TestModel,
      url: TEST.url,
      store: TEST.store,
      options: {
        sort: { sureName: 1 },
        fields: { USERNAME: 1, sureName: 1, firstName: 1, age: 1 },
        query: { age: { $gte: 25 } }
      }
    });

    assert.isFunction(TEST.TestsModelCollection, 'Test collection successfully extended.');

    TEST.Tests = TEST.TestsModelCollection.create();

    assert.isObject(TEST.Tests, 'Test collection successfully created.');

    assert.equal(TEST.Tests.store, TEST.store, 'Test collection has the correct store.');

    var url = TEST.Tests.getUrl();

    assert.ok(url !== TEST.url, 'The base url has been extended.');

    assert.equal(url.indexOf(TEST.url), 0, 'the new url starts with the set url.');

    assert.ok(url.indexOf('query=') > 0, 'query is part of the url.');

    assert.ok(url.indexOf('fields=') > 0, 'fields is part of the url.');

    assert.ok(url.indexOf('sort=') > 0, 'sort is part of the url.');

    // try to clean everything
    TEST.store.clear(TEST.Tests);

  });

  it('create record', function(done) {
    TEST.Tests.create(TEST.data,
      {
        success: function(model) {
          assert.isObject(model, 'new record created successfully.');

          TEST.id = model.id;

          assert.ok(TEST.id, 'new record has an id.');
          done();
        },
        error: backbone_error(done)
      }
    );
  });

  it('get record', function() {
    var model = TEST.Tests.get(TEST.id);

    assert.ok(model, "record found");

    assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
    assert.equal(model.get('sureName'), TEST.data.sureName, "found record has the correct 'sureName' value");
    assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");

  });

  it('fetching data with new model', function(done) {

    TEST.TestModel2 = Relution.LiveData.Model.extend({
      url: TEST.url,
      idAttribute: '_id',
      store: TEST.store,
      entity: 'test'
    });

    var data = { _id: TEST.id };
    var model = TEST.TestModel2.create(data);

    assert.isObject(model, "new model created");

    assert.ok(_.isEqual(model.attributes, data), "new model holds correct data attributes");

    model.fetch({
      success: function() {
        assert.ok(true, 'model has been fetched.');
        assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
        // following is different to other tests as TEST.store does not recreate localStore and thus does not see entity change
        assert.equal(model.get('sureName'), TEST.data.sureName, "found record has the correct 'USERNAME' value");
        assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");
        done();
      },
      error: backbone_error(done)
    });
  });

  it('fetching model with no id using callbacks', function(done) {
    TEST.TestModel2 = Relution.LiveData.Model.extend({
      url: TEST.url,
      idAttribute: '_id',
      store: TEST.store,
      entity: 'test'
    });

    var model = TEST.TestModel2.create({});
    model.fetch({
      success: function(model) {
        backbone_error(done)(model, new Error('this should have failed!'));
      },
      error: function() {
        done();
      }
    });
  });

  it('fetching model with empty-string id using promises', function(done) {
    TEST.TestModel2 = Relution.LiveData.Model.extend({
      url: TEST.url,
      idAttribute: '_id',
      store: TEST.store,
      entity: 'test'
    });

    var model = TEST.TestModel2.create({
      _id: ''
    });
    model.fetch().then(function() {
      throw new Error('this should have failed!');
    },
      function() {
        return model;
      }).then(function(model) {
        done();
        return model;
      }, function(error) {
        backbone_error(done)(model, error);
        return model;
      }).done();
  });

  it('fetching collection', function(done) {
    TEST.Tests.reset();
    assert.equal(TEST.Tests.length, 0, 'reset has cleared the collection.');

    TEST.Tests.fetch({
      success: function(collection) {
        assert.isObject(TEST.Tests.get(TEST.id), 'The model is still there');
        done();
      },
      error: backbone_error(done)
    });
  });

  it('get record', function() {
    var model = TEST.Tests.get(TEST.id);

    assert.ok(model, "record found");

    assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
    assert.equal(model.get('sureName'), TEST.data.sureName, "found record has the correct 'sureName' value");
    assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");

  });

  // following test checks client-side behavior in case server-side alters object ID on update:
  //
  // 1. The test temporarily overwrites the ajax() method to modify response data, substituting new
  //    by old id.
  // 2. Then the synced collection is checked to contain correct data and that lookup by ids works
  //    such that an old id lookup no longer finds data and a new id lookup yields the existing record.
  // 3. The update operation is repeated substituting old id by new id to revert into correct state again.
  // 4. Finally the restored state is checked.
  //
  // In effect the ID change is done twice. This is to avoid failure in subsequent tests which attempt
  // to delete records. Since we modified the IDs by tweaking the HTTP response data in the ajax call,
  // the actual server does not know about the ID changes. Thus, deletions in subsequent tests would
  // fail, if we did not change the ID back again!
  it('change record id', function(done) {
    var model = TEST.Tests.get(TEST.id);
    assert.ok(model, 'record found');
    var oldId = model.id;
    var newId = '4711-' + oldId;

    var TestModel = Relution.LiveData.Model.extend({
      url: TEST.url,
      idAttribute: '_id',
      store: TEST.store,
      entity: 'test',

      ajax: function(options) {
        // following simulates server reassigning ID value
        return Relution.LiveData.Model.prototype.ajax.apply(this, arguments).then(function(response) {
          if (response._id === oldId) {
            response._id = newId;
          } else if (response._id === newId) {
            response._id = oldId;
          }
          return reject(response);
        });
      }
    });
    var testModel = new TestModel(model.attributes);

    var options = {
      wait: true
    };
    var promise = testModel.save(undefined, options);
    return promise.then(function() {
      assert.ok(testModel.id, 'record has an id.');
      assert.equal(testModel.id, newId, 'record has new id.');
      assert.equal(TEST.Tests.get(testModel.id), model, 'model is found in collection by new id.');
      assert.isUndefined(TEST.Tests.get(oldId), 'model is missing in collection by old id.');
    }).then(function() {
      // reverts local changes
      return testModel.save(undefined, options).then(function() {
        assert.ok(testModel.id, 'record has an id.');
        assert.equal(testModel.id, oldId, 'record has new id.');
        assert.equal(TEST.Tests.get(testModel.id), model, 'model is found in collection by old id.');
        assert.isUndefined(TEST.Tests.get(newId), 'model is missing in collection by new id.');
      });
    }).then(done, backbone_error(done));
  });

  it('delete record', function(done) {
    var model = TEST.Tests.get(TEST.id);

    assert.isObject(model, 'model found in collection');

    assert.equal(model.id, TEST.id, 'model has the correct id');

    model.destroy(
      {
        success: function(model) {
          assert.ok(true, 'record has been deleted.');
          done();
        },
        error: backbone_error(done)
      });
  });

  it('cleanup records', function(done) {

    if (TEST.Tests.length === 0) {
      done();
    } else {
      var model, hasError = false, isDone = false;
      TEST.Tests.models.forEach(function(model) {
        if (!hasError) {
          model.destroy({
            success: function() {
              if (TEST.Tests.length == 0 && !isDone) {
                isDone = true;
                assert.equal(TEST.Tests.length, 0, 'collection is empty');
                done();
              }
            },
            error: function(model, error) {
              hasError = isDone = true;
              backbone_error(done).apply(this, arguments);
            }
          });
        }
      });
    }
  });
});

describe('Relution.LiveData.SyncStore Offline Model Save Test', function() {
  var model = null;
  var Store = null
  var modelType = null;
  var db = null;

  before(function() {
    Store = Relution.LiveData.SyncStore.design({
      useLocalStore: true,
      useSocketNotify: false
    });

    modelType = Relution.LiveData.Model.extend({
      idAttribute: 'id',
      entity: 'User',
      store: Store,
      url: serverUrl + '/user',
      defaults: {
        username: 'admin',
        password: 'admin'
      },
      ajax: function(resp) {
        return Q.reject({
          status: -1,
          error: {
            stack: 'Not Online'
          }
        });
      }
    });

    model = new modelType({ id: '12312' });
  });

  it('check model has attributes', function(done) {
    assert.equal(model.idAttribute, 'id');
    assert.equal(model.get('username'), 'admin');
    assert.equal(model.get('password'), 'admin');
    assert.equal(model.get('id'), '12312');
    done();
  });

  it('not saved on Server but must be websql', function(done) {
    var username = 'offline';

    model.save({ username: username }).then(function() {
      var db = openDatabase('relution-livedata', '', '', 1024 * 1024);
      var channel = model.store.endpoints[Object.keys(model.store.endpoints)[0]].channel;
      var query = 'SELECT * FROM \'' + channel + '\' WHERE id =?';

      Relution.LiveData.Debug.trace(query);

      db.transaction(
        function(tx) {
          tx.executeSql(query, [model.get('id')], function(tx, table) {
            Relution.LiveData.Debug.trace('execute', table.rows[0].data);
            assert.equal(table.rows.length, 1)
            var tempModel = JSON.parse(table.rows[0].data);
            assert.equal(tempModel.username, username);
            assert.equal(tempModel.username, model.get('username'));

            Relution.LiveData.Debug.trace('execute done');
            done();
          }, function(foo, error) {
            done(error);
          });
        },
        function(foo, error) {
          done(error);
        }
      );
    });
  });

  it('not saved on Server but must be in websql msg-table', function(done) {
    var username = 'message-offline-test';

    model.save({ username: username }).then(function() {

      var db = openDatabase('relution-livedata', '', '', 1024 * 1024);
      var channel = model.store.endpoints[Object.keys(model.store.endpoints)[0]].channel;
      var query = 'SELECT * FROM \'msg-' + channel + '\' WHERE id =?';

      db.transaction(
        function(tx) {
          tx.executeSql(query, [model.get('id')], function(tx, table) {
            assert.equal(table.rows.length, 1)
            var tempModel = JSON.parse(table.rows[0].data);
            assert.equal(tempModel.data.username, username);
            assert.equal(tempModel.data.username, model.get('username'));

            done();
          }, function(foo, error) {
            done(error);
          });
        },
        function(foo, error) {
          done(error);
        }
      );
    });
  });
});
