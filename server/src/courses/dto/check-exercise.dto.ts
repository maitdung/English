import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class CheckExerciseDto {
  @ApiProperty({
    description:
      'Đáp án của học viên. Có thể là chỉ số, chuỗi, boolean hoặc mảng.',
  })
  @IsDefined()
  answer: unknown;
}
