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
/// <reference path="../Model.ts" />
/// <reference path="../Collection.ts" />
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

    public entity: string;
    public modelType: ModelCtor;
    public urlRoot: string;
    public socketPath: string;
    public credentials: any;

    public host: string;
    public path: string;
    public channel: string;
    public isConnected: Q.Promise<void> = null;

    public localStore: Store;
    public info: Q.Promise<Model>;
    public priority: number;
    public socket: SocketIOClient.Socket;

    // promise of last SyncStore.fetchChanges
    public promiseFetchingChanges: Q.Promise<Collection>;
    // timestamp of last SyncStore.fetchChanges, 0 while request is outstanding
    public timestampFetchingChanges: number;

    // promise of last SyncStore.fetchServerInfo
    public promiseFetchingServerInfo: Q.Promise<Model>;
    // timestamp of last SyncStore.fetchServerInfo, 0 while request is outstanding
    public timestampFetchingServerInfo: number;

    constructor(options:{
      entity: string,
      modelType: ModelCtor,
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

      var name = options.entity;
      var user = options.credentials && options.credentials.username ? options.credentials.username : '';
      var hash = URLUtil.hashLocation(options.urlRoot);
      this.channel = name + user + hash;
    }

    /**
     * close the endpoint explicit.
     */
    public close() {
      if (this.socket) {
        // consider calling this.socket.close() instead
        (<any>this.socket).socket.close();
        this.socket = null;
      }
      if (this.localStore) {
        this.localStore.close();
        this.localStore = null;
      }
    }

  }
}
