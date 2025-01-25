import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, Length } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @Length(3, 20)
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    nullable: false,
  })
  password: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;
}
