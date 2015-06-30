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
module Relution.LiveData {
  /**
   * @description A Static Debug Class
   * @example ````js
   * window.Relution.setDebug(true);
   * ````
   */
  export class Debug {
    /**
     * set the fontSize
     * @type {string}
     */
    private static fontSize:string = '12px';

    /**
     * @descriptions logs the messages to the console
     * @param color
     * @param message
     */
    private static log( color, message) {
      if (Relution.LiveData.isDebugMode()) {
        console.log("%c%s",
          `color: ${color}; font-size: ${this.fontSize};font-weight: normal;`,
          message);
      }
    }
    /**
     * @name trace
     * @param message
     */
    public static trace(message) {
      this.log('#378c13', message);
    }
    /**
     * @name warning
     * @param message
     */
    public static warning(message) {
      this.log('#e69138', message);
    }
    /**
     * @name info
     * @param message
     */
    public static info(message) {
      this.log('#00f', message);
    }
    /**
     * @name error
     * @param message
     */
    public static error(message) {
      this.log('#f00', message);
    }
  }
}
