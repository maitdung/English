import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole, UserStatus } from '../../../generated/prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'student@example.com',
  })
  email: string;

  @ApiPropertyOptional()
  firstName: string | null;

  @ApiPropertyOptional()
  lastName: string | null;

  @ApiPropertyOptional()
  avatarUrl: string | null;

  @ApiProperty({
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiProperty()
  emailVerified: boolean;

  @ApiPropertyOptional()
  lastLoginAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
