/**
 * Filter.ts
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

module Relution.LiveData {

  export interface Filter {
    /**
     * kind of Filter as defined by corresponding Java object model.
     *
     * <p>
     *  - boolean
     *  - containsString
     *  - dateRange
     *  - doubleRange
     *  - like
     *  - logOp
     *  - longEnum
     *  - longRange
     *  - stringEnum
     *  - string
     *  - stringMap
     *  - stringRange
     *  - null
     *  - ...
     * </p>
     */
      type:string;
  }

  export interface LogOpFilter extends Filter {
    /**
     * kind of Operation as defined by corresponding Java object model.
     *
     * <p>
     *  - and
     *  - or
     *  - nand
     *  - nor
     * </p>
     */
    operation:string;

    /**
     * filters evaluated with logical operation (filter1 LOGOP filter2 LOGOP filter3...).
     */
    filters:Filter[];
  }

  export interface FieldFilter extends Filter {
    /**
     * field expression identifying left hand side of the filter.
     */
    fieldName:string;
  }

  interface ValueFilter<T> extends FieldFilter {
    value:T;
  }

  export interface RangeFilter<T> extends FieldFilter {
    min?:T;
    max?:T;
  }

  export interface EnumFilter<T> extends FieldFilter {
    values:T[];
  }

  export interface BooleanFilter extends ValueFilter<boolean> {
  }

  export interface ContainsStringFilter extends FieldFilter {
    contains:string;
  }

  export interface DateRangeFilter extends RangeFilter<Date> {
  }

  interface NumberRangeFilter extends RangeFilter<number> {
  }

  export interface DoubleRangeFilter extends NumberRangeFilter {
  }

  export interface LongRangeFilter extends NumberRangeFilter {
  }

  export interface LikeFilter extends FieldFilter {
    like:string;
  }

  export interface LongEnumFilter extends EnumFilter<number> {
  }

  export interface StringEnumFilter extends EnumFilter<string> {
  }

  export interface StringFilter extends ValueFilter<string> {
  }

  export interface StringMapFilter extends FieldFilter {
    key?:string;
    value?:string;
  }

  export interface StringRangeFilter extends RangeFilter<string> {
  }

  export interface NullFilter extends FieldFilter {
    isNull:boolean;
  }

}
