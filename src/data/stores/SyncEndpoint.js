/**
 * SyncEndpoint.ts
 *
 * Created by Thomas Beckmann on 07.12.2015
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
/* jshint indent: 4 */
/* jshint curly: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/// <reference path="../../core/livedata.d.ts" />
/// <reference path="Store.ts" />
/// <reference path="SyncContext.ts" />
/// <reference path="../Model.ts" />
/// <reference path="../Collection.ts" />
/// <reference path="../../utility/Debug.ts" />
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * The Relution.LiveData.SyncEndpoint manages connection of Relution.LiveData.SyncStory to one collection.
         *
         * @module Relution.LiveData.SyncEndpoint
         *
         * @type {*}
         */
        var SyncEndpoint = (function () {
            function SyncEndpoint(options) {
                this.isConnected = null;
                this.entity = options.entity;
                this.modelType = options.modelType;
                this.urlRoot = options.urlRoot;
                this.socketPath = options.socketPath;
                this.credentials = options.credentials;
                var href = LiveData.URLUtil.getLocation(options.urlRoot);
                this.host = href.protocol + '//' + href.host;
                this.path = href.pathname;
                var name = options.entity;
                var user = options.credentials && options.credentials.username ? options.credentials.username : '';
                var hash = LiveData.URLUtil.hashLocation(options.urlRoot);
                this.channel = name + user + hash;
            }
            /**
             * close the endpoint explicit.
             */
            SyncEndpoint.prototype.close = function () {
                if (this.socket && this.socket.$emit) {
                    // consider calling this.socket.close() instead
                    this.socket.$emit('close');
                    this.socket = null;
                }
                if (this.localStore) {
                    this.localStore.close();
                    this.localStore = null;
                }
            };
            return SyncEndpoint;
        }());
        LiveData.SyncEndpoint = SyncEndpoint;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=SyncEndpoint.js.map