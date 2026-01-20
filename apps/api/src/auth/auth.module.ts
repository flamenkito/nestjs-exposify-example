import { AuthModule as AuthLibModule } from '@example/auth';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { ROLE_PERMISSIONS } from './auth.config';
import { AuthApi } from './auth.api';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthLibModule.forRoot({
      secret: process.env['JWT_SECRET'] || 'super-secret-key-change-in-production',
      expiresIn: '1d',
      rolePermissions: ROLE_PERMISSIONS,
    }),
  ],
  providers: [AuthApi],
  exports: [AuthApi],
})
export class AuthModule {}
