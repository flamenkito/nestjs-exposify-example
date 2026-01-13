export * from './auth.module';
export * from './auth.service';
export * from './auth.dto';
export * from './auth.config';
export type { AuthResponse, AuthUser, JwtPayload } from '@example/auth';
export {
  AuthModule as AuthLibModule,
  JwtAuthGuard,
  Public,
  hasAllPermissions,
  hasPermission,
} from '@example/auth';
