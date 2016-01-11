/**
 * Created by Pascal Brewing
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
/* jshint quotmark: false */
/// <reference path="../core/livedata.d.ts"/>
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * @description A DebugConsole Class
         * @example ````js
         * window.Relution.setDebug(true);
         * ````
         */
        var DebugConsole = (function () {
            function DebugConsole(enabled, fontSize) {
                if (enabled === void 0) { enabled = false; }
                if (fontSize === void 0) { fontSize = '12px'; }
                // uses bound functions to avoid browsers outputting incorrect line numbers
                if (enabled) {
                    this.log = _.bind(console.log, console, '%c%s');
                    this.trace = _.bind(console.trace, console, '%c%s', "color: #378c13; font-size: " + fontSize + ";font-weight: normal;");
                    this.debug = _.bind(console.trace, console, '%c%s', "color: #008c13; font-size: " + fontSize + ";font-weight: normal;");
                    this.warn = _.bind(console.warn, console, '%c%s', "color: #e69138; font-size: " + fontSize + ";font-weight: normal;");
                    this.info = _.bind(console.info, console, '%c%s', "color: #00f; font-size: " + fontSize + ";font-weight: normal;");
                    this.error = _.bind(console.error, console, '%c%s', "color: #f00; font-size: " + fontSize + ";font-weight: normal;");
                }
                else {
                    this.log = DebugConsole.STUB;
                    this.trace = DebugConsole.STUB;
                    this.debug = DebugConsole.STUB;
                    this.warn = DebugConsole.STUB;
                    this.info = DebugConsole.STUB;
                    this.error = DebugConsole.STUB;
                }
                this.warning = this.warn; // alias only
            }
            Object.defineProperty(DebugConsole.prototype, "enabled", {
                get: function () {
                    return this.log !== DebugConsole.STUB;
                },
                enumerable: true,
                configurable: true
            });
            DebugConsole.STUB = function () { };
            return DebugConsole;
        })();
        LiveData.DebugConsole = DebugConsole;
        /**
         * @description default instance not outputting anything.
         *
         * @type {Relution.LiveData.DebugConsole}
         */
        LiveData.Debug = new DebugConsole();
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=Debug.js.map