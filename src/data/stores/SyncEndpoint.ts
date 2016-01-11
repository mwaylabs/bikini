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
/// <reference path="../../utility/Debug.ts" />

module Relution.LiveData {

  /**
   * The Relution.LiveData.SyncEndpoint manages connection of Relution.LiveData.SyncStory to one collection.
   *
   * @module Relution.LiveData.SyncEndpoint
   *
   * @type {*}
   */
  export class SyncEndpoint {

    public entity: any;
    public modelType: any;
    public urlRoot: string;
    public socketPath: string;
    public credentials: any;

    public host: string;
    public path: string;
    public channel: string;
    public isConnected: boolean = false;

    public localStore: Store;
    public info: any;
    public messages: any;
    public messagesPromise: any;
    public messagesPriority: number;
    public socket: any;

    // promise of last SyncStore.fetchChanges
    public promiseFetchingChanges: any;
    // timestamp of last SyncStore.fetchChanges, 0 while request is outstanding
    public timestampFetchingChanges: number;

    // promise of last SyncStore.fetchServerInfo
    public promiseFetchingServerInfo: any;
    // timestamp of last SyncStore.fetchServerInfo, 0 while request is outstanding
    public timestampFetchingServerInfo: number;

    constructor(options:{
      entity: any,
      modelType: string,
      urlRoot: string,
      socketPath: string,
      credentials: any
    }) {
      this.entity = options.entity;
      this.modelType = options.modelType;
      this.urlRoot = options.urlRoot;
      this.socketPath = options.socketPath;
      this.credentials = options.credentials;

      var href = URLUtil.getLocation(options.urlRoot);
      this.host = href.protocol + '//' + href.host;
      this.path = href.pathname;

      var name = options.entity.name;
      var user = options.credentials && options.credentials.username ? options.credentials.username : '';
      var hash = URLUtil.hashLocation(options.urlRoot);
      this.channel = name + user + hash;
    }

    /**
     * close the endpoint explicit.
     */
    public close() {
      if (this.socket) {
        this.socket.socket.close();
        this.socket = null;
      }
      if (this.messages.store) {
        this.messages.store.close();
        this.messages = null;
      }
      if (this.localStore) {
        this.localStore.close();
        this.localStore = null;
      }
    }

  }
}
