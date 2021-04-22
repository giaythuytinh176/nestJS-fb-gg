import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { string } from 'joi';

export class CreateUserDTO {
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: string,
    example: 'test12345@gmail.com',
    description: 'Your email',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(36)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @ApiProperty({
    type: string,
    example: '1@wERSD$',
    description: 'Your password',
  })
  password: string;
}
