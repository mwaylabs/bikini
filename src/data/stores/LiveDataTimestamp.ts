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

module Relution.LiveData {

  /**
   * used to persist last message timestamp data.
   *
   * @module Relution.LiveData.LiveDataTimestamp
   *
   * @type {*}
   */
  export interface LiveDataTimestamp {

    /**
     * channel the timestamp belongs to.
     */
    channel: string;

    /**
     * value stored.
     */
    timestamp: number;
  }

  /**
   * timestamp packed into a Model.
   *
   * @module Relution.LiveData.LiveDataTimestamp
   *
   * @type {*}
   */
  export class LiveDataTimestampModel extends Model/*<LiveDataTimestamp>*/ {

    /**
     * redefined to concrete type of attributes.
     */
    public attributes: LiveDataTimestamp;

  }

  // mixins
  let timestampmodel = _.extend(LiveDataTimestampModel.prototype, {
    _type: 'Relution.LiveData.LiveDataTimestampModel',
    entity: '__timestamp__',
    idAttribute: 'channel'
  });
  Relution.assert(() => new timestampmodel({ channel: 'check' }).id === 'check');

}
