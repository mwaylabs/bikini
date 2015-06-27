/**
 * SortOrderComparator.ts
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
/// <reference path="SortOrder.ts" />
/// <reference path="JsonPath.ts" />

declare var _;

module Relution.LiveData {

  /**
   * compiled compare function.
   */
  export interface JsonCompareFn<T> {
    /**
     * compares objects in a way compatible to Array.sort().
     *
     * @param o1 left operand.
     * @param o2 right operand.
     * @return {number} indicating relative ordering of operands.
     */
    (o1:T, o2:T):number;
  }

  /**
   * compiles a JsonCompareFn from a given SortOrder.
   *
   * @param json of SortOrder being compiled.
   * @return {function} a JsonCompareFn function compatible to Array.sort().
   */
  export function jsonCompare<T>(...json:string[]):JsonCompareFn<T>;
  /**
   * compiles a JsonCompareFn from a given SortOrder.
   *
   * @param json of SortOrder being compiled.
   * @return {function} a JsonCompareFn function compatible to Array.sort().
   */
  export function jsonCompare<T>(json:string[]):JsonCompareFn<T>;
  /**
   * compiles a JsonCompareFn from a given SortOrder.
   *
   * @param sortOrder being compiled.
   * @return {function} a JsonCompareFn function compatible to Array.sort().
   */
  export function jsonCompare<T>(sortOrder:SortOrder):JsonCompareFn<T>;
  /**
   * compiles a JsonCompareFn from a given SortOrder.
   *
   * @param arg defining the SortOrder being compiled.
   * @return {function} a JsonCompareFn function compatible to Array.sort().
   */
  export function jsonCompare<T>(arg):JsonCompareFn<T> {
    var sortOrder;
    if(typeof arg === 'string') {
      sortOrder = new SortOrder();
      sortOrder.fromJSON.apply(sortOrder, arguments);
    } else if(_.isArray(arg)) {
      sortOrder = new SortOrder();
      sortOrder.fromJSON.call(sortOrder, arg);
    } else {
      sortOrder = arg;
    }

    var comparator = new SortOrderComparator<T>(sortOrder);
    return _.bind(comparator.compare, comparator);
  }

  /**
   * compiled SortOrder for comparison of objects.
   *
   * @see SortOrder
   */
  class SortOrderComparator<T> {
    /**
     * compiled accessor paths of SortField data.
     */
    private expressions:JsonPath[];

    /**
     * constructs a compiled SortOrder for object comparison.
     *
     * @param sortOrder to realize.
     */
    public constructor(private sortOrder:SortOrder) {
      this.expressions = new Array<JsonPath>(sortOrder.sortFields.length);
      for (var i = 0; i < this.expressions.length; ++i) {
        this.expressions[i] = new JsonPath(sortOrder.sortFields[i].name);
      }
    }

    /**
     * compares objects in a way compatible to Array.sort().
     *
     * @param o1 left operand.
     * @param o2 right operand.
     * @return {number} indicating relative ordering of operands.
     */
    public compare(o1:T, o2:T):number {
      for (var i = 0; i < this.sortOrder.sortFields.length; ++i) {
        var expression = this.expressions[i];
        var val1 = expression.evaluate(o1);
        var val2 = expression.evaluate(o2);
        var cmp = SortOrderComparator.compare1(val1, val2);
        if (cmp !== 0) {
          return this.sortOrder.sortFields[i].ascending ? +cmp : -cmp;
        }
      }
      return 0;
    }

    /**
     * compares values in a way compatible to Array.sort().
     *
     * @param o1 left operand.
     * @param o2 right operand.
     * @return {number} indicating relative ordering of operands.
     */
    private static compare1(val1:any, val2:any):number {
      if (!val1 || !val2) {
        // null/undefined case
        if (val2) {
          return -1;
        }
        if (val1) {
          return +1;
        }
      } else if (Array.isArray(val1) || Array.isArray(val2)) {
        // array case
        var items1 = Array.isArray(val1) ? val1 : [val1];
        var items2 = Array.isArray(val2) ? val2 : [val2];
        var length = Math.max(items1.length, items2.length);
        for (var i = 0; i < length; ++i) {
          var c = this.compare1(items1[i], items2[i]);
          if (c !== 0) {
            return c;
          }
        }
      } else {
        // value case
        if (val1 < val2) {
          return -1;
        }
        if (val1 > val2) {
          return +1;
        }
      }
      return 0;
    }
  }

}
