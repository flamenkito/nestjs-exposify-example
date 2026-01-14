import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class IdDto {
  @IsUUID()
  id: string;
}

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

export class UpdateUserDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
