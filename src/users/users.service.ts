import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { byId } from '../utils/by-id';
import { required } from '../utils/required';
import { CreateUserDto, UserDto } from './interfaces/user.interface';

const users: UserDto[] = [
  { id: uuidv4(), name: 'John Doe', email: 'john@example.com' },
  { id: uuidv4(), name: 'Jane Smith', email: 'jane@example.com' },
  { id: uuidv4(), name: 'Bob Johnson', email: 'bob@example.com' },
];

@Injectable()
export class UsersService {
  async getUsers(): Promise<UserDto[]> {
    return Promise.resolve(users);
  }

  async getUserById(id: string): Promise<UserDto> {
    const user =
      users.find(byId(id)) || required(`user with id ${id}`, NotFoundException);
    return Promise.resolve(user);
  }

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
