import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';
import { setRolePermissions } from './permissions.decorator';

export interface AuthModuleOptions<
  R extends string = string,
  P extends string = string,
> {
  secret: string;
  expiresIn?: string | number;
  global?: boolean;
  rolePermissions: Record<R, readonly P[]>;
}

@Module({})
export class AuthModule {
  static forRoot<R extends string, P extends string>(
    options: AuthModuleOptions<R, P>,
  ): DynamicModule {
    // Set the role-permissions mapping at module initialization
    setRolePermissions(options.rolePermissions);

    return {
      module: AuthModule,
      imports: [
        JwtModule.register({
          global: options.global ?? true,
          secret: options.secret,
          signOptions: { expiresIn: options.expiresIn ?? '1d' } as never,
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
