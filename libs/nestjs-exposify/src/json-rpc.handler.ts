import { Injectable } from '@nestjs/common';
import { JsonRpcErrorCode } from './json-rpc.error-codes';
import {
  ClassConstructor,
  DtoValidationError,
  validateDto,
} from './validate-dto';

interface RpcMethodDefinition {
  paramsDto?: ClassConstructor<object>;
  handler: (params: unknown) => Promise<unknown>;
}

export class JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
  id: string | number;
}

export class JsonRpcResponse {
  jsonrpc: '2.0';
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
  id: string | number | null;
}

/**
 * Type-safe JSON-RPC handler that validates params against registered DTOs.
 * When a DTO is provided, params are validated and transformed before being passed to the handler.
 */
@Injectable()
export class JsonRpcHandler {
  private methods: Record<string, RpcMethodDefinition> = {};

  /**
   * Register an RPC method with its parameter DTO and handler.
   * The handler will receive validated and transformed params matching the DTO type.
   */
  register<TParams extends object, TResult>(
    name: string,
    paramsDto: ClassConstructor<TParams>,
    handler: (params: TParams) => Promise<TResult>,
  ): this;
  /**
   * Register an RPC method without parameter validation.
   */
  register<TResult>(
    name: string,
    paramsDto: undefined,
    handler: (params: Record<string, unknown> | undefined) => Promise<TResult>,
  ): this;
  register<TParams extends object | Record<string, unknown> | undefined>(
    name: string,
    paramsDto: ClassConstructor<object> | undefined,
    handler: (params: TParams) => Promise<unknown>,
  ): this {
    this.methods[name] = { paramsDto, handler };
    return this;
  }

  async handle(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    try {
      const method = this.methods[request.method];

      if (!method) {
        return {
          jsonrpc: '2.0',
          error: {
            code: JsonRpcErrorCode.METHOD_NOT_FOUND,
            message: `Method ${request.method} not found`,
          },
          id: request.id,
        };
      }

      const params = method.paramsDto
        ? await validateDto(method.paramsDto, request.params)
        : request.params;

      const result = await method.handler(params);

      return {
        jsonrpc: '2.0',
        result,
        id: request.id,
      };
    } catch (error) {
      if (error instanceof DtoValidationError) {
        return {
          jsonrpc: '2.0',
          error: {
            code: JsonRpcErrorCode.INVALID_PARAMS,
            message: error.message,
          },
          id: request.id,
        };
      }

      return {
        jsonrpc: '2.0',
        error: {
          code: JsonRpcErrorCode.INTERNAL_ERROR,
          message: error instanceof Error ? error.message : 'Internal error',
        },
        id: request.id,
      };
    }
  }
}
