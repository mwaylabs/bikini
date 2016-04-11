describe('Relution.LiveData.SyncStore Offline Model Save To online Server sync', function() {
  this.timeout(8000);
  var model = null;
  var Store = null
  var modelType = null;
  var db = null;
  var serverUrl = "http://localhost:8200";

  before(function() {
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
  });

  it('fetch model and onSync msg table have to be no entry with this model', function(done) {
    model.fetch().then(function(resp) {
      assert.equal(model.get('username'), 'message-offline-test');
      assert.equal(model.get('password'), 'admin');
      assert.equal(model.get('id'), '12312');
    });

    model.on('sync', function () {
      var db = openDatabase('relution-livedata', '', '', 1024 * 1024);
      var channel = model.store.endpoints[Object.keys(model.store.endpoints)[0]].channel;
      var query = 'SELECT * FROM \'__msg__\' WHERE id = ?';
      db.transaction(
        function(tx) {
          tx.executeSql(query, [model.entity + '~' + model.get('id')], function(tx, table) {
            assert.equal(table.rows.length, 0);
            done();
          });
        },
        function(foo, error) {
          done(error);
        }
      );
    });
  });
});
