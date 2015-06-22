describe('Relution.LiveData.Collection', function () {

  var TEST = {};

  TEST.url = serverUrl + '/relution/livedata/developers';
  TEST.data = [
    {
      sureName: 'Laubach',
      firstName: 'Dominik',
      age: 27
    },
    {
      sureName: 'Hanowski',
      firstName: 'Marco',
      age: 27
    },
    {
      sureName: 'Stierle',
      firstName: 'Frank',
      age: 43
    },
    {
      sureName: 'Werler',
      firstName: 'Sebastian',
      age: 30
    },
    {
      sureName: 'Buck',
      firstName: 'Stefan',
      age: 26
    }
  ];

  it('basic', function () {
    assert.isDefined(Relution.LiveData.Collection);
    assert.isDefined(Relution.LiveData.Collection.design);
    assert.isDefined(Relution.LiveData.Collection.create);
    assert.isDefined(Relution.LiveData.Collection.extend);

    assert.isFunction(Relution.LiveData.Collection);
    assert.isFunction(Relution.LiveData.Collection.design);
    assert.isFunction(Relution.LiveData.Collection.create);
    assert.isFunction(Relution.LiveData.Collection.extend);

    var instance = Relution.LiveData.Collection.create();
    assert.isDefined(instance);
    assert.isObject(instance);
    assert.isDefined(instance._type);
    assert.isString(instance._type);
    assert.equal(instance._type, 'Relution.LiveData.Collection');
  });

  it('creating collection', function () {

    assert.typeOf(Relution.LiveData.Collection, 'function', 'Relution.LiveData.Collection is defined');

    TEST.Developer = Relution.LiveData.Model.extend({
      idAttribute: '_id',
      entity: {
        name: 'Developer',
        fields: {
          _id: {type: Relution.LiveData.DATA.TYPE.STRING},
          sureName: {name: 'lastName', type: Relution.LiveData.DATA.TYPE.STRING, required: true, index: true},
          firstName: {type: Relution.LiveData.DATA.TYPE.STRING, length: 200},
          age: {type: Relution.LiveData.DATA.TYPE.INTEGER}
        }
      }
    });

    assert.ok(typeof TEST.Developer === 'function', 'Developer model successfully extended.');

    TEST.DeveloperCollection = Relution.LiveData.Collection.extend({
      url: TEST.url,
      model: TEST.Developer
    });

    assert.ok(typeof TEST.DeveloperCollection === 'function', 'Developer collection successfully extended.');

    TEST.Developers = new TEST.DeveloperCollection();

    assert.ok(typeof TEST.Developers === 'object', 'Developer collection successfully created.');
  });

  it('adding data', function () {
    TEST.Developers.add(TEST.data);

    assert.equal(TEST.Developers.length, 5, 'All records were added.');

    assert.equal(TEST.Developers.at(2).get('sureName'), TEST.data[2].sureName, 'sureName of 3. model has correct value');
    assert.equal(TEST.Developers.at(3).get('firstName'), TEST.data[3].firstName, 'firstName of 4. model has correct value');
    assert.equal(TEST.Developers.at(4).get('age'), TEST.data[4].age, 'age of 5. model has correct value');

    assert.ok(TEST.Developer.prototype.isPrototypeOf(TEST.Developers.at(0)), 'Records successfully converted to model records.');

  });

  it('sorting data', function () {

    TEST.Developers.sort({'sort': {'sureName': -1}});

    var p1 = TEST.Developers.at(0);
    assert.ok(p1.get('sureName') === 'Werler', 'Records correctly sorted descending by "sureName".');

    TEST.Developers.comparator = function (m1, m2) {
      return m2.get('age') - m1.get('age');
    };
    TEST.Developers.sort();

    var p2 = TEST.Developers.at(0);
    assert.ok(p2.get('sureName') === 'Stierle', 'Records correctly sorted by passed in sort function');

  });

  it('filtering data', function () {
    // filter all devs older or equal to 26
    var a1 = TEST.Developers.filter(function (rec) {
      return rec.get('age') >= 26;
    });

    assert.ok(a1.length === 5, 'Records successfully filtered. Everyone is 26 or older.');

    // filter all devs older than 26
    var a2 = TEST.Developers.filter(function (rec) {
      return rec.get('age') > 26;
    });

    assert.ok(a2.length === 4, 'Records successfully filtered. One dev is younger than 27.');

  });

  it('finding data', function () {

    TEST.Developers.reset();
    TEST.Developers.add(TEST.data);

    var result = TEST.Developers.select({
      query: {sureName: 'Stierle'}
    });

    assert.ok(typeof result === 'object', 'Find for value has a response object.');

    assert.ok(Relution.LiveData.isCollection(result), 'The response is a Relution.LiveData.Collection.');

    assert.ok(result.length === 1, 'The response holds one record.');

    // get first person record
    var p = result.at(0);

    assert.ok(p.get('sureName') === 'Stierle', 'Field "sureName" has correct value.');

    // SELECT *  FROM Developer WHERE firstName like 'S%'
    result = TEST.Developers.select({
      query: {firstName: /^S/}
    });

    assert.ok(typeof result === 'object', 'Find with RegEx has a response object.');

    assert.ok(result.length === 2, 'The response holds 2 records.');

    // SELECT *  FROM Developer WHERE sureName like '%er%' OR (age > 25 AND age <= 26)
    result = TEST.Developers.select({
      query: {
        $or: [
          {sureName: /.?er/}, // should match 'Stierle' and 'Werler'
          {age: {$gt: 25, $lte: 26}}
        ] // should match Stefan Buck '26'
      },
      sort: ['age']
    });

    assert.typeOf(result, 'object', 'Find with $or, $gt, $lte and sort by "age" has a response object.');

    assert.equal(result.length, 3, 'The response holds 3 records.');

    var d1 = result.at(0); // has to be Stefan Buck
    assert.equal(d1.get('sureName'), 'Buck', 'The first developer field "sureName" has correct value.');

    var d2 = result.at(1); // has to be Sebastian Werler
    assert.equal(d2.get('sureName'), 'Werler', 'The second developer field "sureName" has correct value.');

    var d3 = result.at(2); // has to be Frank Stierle
    assert.equal(d3.get('sureName'), 'Stierle', 'The third developer field "sureName" has correct value.');

  });

});
