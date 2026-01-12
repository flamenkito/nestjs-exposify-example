import { Module } from '@nestjs/common';
import { JsonRpcController } from './json-rpc.controller';
import { JsonRpcHandler } from './json-rpc.handler';

@Module({
  controllers: [JsonRpcController],
  providers: [JsonRpcHandler],
  exports: [JsonRpcHandler],
})
export class JsonRpcModule {}
