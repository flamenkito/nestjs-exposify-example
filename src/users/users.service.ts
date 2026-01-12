import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from './interfaces/user.interface';

const users: UserDto[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

@Injectable()
export class UsersService {
  getUsers(): UserDto[] {
    return users;
  }

  getUserById(id: number): UserDto | undefined {
    return users.find((user) => user.id === id);
  }

  createUser(dto: CreateUserDto): UserDto {
    const newUser: UserDto = {
      id: users.length + 1,
      name: dto.name,
      email: dto.email,
    };
    users.push(newUser);
    return newUser;
  }
}
