import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersFacade } from './users.facade';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersFacade],
})
export class UsersModule {}
