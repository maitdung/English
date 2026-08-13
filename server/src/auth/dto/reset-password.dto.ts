import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_PATTERN,
} from '../password-policy';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(32)
  @MaxLength(256)
  token: string;

  @ApiProperty({ minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(STRONG_PASSWORD_PATTERN, {
    message: STRONG_PASSWORD_MESSAGE,
  })
  password: string;
}
