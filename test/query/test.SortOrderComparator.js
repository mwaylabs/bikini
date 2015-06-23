/**
 * test.SortOrderComparator.ts
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

describe('test.SortOrderComparator', function () {

  it('sort movies by id', function () {
    var testdata = makeMovies();

    var original = new Array(testdata.length);
    for (var i = 0; i < testdata.length; ++i) {
      original[i] = testdata[i].id;
    }

    testdata.sort(Relution.LiveData.jsonCompare(new Relution.LiveData.SortOrder([
      'id'
    ])));
    original.sort();

    for (var j = 0; j < testdata.length; ++j) {
      assert.equal(testdata[j].id, original[j], 'order at #' + j);
    }
  });

  it('sort movies by year ascending', function () {
    var testdata = makeMovies();

    var original = new Array(testdata.length);
    for (var i = 0; i < testdata.length; ++i) {
      original[i] = testdata[i].year;
    }

    testdata.sort(Relution.LiveData.jsonCompare(new Relution.LiveData.SortOrder([
      '+year'
    ])));
    original.sort();

    for (var j = 0; j < testdata.length; ++j) {
      assert.equal(testdata[j].year, original[j], 'order at #' + j);
    }
  });

  it('sort movies by runtime descending', function () {
    var testdata = makeMovies();

    var original = new Array(testdata.length);
    for (var i = 0; i < testdata.length; ++i) {
      original[i] = testdata[i].runtime;
    }

    testdata.sort(Relution.LiveData.jsonCompare(new Relution.LiveData.SortOrder([
      '-runtime'
    ])));
    original.sort(function (a, b) {
      return (b | 0) - (a | 0);
    });

    for (var j = 0; j < testdata.length; ++j) {
      assert.equal(testdata[j].runtime, original[j], 'order at #' + j);
    }
  });

  it('sort movies by year descending, runtime ascending, id', function () {
    var testdata = makeMovies();
    var original = _.clone(testdata);

    testdata.sort(Relution.LiveData.jsonCompare(new Relution.LiveData.SortOrder([
      '-year',
      '+runtime',
      'id'
    ])));
    original.sort(function (a, b) {
      var result = (b.year | 0) - (a.year | 0);
      if (result === 0) {
        result = (a.runtime | 0) - (b.runtime | 0);
        if (result === 0) {
          result = a.id.localeCompare(b.id);
        }
      }
      return result;
    });

    for (var j = 0; j < testdata.length; ++j) {
      assert.equal(testdata[j], original[j], 'order at #' + j);
    }
  });

});
