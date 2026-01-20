import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expose } from 'nestjs-exposify';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Permissions } from '../auth';
import { CreateUserDto, IdDto, UpdateUserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { asUserResource, UserResource } from './user.resource';

@Expose({ transport: 'json-rpc' })
@Injectable()
export class UsersFacade {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Permissions('user:read')
  async getUsers(): Promise<UserResource[]> {
    const users = await this.userRepository.find();
    return users.map(asUserResource);
  }

  @Permissions('user:read')
  async getUserById(dto: IdDto): Promise<UserResource> {
    const user = await this.userRepository.findOneBy({ id: dto.id });
    if (!user) {
      throw new NotFoundException(`User with id ${dto.id} not found`);
    }
    return asUserResource(user);
  }

  @Permissions('user:create')
  async createUser(dto: CreateUserDto): Promise<UserResource> {
    const newUser = this.userRepository.create({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      passwordHash: '',
      role: 'user',
    });
    const saved = await this.userRepository.save(newUser);
    return asUserResource(saved);
  }

  @Permissions('user:update')
  async updateUser(dto: UpdateUserDto): Promise<UserResource> {
    const user = await this.userRepository.findOneBy({ id: dto.id });
    if (!user) {
      throw new NotFoundException(`User with id ${dto.id} not found`);
    }
    user.name = dto.name;
    user.email = dto.email;
    const saved = await this.userRepository.save(user);
    return asUserResource(saved);
  }

  @Permissions('user:delete')
  async deleteUser(dto: IdDto): Promise<void> {
    const result = await this.userRepository.delete({ id: dto.id });
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${dto.id} not found`);
    }
  }
}
