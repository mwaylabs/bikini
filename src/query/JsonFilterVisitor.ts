/**
 * JsonFilterVisitor.ts
 *
 * Created by Thomas Beckmann on 22.06.2015
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
/* jshint eqeqeq: false */
/* jshint newcap: false */
/* jshint -W004: '%' is already defined. */
/* jshint -W018: Confusing use of '!' */
/// <reference path="FilterVisitor.ts" />
/// <reference path="JsonPath.ts" />

declare var _;

module Relution.LiveData {

  /**
   * compiled test function.
   */
  export interface JsonFilterFn<T> {
    /**
     * tests an object against a Filter tree.
     *
     * @param arg object to test.
     * @return {boolean} whether the given object passes the Filter tree.
     */
    (arg:T):boolean;
  }

  /**
   * compiles a JsonFilterFn from a given Filter tree.
   *
   * @param filter tree being compiled.
   * @return {function} a JsonFilterFn function.
   */
  export function jsonFilter<T>(filter:Filter):JsonFilterFn<T> {
    return new JsonFilterVisitor<T>().visit(filter);
  }

  /**
   * compiles a Filter tree into a JsonFilterFn.
   */
  class JsonFilterVisitor<T> extends FilterVisitorBase<JsonFilterFn<T>> implements FilterVisitorCore<JsonFilterFn<T>> {

    containsString(filter:ContainsStringFilter):JsonFilterFn<T> {
      var expression = new JsonPath(filter.fieldName);
      var contains = filter.contains;
      if (contains === undefined || contains === null) {
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return value === undefined || value === null;
        };
      }

      return (obj:T) => {
        var value = expression.evaluate(obj);
        if (value === undefined || value === null) {
          // null/undefined case
          return false;
        } else if (_.isArray(value)) {
          // array case
          for (var i = 0; i < value.length; ++i) {
            var val = value[i];
            if (val !== undefined && val !== null && val.toString().indexOf(contains) >= 0) {
              return true;
            }
          }
          return false;
        } else {
          // simple case
          return value !== undefined && value !== null && value.toString().indexOf(contains) >= 0;
        }
      };
    }

    string(filter:StringFilter):JsonFilterFn<T> {
      var expression = new JsonPath(filter.fieldName);
      var expected = filter.value;
      if (expected === undefined || expected === null) {
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return value === undefined || value === null;
        };
      }

