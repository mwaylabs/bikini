describe('Relution.LiveData Namespace', function () {

    it('Relution.LiveData', function() {
        assert.ok(Relution.LiveData, 'Relution.LiveData is defined.');
        assert.valueOf(Relution.LiveData, 'object', 'Relution.LiveData is an object.');
    });

    it('Relution.LiveData.Version', function() {
        assert.ok(Relution.LiveData.Version && Relution.LiveData.hasOwnProperty('Version'), 'Relution.LiveData.Version is defined');
        assert.ok(typeof Relution.LiveData.Version === 'string', 'Relution.LiveData.Version is a string');
    });

    it('Relution.LiveData.f', function() {
        assert.ok(Relution.LiveData.f, 'Relution.LiveData.f is defined');
        assert.ok(typeof(Relution.LiveData.f) === 'function', 'Relution.LiveData.f is a function');
    });

    it('locale storage', function () {

        var putSomethingToTheLocaleStorage = function () {
            Relution.LiveData.Application = Relution.LiveData.Application || {};
            Relution.LiveData.Application.name = Relution.LiveData.Application.name || 'test';
            localStorage.setItem('test0', 'test0');
            localStorage.setItem('test1', 'test1');
            localStorage.setItem(Relution.LiveData.LOCAL_STORAGE_PREFIX + Relution.LiveData.Application.name + Relution.LiveData.LOCAL_STORAGE_SUFFIX + 'test0', Relution.LiveData.LOCAL_STORAGE_PREFIX + Relution.LiveData.Application.name + Relution.LiveData.LOCAL_STORAGE_SUFFIX + 'test0');
            localStorage.setItem(Relution.LiveData.LOCAL_STORAGE_PREFIX + Relution.LiveData.Application.name + Relution.LiveData.LOCAL_STORAGE_SUFFIX + 'test1', Relution.LiveData.LOCAL_STORAGE_PREFIX + Relution.LiveData.Application.name + Relution.LiveData.LOCAL_STORAGE_SUFFIX + 'test1');
        };

        assert.ok(window && window.localStorage, 'localStorage available');
        putSomethingToTheLocaleStorage();
        localStorage.clear('f');
        assert.equal(localStorage.length, 0, 'localStorage is available and the clear function works with the parameter "f"');

        putSomethingToTheLocaleStorage();
        localStorage.clear();
        assert.equal(localStorage.length, 0, 'localStorage.clear() is implemented as anticipated in the spec');

    });

    it('Relution.LiveData.isCollection', function () {

        assert.isFalse(Relution.LiveData.isCollection());
        assert.isFalse(Relution.LiveData.isCollection(''));
        assert.isFalse(Relution.LiveData.isCollection(0));
        assert.isFalse(Relution.LiveData.isCollection(1));
        assert.isFalse(Relution.LiveData.isCollection({}));
        assert.isFalse(Relution.LiveData.isCollection([]));
        assert.isFalse(Relution.LiveData.isCollection(Relution.LiveData.Collection));
        assert.isTrue(Relution.LiveData.isCollection(Relution.LiveData.Collection.create()));
        assert.isTrue(Relution.LiveData.isCollection(Relution.LiveData.Collection.extend().create()));
        assert.isFalse(Relution.LiveData.isCollection(Relution.LiveData.Model));
        assert.isFalse(Relution.LiveData.isCollection(Relution.LiveData.Model.create()));
        assert.isFalse(Relution.LiveData.isCollection(Relution.LiveData.Model.extend().create()));

    });

    it('Relution.LiveData.isModel', function () {

        assert.isFalse(Relution.LiveData.isModel());
        assert.isFalse(Relution.LiveData.isModel(''));
        assert.isFalse(Relution.LiveData.isModel(0));
        assert.isFalse(Relution.LiveData.isModel(1));
        assert.isFalse(Relution.LiveData.isModel({}));
        assert.isFalse(Relution.LiveData.isModel([]));
        assert.isFalse(Relution.LiveData.isModel(Relution.LiveData.Collection));
        assert.isFalse(Relution.LiveData.isModel(Relution.LiveData.Collection.create()));
        assert.isFalse(Relution.LiveData.isModel(Relution.LiveData.Collection.extend().create()));
        assert.isFalse(Relution.LiveData.isModel(Relution.LiveData.Model));
        assert.isTrue(Relution.LiveData.isModel(Relution.LiveData.Model.create()));
        assert.isTrue(Relution.LiveData.isModel(Relution.LiveData.Model.extend().create()));
    });

    it('Relution.LiveData.URLUtil', function () {
        var bs = new Relution.LiveData.SyncStore();
        assert.equal(Relution.LiveData.URLUtil._hashCode('api/dataSync/Todo'), 1108439963);
        var a = Relution.LiveData.URLUtil.getLocation('api/dataSync/Todo');
        assert.equal(typeof a, 'object');
        assert.equal(typeof a.host, 'string');
        assert.equal(typeof a.toString(), 'string');
        var url = Relution.LiveData.URLUtil.resolveLocation('api/dataSync/Todo');
        assert.equal(typeof url, 'string');
        var hash = Relution.LiveData.URLUtil.hashLocation('api/dataSync/Todo');
        assert.equal(typeof hash, 'number');
    });

});
