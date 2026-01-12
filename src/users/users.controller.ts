import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, UserDto } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): UserDto[] {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): UserDto | undefined {
    return this.usersService.getUserById(parseInt(id));
  }

  @Post()
  createUser(@Body() dto: CreateUserDto): UserDto {
    return this.usersService.createUser(dto);
  }
}
