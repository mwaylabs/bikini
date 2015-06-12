describe('Bikini.Object', function () {

    it('basic', function () {
        assert.isDefined(Bikini.Object);
        assert.isDefined(Bikini.Object._type);

        assert.isObject(Bikini.Object);
        assert.isString(Bikini.Object._type);
        assert.equal(Bikini.Object._type, 'Bikini.Object');
    });

    it('methods', function () {
        assert.isDefined(Bikini.Object._create);
        assert.isDefined(Bikini.Object.mergeProperties);
        assert.isDefined(Bikini.Object.design);
        assert.isDefined(Bikini.Object.bindToCaller);
        assert.isDefined(Bikini.Object.handleCallback);

        assert.isFunction(Bikini.Object._create);
        assert.isFunction(Bikini.Object.mergeProperties);
        assert.isFunction(Bikini.Object.design);
        assert.isFunction(Bikini.Object.bindToCaller);
        assert.isFunction(Bikini.Object.handleCallback);
    });

});
