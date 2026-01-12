"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcHandler = exports.JsonRpcResponse = exports.JsonRpcRequest = void 0;
const common_1 = require("@nestjs/common");
const json_rpc_error_codes_1 = require("./json-rpc.error-codes");
const validate_dto_1 = require("./validate-dto");
class JsonRpcRequest {
}
exports.JsonRpcRequest = JsonRpcRequest;
class JsonRpcResponse {
}
exports.JsonRpcResponse = JsonRpcResponse;
let JsonRpcHandler = class JsonRpcHandler {
    constructor() {
        this.methods = {};
    }
    register(name, paramsDto, handler) {
        this.methods[name] = { paramsDto, handler };
        return this;
    }
    async handle(request) {
        try {
            const method = this.methods[request.method];
            if (!method) {
                return {
                    jsonrpc: '2.0',
                    error: {
                        code: json_rpc_error_codes_1.JsonRpcErrorCode.METHOD_NOT_FOUND,
                        message: `Method ${request.method} not found`,
                    },
                    id: request.id,
                };
            }
            const params = method.paramsDto
                ? await (0, validate_dto_1.validateDto)(method.paramsDto, request.params)
                : request.params;
            const result = await method.handler(params);
            return {
                jsonrpc: '2.0',
                result,
                id: request.id,
            };
        }
        catch (error) {
            if (error instanceof validate_dto_1.DtoValidationError) {
                return {
                    jsonrpc: '2.0',
                    error: {
                        code: json_rpc_error_codes_1.JsonRpcErrorCode.INVALID_PARAMS,
                        message: error.message,
                    },
                    id: request.id,
                };
            }
            return {
                jsonrpc: '2.0',
                error: {
                    code: json_rpc_error_codes_1.JsonRpcErrorCode.INTERNAL_ERROR,
                    message: error instanceof Error ? error.message : 'Internal error',
                },
                id: request.id,
            };
        }
    }
};
exports.JsonRpcHandler = JsonRpcHandler;
exports.JsonRpcHandler = JsonRpcHandler = __decorate([
    (0, common_1.Injectable)()
], JsonRpcHandler);
//# sourceMappingURL=json-rpc.handler.js.map