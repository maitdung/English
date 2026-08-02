import { Module } from '@nestjs/common';

import { SpeakingCoachController } from './speaking-coach.controller';
import { SpeakingCoachService } from './speaking-coach.service';

@Module({
  controllers: [SpeakingCoachController],
  providers: [SpeakingCoachService],
})
export class SpeakingCoachModule {}
