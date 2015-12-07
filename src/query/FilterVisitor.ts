/**
 * FilterVisitor.ts
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
/// <reference path="Filter.ts" />

module Relution.LiveData {

  export interface FilterVisitorCore<T> {
    andOp(filter:LogOpFilter):T;
    orOp(filter:LogOpFilter):T;
    nandOp(filter:LogOpFilter):T;
    norOp(filter:LogOpFilter):T;

    boolean(filter:BooleanFilter):T;
    containsString(filter:ContainsStringFilter):T;
    dateRange(filter:DateRangeFilter):T;
    doubleRange(filter:DoubleRangeFilter):T;
    like(filter:LikeFilter):T;
    logOp(filter:LogOpFilter):T;
    longEnum(filter:LongEnumFilter):T;
    longRange(filter:LongRangeFilter):T;
    stringEnum(filter:StringEnumFilter):T;
    string(filter:StringFilter):T;
    stringMap(filter:StringMapFilter):T;
    stringRange(filter:StringRangeFilter):T;
    null(filter:NullFilter):T;
  }

  export class FilterVisitorBase<T> {
    public visit(filter:Filter):T {
      return this[filter.type].apply(this, arguments);
    }

    logOp(filter:LogOpFilter):T {
      return this[filter.operation.toLowerCase() + 'Op'].apply(this, arguments);
    }
  }

}
