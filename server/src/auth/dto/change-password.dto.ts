import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_PATTERN,
} from '../password-policy';

export class ChangePasswordDto {
  @ApiProperty({
    minLength: 8,
    maxLength: 72,
    writeOnly: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  currentPassword: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 72,
    writeOnly: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(STRONG_PASSWORD_PATTERN, {
    message: STRONG_PASSWORD_MESSAGE,
  })
  newPassword: string;
}
