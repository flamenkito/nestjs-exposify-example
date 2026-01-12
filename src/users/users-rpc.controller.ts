import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, UserDto } from './interfaces/user.interface';
import { UsersService } from './users.service';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
  id: string | number;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
  id: string | number | null;
}

@Controller('api/rpc/users')
export class UsersRpcController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async handleRpc(@Body() request: JsonRpcRequest): Promise<JsonRpcResponse> {
    console.log({ request });
    try {
      const result = await this.executeMethod(request.method, request.params);
      return {
        jsonrpc: '2.0',
        result,
        id: request.id,
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
        id: request.id,
      };
    }
  }

  private async executeMethod(
    method: string,
    params?: Record<string, unknown>,
  ): Promise<UserDto | UserDto[]> {
    switch (method) {
      case 'getUsers':
        return this.usersService.getUsers();
      case 'getUserById':
        return this.usersService.getUserById(params?.id as string);
      case 'createUser':
        return this.usersService.createUser(params as unknown as CreateUserDto);
      default:
        throw new Error(`Method ${method} not found`);
    }
  }
}
