import { Module } from '@nestjs/common';
import { JsonRpcHandler } from './json-rpc-handler';
import { RpcController } from './rpc.controller';

@Module({
  controllers: [RpcController],
  providers: [JsonRpcHandler],
  exports: [JsonRpcHandler],
})
export class RpcModule {}
