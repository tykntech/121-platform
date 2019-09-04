import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as crypto from 'crypto';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  @IsEmail()
  public email: string;

  @Column()
  public password: string;

  @BeforeInsert()
  public hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

}
