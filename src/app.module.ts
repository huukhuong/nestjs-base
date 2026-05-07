import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'database/data-source';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { NestLensModule } from 'nestlens';
import { nestlensConfig } from './common/configs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOption),
    TerminusModule,
    HttpModule,
    NestLensModule.forRoot(nestlensConfig),
  ],
  controllers: [AppController],
})
export class AppModule {}
