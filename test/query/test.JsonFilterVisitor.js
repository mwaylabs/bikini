/**
 * test.JsonFilterVisitor.js
 *
 * Created by Thomas Beckmann on 23.06.2015
 * Copyright (c)
 * 2015
 * M-Way Solutions GmbH. All rights reserved.
 * http://www.mwaysolutions.com
 * Redistribution and use in source and binary forms, with or without
 * modification, are not permitted.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var makeMovies;

describe('Relution.LiveData.JsonFilterVisitor', function () {

  it('filter movies by id', function () {
    var testdata = makeMovies();
    var expected = [1, 3, 5, 8];
    var filtered = testdata.filter(Relution.LiveData.jsonFilter({
      type: 'logOp',
      operation: 'or',
      filters: [
        {
          // index 3
          type: 'string',
          fieldName: 'id',
          value: '771370467'
        },
        {
          // does not exist
          type: 'string',
          fieldName: 'id',
          value: '471100000'
        },
        {
          type: 'stringEnum',
          fieldName: 'id',
          values: [
            '771356696',  // index 5
            '281178000',  // does not exist
            '771313962'   // index 8
          ]
        },
        {
          // index 1
          type: 'string',
          fieldName: 'id',
          value: '771374432'
        }
      ]
    }));
    assert.equal(filtered.length, expected.length, 'expected ' + expected.length + ' elements');
    for (var i = 0; i < filtered.length; ++i) {
      assert.equal(filtered[i], testdata[expected[i]], 'filter at #' + i);
    }
  });

  it('filter movies like Ford', function () {
    var testdata = makeMovies();
    var expected = ['771373149', '771410658'];
    var filtered = testdata.filter(Relution.LiveData.jsonFilter({
      type: 'like',
      fieldName: 'abridged_cast[*].name',
      like: '%Ford%'
    }));
    assert.equal(filtered.length, expected.length, 'expected ' + expected.length + ' elements');
    for (var i = 0; i < filtered.length; ++i) {
      assert.equal(filtered[i].id, expected[i], 'filter at #' + i);
    }
  });

  it('filter movies containing Harris', function () {
    var testdata = makeMovies();
    var expected = ['771364722', '771373149', '771410658'];
    var filtered = testdata.filter(Relution.LiveData.jsonFilter({
      type: 'containsString',
      fieldName: 'abridged_cast[*].name',
      contains: 'Harris'
    }));
    assert.equal(filtered.length, expected.length, 'expected ' + expected.length + ' elements');
    for (var i = 0; i < filtered.length; ++i) {
      assert.equal(filtered[i].id, expected[i], 'filter at #' + i);
    }
  });

  it('filter movies with critics score [70;85]', function () {
    var testdata = makeMovies();
    var expected = ['771324839', '771313962', '771368269', '771354922', '771412075', '771357114', '771385848'];
    var filtered = testdata.filter(Relution.LiveData.jsonFilter({
      type: 'logOp',
      operation: 'and',
      filters: [
        {
          type: 'longRange',
          fieldName: 'ratings.critics_score',
          min: 70,
          max: 88
        },
        {
          type: 'doubleRange',
          fieldName: 'ratings.critics_score',
          max: 85
        }
      ]
    }));
    assert.equal(filtered.length, expected.length, 'expected ' + expected.length + ' elements');
    for (var i = 0; i < filtered.length; ++i) {
      assert.equal(filtered[i].id, expected[i], 'filter at #' + i);
    }
  });

  it('filter movies without DVD release', function () {
    var testdata = makeMovies();
    var filtered = testdata.filter(Relution.LiveData.jsonFilter({
      type: 'null',
      fieldName: 'release_dates.dvd',
      isNull: true
    }));
    var expected = testdata.filter(function (movie) {
      /* jshint -W106 */
      return !movie.release_dates.dvd;
    });
    assert.equal(filtered.length, expected.length, 'expected ' + expected.length + ' elements');
    for (var i = 0; i < expected.length; ++i) {
      assert.equal(filtered[i], expected[i], 'filter at #' + i);
    }
  });

});
