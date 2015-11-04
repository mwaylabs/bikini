/**
 * CipherSqlStore.ts
 *
 * Created by Pascal Brewing on 04.11.2015
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
/// <reference path="AbstractSqlStore.ts" />
/// <reference path="../../utility/Debug.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * The Relution.LiveData.CipherSqlStore can be used to store model collection into
         * the webSql database
         *
         * @module Relution.LiveData.CipherSqlStore
         *
         * @type {*}
         * @extends Relution.LiveData.AbstractSqlStore
         *
         * @example
         *
         * // The default configuration will save the complete model data as json
         * // into a database column with the name "data"
         *
         * var MyCollection = Relution.LiveData.Collection.extend({
         *      model: MyModel,
         *      entity: 'MyTableName',
         *      store: new Relution.LiveData.CipherSqlStore()
         * });
         *
         * // If you want to use specific columns you can specify the fields
         * // in the entity of your model like this:
         *
         * var MyModel = Relution.LiveData.Model.extend({
         *      idAttribute: 'id',
         *      fields: {
         *          id:          { type: Relution.LiveData.DATA.TYPE.STRING,  required: true, index: true },
         *          sureName:    { name: 'USERNAME', type: Relution.LiveData.DATA.TYPE.STRING },
         *          firstName:   { type: Relution.LiveData.DATA.TYPE.STRING,  length: 200 },
         *          age:         { type: Relution.LiveData.DATA.TYPE.INTEGER }
         *      }
         * });
         * 0 (default): Documents - visible to iTunes and backed up by iCloud
         * 1: Library - backed up by iCloud, NOT visible to iTunes
         * 2: Library/LocalDatabase - NOT visible to iTunes and NOT backed up by iCloud
         *
         */
        var CipherSqlStore = (function (_super) {
            __extends(CipherSqlStore, _super);
            function CipherSqlStore(options) {
                _super.call(this, _.extend({
                    name: 'relution-livedata',
                    size: 1024 * 1024,
                    security: null
                }, options));
                if (options && !options.security) {
                    return console.error('security Key is required on a CipherSqlStore');
                }
                console.log('CipherSqlStore', options);
                var self = this;
                this._openDb({
                    error: function (error) {
                        Relution.LiveData.Debug.error(error);
                        self.trigger('error', error);
                    }
                });
            }
            /**
             * @private
             */
            CipherSqlStore.prototype._openDb = function (errorCallback) {
                var error, dbError;
                if (this.options && !this.options.security) {
                    return console.error('A CipherSqlStore need a Security Token!', this.options);
                }
                /* openDatabase(db_name, version, description, estimated_size, callback) */
                if (!this.db) {
                    try {
                        if (!global.openDatabase) {
                            error = 'Your browser does not support WebSQL databases.';
                        }
                        else {
                            this.db = window.sqlitePlugin.openDatabase(this.options.name, this.options.security, 2);
                            if (this.entities) {
                                for (var key in this.entities) {
                                    this._createTable({ entity: this.entities[key] });
                                }
                            }
                        }
                    }
                    catch (e) {
                        dbError = e;
                    }
                }
                if (this.db) {
                    if (this.options.version && this.db.version !== this.options.version) {
                        this._updateDb(errorCallback);
                    }
                    else {
                        this.handleSuccess(errorCallback, this.db);
                    }
                }
                else if (dbError === 2 || dbError === '2') {
                    // Version number mismatch.
                    this._updateDb(errorCallback);
                }
                else {
                    if (!error && dbError) {
                        error = dbError;
                    }
                    this.handleSuccess(errorCallback, error);
                }
            };
            CipherSqlStore.prototype._updateDb = function (options) {
                var error;
                var lastSql;
                var that = this;
                try {
                    if (!this.db) {
                        this.db = window.sqlitePlugin.openDatabase(this.options.name, this.options.security, 2);
                    }
                    try {
                        var arSql = this._sqlUpdateDatabase(this.db.version, this.options.version);
                        console.log('sqlcipher cant change the version its still not supported check out https://github.com/litehelpers/Cordova-sqlcipher-adapter#other-limitations');
                    }
                    catch (e) {
                        error = e.message;
                        Relution.LiveData.Debug.error('webSql change version failed, DB-Version: ' + this.db.version);
                    }
                }
                catch (e) {
                    error = e.message;
                }
                if (error) {
                    this.handleError(options, error);
                }
            };
            return CipherSqlStore;
        })(LiveData.AbstractSqlStore);
        LiveData.CipherSqlStore = CipherSqlStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
