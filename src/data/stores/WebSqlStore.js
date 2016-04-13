/**
 * WebSqlStore.ts
 *
 * Created by Thomas Beckmann on 24.06.2015
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution;
(function (Relution) {
    var LiveData;
    (function (LiveData) {
        /**
         * The Relution.LiveData.WebSqlStore can be used to store model collection into
         * the webSql database
         *
         * @module Relution.LiveData.WebSqlStore
         *
         * @type {*}
         * @extends Relution.LiveData.Store
         *
         * @example
         *
         * // The default configuration will save the complete model data as json
         * // into a database column with the name "data"
         *
         * var MyCollection = Relution.LiveData.Collection.extend({
         *      model: MyModel,
         *      entity: 'MyTableName',
         *      store: new Relution.LiveData.WebSqlStorageStore()
         * });
         *
         * // If you want to use specific columns you can specify the fields
         * // in the entity of your model like this:
         *
         * var MyModel = Relution.LiveData.Model.extend({
         *      idAttribute: 'id'
         * });
         */
        var WebSqlStore = (function (_super) {
            __extends(WebSqlStore, _super);
            function WebSqlStore(options) {
                _super.call(this, options);
                var that = this;
                this._openDb({
                    error: function (error) {
                        Relution.LiveData.Debug.error(error);
                        that.trigger('error', error);
                    }
                });
            }
            /**
             * @private
             */
            WebSqlStore.prototype._openDb = function (options) {
                var error, dbError;
                /* openDatabase(db_name, version, description, estimated_size, callback) */
                if (!this.db) {
                    try {
                        if (!global.openDatabase) {
                            error = 'Your browser does not support WebSQL databases.';
                        }
                        else {
                            this.db = global.openDatabase(this.name, '', '', this.size);
                            if (this.entities) {
                                for (var entity in this.entities) {
                                    this._createTable({ entity: entity });
                                }
                            }
                        }
                    }
                    catch (e) {
                        dbError = e;
                    }
                }
                if (this.db) {
                    if (this.version && this.db.version !== this.version) {
                        this._updateDb(options);
                    }
                    else {
                        this.handleSuccess(options, this.db);
                    }
                }
                else if (dbError === 2 || dbError === '2') {
                    // Version number mismatch.
                    this._updateDb(options);
                }
                else {
                    if (!error && dbError) {
                        error = dbError;
                    }
                    this.handleSuccess(options, error);
                }
            };
            WebSqlStore.prototype._updateDb = function (options) {
                var error;
                var lastSql;
                var that = this;
                try {
                    if (!this.db) {
                        this.db = global.openDatabase(this.name, '', '', this.size);
                    }
                    try {
                        var arSql = this._sqlUpdateDatabase(this.db.version, this.version);
                        this.db.changeVersion(this.db.version, this.version, function (tx) {
                            _.each(arSql, function (sql) {
                                Relution.LiveData.Debug.info('sql statement: ' + sql);
                                lastSql = sql;
                                tx.executeSql(sql);
                            });
                        }, function (err) {
                            if (!lastSql && that.db.version === that.options.version) {
                                // not a real error, concurrent migration attempt completed already
                                that.handleSuccess(options, that.db);
                            }
                            else {
                                that.handleError(options, err.message, lastSql);
                            }
                        }, function () {
                            that.handleSuccess(options, that.db);
                        });
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
            WebSqlStore.prototype.close = function () {
                Relution.LiveData.Debug.info('WebSQL Store close');
                if (this.db) {
                    this.db = null;
                }
            };
            return WebSqlStore;
        })(LiveData.AbstractSqlStore);
        LiveData.WebSqlStore = WebSqlStore;
        // mixins
        var webSqlStore = _.extend(WebSqlStore.prototype, {
            _type: 'Relution.LiveData.WebSqlStore'
        });
        Relution.assert(function () { return WebSqlStore.prototype.isPrototypeOf(webSqlStore); });
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=WebSqlStore.js.map