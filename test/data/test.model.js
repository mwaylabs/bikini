describe('Bikini.Model', function() {

    var TEST = {};

    it('basic', function () {
        assert.isDefined(Bikini.Model);
        assert.isDefined(Bikini.Model.design);
        assert.isDefined(Bikini.Model.create);
        assert.isDefined(Bikini.Model.extend);

        assert.isFunction(Bikini.Model.design);
        assert.isFunction(Bikini.Model.create);
        assert.isFunction(Bikini.Model.extend);

        var instance = Bikini.Model.create();
        assert.isDefined(instance);
        assert.isObject(instance);
        assert.isDefined(instance._type);
        assert.isString(instance._type);
        assert.equal(instance._type, 'Bikini.Model');
    });

    it ('creating model', function() {
        
        assert.typeOf(Bikini.Model, 'function', 'Bikini.Model is defined.');

        var Person = Bikini.Model.extend({
            idAttribute: 'id',
            defaults: { bmi: 0.0 },
            entity: {
                name:   'person',
                fields:  {
                    id:          { type: Bikini.DATA.TYPE.INTEGER, required: YES },
                    firstName:   { type: Bikini.DATA.TYPE.STRING,  length: 200 },
                    sureName:    { type: Bikini.DATA.TYPE.STRING,  required: YES, index: true },
                    birthDate:   { type: Bikini.DATA.TYPE.DATE   },
                    bmi:         { type: Bikini.DATA.TYPE.FLOAT },
                    notes:       { type: Bikini.DATA.TYPE.TEXT   },
                    address:     { type: Bikini.DATA.TYPE.OBJECT },
                    displayName: { type: Bikini.DATA.TYPE.STRING, persistent: NO }
                }
            }
        });

        assert.typeOf(Person, 'function', 'person model could be extended.');

        TEST.Person = Person.create();

        assert.typeOf(TEST.Person, 'object', 'empty person model could be created.');

        var p = Person.create({
            firstName: 'Max',
            sureName: 'Mustermann',
            birthDate: Bikini.Date.create('01.02.2003'),
            notes: 'Notes to this person',
            address: { street: 'Leitzstraße', house_nr: 45, zip: '70469', city: 'Stuttgart' }
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