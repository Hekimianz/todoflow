import {
  Body,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(pass, user.password)))
      throw new UnauthorizedException();
    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signUp(username: string, pass: string): Promise<{ message: string }> {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) throw new ConflictException('Username is taken');
    const hashedPassword = await bcrypt.hash(pass, 10);
    await this.usersService.createUser(username, hashedPassword);
    return { message: 'ok' };
  }
}
