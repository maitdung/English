import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from '../../../generated/prisma/client';
import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_PATTERN,
} from '../../auth/password-policy';

export class CreateUserDto {
  @ApiProperty({
    example: 'student@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    minLength: 8,
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

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  avatarUrl?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
