import { Body, Controller, Post } from '@nestjs/common';
import {
  JsonRpcHandler,
  JsonRpcRequest,
  JsonRpcResponse,
} from '../common/json-rpc-handler';

@Controller('rpc/v1')
export class UsersRpcController {
  constructor(public readonly rpcHandler: JsonRpcHandler) {}

  @Post()
  async handleRpc(@Body() request: JsonRpcRequest): Promise<JsonRpcResponse> {
    return this.rpcHandler.handle(request);
  }
}
