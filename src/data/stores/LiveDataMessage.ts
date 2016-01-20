/**
 * LiveDataMessage.ts
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
/// <reference path="../../utility/Debug.ts" />

module Relution.LiveData {

  /**
   * an offline message.
   *
   * @module Relution.LiveData.LiveDataMessage
   *
   * @type {*}
   */
  export interface LiveDataMessage {

    /**
     * original key of the target record being altered.
     *
     * <p>
     * For offline messages stored on the client-side this is also the primary key of the message itself.
     * This works because offline messages are merged resulting in just one change. For changes reported
     * by the server-side an explicit _id value is used, which is of no concern to the client except for
     * diagnostics as a debugging aid.
     * </p>
     */
    id: string;

    /**
     * CRUD-method of how the record is altered.
     *
     * <p>
     * This can be one of read, create, update, patch or delete only.
     * </p>
     */
    method: string;
    /**
     * point in time of alteration.
     */
    time: number;

    /**
     * actual attribute data being set (patch => merged) on target model in format suitable for model.set() call.
     */
    data: any;

  }
}
