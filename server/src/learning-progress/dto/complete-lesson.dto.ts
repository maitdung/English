import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CompleteLessonDto {
  @ApiPropertyOptional({
    description: 'Tỷ lệ hoàn thành của bài học.',
    minimum: 0,
    maximum: 100,
    example: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @ApiPropertyOptional({
    description: 'Điểm số bài làm gần nhất.',
    minimum: 0,
    maximum: 100,
    example: 80,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiPropertyOptional({
    description: 'Số phút đã dành cho bài học.',
    minimum: 0,
    example: 12,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpentMinutes?: number;
}
