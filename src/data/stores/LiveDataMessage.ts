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
   * an offline message of the client or a change message of the server.
   *
   * @module Relution.LiveData.LiveDataMessage
   *
   * @type {*}
   */
  export interface LiveDataMessage {

    /**
     * primary key of the message.
     *
     * <p>
     * For offline messages stored on the client-side the key is of the form entity~id. The entity prefix
     * is required in order to compose a unique key in the rare event of using the same id value in
     * different entities. Notice, the combination is unique because offline messages targeting the same
     * record are merged resulting in just one change.
     * </p>
     * <p>
     * For transient (not stored) offline messages on the client-side the value is not present.
     * </p>
     * <p>
     * For changes reported by the server-side an explicit _id value is used, which is of no concern to
     * the client except for diagnostics as a debugging aid.
     * </p>
     */
    _id?: string;

    /**
     * original key of the target record being altered.
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

    /**
     * offline messages are replayed in sort order of decreasing priority followed by increasing time.
     *
     * <p>
     * The priority assigned is based on the SyncEndpoint (aka. entity). By default, all entites are of equal priority
     * so that messages are replayed in causal order. The priority may be changed to account for foreign key id
     * references among the entities. When this is done, higher priority entities are propagated to the server before
     * messages of lower order, independent of their timely order.
     * </p>
     * <p>
     * An example are customer accounts which must be created before creation of shopping card orders.
     * </p>
     */
    priority?: number;
  }

  /**
   * message packed into a Model.
   *
   * @module Relution.LiveData.LiveDataMessage
   *
   * @type {*}
   */
  export class LiveDataMessageModel extends Model/*<LiveDataMessage>*/ {

    /**
     * redefined to concrete type of attributes.
     */
    public attributes: LiveDataMessage;

  }

  // mixins
  let msgmodel = _.extend(LiveDataMessageModel.prototype, {
    _type: 'Relution.LiveData.LiveDataMessageModel',
    entity: '__msg__',
    idAttribute: '_id'
  });
  Relution.assert(() => new msgmodel({ _id: 'check' }).id === 'check');

}
