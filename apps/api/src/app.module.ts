import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JsonRpcModule } from 'nestjs-exposify';
import { join } from 'path';
import { AuthModule } from './auth';
import { UsersModule } from './users';
import { DelayInterceptor } from './delay.interceptor';

const WEB_PREACT_PATH = join(__dirname, '..', '..', 'web-preact');
const WEB_ANGULAR_PATH = join(__dirname, '..', '..', 'web-angular', 'browser');
const DEFAULT_SPA_PATH = WEB_ANGULAR_PATH;

@Module({
  imports: [
    AuthModule,
    UsersModule,
    JsonRpcModule,
    ServeStaticModule.forRoot({
      rootPath: WEB_PREACT_PATH,
      serveRoot: '/preact',
      exclude: ['/rpc{/*path}'],
    }),
    ServeStaticModule.forRoot({
      rootPath: WEB_ANGULAR_PATH,
      serveRoot: '/angular',
      exclude: ['/rpc{/*path}'],
    }),
    ServeStaticModule.forRoot({
      rootPath: DEFAULT_SPA_PATH,
      exclude: ['/rpc{/*path}', '/preact{/*path}', '/angular{/*path}'],
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
