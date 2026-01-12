import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonRpcModule } from './json-rpc';
import { UsersModule } from './users';

@Module({
  imports: [UsersModule, JsonRpcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
