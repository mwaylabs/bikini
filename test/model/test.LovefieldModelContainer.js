/**
 * test.LovefieldModelContainer.js
 *
 * Created by Thomas Beckmann on 29.01.2016
 * Copyright (c)
 * 2016
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

var makeModelsMobileCRM;

describe('Relution.LiveData.LovefieldModelContainer', function () {

  it('createSchema', function (done) {
    var testmodel = makeModelsMobileCRM();
    var modelcontainer = Relution.LiveData.LovefieldModelFactory.instance.fromJSON(testmodel);

    var schemaBuilder  = lf.schema.create(modelcontainer.name, modelcontainer.version);
    modelcontainer.createSchema(schemaBuilder);
    schemaBuilder.connect({
      storeType: lf.schema.DataStoreType.WEB_SQL
    }).then(function (db) {
      db.close();
      return true;
    }).then(function () {
      done();
      return true;
    }, function (error) {
      done(error);
      return false;
    });
  });

});
