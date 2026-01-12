import { Body, Controller, Get, Param, Post } from '@nestjs/common';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

@Controller('api/users')
export class UsersController {
  @Get()
  getUsers() {
    return users;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return users.find((user) => user.id === parseInt(id));
  }

  @Post()
  createUser(@Body() body: { name: string; email: string }) {
    const newUser = {
      id: users.length + 1,
      name: body.name,
      email: body.email,
    };
    users.push(newUser);
    return newUser;
  }
}
