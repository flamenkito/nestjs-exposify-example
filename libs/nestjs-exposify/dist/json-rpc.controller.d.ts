import { JsonRpcHandler, JsonRpcRequest, JsonRpcResponse } from './json-rpc.handler';
export declare class JsonRpcController {
    private readonly rpcHandler;
    constructor(rpcHandler: JsonRpcHandler);
    handleRpc(request: JsonRpcRequest): Promise<JsonRpcResponse>;
}
