import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ERoles } from 'src/common/enum';
import {
  ApiPaginationQuery,
  PaginationQueryParam,
  Roles,
} from 'src/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import type { PaginationQuery } from 'src/common/pagination';

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(ERoles.SUPER_ADMIN, ERoles.ADMIN)
  @ApiOperation({ summary: 'Get users with pagination' })
  @ApiPaginationQuery
  async findAll(@PaginationQueryParam() query: PaginationQuery) {
    return this.userService.findAll(query);
  }

  @Post()
  @Roles(ERoles.SUPER_ADMIN, ERoles.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
}
