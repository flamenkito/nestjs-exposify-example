import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expose } from 'nestjs-exposify';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Permissions } from '../auth';
import { CreateUserDto, IdDto, UpdateUserDto, UserDto } from './user.dto';
import { UserEntity } from './user.entity';

@Expose({ transport: 'json-rpc' })
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Permissions('user:read')
  async getUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return users.map(({ id, name, email }) => ({ id, name, email }));
  }

  @Permissions('user:read')
  async getUserById(dto: IdDto): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id: dto.id });
    if (!user) {
      throw new NotFoundException(`User with id ${dto.id} not found`);
    }
    return { id: user.id, name: user.name, email: user.email };
  }

  @Permissions('user:create')
  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const newUser = this.userRepository.create({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      passwordHash: '',
      role: 'user',
    });
    const saved = await this.userRepository.save(newUser);
    return { id: saved.id, name: saved.name, email: saved.email };
  }

  @Permissions('user:update')
  async updateUser(dto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id: dto.id });
    if (!user) {
      throw new NotFoundException(`User with id ${dto.id} not found`);
    }
    user.name = dto.name;
    user.email = dto.email;
    const saved = await this.userRepository.save(user);
    return { id: saved.id, name: saved.name, email: saved.email };
  }

  @Permissions('user:delete')
  async deleteUser(dto: IdDto): Promise<void> {
    const result = await this.userRepository.delete({ id: dto.id });
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${dto.id} not found`);
    }
  }
}
