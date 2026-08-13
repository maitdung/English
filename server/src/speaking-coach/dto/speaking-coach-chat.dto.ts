import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class SpeakingCoachChatMessageDto {
  @IsIn(['assistant', 'user'])
  role: 'assistant' | 'user';

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/u, { message: 'content must contain a visible character' })
  @MaxLength(2_000)
  content: string;
}

export class SpeakingCoachChatDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/u, { message: 'topic must contain a visible character' })
  @MaxLength(200)
  topic: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/u, { message: 'input must contain a visible character' })
  @MaxLength(4_000)
  input: string;

  @IsOptional()
  @IsIn(['coach', 'translate_en_vi', 'translate_vi_en'])
  mode?: 'coach' | 'translate_en_vi' | 'translate_vi_en';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => SpeakingCoachChatMessageDto)
  messages?: SpeakingCoachChatMessageDto[];
}
