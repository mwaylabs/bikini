describe('Relution.LiveData.LocalStorageStore', function () {

  var TEST = {};

  it('creating local storage store', function () {

    assert.typeOf(Relution.LiveData.LocalStorageStore, 'function', 'Relution.LiveData.LocalStorageStore is defined');

    TEST.store = Relution.LiveData.LocalStorageStore.design();

    assert.typeOf(TEST.store, 'object', 'store successfully created.');
  });

  TEST.dropEntityTest = function (done) {
    TEST.store.drop({
      entity: {
        name: 'test'
      },
      success: function () {
        assert.ok(true, 'drop table test');
        done();
      },
      error: backbone_error(done)
    });
  };

  it('simple model with LocalStorageStore', function (done) {

    TEST.SimpleModel = Relution.LiveData.Model.extend({
      store: Relution.LiveData.LocalStorageStore.create(),
      entity: 'test'
    });

    assert.typeOf(TEST.SimpleModel, 'function', 'Simple model successfully extended.');

    TEST.Simple = TEST.SimpleModel.create({
      firstname: 'Max',
      lastname: 'Mustermann'
    });

    assert.typeOf(TEST.Simple, 'object', 'Simple model successfully created.');

    TEST.Simple.save({}, // save existing data
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


  it('simple collection with LocalStorageStore', function (done) {

    TEST.SimpleModelCollection = Relution.LiveData.Collection.extend({
      store: Relution.LiveData.LocalStorageStore.create(),
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

  it('drop table', TEST.dropEntityTest);

  it('creating collection', function () {

    assert.typeOf(Relution.LiveData.Collection, 'function', 'Relution.LiveData.Collection is defined');

    TEST.TestModel = Relution.LiveData.Model.extend({
      idAttribute: '_id',
      entity: {
        name: 'test',
        fields: {
          _id: {type: Relution.LiveData.DATA.TYPE.STRING, required: true},
          sureName: {name: 'USERNAME', type: Relution.LiveData.DATA.TYPE.STRING, required: true},
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

    TEST.Test = TEST.TestModelCollection.create();

    assert.typeOf(TEST.Test, 'object', 'Test collection successfully created.');

    assert.ok(TEST.Test.store === TEST.store, 'Test collection has the correct store.');

  });

  it('create record', function (done) {
    TEST.data = {
      firstName: 'Max',
      sureName: 'Mustermann',
      age: 33
    };

    TEST.Test.create(TEST.data,
      {
        success: function (model) {
          assert.ok(model, 'new record created successfully.');

          TEST.id = model.id;

          assert.ok(TEST.id, 'new record has an id.');
          assert.equal(model.get('firstName'), TEST.data.firstName, "created record has the correct 'firstname' value");
          assert.equal(model.get('sureName'), TEST.data.sureName, "created record has the correct 'sureName' value");
          assert.equal(model.get('age'), TEST.data.age, "created record has the correct 'age' value");

          done();
        },
        error: backbone_error(done)
      }
    );
  });

  it('read record', function () {
    var model = TEST.Test.get(TEST.id);

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
        assert.equal(model.get('firstName'), TEST.data.firstName, "found record has the correct 'firstname' value");
        assert.equal(model.get('USERNAME'), TEST.data.sureName, "found record has the correct 'USERNAME' value");
        assert.equal(model.get('age'), TEST.data.age, "found record has the correct 'age' value");
        done();
      },
      error: backbone_error(done)
    })
  });

  it('delete record', function (done) {
    TEST.Test.get(TEST.id).destroy(
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
    TEST.Test.fetch({
      success: function (collection) {
        assert.ok(true, 'Test collection fetched successfully.');
        TEST.count = TEST.Test.length;
        done();
      },
      error: backbone_error(done)
    });
  });

  it('cleanup records local storage', function (done) {

    if (TEST.Test.length === 0) {
      done();
    } else {
      var model, hasError = false, isDone = false;
      TEST.Test.models.forEach(function (model) {
        if (!hasError) {
          model.destroy({
            success: function () {
              if (TEST.Test.length == 0 && !isDone) {
                isDone = true;
                assert.equal(TEST.Test.length, 0, 'collection is empty');
                done();
              }
            },
            error: function (model, error) {
              hasError = isDone = true;
              backbone_error(done).apply(this, arguments);
            }
          });
        }
      });
    }
  });

});
