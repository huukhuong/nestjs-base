import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseException from 'src/common/base-exception';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-res.dto';
import { ENV } from 'src/config/env';
import { EUserStatus } from 'src/user/enums/user-status';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({
      where: [{ username: username }, { email: username }],
    });

    if (!user) {
      throw new BaseException('Sai tên đăng nhập', HttpStatus.UNAUTHORIZED);
    }

    if (user.status !== EUserStatus.ACTIVE) {
      throw new BaseException(
        'Tài khoản chưa được kích hoạt',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!(await this.checkPassword(password, user.password))) {
      throw new BaseException('Sai mật khẩu', HttpStatus.UNAUTHORIZED);
    }

    return await this.generateUserResponse(user);
  }

  async generateUserResponse(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ENV.JWT_EXPIRATION_TIME,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: ENV.JWT_REFRESH_EXPIRATION_TIME,
    });

    return new LoginResponseDto({
      accessToken,
      refreshToken,
      user,
    }).toPlain();
  }

  async checkPassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }
}
