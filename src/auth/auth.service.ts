import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { EExceptionCodes } from 'src/common/enum/exception-codes.enum';
import { BadRequestException, BaseException } from 'src/common/exceptions';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(payload: RegisterDto) {
    const [existingEmail, existingUsername] = await Promise.all([
      this.userService.findByEmail(payload.email),
      payload.username
        ? this.userService.findByUsername(payload.username)
        : Promise.resolve(null),
    ]);

    if (existingEmail) {
      throw new BadRequestException({
        message: 'Email already exists',
        code: EExceptionCodes.BAD_REQUEST,
      });
    }

    if (existingUsername) {
      throw new BadRequestException({
        message: 'Username already exists',
        code: EExceptionCodes.BAD_REQUEST,
      });
    }

    const user = new CreateUserDto();
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.username = payload.username;
    user.email = payload.email;
    user.phoneNumber = payload.phoneNumber;
    user.password = await hash(
      payload.password,
      Number(process.env.HASH_ROUNDS || 10),
    );

    try {
      const createdUser = await this.userService.createUser(user);
      return createdUser;
    } catch (error) {
      throw new BaseException({
        message: 'Failed to create user',
        exception: error as Error,
      });
    }
  }
}
