import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { Role } from '../auth/auth.config';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  role: Role;
}
