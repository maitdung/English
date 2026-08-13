import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SpeakingCoachFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/u, { message: 'topic must contain a visible character' })
  @MaxLength(200)
  topic: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/u, { message: 'response must contain a visible character' })
  @MaxLength(6_000)
  response: string;
}
