"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcErrorCode = void 0;
var JsonRpcErrorCode;
(function (JsonRpcErrorCode) {
    JsonRpcErrorCode[JsonRpcErrorCode["PARSE_ERROR"] = -32700] = "PARSE_ERROR";
    JsonRpcErrorCode[JsonRpcErrorCode["INVALID_REQUEST"] = -32600] = "INVALID_REQUEST";
    JsonRpcErrorCode[JsonRpcErrorCode["METHOD_NOT_FOUND"] = -32601] = "METHOD_NOT_FOUND";
    JsonRpcErrorCode[JsonRpcErrorCode["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
    JsonRpcErrorCode[JsonRpcErrorCode["INTERNAL_ERROR"] = -32603] = "INTERNAL_ERROR";
})(JsonRpcErrorCode || (exports.JsonRpcErrorCode = JsonRpcErrorCode = {}));
//# sourceMappingURL=json-rpc.error-codes.js.map