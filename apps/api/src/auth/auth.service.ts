import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Expose } from 'nestjs-exposify';
import { v4 as uuidv4 } from 'uuid';
import {
  AuthResponse,
  AuthUser,
  LoginDto,
  RegisterDto,
} from './auth.dto.js';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// In-memory user storage
const users: StoredUser[] = [
  {
    id: uuidv4(),
    name: 'Admin',
    email: 'admin@example.com',
    // Password: "password"
    passwordHash: '$2b$10$1mt58fwdDw3YvdWY5c.z0OhPjr2IrVS1LeNythMesdeY3lmUmSt/y',
  },
];

@Expose({ transport: 'json-rpc' })
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = users.find((u) => u.email === dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = users.find((u) => u.email === dto.email);

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newUser: StoredUser = {
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      passwordHash,
    };

    users.push(newUser);

    const payload = { sub: newUser.id, email: newUser.email, name: newUser.name };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  async me(user: AuthUser): Promise<AuthUser> {
    return user;
  }
}
