describe('Bikini Namespace', function () {

    it('Bikini', function() {
        assert.ok(Bikini, 'Bikini is defined.');
        assert.valueOf(Bikini, 'object', 'Bikini is an object.');
    });

    it('Bikini.Version', function() {
        assert.ok(Bikini.Version && Bikini.hasOwnProperty('Version'), 'Bikini.Version is defined');
        assert.ok(typeof Bikini.Version === 'string', 'Bikini.Version is a string');
    });

    it('Bikini.f', function() {
        assert.ok(Bikini.f, 'Bikini.f is defined');
        assert.ok(typeof(Bikini.f) === 'function', 'Bikini.f is a function');
    });

    it('locale storage', function () {

        var putSomethingToTheLocaleStorage = function () {
            Bikini.Application = Bikini.Application || {};
            Bikini.Application.name = Bikini.Application.name || 'test';
            localStorage.setItem('test0', 'test0');
            localStorage.setItem('test1', 'test1');
            localStorage.setItem(Bikini.LOCAL_STORAGE_PREFIX + Bikini.Application.name + Bikini.LOCAL_STORAGE_SUFFIX + 'test0', Bikini.LOCAL_STORAGE_PREFIX + Bikini.Application.name + Bikini.LOCAL_STORAGE_SUFFIX + 'test0');
            localStorage.setItem(Bikini.LOCAL_STORAGE_PREFIX + Bikini.Application.name + Bikini.LOCAL_STORAGE_SUFFIX + 'test1', Bikini.LOCAL_STORAGE_PREFIX + Bikini.Application.name + Bikini.LOCAL_STORAGE_SUFFIX + 'test1');
        };

        assert.ok(window && window.localStorage, 'localStorage available');
        putSomethingToTheLocaleStorage();
        localStorage.clear('f');
        assert.equal(localStorage.length, 0, 'localStorage is available and the clear function works with the parameter "f"');

        putSomethingToTheLocaleStorage();
        localStorage.clear();
        assert.equal(localStorage.length, 0, 'localStorage.clear() is implemented as anticipated in the spec');

    });

    it('Bikini.isCollection', function () {

        assert.isFalse(Bikini.isCollection());
        assert.isFalse(Bikini.isCollection(''));
        assert.isFalse(Bikini.isCollection(0));
        assert.isFalse(Bikini.isCollection(1));
        assert.isFalse(Bikini.isCollection({}));
        assert.isFalse(Bikini.isCollection([]));
        assert.isFalse(Bikini.isCollection(Bikini.Collection));
        assert.isTrue(Bikini.isCollection(Bikini.Collection.create()));
        assert.isTrue(Bikini.isCollection(Bikini.Collection.extend().create()));
        assert.isFalse(Bikini.isCollection(Bikini.Model));
        assert.isFalse(Bikini.isCollection(Bikini.Model.create()));
        assert.isFalse(Bikini.isCollection(Bikini.Model.extend().create()));

    });

    it('Bikini.isModel', function () {

        assert.isFalse(Bikini.isModel());
        assert.isFalse(Bikini.isModel(''));
        assert.isFalse(Bikini.isModel(0));
        assert.isFalse(Bikini.isModel(1));
        assert.isFalse(Bikini.isModel({}));
        assert.isFalse(Bikini.isModel([]));
        assert.isFalse(Bikini.isModel(Bikini.Collection));
        assert.isFalse(Bikini.isModel(Bikini.Collection.create()));
        assert.isFalse(Bikini.isModel(Bikini.Collection.extend().create()));
        assert.isFalse(Bikini.isModel(Bikini.Model));
        assert.isTrue(Bikini.isModel(Bikini.Model.create()));
        assert.isTrue(Bikini.isModel(Bikini.Model.extend().create()));
    });

    it('Bikini.URLUtil', function () {
        var bs = new Bikini.BikiniStore();
        assert.equal(Bikini.URLUtil._hashCode('api/dataSync/Todo'), 1108439963);
        var a = Bikini.URLUtil.getLocation('api/dataSync/Todo');
        assert.equal(typeof a, 'object');
        assert.equal(typeof a.host, 'string');
        assert.equal(typeof a.toString(), 'string');
        var url = Bikini.URLUtil.resolveLocation('api/dataSync/Todo');
        assert.equal(typeof url, 'string');
        var hash = Bikini.URLUtil.hashLocation('api/dataSync/Todo');
        assert.equal(typeof hash, 'number');
    });

});
