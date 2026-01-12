import { Module } from '@nestjs/common';
import { UsersRpcController } from './users-rpc.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, UsersRpcController],
  providers: [UsersService],
})
export class UsersModule {}
