/**
 * Dependencies.
 */

if ('undefined' != typeof require) {
  Q = require('q');
  chai = require('chai');
  assert = chai.assert;
  expect = chai.expect;
}

serverUrl = "http://localhost:8200";

describe('Mocha', function () {

  it('assert samples', function () {
    var x = {};
    assert.valueOf(x, 'object', 'x is an object.');
    assert.isObject(x, 'x is an object.');
    assert.ok(1 !== 2, '1 is not 2');
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });

  it('expect samples', function () {
    var foo = 'bar'
    var beverages = {tea: ['chai', 'matcha', 'oolong']};
    expect(foo).to.be.a('string');
    expect(foo).to.equal('bar');
    expect(foo).to.have.length(3);
    expect(beverages).to.have.property('tea').with.length(3);

  });
});

Q.longStackSupport = true;

describe('Q', function () {
  it('Q direct resolve', function (done) {
    Q.resolve(1).then(function (x) {
      assert.equal(x, 1, 'one');
    }).then(done, done).done();
  });

  it('Q indirect resolve', function (done) {
    Q.fcall(function () {
      return 1;
    }).then(function (x) {
      assert.equal(x, 1, 'one');
    }).then(done, done).done();
  });

  it('Q empty resolve', function (done) {
    Q.resolve().then(function (x) {
      assert.equal(x, undefined, 'undefined');
    }).then(done, done).done();
  });

  it('Q empty resolve all', function (done) {
    Q.all([]).then(function (x) {
      assert.deepEqual(x, [], 'undefined');
    }).then(done, done).done();
  });
});

function backbone_error(done) {
  return function (model, error) {
    done(error instanceof Error ? error : new Error(JSON.stringify(error)));
  }
}
