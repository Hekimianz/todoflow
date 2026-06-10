import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import User from './User.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.usersRepo.findAll();
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepo.findByUsername(username);
  }

  async createUser(username: string, password: string): Promise<User> {
    return await this.usersRepo.createUser(username, password);
  }
}
