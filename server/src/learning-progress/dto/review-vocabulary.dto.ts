import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ReviewVocabularyDto {
  @ApiPropertyOptional({
    description: 'Điểm ghi nhớ cho lần ôn này.',
    minimum: 0,
    maximum: 100,
    example: 90,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;
}
