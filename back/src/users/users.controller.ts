import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import User from './User.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.findAll();
  }

  @Get('/username')
  async findByUsername(
    @Query('username') username: string,
  ): Promise<User | null> {
    return await this.usersService.findByUsername(username);
  }
}
