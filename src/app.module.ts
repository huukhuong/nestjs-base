import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'database/data-source';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { NestLensModule } from 'nestlens';
import { nestlensConfig } from './common/configs';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from './common/filters';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOption),
    TerminusModule,
    HttpModule,
    NestLensModule.forRoot(nestlensConfig),
    AuthModule,
    UserModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
