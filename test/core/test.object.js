describe('Relution.LiveData.Object', function () {

  it('basic', function () {
    assert.isDefined(Relution.LiveData.Object);
    assert.isDefined(Relution.LiveData.Object._type);

    assert.isObject(Relution.LiveData.Object);
    assert.isString(Relution.LiveData.Object._type);
    assert.equal(Relution.LiveData.Object._type, 'Relution.LiveData.Object');
  });

  it('methods', function () {
    assert.isDefined(Relution.LiveData.Object._create);
    assert.isDefined(Relution.LiveData.Object.design);
    assert.isDefined(Relution.LiveData.Object.bindToCaller);
    assert.isDefined(Relution.LiveData.Object.handleCallback);

    assert.isFunction(Relution.LiveData.Object._create);
    assert.isFunction(Relution.LiveData.Object.design);
    assert.isFunction(Relution.LiveData.Object.bindToCaller);
    assert.isFunction(Relution.LiveData.Object.handleCallback);
  });

});
