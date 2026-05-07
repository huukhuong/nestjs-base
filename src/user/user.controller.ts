import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ERoles } from 'src/common/enum';
import { Roles } from 'src/common/decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(ERoles.SUPER_ADMIN, ERoles.ADMIN)
  async createUser(@Body() user: UserEntity) {
    return this.userService.createUser(user);
  }
}
