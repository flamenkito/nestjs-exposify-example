import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JsonRpcModule } from 'nestjs-exposify';
import { join } from 'path';
import { UsersModule } from './users';

@Module({
  imports: [
    UsersModule,
    JsonRpcModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/rpc{/*path}'],
    }),
  ],
})
export class AppModule {}
