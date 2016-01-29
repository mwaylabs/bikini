/**
 * LovefieldModelContainer.ts
 *
 * Created by Thomas Beckmann on 26.01.2016
 * Copyright (c)
 * 2016
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
/// <reference path="../core/livedata.d.ts"/>
/// <reference path="./ModelContainer.ts"/>

module Relution.LiveData {

  export class LovefieldModelContainer extends ModelContainer {
    public static factory: LovefieldModelFactory;

    public fromJSON(json: ModelContainer) {
      super.fromJSON(json);

      for (var i = this.models.length; i-- > 0;) {
        var model: LovefieldMetaModel = this.models[i];
        model.modelContainer = this;
      }

      return this;
    }

    public createSchema(schemaBuilder : lf.schema.Builder) {
      // first pass: tables
      for (var i = this.models.length; i-- > 0;) {
        var model: LovefieldMetaModel = this.models[i];
        model.createTables(schemaBuilder );
      }

      // second pass: constraints
      for (var i = this.models.length; i-- > 0;) {
        var model: LovefieldMetaModel = this.models[i];
        model.createConstraints(schemaBuilder );
      }
    }
  }

  export class LovefieldMetaModel extends MetaModel {
    public static factory: LovefieldModelFactory;

    modelContainer: LovefieldModelContainer;

    tableName: string;
    tableBuilder: lf.schema.TableBuilder;
    primaryKey: LovefieldFieldDefinition; // unset for auto-incremented integer.
    foreignKeys: LovefieldFieldDefinition[]; // unset when there are no ingoing keys

    get primaryKeyColumnName(): string {
      return this.primaryKey ? this.primaryKey.columnName : '_id';
    }
    get primaryKeyColumnType(): lf.Type {
      return this.primaryKey ? this.primaryKey.columnType : lf.Type.INTEGER;
    }

    public fromJSON(json: MetaModel) {
      super.fromJSON(json);

      for (var i = this.fieldDefinitions.length; i-- > 0;) {
        var fieldDefinition: LovefieldFieldDefinition = this.fieldDefinitions[i];
        fieldDefinition.model = this;
      }

      return this;
    }

    public createTables(schemaBuilder : lf.schema.Builder) {
      if (this.tableName) {
        this.tableBuilder = schemaBuilder .createTable(this.tableName);

        this.tableBuilder.addColumn(this.primaryKeyColumnName, this.primaryKeyColumnType);
        this.tableBuilder.addPrimaryKey([ this.primaryKeyColumnName ], !this.primaryKey);

        for (var i = this.fieldDefinitions.length; i-- > 0;) {
          var fieldDefinition:LovefieldFieldDefinition = this.fieldDefinitions[i];
          if (fieldDefinition !== this.primaryKey) {
            fieldDefinition.createTables(schemaBuilder);
          }
        }
      }
    }

    public createConstraints(schemaBuilder : lf.schema.Builder) {
      if (this.tableBuilder) {

        for (var i = this.fieldDefinitions.length; i-- > 0;) {
          var fieldDefinition:LovefieldFieldDefinition = this.fieldDefinitions[i];
          if (fieldDefinition !== this.primaryKey) {
            fieldDefinition.createConstraints(schemaBuilder);
          }
        }
      }
    }
  }

  export class LovefieldFieldDefinition extends FieldDefinition {
    public static factory: LovefieldModelFactory;

    public static columnTypeMapping = {
      'java.lang.Boolean': lf.Type.BOOLEAN,
      'java.lang.Double': lf.Type.NUMBER,
      'java.lang.Float': lf.Type.NUMBER,
      'java.lang.Integer': lf.Type.INTEGER,
      'java.lang.String': lf.Type.STRING,
      'java.lang.Object': lf.Type.OBJECT,
      'java.math.BigDecimal': lf.Type.NUMBER,
      'java.math.BigInteger': lf.Type.NUMBER,
      'java.util.Date': lf.Type.DATE_TIME
    };

    model: LovefieldMetaModel;

    referencedModel: LovefieldMetaModel;
    joinTableName: string; // set for array data
    joinTableBuilder: lf.schema.TableBuilder;
    columnName: string;
    columnType: lf.Type;

    public createTables(schemaBuilder : lf.schema.Builder) {
      if (this.joinTableName) {
        this.joinTableBuilder = schemaBuilder .createTable(this.joinTableName);

        // reference to owning model
        var primaryColumnName = this.model.primaryKeyColumnName;
        this.joinTableBuilder.addColumn(primaryColumnName, this.model.primaryKeyColumnType);

        if (this.dataType === 'java.util.Map') {
          // Map special case
          this.joinTableBuilder.addColumn('_key', lf.Type.STRING);
          this.joinTableBuilder.addPrimaryKey([primaryColumnName, '_key']);
        } else {
          // position in array
          this.joinTableBuilder.addColumn('_idx', lf.Type.INTEGER);
          this.joinTableBuilder.addPrimaryKey([primaryColumnName, '_idx']);
        }

        // values of array
        this.joinTableBuilder.addColumn(this.columnName, this.columnType);
      } else {
        // single value
        this.model.tableBuilder.addColumn(this.columnName, this.columnType);
      }
    }

    public createConstraints(schemaBuilder : lf.schema.Builder) {
      if (this.joinTableBuilder) {
        // reference to owning model
        /* "543": "Foreign key {0}. A primary key column can't also be a foreign key child column"
        var primaryColumnName = this.model.primaryKeyColumnName;
        this.joinTableBuilder.addForeignKey('fk_' + primaryColumnName, {
          local: primaryColumnName,
          ref: this.model.tableName + '.' + primaryColumnName,
          action: lf.ConstraintAction.CASCADE,
          timing: lf.ConstraintTiming.IMMEDIATE
        });
        */

        // values of array
        if (this.referencedModel) {
          this.joinTableBuilder.addForeignKey('fk_' + this.columnName, {
            local: this.columnName,
            ref: this.referencedModel.tableName + '.' + this.referencedModel.primaryKeyColumnName,
            action: lf.ConstraintAction.CASCADE,
            timing: lf.ConstraintTiming.IMMEDIATE
          });
        }
      } else {
        // single value
        if (this.referencedModel) {
          this.model.tableBuilder.addForeignKey('fk_' + this.columnName, {
            local: this.columnName,
            ref: this.referencedModel.tableName + '.' + this.referencedModel.primaryKeyColumnName,
            action: lf.ConstraintAction.CASCADE,
            timing: lf.ConstraintTiming.IMMEDIATE
          });
        } else if (!this.mandatory) {
          this.model.tableBuilder.addNullable([ this.columnName ]);
        }
      }
    }
  }

  export class LovefieldEnumDefinition extends EnumDefinition {
    public static factory: LovefieldModelFactory;
  }

  export class LovefieldModelFactory extends ModelFactory {
    public static instance = new LovefieldModelFactory(LovefieldModelContainer, LovefieldMetaModel, LovefieldFieldDefinition, LovefieldEnumDefinition);

    public fromJSON(json:any): LovefieldModelContainer {
      var modelContainer = <LovefieldModelContainer>(super.fromJSON(json));

      // first pass: referencing and build-in types
      for (var i = modelContainer.models.length; i-- > 0;) {
        var model: LovefieldMetaModel = modelContainer.models[i];
        model.tableName = model.name;

        for (var j = model.fieldDefinitions.length; j-- > 0;) {
          var fieldDefinition: LovefieldFieldDefinition = model.fieldDefinitions[j];
          if (fieldDefinition.keyField) {
            if (model.primaryKey) {
              throw new Error('multiple primary keys are not supported');
            }
            model.primaryKey = fieldDefinition;
          }

          fieldDefinition.columnName = fieldDefinition.name;
          var dataType = fieldDefinition.dataTypeNormalized;
          var dataArray: boolean;
          if (dataType.substring(dataType.length - 2) === '[]') {
            dataArray = true;
            dataType = dataType.substring(0, dataType.length - 2);
            fieldDefinition.joinTableName = model.tableName + '_' + fieldDefinition.name;
          }

          fieldDefinition.referencedModel = modelContainer.models[dataType];
          if (fieldDefinition.referencedModel) {
            // composite
            if (!fieldDefinition.referencedModel.foreignKeys) {
              fieldDefinition.referencedModel.foreignKeys = [];
            }
            fieldDefinition.referencedModel.foreignKeys.push(fieldDefinition);
          } else if (dataType === 'java.util.Map') {
            // Map special case
            fieldDefinition.columnType = lf.Type.STRING;
            fieldDefinition.joinTableName = model.tableName + '_' + fieldDefinition.name;
          } else {
            // build-in
            fieldDefinition.columnType = LovefieldFieldDefinition.columnTypeMapping[dataType];
            if (fieldDefinition.columnType === undefined) {
              throw new Error('no mapping for type: ' + dataType);
            }
          }
        }
      }

      // second pass: key distribution
      for (var i = modelContainer.models.length; i-- > 0;) {
        var model: LovefieldMetaModel = modelContainer.models[i];
        if (!model.primaryKey && !model.foreignKeys) {
          // unused model
          model.tableName = null;
          continue;
        }

        for (var j = model.fieldDefinitions.length; --j > 0;) {
          var fieldDefinition: LovefieldFieldDefinition = model.fieldDefinitions[j];
          if (fieldDefinition.referencedModel) {
            if (!fieldDefinition.referencedModel.primaryKey) {
              // reference to model not having a primary key
              fieldDefinition.columnType = lf.Type.INTEGER;
            } else {
              // foreign key reference
              fieldDefinition.columnType = fieldDefinition.referencedModel.primaryKey.columnType;
            }
          }
        }
      }

      return modelContainer;
    }
  }

}