      return (obj:T) => {
        var value = expression.evaluate(obj);
        if (value === undefined || value === null) {
          // null/undefined case
          return false;
        } else if (_.isArray(value)) {
          // array case
          for (var i = 0; i < value.length; ++i) {
            var val = value[i];
            if (val == filter.value) {
              return true;
            }
          }
          return false;
        } else {
          // simple case
          return value == filter.value;
        }
      };
    }

    range<V>(filter:RangeFilter<V>):JsonFilterFn<T> {
      var expression = new JsonPath(filter.fieldName);
      var min:V = filter.min;
      var max:V = filter.max;
      if (min === undefined || min === null) {
        if (max === undefined || max === null) {
          return (obj:T) => {
            var value = expression.evaluate(obj);
            return !!value;
          };
        } else {
          return (obj:T) => {
            var value = expression.evaluate(obj);
            return !!value && value <= max;
          };
        }
      } else if (min === max) {
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return !!value && value == min;
        };
      } else {
        if (max === undefined || max === null) {
          return (obj:T) => {
            var value = expression.evaluate(obj);
            return !!value && value >= min;
          };
        } else {
          return (obj:T) => {
            var value = expression.evaluate(obj);
            return !!value && value <= max && value >= min;
          };
        }
      }
    }

    longRange(filter:LongRangeFilter):JsonFilterFn<T> {
      return this.range(filter);
    }

    dateRange(filter:DateRangeFilter):JsonFilterFn<T> {
      return this.range(filter);
    }

    stringRange(filter:StringRangeFilter):JsonFilterFn<T> {
      return this.range(filter);
    }

    doubleRange(filter:DoubleRangeFilter):JsonFilterFn<T> {
      return this.range(filter);
    }

    boolean(filter:BooleanFilter):JsonFilterFn<T> {
      var expression = new JsonPath(filter.fieldName);
      var expected = filter.value;
      return (obj:T) => {
        var value = expression.evaluate(obj);
        return !!value === expected;
      };
    }

    enum<V>(filter:EnumFilter<V>):JsonFilterFn<T> {
      var expression = new JsonPath(filter.fieldName);
      var values:V[] = filter.values;
      if (!values) {
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return !value;
        };
      } else {
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return values.indexOf(value) >= 0;
        };
      }
    }

    stringEnum(filter:StringEnumFilter):JsonFilterFn<T> {
      return this.enum(filter);
    }

    longEnum(filter:LongEnumFilter):JsonFilterFn<T> {
      return this.enum(filter);
    }

    stringMap(filter:StringMapFilter):JsonFilterFn<T> {
      var expression = new JsonPath(filter.fieldName);
      var property = filter.key !== undefined && filter.key !== null && new JsonPath(filter.key);
      var expected = filter.value;
      if (!property && (expected === undefined || expected === null)) {
        // no key and no value --> at least one entry in dictionary
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return value && _.keys(value).length > 0;
        }
      } else if (!property) {
        // no key but some value
        return (obj:T) => {
          var value = expression.evaluate(obj);
          if (value) {
            for (var key in value) {
              var val = value[key];
              if (val == expected) {
                return true;
              }
            }
          }
          return false;
        }
      } else if (expected === undefined || expected === null) {
        // key but no value --> any value will do
        return (obj:T) => {
          var value = expression.evaluate(obj);
          var val = property.evaluate(value);
          return val !== undefined && val !== null;
        }
      } else {
        // key and value --> must have exact entry
        return (obj:T) => {
          var value = expression.evaluate(obj);
          var val = property.evaluate(value);
          return val == expected;
        }
      }
    }

    like(filter:LikeFilter):JsonFilterFn<T> {
      var expression = new JsonPath(filter.fieldName);
      var like = filter.like;
      if (like === undefined || like === null) {
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return value === undefined || value === null;
        };
      }

      var regexp = like.replace(/%/g, '.*');
      var pattern = new RegExp(regexp);
      return (obj:T) => {
        var value = expression.evaluate(obj);
        if (value === undefined || value === null) {
          // null/undefined case
          return false;
        } else if (_.isArray(value)) {
          // array case
          for (var i = 0; i < value.length; ++i) {
            var val = value[i];
            if (pattern.test(val)) {
              return true;
            }
          }
          return false;
        } else {
          // simple case
          return pattern.test(value);
        }
      };
    }

    null(filter:NullFilter):JsonFilterFn<T> {
      var expression = new JsonPath(filter.fieldName);
      if (filter.isNull) {
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return value === undefined || value === null;
        };
      } else {
        return (obj:T) => {
          var value = expression.evaluate(obj);
          return value !== undefined && value !== null;
        };
      }
    }

    filters(filter:LogOpFilter):JsonFilterFn<T>[] {
      // build filter functions
      var filters:JsonFilterFn<T>[] = new Array<JsonFilterFn<T>>(filter.filters.length);
      for (var i = 0; i < filters.length; ++i) {
        filters[i] = this.visit(filter.filters[i]);
      }
      return filters;
    }

    andOp(filter:LogOpFilter):JsonFilterFn<T> {
      var filters = this.filters(filter);
      return (obj:T) => {
        for (var i = 0; i < filters.length; ++i) {
          var filter = filters[i];
          if (!filter(obj)) {
            return false;
          }
        }
        return true;
      }
    }

    orOp(filter:LogOpFilter):JsonFilterFn<T> {
      var filters = this.filters(filter);
      return (obj:T) => {
        for (var i = 0; i < filters.length; ++i) {
          var filter = filters[i];
          if (filter(obj)) {
            return true;
          }
        }
        return false;
      }
    }

    nandOp(filter:LogOpFilter):JsonFilterFn<T> {
      var filters = this.filters(filter);
      return (obj:T) => {
        for (var i = 0; i < filters.length; ++i) {
          var filter = filters[i];
          if (!filter(obj)) {
            return true;
          }
        }
        return false;
      }
    }

    norOp(filter:LogOpFilter):JsonFilterFn<T> {
      var filters = this.filters(filter);
      return (obj:T) => {
        for (var i = 0; i < filters.length; ++i) {
          var filter = filters[i];
          if (filter(obj)) {
            return false;
          }
        }
        return true;
      }
    }
  }

}
