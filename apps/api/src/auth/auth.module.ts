import { Module } from '@nestjs/common';
import { AuthModule as AuthLibModule } from '@example/auth';
import { AuthService } from './auth.service';
import { ROLE_PERMISSIONS } from './auth.config';

@Module({
  imports: [
    AuthLibModule.forRoot({
      secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      expiresIn: '1d',
      rolePermissions: ROLE_PERMISSIONS,
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
