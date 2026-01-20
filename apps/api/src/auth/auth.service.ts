import { AuthResponse, AuthUser, Public } from '@example/auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Expose } from 'nestjs-exposify';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../users/user.entity';
import { Role } from './auth.config';
import { LoginDto, RegisterDto } from './auth.dto';

@Expose({ transport: 'json-rpc' })
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Public()
  async login(dto: LoginDto): Promise<AuthResponse<Role>> {
    const user = await this.userRepository.findOneBy({ email: dto.email });

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
    const existingUser = await this.userRepository.findOneBy({ email: dto.email });

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepository.create({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: 'user',
    });

    await this.userRepository.save(newUser);

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
