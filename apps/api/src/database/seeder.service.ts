import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedUsers();
  }

  private async seedUsers(): Promise<void> {
    const hashedPassword = await bcrypt.hash('password', 10);

    await this.userRepository.save([
      {
        id: uuidv4(),
        name: 'Admin',
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        role: 'admin',
      },
      {
        id: uuidv4(),
        name: 'User',
        email: 'user@example.com',
        passwordHash: hashedPassword,
        role: 'user',
      },
    ]);
  }
}
