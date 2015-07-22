// @echo BANNER
(function(factory) {
  "use strict";
  var root = (typeof self == 'object' && self.self == self && self) ||
    (typeof global == 'object' && global.global == global && global);

  if (typeof exports !== 'undefined' && require !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore'), $;
    var Q = require('q');
    var jsonPath = require('JSONPath');
    var vm = {};
    try { $ = require('jquery'); } catch(e) {}
    factory(root, exports, Backbone, _, $, Q, jsonPath);
  }else {
    root.Relution = factory(root, {},root.Backbone, root._, (root.jQuery || root.Zepto || root.ender || root.$), root.Q, root.jsonPath);
  }
}(function (root, global, Backbone, _, $, Q, jsonPath) {
// @include ./core/livedata.require.js
// @include ./utility/debug.js
// @include ./core/livedata.js

// @include ./utility/objectid.js
// @include ./utility/uuid.js
// @include ./utility/base64.js
// @include ./utility/sha256.js
// @include ./utility/cypher.js
// @include ./utility/date.js
// @include ./utility/url.js

// @include ./query/JsonPath.js
// @include ./query/Filter.js
// @include ./query/FilterVisitor.js
// @include ./query/JsonFilterVisitor.js
// @include ./query/SortOrder.js
// @include ./query/SortOrderComparator.js
// @include ./query/GetQuery.js

// @include ./data/field.js
// @include ./data/entity.js
// @include ./data/security.js
// @include ./data/model.js
// @include ./data/collection.js
// @include ./data/data_selector.js
// @include ./data/sql_selector.js
// @include ./data/stores/Store.js
// @include ./data/stores/LocalStorageStore.js
// @include ./data/stores/WebSqlStore.js
// @include ./data/stores/SyncStore.js
// @include ./data/stores/SyncContext.js

// @include ./core/bikini.js
return Relution;
}));



