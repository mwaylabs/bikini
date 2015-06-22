describe('Relution.LiveData.WebSqlStore', function () {

  var TEST = {
    data: {
      firstName: 'Max',
      sureName: 'Mustermann',
      age: 33
    }
  };

  it('creating websql store', function () {

    assert.typeOf(window.openDatabase, 'function', 'Browser supports WebSql');

    assert.typeOf(Relution.LiveData.WebSqlStore, 'function', 'Relution.LiveData.LocalStorageStore is defined');

    TEST.store = Relution.LiveData.WebSqlStore.design();

    assert.typeOf(TEST.store, 'object', 'store successfully created.');

  });


  TEST.dropTableTest = function (done) {
    TEST.store.drop({
      entity: 'test',
      success: function () {
        assert.ok(true, 'drop table test');
        done();
      },
      error: backbone_error(done)
    });
  };

  it('drop table', TEST.dropTableTest);

  it('simple websql store', function (done) {

    TEST.SimpleModel = Relution.LiveData.Model.extend({
      idAttribute: '_id'
    });

    assert.typeOf(TEST.SimpleModel, 'function', 'SimpleModel model successfully extended.');

    TEST.SimpleModelCollection = Relution.LiveData.Collection.extend({
      model: TEST.SimpleModel,
      store: new Relution.LiveData.WebSqlStore(),
      entity: 'test'
    });

    assert.typeOf(TEST.SimpleModelCollection, 'function', 'Simple collection successfully extended.');

    TEST.Simple = TEST.SimpleModelCollection.create();

    assert.typeOf(TEST.Simple, 'object', 'Simple collection successfully created.');

    TEST.Simple.create(TEST.data,
      {
        success: function (model) {
          assert.ok(model, 'new record exists.');

          TEST.id = model.id;

          assert.ok(TEST.id, 'new record has an id.');

          done();
        },
        error: backbone_error(done)
      }
    );
  });

  it('drop table', TEST.dropTableTest);


  it('creating collection', function () {

    assert.typeOf(Relution.LiveData.Collection, 'function', 'Relution.LiveData.Collection is defined');

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

    assert.typeOf(TEST.TestModel, 'function', 'TestModel model successfully extended.');

    TEST.TestModelCollection = Relution.LiveData.Collection.extend({
      model: TEST.TestModel,
      store: TEST.store
    });

    assert.typeOf(TEST.TestModelCollection, 'function', 'Test collection successfully extended.');

    TEST.Tests = TEST.TestModelCollection.create();

    assert.typeOf(TEST.Tests, 'object', 'Test collection successfully created.');

    assert.ok(TEST.Tests.store === TEST.store, 'Test collection has the correct store.');

  });

  it('create record 1', function (done) {

    TEST.Tests.create(TEST.data,
      {
        success: function (model) {
          assert.ok(model, 'new record exists.');

          TEST.id = model.id;

          assert.ok(TEST.id, 'new record has an id.');

          done();
        },
        error: backbone_error(done)
      }
    );
  });

  it('create record 2', function (done) {

    TEST.Tests.create(TEST.data,
      {
        success: function (model) {
          assert.ok(model, 'new record exists.');

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
      idAttribute: '_id',
      store: TEST.store,
      entity: {
        name: 'test'
      }
    });

    var model = TEST.TestModel2.create({_id: TEST.id});

    assert.isObject(model, "new model created");

    model.fetch({
      success: function () {
        assert.ok(true, 'model has been fetched.');
        assert.equal(model.id, TEST.id, "found record has the correct id");
        assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
        assert.equal(model.get('USERNAME'), TEST.data.sureName, "found record has the correct 'USERNAME' value");
        assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");
        done();
      },
      error: backbone_error(done)
    })
  });

  it('delete record', function (done) {
    TEST.Tests.get(TEST.id).destroy(
      {
        success: function (model) {
          assert.ok(true, 'record has been deleted.');
          done();
        },
        error: backbone_error(done)
      }
    );
  });

  it('fetching collection', function (done) {
    TEST.Tests.fetch({
      success: function (collection) {
        assert.ok(true, 'Test collection fetched successfully.');
        TEST.count = TEST.Tests.length;
        done();
      },
      error: backbone_error(done)
    });
  });

  it('cleanup records websql', function (done) {

    if (TEST.Tests.length === 0) {
      done();
    } else {
      TEST.Tests.on('all', function (event) {
        if (event === 'destroy' && TEST.Tests.length == 0) {
          done();
        }
      });
      var model;
      while (model = TEST.Tests.first()) {
        model.destroy();
      }
    }
  });

  it('drop table', TEST.dropTableTest);

  it('create record (no schema)', function (done) {

    TEST.Tests2 = Relution.LiveData.Collection.design({
      model: TEST.TestModel2,
      store: TEST.store
    });

    assert.isObject(TEST.Tests2, "Relution.LiveData.Collection.design created a new collection");

    TEST.data = {
      firstName: 'Max',
      sureName: 'Mustermann',
      age: 33
    };

    TEST.Tests2.create(TEST.data,
      {
        success: function (model) {
          assert.ok(model, 'new record exists.');

          TEST.id = model.id;

          assert.ok(TEST.id, 'new record has an id.');

          done();
        },
        error: backbone_error(done)
      }
    );
  });

  it('read record', function () {
    var model = TEST.Tests2.get(TEST.id);

    assert.ok(model, "record found");

    assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
    assert.equal(model.get('sureName'), TEST.data.sureName, "found record has the correct 'sureName' value");
    assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");

  });

  it('drop table', TEST.dropTableTest);

});
