import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const user = await this.userService.find(email);
    if (user.length) throw new BadRequestException('email in use');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const finalUser = await this.userService.create(email, result);

    return finalUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) throw new NotFoundException('invalid credentials');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('bad request');

    return user;
  }
}
