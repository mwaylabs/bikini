/* jshint indent: 4 */
/* jshint quotmark: false */
/// <reference path="../core/livedata.d.ts"/>
module Relution.LiveData {
  export class Debug {
    private static fontSize:string = '12px';

    private static log(color, message) {
      if (Relution.LiveData.isDebugMode()) {
        console.log("%c%s",
          `color: ${color}; font-size: ${this.fontSize};font-weight: normal;`,
          message);
      }
    }

    public static trace(message) {
      this.log('#378c13', message);
    }

    public static warning(message) {
      this.log('#e69138', message);
    }

    public static info(message) {
      this.log('#00f', message);
    }

    public static error(message) {
      this.log('#f00', message);
    }
  }
}
