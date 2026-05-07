import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  global: true,
  secret: String(process.env.JWT_SECRET),
  signOptions: {
    expiresIn: Number(process.env.JWT_EXPIRATION),
  },
};
