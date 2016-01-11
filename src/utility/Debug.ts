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

// underscore is a global symbol
declare var _;

module Relution {

  /**
   * @description A DebugConsole Class
   * @example ````js
   * window.Relution.setDebug(true);
   * ````
   */
  export class DebugConsole {
    private static STUB() {
      // empty by intention
    }

    private fontSize_: string;
    private enabled_: boolean;

    public constructor(enabled: boolean = false, fontSize = '12px') {
      this.enabled_ = enabled;
      this.fontSize_ = fontSize;
      this.reset();
    }

    private reset() {
      // uses bound functions to avoid browsers outputting incorrect line numbers
      if (this.enabled_) {
        this.log = _.bind(console.log, console, '%c%s');
        this.trace = _.bind(console.trace, console, '%c%s', `color: #378c13; font-size: ${this.fontSize_};font-weight: normal;`);
        this.debug = _.bind(console.trace, console, '%c%s', `color: #008c13; font-size: ${this.fontSize_};font-weight: normal;`);
        this.warn = _.bind(console.warn, console, '%c%s', `color: #e69138; font-size: ${this.fontSize_};font-weight: normal;`);
        this.info = _.bind(console.info, console, '%c%s', `color: #00f; font-size: ${this.fontSize_};font-weight: normal;`);
        this.error = _.bind(console.error, console, '%c%s', `color: #f00; font-size: ${this.fontSize_};font-weight: normal;`);
      } else {
        this.log = DebugConsole.STUB;
        this.trace = DebugConsole.STUB;
        this.debug = DebugConsole.STUB;
        this.warn = DebugConsole.STUB;
        this.info = DebugConsole.STUB;
        this.error = DebugConsole.STUB;
      }
      this.warning = this.warn; // alias only
    }

    public get enabled(): boolean {
      return this.enabled_;
    }

    public set enabled(enabled: boolean) {
      if (this.enabled_ !== enabled) {
        this.enabled_ = enabled;
        this.reset();
      }
    }

    public get fontSize(): string {
      return this.fontSize_;
    }

    public set fontSize(fontSize: string) {
      if (this.fontSize_ !== fontSize) {
        this.fontSize_ = fontSize;
        this.reset();
      }
    }

    private log:(message:string, ...parameters:any[]) => void;

    public trace:(message:string, ...parameters:any[]) => void;
    public debug:(message:string, ...parameters:any[]) => void;
    public info:(message:string, ...parameters:any[]) => void;
    public warn:(message:string, ...parameters:any[]) => void;
    public warning:(message:string, ...parameters:any[]) => void;
    public error:(message:string, ...parameters:any[]) => void;

    public static DebugConsole = DebugConsole;
  }

  export var Debug = new DebugConsole();

  export function isDebugMode() {
    return Debug.enabled;
  }

  export function setDebug(enabled: boolean) {
    Debug.enabled = enabled;
    return Debug;
  }

  export module LiveData {
    export var Debug = Relution.Debug;
  }

}
