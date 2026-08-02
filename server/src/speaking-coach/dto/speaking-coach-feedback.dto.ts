import { IsNotEmpty, IsString } from 'class-validator';

export class SpeakingCoachFeedbackDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsNotEmpty()
  response: string;
}
