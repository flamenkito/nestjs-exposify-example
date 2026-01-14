import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JsonRpcModule } from 'nestjs-exposify';
import { join } from 'path';
import { AuthModule } from './auth';
import { UsersModule } from './users';
import { DelayInterceptor } from './delay.interceptor';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    JsonRpcModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'web-preact'),
      serveRoot: '/preact',
      exclude: ['/rpc{/*path}'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'web-angular', 'browser'),
      serveRoot: '/angular',
      exclude: ['/rpc{/*path}'],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DelayInterceptor,
    },
  ],
})
export class AppModule {}
