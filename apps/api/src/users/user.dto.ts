import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  id: string;
  name: string;
  email: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
