import { Injectable } from '@nestjs/common';
import User from './User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepo.find();
    return users.map(({ password, ...publicProfile }) => publicProfile);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepo.findOneBy({ username });
  }

  async createUser(username: string, password: string): Promise<User> {
    const newUser = this.usersRepo.create({ username, password });
    return await this.usersRepo.save(newUser);
  }
}
