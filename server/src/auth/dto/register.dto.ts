import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_PATTERN,
} from '../password-policy';

export class RegisterDto {
  @ApiProperty({
    example: 'student@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(STRONG_PASSWORD_PATTERN, {
    message: STRONG_PASSWORD_MESSAGE,
  })
  password: string;

  @ApiPropertyOptional({
    example: 'Minh',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Nguyen',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}
