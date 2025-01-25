import { classToPlain, Expose, plainToClass } from 'class-transformer';
import { User } from 'src/user/user.entity';

export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  user: User;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }

  toPlain() {
    const plainUser = classToPlain(this.user); // Chuyển sang plain object
    const user = plainToClass(User, plainUser); // Chuyển lại thành instance của User
    this.user = user; // Gán lại vào user
    return this; // Trả về đối tượng Lo
  }
}
