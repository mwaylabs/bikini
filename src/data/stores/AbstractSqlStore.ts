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
/* jshint -W109: Strings must use singlequote. */
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
   */
  export class AbstractSqlStore extends Store {
    protected db: any = null;
    protected options: any;
    protected entities: { [entity: string]: boolean } = {};

    constructor(options?:any) {
      super(_.extend({
        name: 'relution-livedata',
        size: 1024 * 1024, // 1 MB
        version: '1.0',
        security: '',
        entities: {}
      }, options));

      for (var entity in this.options.entities) {
        this.entities[entity] = false;
      }
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
      for (var entity in this.entities) {
        sql.push(this._sqlDropTable(entity));
        sql.push(this._sqlCreateTable(entity));
      }
      return sql;
    }

    protected _sqlDropTable(entity) {
      return `DROP TABLE IF EXISTS '${entity}';`;
    }

    protected _sqlCreateTable(entity) {
      return `CREATE TABLE IF NOT EXISTS '${entity}' (id VARCHAR(255) NOT NULL PRIMARY KEY ASC UNIQUE, data  TEXT NOT NULL);`;
    }

    protected _sqlDelete(options, entity) {
      var sql = 'DELETE FROM \'' + entity + '\'';
      var where = this._sqlWhereFromData(options, entity);
      if (where) {
        sql += ' WHERE ' + where;
      } else {
        Relution.assert(() => false, 'attempt of deletion without where clause');
      }
      sql += options.and ? ' AND ' + options.and : '';
      return sql;
    }

    protected _sqlWhereFromData(options, entity) {
      if (options && options.models && entity) {
        var ids = [];
        var that = this;
        _.each(options.models, function (model) {
          if (!model.isNew()) {
            ids.push(that._sqlValue(model.id));
          }
        });
        if (ids.length > 0) {
          return 'id IN (' + ids.join(',') + ')';
        }
      }
      return '';
    }

    protected _sqlSelect(options, entity) {
      if (options.syncContext) {
        // new code
        var sql = 'SELECT ';
        sql += '*';
        sql += ' FROM \'' + entity + '\'';
        return sql;
      }

      var sql = 'SELECT ';
      sql += '*';
      sql += ' FROM \'' + entity + '\'';

      var where = this._sqlWhereFromData(options, entity);
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

    protected _sqlValue(value) {
      value = _.isNull(value) ? 'null' : _.isObject(value) ? JSON.stringify(value) : value.toString();
      value = value.replace(/"/g, '""');
      return '"' + value + '"';
    }

    protected _dropTable(options) {
      var entity = options.entity;
      this.entities[entity] = false;

      if (this._checkDb(options) && entity) {
        var sql = this._sqlDropTable(entity);
        // reset flag
        this._executeTransaction(options, [sql]);
      }
    }

    protected _createTable(options) {
      var entity = options.entity;
      this.entities[entity] = true;

      if (this._checkDb(options)) {
        var sql = this._sqlCreateTable(entity);
        // reset flag
        this._executeTransaction(options, [sql]);
      }
    }

    protected _checkTable(options, callback) {
      var entity = options.entity;
      var that = this;
      if (entity && !this.entities[entity]) {
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
      var entity = options.entity;
      var models = isCollection(model) ? model.models : [model];
      if (this._checkDb(options) && this._checkData(options, models)) {
        var statements = [];
        var sqlTemplate = 'INSERT OR REPLACE INTO \'' + entity + '\' (';
        for (var i = 0; i < models.length; i++) {
          var amodel = models[i];
          var statement = ''; // the actual sql insert string with values
          if (!amodel.id) {
            amodel.set(amodel.idAttribute, new ObjectID().toHexString());
          }
          var value = options.attrs || amodel.attributes;
          var keys = [ 'id', 'data' ];
          var args = [ amodel.id, JSON.stringify(value) ];
          if (args.length > 0) {
            var values = new Array(args.length).join('?,') + '?';
            var columns = '\'' + keys.join('\',\'') + '\'';
            statement += sqlTemplate + columns + ') VALUES (' + values + ');';
            statements.push({
              statement: statement,
              arguments: args
            });
          }
        }
        this._executeTransaction(options, statements, model.toJSON());
      }
    }

    protected _select(model, options) {
      var entity = options.entity;
      if (this._checkDb(options)) {
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
              try {
                attrs = JSON.parse(item.data);
              } catch (e) {
                that.trigger('error', e);
                continue;
              }
              if (isCollection) {
                result.push(attrs);
              } else {
                result = attrs;
                break;
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
      var entity = options.entity;
      var models = isCollection(model) ? model.models : [model];
      if (this._checkDb(options)) {
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
  }

}
