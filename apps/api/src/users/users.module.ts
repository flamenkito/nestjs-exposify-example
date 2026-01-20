import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersApi } from './users.api';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersApi],
})
export class UsersModule {}
