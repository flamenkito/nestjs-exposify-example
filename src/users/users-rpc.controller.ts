import { Body, Controller, OnModuleInit, Post } from '@nestjs/common';
import { IsString } from 'class-validator';
import {
  JsonRpcHandler,
  JsonRpcRequest,
  JsonRpcResponse,
} from '../common/json-rpc-handler';
import { CreateUserDto } from './interfaces/user.interface';
import { UsersService } from './users.service';

class GetUserByIdParams {
  @IsString()
  id: string;
}

@Controller('rpc/v1/users')
export class UsersRpcController implements OnModuleInit {
  private rpcHandler = new JsonRpcHandler();

  constructor(private readonly usersService: UsersService) {}

  onModuleInit() {
    this.rpcHandler
      .register('getUsers', undefined, () => this.usersService.getUsers())
      .register('getUserById', GetUserByIdParams, (params) =>
        this.usersService.getUserById(params.id),
      )
      .register('createUser', CreateUserDto, (dto) =>
        this.usersService.createUser(dto),
      );
  }

  @Post()
  async handleRpc(@Body() request: JsonRpcRequest): Promise<JsonRpcResponse> {
    return this.rpcHandler.handle(request);
  }
}
