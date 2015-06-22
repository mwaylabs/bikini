/**
 * JsonPath.ts
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

module query {

  /**
   * external evaluation function of JSONPath library.
   *
   * @param obj to evaluate expression on.
   * @param expr to evaluate on object.
   * @param arg options object.
   * @return{any} result of evaluating expression on object.
   *
   * @see https://libraries.io/bower/JSONPath
   */
  declare function jsonPath(obj:any, expr:string, arg?:{}):any;

  /**
   * compiled JSON path expression.
   *
   * @see http://goessner.net/articles/JsonPath/
   */
  export class JsonPath {
    /**
     * normalized JSON path expression.
     */
    private expression:string;

    /**
     * constructs a compiled expression.
     *
     * @param expression to compile.
     */
    constructor(expression:string) {
      this.expression = jsonPath({}, expression, {
        resultType: 'PATH'
      }) || expression;
    }

    /**
     * evaluates the expression on a target object.
     *
     * @param obj to evaluate expression on.
     * @param arg options object.
     * @return{any} result of evaluating expression on object.
     */
    evaluate(obj:any, arg?:{}):any {
      return jsonPath(obj, this.expression, arg);
    }
  }

}
