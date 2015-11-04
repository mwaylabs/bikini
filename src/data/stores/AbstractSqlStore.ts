/**
 * AbstractSqlStore.ts
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
/// <reference path="Store.ts" />
/// <reference path="../../utility/Debug.ts" />

module Relution.LiveData {

  /**
   * The Relution.LiveData.AbstractSqlStore can be used to store model collection into
   * the webSql database
   *
   * @module Relution.LiveData.AbstractSqlStore
   *
   *
   */
  export class AbstractSqlStore extends Store {
    _selector;

    protected db:any = null;
    protected options:any;
    protected dataField = {
      name: 'data',
      type: 'text',
      required: true
    };
    protected idField = {
      name: 'id',
      type: 'string',
      required: true
    };

    constructor(options?:any) {
      super(_.extend({
        name: 'relution-livedata',
        size: 1024 * 1024, // 1 MB
        version: '1.0',
        security: '',

        typeMapping: (function () {
          var map = {};
          map [DATA.TYPE.OBJECTID] = DATA.TYPE.STRING;
          map [DATA.TYPE.DATE] = DATA.TYPE.STRING;
          map [DATA.TYPE.OBJECT] = DATA.TYPE.TEXT;
          map [DATA.TYPE.ARRAY] = DATA.TYPE.TEXT;
          map [DATA.TYPE.BINARY] = DATA.TYPE.TEXT;
          return map;
        })(),
        sqlTypeMapping: (function () {
          var map = {};
          map [DATA.TYPE.STRING] = 'varchar(255)';
          map [DATA.TYPE.TEXT] = 'text';
          map [DATA.TYPE.OBJECT] = 'text';
          map [DATA.TYPE.ARRAY] = 'text';
          map [DATA.TYPE.FLOAT] = 'float';
          map [DATA.TYPE.INTEGER] = 'integer';
          map [DATA.TYPE.DATE] = 'varchar(255)';
          map [DATA.TYPE.BOOLEAN] = 'boolean';
          return map;
        })()
      }, options));
      var that = this;
    }

    public sync(method, model, options) {
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
          } else {
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
    }

    protected select(options) {
      this._select(null, options);
    }

    protected drop(options) {
      this._dropTable(options);
    }

    protected createTable(options) {
      this._createTable(options);
    }

    protected execute(options) {
      this._executeSql(options);
    }

    protected _sqlUpdateDatabase(oldVersion, newVersion) {
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
    }

    protected _sqlDropTable(name) {
      return 'DROP TABLE IF EXISTS \'' + name + '\'';
    }

    protected _isAutoincrementKey(entity, key) {
      if (entity && key) {
        var column = this.getField(entity, key);
        return column && column.type === DATA.TYPE.INTEGER;
      }
    }

    protected _sqlPrimaryKey(entity, keys) {
      if (keys && keys.length === 1) {
        var field = this.getField(entity, keys[0]);
        if (this._isAutoincrementKey(entity, keys[0])) {
          return field.name + ' INTEGER PRIMARY KEY ASC AUTOINCREMENT UNIQUE';
        } else {
          return this._dbAttribute(field) + ' PRIMARY KEY ASC UNIQUE';
        }
      }
      return '';
    }

    protected _sqlConstraint(entity, keys) {
      if (keys && keys.length > 1) {
        return 'PRIMARY KEY (' + keys.join(',') + ') ON CONFLICT REPLACE';
      }
      return '';
    }

    protected _sqlCreateTable(entity) {
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
    }

    protected _sqlDelete(options, entity) {
      var sql = 'DELETE FROM \'' + entity.name + '\'';
      var where = this._sqlWhere(options, entity) || this._sqlWhereFromData(options, entity);
      if (where) {
        sql += ' WHERE ' + where;
      }
      sql += options.and ? ' AND ' + options.and : '';
      return sql;
    }

    protected _sqlWhere(options, entity) {
      this._selector = null;
      var sql = '';
      if (_.isString(options.where)) {
        sql = options.where;
      } else if (_.isObject(options.where)) {
        this._selector = SqlSelector.create(options.where, entity);
        sql = this._selector.buildStatement();
      }
      return sql;
    }

    protected _sqlWhereFromData(options, entity) {
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
    }

    protected _sqlSelect(options, entity) {
      if (options.syncContext) {
        // new code
        var sql = 'SELECT ';
        sql += '*';
        sql += ' FROM \'' + entity.name + '\'';
        return sql;
      }

      var sql = 'SELECT ';
      if (options.fields) {
        if (options.fields.length > 1) {
          sql += options.fields.join(', ');
        } else if (options.fields.length === 1) {
          sql += options.fields[0];
        }
      } else {
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
    }
    public blubber(){

    }
    protected _sqlValue(value, field) {
      var type = field && field.type ? field.type : Field.prototype.detectType(value);
      if (type === DATA.TYPE.INTEGER || type === DATA.TYPE.FLOAT) {
        return value;
      } else if (type === DATA.TYPE.BOOLEAN) {
        return value ? '1' : '0';
      } else if (type === DATA.TYPE.NULL) {
        return 'NULL';
      }
      value = Field.prototype.transform(value, DATA.TYPE.STRING);
      value = value.replace(/"/g, '""');
      return '"' + value + '"';
    }

    protected _dbAttribute(field) {
      if (field && field.name) {
        var type = this.options.sqlTypeMapping[field.type];
        var isReqStr = field.required ? ' NOT NULL' : '';
        if (type) {
          return field.name + ' ' + type.toUpperCase() + isReqStr;
        }
      }
    }

    protected _dropTable(options) {

      var entity = this.getEntity(options);
      entity.db = null;

      if (this._checkDb(options) && entity) {
        var sql = this._sqlDropTable(entity.name);
        // reset flag
        this._executeTransaction(options, [sql]);
      }
    }

    protected _createTable(options) {

      var entity = this.getEntity(options);
      entity.db = this.db;

      if (this._checkDb(options) && this._checkEntity(options, entity)) {
        var sql = this._sqlCreateTable(entity);
        // reset flag
        this._executeTransaction(options, [sql]);
      }
    }

    protected _checkTable(options, callback) {
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
      } else {
        callback();
      }
    }

    protected _insertOrReplace(model, options) {
      var entity = this.getEntity(options);
      var models = isCollection(model) ? model.models : [model];
      if (this._checkDb(options) && this._checkEntity(options, entity) && this._checkData(options, models)) {

        var isAutoInc = this._isAutoincrementKey(entity, entity.getKey());
        var statements = [];
        var sqlTemplate = 'INSERT OR REPLACE INTO \'' + entity.name + '\' (';
        for (var i = 0; i < models.length; i++) {
          var amodel = models[i];
          var statement = ''; // the actual sql insert string with values
          if (!isAutoInc && !amodel.id && amodel.idAttribute) {
            amodel.set(amodel.idAttribute, new ObjectID().toHexString());
          }
          var value = options.attrs || amodel.attributes;
          var args, keys;
          if (!_.isEmpty(entity.fields)) {
            value = entity.fromAttributes(value);
            args = _.values(value);
            keys = _.keys(value);
          } else {
            args = [amodel.id, JSON.stringify(value)];
            keys = [this.idField.name, this.dataField.name];
          }
          if (args.length > 0) {
            var values = new Array(args.length).join('?,') + '?';
            var columns = '\'' + keys.join('\',\'') + '\'';
            statement += sqlTemplate + columns + ') VALUES (' + values + ');';
            statements.push({statement: statement, arguments: args});
          }
        }
        this._executeTransaction(options, statements, model.toJSON());
      }
    }

    protected _select(model, options) {
      var entity = this.getEntity(options);
      if (this._checkDb(options) && this._checkEntity(options, entity)) {
        var lastStatement;
        var isCollection = !isModel(model);
        var result;
        if (isCollection) {
          result = [];
        } else {
          options.models = [model];
        }
        var stm:any = this._sqlSelect(options, entity);
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
            var len = res.rows.length;//, i;
            for (var i = 0; i < len; i++) {
              var item = res.rows.item(i);
              var attrs;
              if (!_.isEmpty(entity.fields) || !that._hasDefaultFields(item)) {
                attrs = entity.toAttributes(item);
              } else {
                try {
                  attrs = JSON.parse(item.data);
                } catch (e) {
                  that.trigger('error', e);
                  continue;
                }
              }
              if (!that._selector || that._selector.matches(attrs)) {
                if (isCollection) {
                  result.push(attrs);
                } else {
                  result = attrs;
                  break;
                }
              }
            }
          }, function (t, e) {
            // error
            Relution.LiveData.Debug.error('webSql error: ' + e.message);
          });
        }, function (sqlError) { // errorCallback
          Relution.LiveData.Debug.error('WebSql Syntax Error: ' + sqlError.message);
          that.handleError(options, sqlError.message, lastStatement);
        }, function () { // voidCallback (success)
          if (result) {
            if (options.syncContext) {
              result = options.syncContext.processAttributes(result, options);
            }
            that.handleSuccess(options, result);
          } else {
            that.handleError(options, 'no result');
          }
        });
      }
    }

    protected _delete(model, options) {
      var entity = this.getEntity(options);
      var models = isCollection(model) ? model.models : [model];
      if (this._checkDb(options) && this._checkEntity(options, entity)) {
        options.models = models;
        var sql = this._sqlDelete(options, entity);
        // reset flag
        this._executeTransaction(options, [sql], model.toJSON());
      }
    }

    protected _executeSql(options) {
      if (options.sql) {
        this._executeTransaction(options, [options.sql]);
      }
    }

    protected _executeTransaction(options, statements, result?) {
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
          }, function (sqlError) { // errorCallback
            Relution.LiveData.Debug.error(sqlError.message);
            that.handleError(options, sqlError.message, lastStatement);
          }, function () {
            that.handleSuccess(options, result);
          });
        } catch (e) {
          Relution.LiveData.Debug.error(e.message);
          error = e;
        }
      }
      if (error) {
        this.handleError(options, error, lastStatement);
      }
    }

    protected _hasDefaultFields(item) {
      return _.every(_.keys(item), function (key) {
        return key === this.idField.name || key === this.dataField.name;
      }, this);
    }

    protected _checkDb(options) {
      // has to be initialized first
      if (!this.db) {
        var error = 'db handler not initialized.';
        Relution.LiveData.Debug.error(error);
        this.handleError(options, error);
        return false;
      }
      return true;
    }

    protected getFields(entity) {
      if (!_.isEmpty(entity.fields)) {
        return entity.fields;
      } else {
        var fields:any = {};
        var idAttribute = entity.idAttribute || 'id';
        fields[idAttribute] = this.idField;
        fields.data = this.dataField;
        return fields;
      }
    }

    protected getField(entity, key) {
      return this.getFields(entity)[key];
    }
  }

}
