/**
 * test.JsonFilterVisitor.ts
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

describe('test.JsonFilterVisitor', function () {

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

});
