import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ParseUuidPipe } from '../pipes/parse-uuid.pipe';
import { CreateUserDto, UserDto } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUuidPipe) id: string): Promise<UserDto | undefined> {
    return this.usersService.getUserById(id);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(dto);
  }
}
