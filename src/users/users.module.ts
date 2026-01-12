import { Module } from '@nestjs/common';
import { JsonRpcHandler } from '../common/json-rpc-handler';
import { UsersRpcController } from './users-rpc.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersRpcController],
  providers: [UsersService, JsonRpcHandler],
})
export class UsersModule {}
