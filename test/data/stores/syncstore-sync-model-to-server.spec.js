describe('Relution.LiveData.SyncStore Offline Online sync', function() {
  this.timeout(8000);
  var model = null;
  var Store = null
  var modelType = null;
  var db = null;
  var serverUrl = "http://localhost:8200";
  var promise = null;

  beforeEach(function() {
    Store = Relution.LiveData.SyncStore.design({
      useLocalStore: true,
      useSocketNotify: false
    });

    modelType = Relution.LiveData.Model.extend({
      idAttribute: 'id',
      entity: 'User',
      store: Store,
      urlRoot: serverUrl + '/relution/livedata/user/'
    });
    model = new modelType({id: '12312'});
    promise = model.fetch();
  });

  it('fetch model sync to server', function(done) {
    var haveTobe = {
      username: 'message-offline-test',
      password: 'admin',
      id: '12312'
    };
    return promise.then(function() {
      Object.keys(model.attributes).forEach(function (attr) {
        assert.ok(assert.equal(model.get(attr), haveTobe[attr]), 'model has same ' + attr);
      });
    }).finally(done);
  });

  it('listen on sync EventEmitter and msg table have to be no entry with this model', function (done) {
    return model.on('sync', function () {
      var db = openDatabase('relution-livedata', '', '', 1024 * 1024);
      var channel = model.store.endpoints[Object.keys(model.store.endpoints)[0]].channel;
      var query = 'SELECT * FROM \'__msg__\' WHERE id = ?';
      return db.transaction(
        function(tx) {
          return tx.executeSql(query, [model.entity + '~' + model.get('id')], function(tx, table) {
            assert.equal(table.rows.length, 0);
            return done();
          });
        },
        function(error) {
          return done(error);
        }
      );
    });
  })

  it ('delete model from db', function (done) {
    return model.destroy().then(function () {
      var db = openDatabase('relution-livedata', '', '', 1024 * 1024);
      var channel = model.store.endpoints[Object.keys(model.store.endpoints)[0]].channel;
      var query = 'SELECT * FROM \'' + channel + '\' WHERE id =?';

      return db.transaction(
        function(tx) {
          return tx.executeSql(query, [model.get('id')], function(tx, table) {
            assert.equal(table.rows.length, 0);
            return done();
          });
        },
        function(error) {
          return done(error);
        }
      );
    });
  });
});
