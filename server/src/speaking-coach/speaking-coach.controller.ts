import { Body, Controller, Post } from '@nestjs/common';

import { SpeakingCoachFeedbackDto } from './dto/speaking-coach-feedback.dto';
import { SpeakingCoachService } from './speaking-coach.service';

@Controller('speaking-coach')
export class SpeakingCoachController {
  constructor(private readonly speakingCoachService: SpeakingCoachService) {}

  @Post('feedback')
  async getFeedback(@Body() dto: SpeakingCoachFeedbackDto) {
    return this.speakingCoachService.getFeedback(dto.topic, dto.response);
  }
}
