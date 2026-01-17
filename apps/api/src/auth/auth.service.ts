import { AuthResponse, AuthUser, Public } from '@example/auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Expose } from 'nestjs-exposify';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './auth.config';
import { LoginDto, RegisterDto } from './auth.dto';

// Password: "password"
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const passwordHash = '$2b$10$1mt58fwdDw3YvdWY5c.z0OhPjr2IrVS1LeNythMesdeY3lmUmSt/y';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}

// In-memory user storage
const users: StoredUser[] = [
  {
    id: uuidv4(),
    name: 'Admin',
    email: 'admin@example.com',
    // Password: "password"
    passwordHash,
    role: 'admin',
  },
  {
    id: uuidv4(),
    name: 'User',
    email: 'user@example.com',
    // Password: "password"
    passwordHash,
    role: 'user',
  },
];

@Expose({ transport: 'json-rpc' })
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  @Public()
  async login(dto: LoginDto): Promise<AuthResponse<Role>> {
    const user = users.find((u) => u.email === dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Public()
  async register(dto: RegisterDto): Promise<AuthResponse<Role>> {
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
      role: 'user',
    };

    users.push(newUser);

    const payload = { sub: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  me(user: AuthUser<Role>): AuthUser<Role> {
    return user;
  }
}
