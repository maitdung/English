import { Transform, Type } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CourseLevel } from '../../../generated/prisma/client';

export enum WritingTaskType {
  GENERAL = 'general',
  EMAIL = 'email',
  ESSAY = 'essay',
  TOEIC = 'toeic',
  IELTS = 'ielts',
}

function trimString({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function trimOptionalString({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export class ReviewWritingDto {
  @ApiProperty({
    type: Boolean,
    example: true,
    enum: [true],
    description: 'Xác nhận người dùng đồng ý gửi và lưu bài viết để chấm.',
  })
  @Transform(({ value }: { value: unknown }) => value === true)
  @IsBoolean()
  @Equals(true, {
    message: 'consent phải là true trước khi gửi bài viết để chấm',
  })
  consent!: true;

  @ApiProperty({ enum: WritingTaskType, example: WritingTaskType.ESSAY })
  @IsEnum(WritingTaskType)
  taskType!: WritingTaskType;

  @ApiProperty({ enum: CourseLevel, example: CourseLevel.B1 })
  @IsEnum(CourseLevel)
  level!: CourseLevel;

  @ApiPropertyOptional({
    maxLength: 2000,
    example: 'Do social networks improve communication?',
  })
  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  prompt?: string;

  @ApiProperty({ minLength: 20, maxLength: 12000 })
  @Transform(trimString)
  @IsString()
  @MinLength(20)
  @MaxLength(12000)
  content!: string;

  @ApiPropertyOptional({ minimum: 30, maximum: 2000, example: 250 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(2000)
  targetWords?: number;
}
