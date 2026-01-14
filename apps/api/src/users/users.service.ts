import { Expose } from 'nestjs-exposify';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { byId, required } from '@example/utils';
import { Permissions } from '../auth';
import { CreateUserDto, IdDto, UpdateUserDto, UserDto } from './user.dto';

const users: UserDto[] = [
  { id: uuidv4(), name: 'John Doe', email: 'john@example.com' },
  { id: uuidv4(), name: 'Jane Smith', email: 'jane@example.com' },
  { id: uuidv4(), name: 'Bob Johnson', email: 'bob@example.com' },
];

@Expose({ transport: 'json-rpc' })
@Injectable()
export class UsersService {
  @Permissions('user:read')
  getUsers(): UserDto[] {
    return users;
  }

  @Permissions('user:read')
  getUserById(dto: IdDto): UserDto {
    return users.find(byId(dto.id)) ?? required(`user with id ${dto.id}`, NotFoundException);
  }

  @Permissions('user:create')
  createUser(dto: CreateUserDto): UserDto {
    const newUser: UserDto = {
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
    };
    users.push(newUser);
    return newUser;
  }

  @Permissions('user:update')
  updateUser(dto: UpdateUserDto): UserDto {
    const user =
      users.find(byId(dto.id)) ?? required(`user with id ${dto.id}`, NotFoundException);
    user.name = dto.name;
    user.email = dto.email;
    return user;
  }

  @Permissions('user:delete')
  deleteUser(dto: IdDto): void {
    const index = users.findIndex(byId(dto.id));
    if (index === -1) {
      required(`user with id ${dto.id}`, NotFoundException);
    }
    users.splice(index, 1);
  }
}
