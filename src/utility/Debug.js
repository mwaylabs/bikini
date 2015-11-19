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
         * @description A Static Debug Class
         * @example ````js
         * window.Relution.setDebug(true);
         * ````
         */
        var Debug = (function () {
            function Debug() {
            }
            /**
             * @descriptions logs the messages to the console
             * @param color
             * @param message
             */
            Debug.log = function (color, message) {
                if (Relution.LiveData.isDebugMode()) {
                    console.log("%c%s", "color: " + color + "; font-size: " + this.fontSize + ";font-weight: normal;", message);
                }
            };
            /**
             * @name trace
             * @param message
             */
            Debug.trace = function (message) {
                this.log('#378c13', message);
            };
            /**
             * @name warning
             * @param message
             */
            Debug.warning = function (message) {
                this.log('#e69138', message);
            };
            /**
             * @name info
             * @param message
             */
            Debug.info = function (message) {
                this.log('#00f', message);
            };
            /**
             * @name error
             * @param message
             */
            Debug.error = function (message) {
                this.log('#f00', message);
            };
            /**
             * set the fontSize
             * @type {string}
             */
            Debug.fontSize = '12px';
            return Debug;
        })();
        LiveData.Debug = Debug;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=Debug.js.map