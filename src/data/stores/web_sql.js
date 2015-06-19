// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

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
Relution.LiveData.WebSqlStore = Relution.LiveData.Store.extend({

  _type: 'Relution.LiveData.WebSqlStore',

  _selector: null,

  options: null,

  name: 'relution-livedata',

  size: 1024 * 1024, // 1 MB

  version: '1.0',

  db: null,

  dataField: {name: 'data', type: 'text', required: true},

  idField: {name: 'id', type: 'string', required: true},

  typeMapping: (function () {
    var map = {};
    map [Relution.LiveData.DATA.TYPE.OBJECTID] = Relution.LiveData.DATA.TYPE.STRING;
    map [Relution.LiveData.DATA.TYPE.DATE] = Relution.LiveData.DATA.TYPE.STRING;
    map [Relution.LiveData.DATA.TYPE.OBJECT] = Relution.LiveData.DATA.TYPE.TEXT;
    map [Relution.LiveData.DATA.TYPE.ARRAY] = Relution.LiveData.DATA.TYPE.TEXT;
    map [Relution.LiveData.DATA.TYPE.BINARY] = Relution.LiveData.DATA.TYPE.TEXT;
    return map;
  })(),

  sqlTypeMapping: (function () {
    var map = {};
    map [Relution.LiveData.DATA.TYPE.STRING] = 'varchar(255)';
    map [Relution.LiveData.DATA.TYPE.TEXT] = 'text';
    map [Relution.LiveData.DATA.TYPE.OBJECT] = 'text';
    map [Relution.LiveData.DATA.TYPE.ARRAY] = 'text';
    map [Relution.LiveData.DATA.TYPE.FLOAT] = 'float';
    map [Relution.LiveData.DATA.TYPE.INTEGER] = 'integer';
    map [Relution.LiveData.DATA.TYPE.DATE] = 'varchar(255)';
    map [Relution.LiveData.DATA.TYPE.BOOLEAN] = 'boolean';
    return map;
  })(),

  initialize: function (options) {
    Relution.LiveData.Store.prototype.initialize.apply(this, arguments);
    this.options = this.options || {};
    this.options.name = this.name;
    this.options.size = this.size;
    this.options.version = this.version;
    this.options.typeMapping = this.typeMapping;
    this.options.sqlTypeMapping = this.sqlTypeMapping;
    _.extend(this.options, options || {});

    var that = this;
    this._openDb({
      error: function (error) {
        console.error(error);
        that.trigger('error', error);
      }
    });
  },

  sync: function (method, model, options) {
    options = options || {};
    var that = this;
    var q = Q.defer();
    var opts = _.extend({
      entity: model.entity || options.entity || this.entity
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

    var models = Relution.LiveData.isCollection(model) ? model.models : [model];
    switch (method) {
      case 'create':
        that._checkTable(opts, function () {
          that._insertOrReplace(models, opts);
        });
        break;

      case 'update':
      case 'patch':
        that._checkTable(opts, function () {
          that._insertOrReplace(models, opts);
        });
        break;

      case 'delete':
        that._checkTable(opts, function () {
          that._delete(models, opts);
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
  },

  select: function (options) {
    this._select(null, options);
  },

  drop: function (options) {
    this._dropTable(options);
  },

  createTable: function (options) {
    this._createTable(options);
  },

  execute: function (options) {
    this._executeSql(options);
  },

  /**
   * @private
   */
  _openDb: function (options) {
    var error, dbError;
    /* openDatabase(db_name, version, description, estimated_size, callback) */
    if (!this.db) {
      try {
        if (!window.openDatabase) {
          error = 'Your browser does not support WebSQL databases.';
        } else {
          this.db = window.openDatabase(this.options.name, '', '', this.options.size);
          if (this.entities) {
            for (var key in this.entities) {
              this._createTable({entity: this.entities[key]});
            }
          }
        }
      } catch (e) {
        dbError = e;
      }
    }
    if (this.db) {
      if (this.options.version && this.db.version !== this.options.version) {
        this._updateDb(options);
      } else {
        this.handleSuccess(options, this.db);
      }
    } else if (dbError === 2 || dbError === '2') {
      // Version number mismatch.
      this._updateDb(options);
    } else {
      if (!error && dbError) {
        error = dbError;
      }
      this.handleSuccess(options, error);
    }
  },

  _updateDb: function (options) {
    var error;
    var lastSql;
    var that = this;
    try {
      var db = window.openDatabase(this.options.name, '', '', this.options.size);
      try {
        var arSql = this._sqlUpdateDatabase(db.version, this.options.version);
        db.changeVersion(db.version, this.options.version, function (tx) {
          _.each(arSql, function (sql) {
            Relution.debug('sql statement: ' + sql);
            lastSql = sql;
            tx.executeSql(sql);
          });
        }, function (msg) {
          that.handleError(options, msg, lastSql);
        }, function () {
          that.handleSuccess(options);
        });
      } catch (e) {
        error = e.message;
        console.error('webSql change version failed, DB-Version: ' + db.version);
      }
    } catch (e) {
      error = e.message;
    }
    if (error) {
      this.handleError(options, error);
    }
  },

  _sqlUpdateDatabase: function (oldVersion, newVersion) {
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
  },

  _sqlDropTable: function (name) {
    return 'DROP TABLE IF EXISTS \'' + name + '\'';
  },

  _isAutoincrementKey: function (entity, key) {
    if (entity && key) {
      var column = this.getField(entity, key);
      return column && column.type === Relution.LiveData.DATA.TYPE.INTEGER;
    }
  },

  _sqlPrimaryKey: function (entity, keys) {
    if (keys && keys.length === 1) {
      if (this._isAutoincrementKey(entity, keys[0])) {
        return keys[0] + ' INTEGER PRIMARY KEY ASC AUTOINCREMENT UNIQUE';
      } else {
        return keys[0] + ' PRIMARY KEY ASC UNIQUE';
      }
    }
    return '';
  },

  _sqlConstraint: function (entity, keys) {
    if (keys && keys.length > 1) {
      return 'PRIMARY KEY (' + keys.join(',') + ') ON CONFLICT REPLACE';
    }
    return '';
  },

  _sqlCreateTable: function (entity) {
    var that = this;
    var keys = entity.getKeys();
    var primaryKey = keys.length === 1 ? this._sqlPrimaryKey(entity, keys) : '';
    var constraint = keys.length > 1 ? this._sqlConstraint(entity, keys) : (entity.constraint || '');

    var columns = '';
    var fields = this.getFields(entity);
    _.each(fields, function (field) {
      // skip ID, it is defined manually above
      if (!primaryKey || field.name !== keys[0]) {
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
  },

  _sqlDelete: function (options, entity) {
    var sql = 'DELETE FROM \'' + entity.name + '\'';
    var where = this._sqlWhere(options, entity) || this._sqlWhereFromData(options, entity);
    if (where) {
      sql += ' WHERE ' + where;
    }
    sql += options.and ? ' AND ' + options.and : '';
    return sql;
  },

  _sqlWhere: function (options, entity) {
    this._selector = null;
    var sql = '';
    if (_.isString(options.where)) {
      sql = options.where;
    } else if (_.isObject(options.where)) {
      this._selector = Relution.LiveData.SqlSelector.create(options.where, entity);
      sql = this._selector.buildStatement();
    }
    return sql;
  },

  _sqlWhereFromData: function (options, entity) {
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
  },

  _sqlSelect: function (options, entity) {

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
  },

  _sqlValue: function (value, field) {
    var type = field && field.type ? field.type : Relution.LiveData.Field.prototype.detectType(value);
    if (type === Relution.LiveData.DATA.TYPE.INTEGER || type === Relution.LiveData.DATA.TYPE.FLOAT) {
      return value;
    } else if (type === Relution.LiveData.DATA.TYPE.BOOLEAN) {
      return value ? '1' : '0';
    } else if (type === Relution.LiveData.DATA.TYPE.NULL) {
      return 'NULL';
    }
    value = Relution.LiveData.Field.prototype.transform(value, Relution.LiveData.DATA.TYPE.STRING);
    value = value.replace(/"/g, '""');
    return '"' + value + '"';
  },

  _dbAttribute: function (field) {
    if (field && field.name) {
      var type = this.options.sqlTypeMapping[field.type];
      var isReqStr = field.required ? ' NOT NULL' : '';
      if (type) {
        return field.name + ' ' + type.toUpperCase() + isReqStr;
      }
    }
  },

  _dropTable: function (options) {

    var entity = this.getEntity(options);
    entity.db = null;

    if (this._checkDb(options) && entity) {
      var sql = this._sqlDropTable(entity.name);
      // reset flag
      this._executeTransaction(options, [sql]);
    }
  },

  _createTable: function (options) {

    var entity = this.getEntity(options);
    entity.db = this.db;

    if (this._checkDb(options) && this._checkEntity(options, entity)) {
      var sql = this._sqlCreateTable(entity);
      // reset flag
      this._executeTransaction(options, [sql]);
    }
  },

  _checkTable: function (options, callback) {
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
  },

  _insertOrReplace: function (models, options) {

    var entity = this.getEntity(options);

    if (this._checkDb(options) && this._checkEntity(options, entity) && this._checkData(options, models)) {

      var isAutoInc = this._isAutoincrementKey(entity, entity.getKey());
      var statements = [];
      var sqlTemplate = 'INSERT OR REPLACE INTO \'' + entity.name + '\' (';
      for (var i = 0; i < models.length; i++) {
        var model = models[i];
        var statement = ''; // the actual sql insert string with values
        if (!isAutoInc && !model.id && model.idAttribute) {
          model.set(model.idAttribute, new Relution.LiveData.ObjectID().toHexString());
        }
        var value = options.attrs || model.toJSON();
        var args, keys;
        if (!_.isEmpty(entity.fields)) {
          args = _.values(value);
          keys = _.keys(value);
        } else {
          args = [model.id, JSON.stringify(value)];
          keys = ['id', 'data'];
        }
        if (args.length > 0) {
          var values = new Array(args.length).join('?,') + '?';
          var columns = '\'' + keys.join('\',\'') + '\'';
          statement += sqlTemplate + columns + ') VALUES (' + values + ');';
          statements.push({statement: statement, arguments: args});
        }
      }
      this._executeTransaction(options, statements);
    }
  },

  _select: function (model, options) {
    var entity = this.getEntity(options);
    if (this._checkDb(options) && this._checkEntity(options, entity)) {
      var lastStatement;
      var isCollection = !Relution.LiveData.isModel(model);
      var result;
      if (isCollection) {
        result = [];
      } else {
        options.models = [model];
      }
      var stm = this._sqlSelect(options, entity);
      var that = this;
      this.db.readTransaction(function (t) {
        var statement = stm.statement || stm;
        var args = stm.arguments;
        lastStatement = statement;
        Relution.debug('sql statement: ' + statement);
        if (args) {
          Relution.debug('    arguments: ' + JSON.stringify(args));
        }
        t.executeSql(statement, args, function (tx, res) {
          var len = res.rows.length;//, i;
          for (var i = 0; i < len; i++) {
            var item = res.rows.item(i);
            var attrs;
            if (!_.isEmpty(entity.fields) || !that._hasDefaultFields(item)) {
              attrs = item;
            } else {
              try {
                attrs = JSON.parse(item.data);
              } catch (e) {
              }
            }
            if (attrs && (!that._selector || that._selector.matches(attrs))) {
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
          console.error('webSql error: ' + e.message);
        });
      }, function (sqlError) { // errorCallback
        console.error('WebSql Syntax Error: ' + sqlError.message);
        that.handleError(options, sqlError.message, lastStatement);
      }, function () { // voidCallback (success)
        if (result) {
          that.handleSuccess(options, result);
        } else {
          that.handleError(options, 'no result');
        }
      });
    }
  },

  _delete: function (models, options) {
    var entity = this.getEntity(options);
    if (this._checkDb(options) && this._checkEntity(options, entity)) {
      options.models = models;
      var sql = this._sqlDelete(options, entity);
      // reset flag
      this._executeTransaction(options, [sql]);
    }
  },

  _executeSql: function (options) {
    if (options.sql) {
      this._executeTransaction(options, [options.sql]);
    }
  },

  _executeTransaction: function (options, statements) {
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
            Relution.debug('sql statement: ' + statement);
            if (args) {
              Relution.debug('    arguments: ' + JSON.stringify(args));
            }
            t.executeSql(statement, args);
          });
        }, function (sqlError) { // errorCallback
          console.error(sqlError.message);
          that.handleError(options, sqlError.message, lastStatement);
        }, function () {
          that.handleSuccess(options);
        });
      } catch (e) {
        console.error(e.message);
      }
    }
    if (error) {
      this.handleCallback(options.error, error, lastStatement);
    }
  },

  _hasDefaultFields: function (item) {
    return _.every(_.keys(item), function (key) {
      return key === this.idField.name || key === this.dataField.name;
    }, this);
  },

  _checkDb: function (options) {
    // has to be initialized first
    if (!this.db) {
      var error = 'db handler not initialized.';
      console.error(error);
      this.handleError(options, error);
      return false;
    }
    return true;
  },

  getFields: function (entity) {
    if (!_.isEmpty(entity.fields)) {
      return entity.fields;
    } else {
      var fields = {};
      fields.data = this.dataField;
      var idAttribute = entity.idAttribute || 'id';
      fields[idAttribute] = this.idField;
      return fields;
    }
  },

  getField: function (entity, key) {
    return this.getFields(entity)[key];
  }

});
