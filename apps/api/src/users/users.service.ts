import { Expose } from 'nestjs-exposify';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { byId, required } from '@example/utils';
import { Permissions } from '../auth';
import { CreateUserDto, IdDto, UserDto } from './user.dto';

const users: UserDto[] = [
  { id: uuidv4(), name: 'John Doe', email: 'john@example.com' },
  { id: uuidv4(), name: 'Jane Smith', email: 'jane@example.com' },
  { id: uuidv4(), name: 'Bob Johnson', email: 'bob@example.com' },
];

@Expose({ transport: 'json-rpc' })
@Injectable()
export class UsersService {
  @Permissions('user:read')
  async getUsers(): Promise<UserDto[]> {
    return Promise.resolve(users);
  }

  @Permissions('user:read')
  async getUserById(dto: IdDto): Promise<UserDto> {
    const user =
      users.find(byId(dto.id)) ?? required(`user with id ${dto.id}`, NotFoundException);
    return Promise.resolve(user);
  }

  @Permissions('user:create')
  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const newUser: UserDto = {
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  }
}
