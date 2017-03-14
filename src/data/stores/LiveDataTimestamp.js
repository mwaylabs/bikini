/**
 * LiveDataTimestamp.ts
 *
 * Created by Thomas Beckmann on 24.02.2017
 * Copyright (c)
 * 2017
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
/* jshint indent: 4 */
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/// <reference path="../../core/livedata.d.ts" />
/// <reference path="Store.ts" />
/// <reference path="SyncContext.ts" />
/// <reference path="../../utility/Debug.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * timestamp packed into a Model.
         *
         * @module Relution.LiveData.LiveDataTimestamp
         *
         * @type {*}
         */
        var LiveDataTimestampModel = (function (_super) {
            __extends(LiveDataTimestampModel, _super);
            function LiveDataTimestampModel() {
                _super.apply(this, arguments);
            }
            return LiveDataTimestampModel;
        })(LiveData.Model);
        LiveData.LiveDataTimestampModel = LiveDataTimestampModel;
        // mixins
        var timestampmodel = _.extend(LiveDataTimestampModel.prototype, {
            _type: 'Relution.LiveData.LiveDataTimestampModel',
            entity: '__timestamp__',
            idAttribute: 'channel'
        });
        Relution.assert(function () { return new timestampmodel({ channel: 'check' }).id === 'check'; });
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=LiveDataTimestamp.js.map