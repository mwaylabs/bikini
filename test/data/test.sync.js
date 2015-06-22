describe('Relution.LiveData.SyncStore', function () {
  this.timeout(5000);

  var TEST = {
    data: {
      firstName: 'Max',
      sureName: 'Mustermann',
      age: 33
    }
  };

  it('creating store', function () {

    assert.isString(serverUrl, 'Server url is defined.');

    assert.isFunction(Relution.LiveData.SyncStore, 'Relution.LiveData.SyncStore is defined');

    TEST.store = Relution.LiveData.SyncStore.design({
      useLocalStore: true,
      useSocketNotify: false
    });

    assert.isObject(TEST.store, 'store successfully created.');
  });

  it('creating collection', function () {

    assert.isFunction(Relution.LiveData.Collection, 'Relution.LiveData.Collection is defined');

    TEST.TestModel = Relution.LiveData.Model.extend({
      idAttribute: '_id',
      entity: {
        name: 'test',
        fields: {
          _id: {type: Relution.LiveData.DATA.TYPE.STRING, required: true, index: true},
          sureName: {name: 'USERNAME', type: Relution.LiveData.DATA.TYPE.STRING, required: true, index: true},
          firstName: {type: Relution.LiveData.DATA.TYPE.STRING, length: 200},
          age: {type: Relution.LiveData.DATA.TYPE.INTEGER}
        }
      }
    });

    assert.isFunction(TEST.TestModel, 'TestModel model successfully extended.');

    TEST.url = serverUrl + '/relution/livedata/test/';

    TEST.TestsModelCollection = Relution.LiveData.Collection.extend({
      model: TEST.TestModel,
      url: TEST.url,
      store: TEST.store,
      options: {
        sort: {sureName: 1},
        fields: {USERNAME: 1, sureName: 1, firstName: 1, age: 1},
        query: {age: {$gte: 25}}
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

  it('create record', function (done) {
    TEST.Tests.create(TEST.data,
      {
        success: function (model) {
          assert.isObject(model, 'new record created successfully.');

          TEST.id = model.id;

          assert.ok(TEST.id, 'new record has an id.');
          done();
        },
        error: backbone_error(done)
      }
    );
  });

  it('read record', function () {
    var model = TEST.Tests.get(TEST.id);

    assert.ok(model, "record found");

    assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
    assert.equal(model.get('sureName'), TEST.data.sureName, "found record has the correct 'sureName' value");
    assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");

  });

  it('fetching data with new model', function (done) {

    TEST.TestModel2 = Relution.LiveData.Model.extend({
      url: TEST.url,
      idAttribute: '_id',
      store: TEST.store,
      entity: {
        name: 'test'
      }
    });

    var data = {_id: TEST.id};
    var model = TEST.TestModel2.create(data);

    assert.isObject(model, "new model created");

    assert.ok(_.isEqual(model.attributes, data), "new model holds correct data attributes");

    model.fetch({
      success: function () {
        assert.ok(true, 'model has been fetched.');
        assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
        assert.equal(model.get('USERNAME'), TEST.data.sureName, "found record has the correct 'USERNAME' value");
        assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");
        done();
      },
      error: backbone_error(done)
    })
  });

  it('fetching collection', function (done) {
    TEST.Tests.reset();
    assert.equal(TEST.Tests.length, 0, 'reset has cleared the collection.');

    TEST.Tests.fetch({
      success: function (collection) {
        assert.isObject(TEST.Tests.get(TEST.id), 'The model is still there');
        done();
      },
      error: backbone_error(done)
    });
  });


  it('read record', function () {
    var model = TEST.Tests.get(TEST.id);

    assert.ok(model, "record found");

    assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
    assert.equal(model.get('sureName'), TEST.data.sureName, "found record has the correct 'sureName' value");
    assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");

  });

  it('delete record', function (done) {
    var model = TEST.Tests.get(TEST.id);

    assert.isObject(model, 'model found in collection');

    assert.equal(model.id, TEST.id, 'model has the correct id');

    model.destroy(
      {
        success: function (model) {
          assert.ok(true, 'record has been deleted.');
          done();
        },
        error: backbone_error(done)
      });
  });

  it('cleanup records', function (done) {

    if (TEST.Tests.length === 0) {
      done();
    } else {
      var model, hasError = false, isDone = false;
      while ((model = TEST.Tests.first()) && !hasError) {
        model.destroy({
          success: function () {
            if (TEST.Tests.length == 0 && !isDone) {
              isDone = true;
              assert.equal(TEST.Tests.length, 0, 'collection is empty');
              done();
            }
          },
          error: function (model, error) {
            hasError = isDone = true;
            backbone_error(done).apply(this, arguments);
          }
        });
      }
    }
  });

});
