/* jshint indent: 4 */
/* jshint quotmark: false */
/// <reference path="../core/livedata.d.ts"/>
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        var Debug = (function () {
            function Debug() {
            }
            Debug.log = function (color, message) {
                if (Relution.LiveData.isDebugMode()) {
                    console.log("%c%s", "color: " + color + "; font-size: " + this.fontSize + ";font-weight: normal;", message);
                }
            };
            Debug.trace = function (message) {
                this.log('#378c13', message);
            };
            Debug.warning = function (message) {
                this.log('#e69138', message);
            };
            Debug.info = function (message) {
                this.log('#00f', message);
            };
            Debug.error = function (message) {
                this.log('#f00', message);
            };
            Debug.fontSize = '12px';
            return Debug;
        })();
        LiveData.Debug = Debug;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=Debug.js.map