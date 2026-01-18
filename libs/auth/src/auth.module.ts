import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { JwtAuthGuard } from './auth.guard';
import { setRolePermissions } from './permissions.decorator';

interface AuthModuleRequiredOptions<R extends string = string, P extends string = string> {
  secret: string;
  rolePermissions: Record<R, readonly P[]>;
}

interface AuthModuleDefaults {
  expiresIn: StringValue | number;
  global: boolean;
}

const AUTH_MODULE_DEFAULTS: AuthModuleDefaults = {
  expiresIn: '1d',
  global: true,
};

export type AuthModuleOptions<R extends string = string, P extends string = string> = AuthModuleRequiredOptions<R, P> &
  Partial<AuthModuleDefaults>;

@Module({})
export class AuthModule {
  static forRoot<R extends string, P extends string>(options: AuthModuleOptions<R, P>): DynamicModule {
    const config = { ...AUTH_MODULE_DEFAULTS, ...options };

    // Set the role-permissions mapping at module initialization
    setRolePermissions(config.rolePermissions);

    return {
      module: AuthModule,
      imports: [
        JwtModule.register({
          global: config.global,
          secret: config.secret,
          signOptions: { expiresIn: config.expiresIn },
        }),
      ],
      providers: [
        JwtAuthGuard,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
      exports: [JwtAuthGuard, JwtModule],
    };
  }
}
