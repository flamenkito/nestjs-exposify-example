import { ClassConstructor } from './validate-dto';
export declare class JsonRpcRequest {
    jsonrpc: '2.0';
    method: string;
    params?: Record<string, unknown>;
    id: string | number;
}
export declare class JsonRpcResponse {
    jsonrpc: '2.0';
    result?: unknown;
    error?: {
        code: number;
        message: string;
    };
    id: string | number | null;
}
export declare class JsonRpcHandler {
    private methods;
    register<TParams extends object, TResult>(name: string, paramsDto: ClassConstructor<TParams>, handler: (params: TParams) => Promise<TResult>): this;
    register<TResult>(name: string, paramsDto: undefined, handler: (params: Record<string, unknown> | undefined) => Promise<TResult>): this;
    handle(request: JsonRpcRequest): Promise<JsonRpcResponse>;
}
