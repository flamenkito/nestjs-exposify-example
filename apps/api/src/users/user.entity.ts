import { Attribute } from '@example/json-api';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { Role } from '../auth/auth.config';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Attribute()
  @Column()
  name: string;

  @Attribute()
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Attribute()
  @Column()
  role: Role;
}
