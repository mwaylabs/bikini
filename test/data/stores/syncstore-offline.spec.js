describe('Relution.LiveData.SyncStore Offline Model Save Test', function() {
  var model = null;
  var Store = null
  var modelType = null;
  var db = null;
  var serverUrl = "http://localhost:8200";
  this.timeout(8000);

  before(function() {
    Store = new Relution.LiveData.SyncStore({
      useLocalStore: true,
      useSocketNotify: false
    });

    modelType = Relution.LiveData.Model.extend({
      idAttribute: 'id',
      entity: 'User',
      store: Store,
      urlRoot: serverUrl + '/relution/livedata/user/',
      defaults: {
        username: 'admin',
        password: 'admin'
      },
      ajax: function(requ) {
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
      var channel = model.store.getEndpoint(model).channel;
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
      var query = 'SELECT * FROM \'__msg__\' WHERE id =?';
      db.transaction(
        function(tx) {
          tx.executeSql(query, [model.entity + '~' + model.get('id')], function(tx, table) {
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

