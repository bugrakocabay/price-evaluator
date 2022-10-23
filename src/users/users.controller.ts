import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(dto.email, dto.password);
    session.userId = user.id;

    return user;
  }

  @Post('signin')
  async signin(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(dto.email, dto.password);
    session.userId = user.id;

    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoamI(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch(':id')
  updateUser(@Body() dto: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.update(parseInt(id), dto);
  }
}
