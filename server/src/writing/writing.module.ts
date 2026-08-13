import { Module } from '@nestjs/common';

import { WritingController } from './writing.controller';
import { WritingRetentionService } from './writing-retention.service';
import { WritingService } from './writing.service';

@Module({
  controllers: [WritingController],
  providers: [WritingService, WritingRetentionService],
  exports: [WritingService],
})
export class WritingModule {}
