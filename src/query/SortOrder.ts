/**
 * SortOrder.ts
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
/// <reference path="../core/livedata.d.ts"/>

module Relution.LiveData {

  /**
   * defines a sort order of fields.
   *
   * Caution, member fields eventually are shared by multiple instances! You may mutate member fields, but not the
   * objects and arrays referenced by them.
   */
  export class SortOrder {
    /**
     * ordered list of fields to sort on.
     */
    sortFields:SortField[];

    /**
     * default/copy constructor.
     *
     * @param other instance to optionally initialize an independent copy of.
     */
    public constructor(other?:SortOrder) {
      this.sortFields = other && other.sortFields;
    }

    /**
     * parses a JSON literal such as ['-rating', '+date', 'id'] into this instance.
     *
     * @param json data, such as ['-rating', '+date'].
     * @return {Relution.LiveData.SortOrder} this instance.
     */
    public fromJSON(json:string[]):SortOrder {
      this.sortFields = new Array<SortField>(json.length);
      for (var i = json.length - 1; i >= 0; --i) {
        this.sortFields[i] = new SortField().fromJSON(json[i]);
      }
      return this;
    }

    /**
     * formats a string such as '+name,-id'.
     *
     * @return {string} representation of SortOrder, may be the empty string when this is empty.
       */
    public toString(): string {
      var str = '';
      var length = this.sortFields.length;
      for (var i = 0; i < length; ++i) {
        if (i > 0) {
          str += ',';
        }
        str += this.sortFields[i].toString();
      }
      return str;
    }

    /**
     * combines an other instance such that this order is maintained by priority and equivalent elements are ordered by
     * the other order.
     *
     * You may want to optimize after merging several instances.
     *
     * @param other order to merge into this as secondary.
     */
    public merge(other:SortOrder) {
      this.sortFields = this.sortFields.concat(other.sortFields);
    }

    /**
     * eliminates redundant sort fields that do not affect overall order.
     */
    public optimize() {
      this.sortFields = _.unique(this.sortFields, false, (sortField:SortField) => {
        return sortField.name;
      });
    }
  }

  export class SortField {
    /**
     * name/path of field to sort by.
     */
    name:string;
    /**
     * whether to sort ascending (true) or descending (false).
     */
    ascending:boolean;

    /**
     * default/copy constructor.
     *
     * @param other instance to optionally initialize an independent copy of.
     */
    public constructor(other?:SortField) {
      if (other) {
        this.name = other.name;
        this.ascending = other.ascending;
      }
    }

    /**
     * parses a JSON literal such as '-rating' into this instance.
     *
     * @param json data, such as '-rating'.
     * @return {Relution.LiveData.SortOrder} this instance.
     */
    public fromJSON(json:string):SortField {
      var order = json.length > 0 && json.charAt(0);
      this.name = order === '+' || order === '-' ? json.substring(1) : json;
      this.ascending = order !== '-';

      return this;
    }

    /**
     * formats a JSON literal such as 'name'.
     *
     * @return {string} JSON literal such as 'name'.
     */
    public toJSON():string {
      return this.ascending ? this.name : '-' + this.name;
    }

    /**
     * formats a string such as '+name'.
     *
     * @return {string} such as '+name'.
     */
    public toString():string {
      return this.ascending ? '+' + this.name : '-' + this.name;
    }
  }

}
