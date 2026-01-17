import { AuthModule as AuthLibModule } from '@example/auth';
import { Module } from '@nestjs/common';
import { ROLE_PERMISSIONS } from './auth.config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    AuthLibModule.forRoot({
      secret: process.env['JWT_SECRET'] || 'super-secret-key-change-in-production',
      expiresIn: '1d',
      global: undefined,
      rolePermissions: ROLE_PERMISSIONS,
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
