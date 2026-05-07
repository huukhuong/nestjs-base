import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ERoles } from 'src/common/enum';
import { Roles } from 'src/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(ERoles.SUPER_ADMIN, ERoles.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
}
