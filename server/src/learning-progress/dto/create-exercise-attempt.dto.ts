import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateExerciseAttemptDto {
  @ApiProperty({
    description: 'Đáp án học viên đã chọn hoặc nhập.',
  })
  @IsDefined()
  answer: unknown;

  @ApiProperty({
    description: 'Số phút dành cho câu này.',
    minimum: 0,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpentMinutes?: number;

  @ApiProperty({
    description: 'Điểm tự chấm hoặc điểm mong muốn lưu thêm.',
    minimum: 0,
    maximum: 100,
    required: false,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;
}
