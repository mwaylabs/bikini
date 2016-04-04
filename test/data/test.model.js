describe('Relution.LiveData.Model', function () {

  var TEST = {};

  it('basic', function () {
    assert.isDefined(Relution.LiveData.Model);
    assert.isDefined(Relution.LiveData.Model.design);
    assert.isDefined(Relution.LiveData.Model.create);
    assert.isDefined(Relution.LiveData.Model.extend);

    assert.isFunction(Relution.LiveData.Model.design);
    assert.isFunction(Relution.LiveData.Model.create);
    assert.isFunction(Relution.LiveData.Model.extend);

    var instance = Relution.LiveData.Model.create();
    assert.isDefined(instance);
    assert.isObject(instance);
    assert.isDefined(instance._type);
    assert.isString(instance._type);
    assert.equal(instance._type, 'Relution.LiveData.Model');
  });

  it('creating model', function () {

    assert.typeOf(Relution.LiveData.Model, 'function', 'Relution.LiveData.Model is defined.');

    var Person = Relution.LiveData.Model.extend({
      idAttribute: 'id',
      defaults: {bmi: 0.0},
      entity: 'person'
    });

    assert.typeOf(Person, 'function', 'person model could be extended.');

    TEST.Person = Person.create();

    assert.typeOf(TEST.Person, 'object', 'empty person model could be created.');

    var p = Person.create({
      firstName: 'Max',
      sureName: 'Mustermann',
      birthDate: Relution.LiveData.Date.create('01.02.2003'),
      notes: 'Notes to this person',
      address: {street: 'Leitzstraße', house_nr: 45, zip: '70469', city: 'Stuttgart'}
    });

    assert.ok(typeof p === 'object', 'person record could be created.');

    assert.ok(p.get('firstName') === 'Max', 'Field "firstName" is set.');

    assert.ok(p.get('sureName') === 'Mustermann', 'Field "sureName" is set.');

    assert.ok(p.get('bmi') === 0.0, 'Field "bmi" has correct default value.');

    assert.ok(p.get('notes') === 'Notes to this person', 'Field "note" has correct value.');

    assert.ok(typeof p.get('id') === 'undefined', 'Field "id" is undefined, as expected.');

    assert.ok(p.get('address').street === 'Leitzstraße', 'Field "address" has correct value.');

  });

});
