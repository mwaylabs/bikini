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

function backbone_error(done) {
  return function (model, error) {
    done(error || new Error());
  }
}
