describe('Relution.LiveData._Object', function () {

  it('basic', function () {
    assert.isDefined(Relution.LiveData._Object);
    assert.isDefined(Relution.LiveData._Object._type);

    assert.isObject(Relution.LiveData._Object);
    assert.isString(Relution.LiveData._Object._type);
    assert.equal(Relution.LiveData._Object._type, 'Relution.LiveData._Object');
  });

  it('methods', function () {
    assert.isDefined(Relution.LiveData._Object._create);
    assert.isDefined(Relution.LiveData._Object.design);
    assert.isDefined(Relution.LiveData._Object.bindToCaller);
    assert.isDefined(Relution.LiveData._Object.handleCallback);

    assert.isFunction(Relution.LiveData._Object._create);
    assert.isFunction(Relution.LiveData._Object.design);
    assert.isFunction(Relution.LiveData._Object.bindToCaller);
    assert.isFunction(Relution.LiveData._Object.handleCallback);
  });

});
