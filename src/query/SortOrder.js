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
var query;
(function (query) {
    var SortOrder = (function () {
        function SortOrder(sortFields) {
            this.sortFields = new Array(sortFields.length);
            for (var i = sortFields.length - 1; i >= 0; --i) {
                this.sortFields[i] = new SortField(sortFields[i]);
            }
        }
        return SortOrder;
    })();
    query.SortOrder = SortOrder;
    var SortField = (function () {
        function SortField(sortField) {
            var order = sortField.length > 0 && sortField.charAt(0);
            this.name = order === '+' || order === '-' ? sortField.substring(1) : sortField;
            this.ascending = order !== '-';
        }
        return SortField;
    })();
    query.SortField = SortField;
})(query || (query = {}));
//# sourceMappingURL=SortOrder.js.map