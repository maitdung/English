import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SpeakingCoachChatDto } from './dto/speaking-coach-chat.dto';
import { SpeakingCoachFeedbackDto } from './dto/speaking-coach-feedback.dto';
import { SpeakingCoachService } from './speaking-coach.service';

@ApiTags('Speaking coach')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Access token không hợp lệ.' })
@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('speaking-coach')
export class SpeakingCoachController {
  constructor(private readonly speakingCoachService: SpeakingCoachService) {}

  @Post('feedback')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @ApiOperation({ summary: 'Chấm phản hồi luyện nói bằng AI' })
  @ApiOkResponse({ description: 'Nhận điểm và góp ý luyện nói.' })
  @ApiTooManyRequestsResponse({
    description: 'Đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
  })
  async getFeedback(@Body() dto: SpeakingCoachFeedbackDto) {
    return this.speakingCoachService.getFeedback(dto.topic, dto.response);
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @ApiOperation({ summary: 'Trò chuyện hoặc dịch cùng huấn luyện viên AI' })
  @ApiOkResponse({ description: 'Nhận phản hồi hội thoại hoặc bản dịch.' })
  @ApiTooManyRequestsResponse({
    description: 'Đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
  })
  async getChatReply(@Body() dto: SpeakingCoachChatDto) {
    return this.speakingCoachService.getChatReply(
      dto.topic,
      dto.input,
      dto.messages ?? [],
      dto.mode ?? 'coach',
    );
  }
}
