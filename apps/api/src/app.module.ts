import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JsonRpcModule } from 'nestjs-exposify';
import { join } from 'path';
import { AuthModule } from './auth';
import { UsersModule } from './users';

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
})
export class AppModule {}
