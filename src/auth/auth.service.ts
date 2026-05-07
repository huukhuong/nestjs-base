import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { EExceptionCodes } from 'src/common/enum/exception-codes.enum';
import {
  BadRequestException,
  BaseException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
      const safeUser = Object.fromEntries(
        Object.entries(createdUser).filter(([key]) => key !== 'password'),
      );
      return safeUser;
    } catch (error) {
      throw new BaseException({
        message: 'Failed to create user',
        exception: error as Error,
      });
    }
  }

  async login(payload: LoginDto) {
    const accountValue = payload.account.trim();
    const user = accountValue.includes('@')
      ? await this.userService.findByEmail(accountValue)
      : await this.userService.findByUsername(accountValue);

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: EExceptionCodes.USER_NOT_FOUND,
      });
    }

    const isPasswordValid = await compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid password',
        code: EExceptionCodes.INVALID_PASSWORD,
      });
    }

    return this.generateTokenPair(user.id, user.email);
  }

  async refreshToken(payload: RefreshTokenDto) {
    try {
      const refreshPayload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string | null;
      }>(payload.refreshToken, {
        secret: String(process.env.JWT_REFRESH_SECRET),
      });

      const user = await this.userService.findById(refreshPayload.sub);
      if (!user) {
        throw new UnauthorizedException({
          message: 'User not found',
          code: EExceptionCodes.USER_NOT_FOUND,
        });
      }

      return this.generateTokenPair(user.id, user.email);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        code: EExceptionCodes.INVALID_REFRESH_TOKEN,
      });
    }
  }

  async me(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: EExceptionCodes.UNAUTHORIZED,
      });
    }
    const safeUser = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password'),
    );
    return safeUser;
  }

  private async generateTokenPair(userId: string, email: string | null) {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      email,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: String(process.env.JWT_REFRESH_SECRET),
        expiresIn: Number(process.env.JWT_REFRESH_EXPIRATION),
      },
    );

    return {
      accessToken,
      accessTokenExpiredIn: Number(process.env.JWT_EXPIRATION),
      refreshToken,
      refreshTokenExpiredIn: Number(process.env.JWT_REFRESH_EXPIRATION),
    };
  }
}
