import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/configs';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { VerificationModule } from 'src/verification/verification.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthTokenService } from './auth-token.service';
import { RbacModule, RbacGuard } from 'src/rbac';

@Module({
  imports: [
    JwtModule.register(jwtConfig),
    UserModule,
    VerificationModule,
    MailModule,
    RbacModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthTokenService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useExisting: JwtAuthGuard,
    },
    RbacGuard,
    {
      provide: APP_GUARD,
      useExisting: RbacGuard,
    },
  ],
})
export class AuthModule {}
