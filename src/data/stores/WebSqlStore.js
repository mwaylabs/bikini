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
/// <reference path="Store.ts" />
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
         *      idAttribute: 'id',
         *      fields: {
         *          id:          { type: Relution.LiveData.DATA.TYPE.STRING,  required: true, index: true },
         *          sureName:    { name: 'USERNAME', type: Relution.LiveData.DATA.TYPE.STRING },
         *          firstName:   { type: Relution.LiveData.DATA.TYPE.STRING,  length: 200 },
         *          age:         { type: Relution.LiveData.DATA.TYPE.INTEGER }
         *      }
         * });
         *
         *
         */
        var WebSqlStore = (function (_super) {
            __extends(WebSqlStore, _super);
            function WebSqlStore(options) {
                _super.call(this, _.extend({
                    name: 'relution-livedata',
                    size: 1024 * 1024,
                    version: '1.0',
                    typeMapping: (function () {
                        var map = {};
                        map[LiveData.DATA.TYPE.OBJECTID] = LiveData.DATA.TYPE.STRING;
                        map[LiveData.DATA.TYPE.DATE] = LiveData.DATA.TYPE.STRING;
                        map[LiveData.DATA.TYPE.OBJECT] = LiveData.DATA.TYPE.TEXT;
                        map[LiveData.DATA.TYPE.ARRAY] = LiveData.DATA.TYPE.TEXT;
                        map[LiveData.DATA.TYPE.BINARY] = LiveData.DATA.TYPE.TEXT;
                        return map;
                    })(),
                    sqlTypeMapping: (function () {
                        var map = {};
                        map[LiveData.DATA.TYPE.STRING] = 'varchar(255)';
                        map[LiveData.DATA.TYPE.TEXT] = 'text';
                        map[LiveData.DATA.TYPE.OBJECT] = 'text';
                        map[LiveData.DATA.TYPE.ARRAY] = 'text';
                        map[LiveData.DATA.TYPE.FLOAT] = 'float';
                        map[LiveData.DATA.TYPE.INTEGER] = 'integer';
                        map[LiveData.DATA.TYPE.DATE] = 'varchar(255)';
                        map[LiveData.DATA.TYPE.BOOLEAN] = 'boolean';
                        return map;
                    })()
                }, options));
                this.db = null;
                this.dataField = {
                    name: 'data',
                    type: 'text',
                    required: true
                };
                this.idField = {
                    name: 'id',
                    type: 'string',
                    required: true
                };
                var that = this;
                this._openDb({
                    error: function (error) {
                        Relution.LiveData.Debug.error(error);
                        that.trigger('error', error);
                    }
                });
            }
            WebSqlStore.prototype.sync = function (method, model, options) {
                options = options || {};
                var that = this;
                var q = Q.defer();
                var opts = _.extend({
                    entity: model.entity || options.entity
                }, options || {}, {
                    success: function (response) {
                        var result = that.handleSuccess(options, response) || response;
                        q.resolve(result);
                        return result;
                    },
                    error: function (error) {
                        var result = that.handleError(options, error);
                        if (result) {
                            q.resolve(result);
                            return result;
                        }
                        else {
                            q.reject(error);
                        }
                    }
                });
                switch (method) {
                    case 'create':
                        that._checkTable(opts, function () {
                            that._insertOrReplace(model, opts);
                        });
                        break;
                    case 'update':
                    case 'patch':
                        that._checkTable(opts, function () {
                            that._insertOrReplace(model, opts);
                        });
                        break;
                    case 'delete':
                        that._checkTable(opts, function () {
                            that._delete(model, opts);
                        });
                        break;
                    case 'read':
                        that._checkTable(opts, function () {
                            that._select(model, opts);
                        });
                        break;
                    default:
                        break;
                }
                return q.promise;
            };
            WebSqlStore.prototype.select = function (options) {
                this._select(null, options);
            };
            WebSqlStore.prototype.drop = function (options) {
                this._dropTable(options);
            };
            WebSqlStore.prototype.createTable = function (options) {
                this._createTable(options);
            };
            WebSqlStore.prototype.execute = function (options) {
                this._executeSql(options);
            };
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
                            this.db = global.openDatabase(this.options.name, '', '', this.options.size);
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
                        this.db = global.openDatabase(this.options.name, '', '', this.options.size);
                    }
                    try {
                        var arSql = this._sqlUpdateDatabase(this.db.version, this.options.version);
                        this.db.changeVersion(this.db.version, this.options.version, function (tx) {
                            _.each(arSql, function (sql) {
                                Relution.LiveData.Debug.info('sql statement: ' + sql);
                                lastSql = sql;
                                tx.executeSql(sql);
                            });
                        }, function (msg) {
                            that.handleError(options, msg, lastSql);
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
            WebSqlStore.prototype._sqlUpdateDatabase = function (oldVersion, newVersion) {
                // create sql array, simply drop and create the database
                var sql = [];
                if (this.entities) {
                    for (var name in this.entities) {
                        var entity = this.entities[name];
                        sql.push(this._sqlDropTable(entity.name));
                        sql.push(this._sqlCreateTable(entity));
                    }
                }
                return sql;
            };
            WebSqlStore.prototype._sqlDropTable = function (name) {
                return 'DROP TABLE IF EXISTS \'' + name + '\'';
            };
            WebSqlStore.prototype._isAutoincrementKey = function (entity, key) {
                if (entity && key) {
                    var column = this.getField(entity, key);
                    return column && column.type === LiveData.DATA.TYPE.INTEGER;
                }
            };
            WebSqlStore.prototype._sqlPrimaryKey = function (entity, keys) {
                if (keys && keys.length === 1) {
                    var field = this.getField(entity, keys[0]);
                    if (this._isAutoincrementKey(entity, keys[0])) {
                        return field.name + ' INTEGER PRIMARY KEY ASC AUTOINCREMENT UNIQUE';
                    }
                    else {
                        return this._dbAttribute(field) + ' PRIMARY KEY ASC UNIQUE';
                    }
                }
                return '';
            };
            WebSqlStore.prototype._sqlConstraint = function (entity, keys) {
                if (keys && keys.length > 1) {
                    return 'PRIMARY KEY (' + keys.join(',') + ') ON CONFLICT REPLACE';
                }
                return '';
            };
            WebSqlStore.prototype._sqlCreateTable = function (entity) {
                var that = this;
                var keys = entity.getKeys();
                var primaryKey = keys.length === 1 ? this._sqlPrimaryKey(entity, keys) : '';
                var constraint = keys.length > 1 ? this._sqlConstraint(entity, keys) : (entity.constraint || '');
                var columns = '';
                var fields = this.getFields(entity);
                _.each(fields, function (field) {
                    // skip primary key as it is defined manually above
                    if (!primaryKey || field !== fields[keys[0]]) {
                        // only add valid types
                        var attr = that._dbAttribute(field);
                        if (attr) {
                            columns += (columns ? ', ' : '') + attr;
                        }
                    }
                });
                if (!columns) {
                    columns = this._dbAttribute(this.dataField);
                }
                var sql = 'CREATE TABLE IF NOT EXISTS \'' + entity.name + '\' (';
                sql += primaryKey ? primaryKey + ', ' : '';
                sql += columns;
                sql += constraint ? ', ' + constraint : '';
                sql += ');';
                return sql;
            };
            WebSqlStore.prototype._sqlDelete = function (options, entity) {
                var sql = 'DELETE FROM \'' + entity.name + '\'';
                var where = this._sqlWhere(options, entity) || this._sqlWhereFromData(options, entity);
                if (where) {
                    sql += ' WHERE ' + where;
                }
                sql += options.and ? ' AND ' + options.and : '';
                return sql;
            };
            WebSqlStore.prototype._sqlWhere = function (options, entity) {
                this._selector = null;
                var sql = '';
                if (_.isString(options.where)) {
                    sql = options.where;
                }
                else if (_.isObject(options.where)) {
                    this._selector = LiveData.SqlSelector.create(options.where, entity);
                    sql = this._selector.buildStatement();
                }
                return sql;
            };
            WebSqlStore.prototype._sqlWhereFromData = function (options, entity) {
                var that = this;
                var ids = [];
                if (options && options.models && entity && entity.idAttribute) {
                    var id, key = entity.idAttribute;
                    var field = this.getField(entity, key);
                    _.each(options.models, function (model) {
                        id = model.id;
                        if (!_.isUndefined(id)) {
                            ids.push(that._sqlValue(id, field));
                        }
                    });
                    if (ids.length > 0) {
                        return key + ' IN (' + ids.join(',') + ')';
                    }
                }
                return '';
            };
            WebSqlStore.prototype._sqlSelect = function (options, entity) {
                var sql = 'SELECT ';
                if (options.fields) {
                    if (options.fields.length > 1) {
                        sql += options.fields.join(', ');
                    }
                    else if (options.fields.length === 1) {
                        sql += options.fields[0];
                    }
                }
                else {
                    sql += '*';
                }
                sql += ' FROM \'' + entity.name + '\'';
                if (options.join) {
                    sql += ' JOIN ' + options.join;
                }
                if (options.leftJoin) {
                    sql += ' LEFT JOIN ' + options.leftJoin;
                }
                var where = this._sqlWhere(options, entity) || this._sqlWhereFromData(options, entity);
                if (where) {
                    sql += ' WHERE ' + where;
                }
                if (options.order) {
                    sql += ' ORDER BY ' + options.order;
                }
                if (options.limit) {
                    sql += ' LIMIT ' + options.limit;
                }
                if (options.offset) {
                    sql += ' OFFSET ' + options.offset;
                }
                return sql;
            };
            WebSqlStore.prototype._sqlValue = function (value, field) {
                var type = field && field.type ? field.type : LiveData.Field.prototype.detectType(value);
                if (type === LiveData.DATA.TYPE.INTEGER || type === LiveData.DATA.TYPE.FLOAT) {
                    return value;
                }
                else if (type === LiveData.DATA.TYPE.BOOLEAN) {
                    return value ? '1' : '0';
                }
                else if (type === LiveData.DATA.TYPE.NULL) {
                    return 'NULL';
                }
                value = LiveData.Field.prototype.transform(value, LiveData.DATA.TYPE.STRING);
                value = value.replace(/"/g, '""');
                return '"' + value + '"';
            };
            WebSqlStore.prototype._dbAttribute = function (field) {
                if (field && field.name) {
                    var type = this.options.sqlTypeMapping[field.type];
                    var isReqStr = field.required ? ' NOT NULL' : '';
                    if (type) {
                        return field.name + ' ' + type.toUpperCase() + isReqStr;
                    }
                }
            };
            WebSqlStore.prototype._dropTable = function (options) {
                var entity = this.getEntity(options);
                entity.db = null;
                if (this._checkDb(options) && entity) {
                    var sql = this._sqlDropTable(entity.name);
                    // reset flag
                    this._executeTransaction(options, [sql]);
                }
            };
            WebSqlStore.prototype._createTable = function (options) {
                var entity = this.getEntity(options);
                entity.db = this.db;
                if (this._checkDb(options) && this._checkEntity(options, entity)) {
                    var sql = this._sqlCreateTable(entity);
                    // reset flag
                    this._executeTransaction(options, [sql]);
                }
            };
            WebSqlStore.prototype._checkTable = function (options, callback) {
                var entity = this.getEntity(options);
                var that = this;
                if (entity && !entity.db) {
                    this._createTable({
                        success: function () {
                            callback();
                        },
                        error: function (error) {
                            this.handleError(options, error);
                        },
                        entity: entity
                    });
                }
                else {
                    callback();
                }
            };
            WebSqlStore.prototype._insertOrReplace = function (model, options) {
                var entity = this.getEntity(options);
                var models = LiveData.isCollection(model) ? model.models : [model];
                if (this._checkDb(options) && this._checkEntity(options, entity) && this._checkData(options, models)) {
                    var isAutoInc = this._isAutoincrementKey(entity, entity.getKey());
                    var statements = [];
                    var sqlTemplate = 'INSERT OR REPLACE INTO \'' + entity.name + '\' (';
                    for (var i = 0; i < models.length; i++) {
                        var amodel = models[i];
                        var statement = ''; // the actual sql insert string with values
                        if (!isAutoInc && !amodel.id && amodel.idAttribute) {
                            amodel.set(amodel.idAttribute, new LiveData.ObjectID().toHexString());
                        }
                        var value = options.attrs || amodel.attributes;
                        var args, keys;
                        if (!_.isEmpty(entity.fields)) {
                            value = entity.fromAttributes(value);
                            args = _.values(value);
                            keys = _.keys(value);
                        }
                        else {
                            args = [amodel.id, JSON.stringify(value)];
                            keys = [this.idField.name, this.dataField.name];
                        }
                        if (args.length > 0) {
                            var values = new Array(args.length).join('?,') + '?';
                            var columns = '\'' + keys.join('\',\'') + '\'';
                            statement += sqlTemplate + columns + ') VALUES (' + values + ');';
                            statements.push({ statement: statement, arguments: args });
                        }
                    }
                    this._executeTransaction(options, statements, model.toJSON());
                }
            };
            WebSqlStore.prototype._select = function (model, options) {
                var entity = this.getEntity(options);
                if (this._checkDb(options) && this._checkEntity(options, entity)) {
                    var lastStatement;
                    var isCollection = !LiveData.isModel(model);
                    var result;
                    if (isCollection) {
                        result = [];
                    }
                    else {
                        options.models = [model];
                    }
                    var stm = this._sqlSelect(options, entity);
                    var that = this;
                    this.db.readTransaction(function (t) {
                        var statement = stm.statement || stm;
                        var args = stm.arguments;
                        lastStatement = statement;
                        Relution.LiveData.Debug.info('sql statement: ' + statement);
                        if (args) {
                            Relution.LiveData.Debug.trace('arguments: ' + JSON.stringify(args));
                        }
                        t.executeSql(statement, args, function (tx, res) {
                            var len = res.rows.length; //, i;
                            for (var i = 0; i < len; i++) {
                                var item = res.rows.item(i);
                                var attrs;
                                if (!_.isEmpty(entity.fields) || !that._hasDefaultFields(item)) {
                                    attrs = entity.toAttributes(item);
                                }
                                else {
                                    try {
                                        attrs = JSON.parse(item.data);
                                    }
                                    catch (e) {
                                        that.trigger('error', e);
                                        continue;
                                    }
                                }
                                if (!that._selector || that._selector.matches(attrs)) {
                                    if (isCollection) {
                                        result.push(attrs);
                                    }
                                    else {
                                        result = attrs;
                                        break;
                                    }
                                }
                            }
                        }, function (t, e) {
                            // error
                            Relution.LiveData.Debug.error('webSql error: ' + e.message);
                        });
                    }, function (sqlError) {
                        Relution.LiveData.Debug.error('WebSql Syntax Error: ' + sqlError.message);
                        that.handleError(options, sqlError.message, lastStatement);
                    }, function () {
                        if (result) {
                            that.handleSuccess(options, result);
                        }
                        else {
                            that.handleError(options, 'no result');
                        }
                    });
                }
            };
            WebSqlStore.prototype._delete = function (model, options) {
                var entity = this.getEntity(options);
                var models = LiveData.isCollection(model) ? model.models : [model];
                if (this._checkDb(options) && this._checkEntity(options, entity)) {
                    options.models = models;
                    var sql = this._sqlDelete(options, entity);
                    // reset flag
                    this._executeTransaction(options, [sql], model.toJSON());
                }
            };
            WebSqlStore.prototype._executeSql = function (options) {
                if (options.sql) {
                    this._executeTransaction(options, [options.sql]);
                }
            };
            WebSqlStore.prototype._executeTransaction = function (options, statements, result) {
                var error;
                var lastStatement;
                if (this._checkDb(options)) {
                    var that = this;
                    try {
                        /* transaction has 3 parameters: the transaction callback, the error callback and the success callback */
                        this.db.transaction(function (t) {
                            _.each(statements, function (stm) {
                                var statement = stm.statement || stm;
                                var args = stm.arguments;
                                lastStatement = statement;
                                Relution.LiveData.Debug.info('sql statement: ' + statement);
                                if (args) {
                                    Relution.LiveData.Debug.trace('    arguments: ' + JSON.stringify(args));
                                }
                                t.executeSql(statement, args);
                            });
                        }, function (sqlError) {
                            Relution.LiveData.Debug.error(sqlError.message);
                            that.handleError(options, sqlError.message, lastStatement);
                        }, function () {
                            that.handleSuccess(options, result);
                        });
                    }
                    catch (e) {
                        Relution.LiveData.Debug.error(e.message);
                        error = e;
                    }
                }
                if (error) {
                    this.handleError(options, error, lastStatement);
                }
            };
            WebSqlStore.prototype._hasDefaultFields = function (item) {
                return _.every(_.keys(item), function (key) {
                    return key === this.idField.name || key === this.dataField.name;
                }, this);
            };
            WebSqlStore.prototype._checkDb = function (options) {
                // has to be initialized first
                if (!this.db) {
                    var error = 'db handler not initialized.';
                    Relution.LiveData.Debug.error(error);
                    this.handleError(options, error);
                    return false;
                }
                return true;
            };
            WebSqlStore.prototype.getFields = function (entity) {
                if (!_.isEmpty(entity.fields)) {
                    return entity.fields;
                }
                else {
                    var fields = {};
                    var idAttribute = entity.idAttribute || 'id';
                    fields[idAttribute] = this.idField;
                    fields.data = this.dataField;
                    return fields;
                }
            };
            WebSqlStore.prototype.getField = function (entity, key) {
                return this.getFields(entity)[key];
            };
            return WebSqlStore;
        })(LiveData.Store);
        LiveData.WebSqlStore = WebSqlStore;
    })(LiveData = Relution.LiveData || (Relution.LiveData = {}));
})(Relution || (Relution = {}));
//# sourceMappingURL=WebSqlStore.js.map