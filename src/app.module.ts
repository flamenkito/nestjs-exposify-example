import { JsonRpcModule } from 'nestjs-exposify';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users';

@Module({
  imports: [UsersModule, JsonRpcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
