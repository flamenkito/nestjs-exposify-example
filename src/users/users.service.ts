import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from './interfaces/user.interface';

const users: UserDto[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

const byId = <T extends { id: unknown }>(id: unknown) => {
  return (it: T) => it.id === id;
};

@Injectable()
export class UsersService {
  async getUsers(): Promise<UserDto[]> {
    return Promise.resolve(users);
  }

  async getUserById(id: number): Promise<UserDto | undefined> {
    return Promise.resolve(users.find(byId(id)));
  }

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const newUser: UserDto = {
      id: users.length + 1,
      name: dto.name,
      email: dto.email,
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  }
}
