import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ReviewWritingDto } from './dto/review-writing.dto';
import { WritingHistoryQueryDto } from './dto/writing-history-query.dto';
import { WritingService } from './writing.service';

@ApiTags('Writing')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Access token không hợp lệ.' })
@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('writing')
export class WritingController {
  constructor(private readonly writingService: WritingService) {}

  @Post('review')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'private, no-store')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @ApiOperation({ summary: 'Chấm và lưu một bài viết tiếng Anh' })
  @ApiOkResponse({ description: 'Bài viết đã được chấm và lưu.' })
  @ApiTooManyRequestsResponse({
    description: 'Đã gửi quá nhiều bài viết. Vui lòng thử lại sau.',
  })
  review(@CurrentUser() user: JwtPayload, @Body() dto: ReviewWritingDto) {
    return this.writingService.review(user.sub, dto);
  }

  @Get('history')
  @Header('Cache-Control', 'private, no-store')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'Lấy lịch sử chấm viết của người dùng' })
  @ApiOkResponse({ description: 'Danh sách được phân trang theo thời gian.' })
  history(
    @CurrentUser() user: JwtPayload,
    @Query() query: WritingHistoryQueryDto,
  ) {
    return this.writingService.getHistory(user.sub, query);
  }

  @Get('policy')
  @Header('Cache-Control', 'private, no-store')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @ApiOperation({ summary: 'Lấy chính sách dữ liệu Writing hiện hành' })
  @ApiOkResponse({
    description:
      'Thời hạn lưu, phiên bản consent và các provider đã cấu hình; không lộ khóa hay model.',
  })
  policy() {
    return this.writingService.getPolicy();
  }

  @Get('export')
  @Header('Cache-Control', 'private, no-store')
  @Throttle({ default: { limit: 3, ttl: 3_600_000 } })
  @ApiOperation({ summary: 'Xuất toàn bộ dữ liệu Writing của người dùng' })
  @ApiOkResponse({ description: 'Bản xuất dữ liệu Writing đầy đủ.' })
  export(@CurrentUser() user: JwtPayload) {
    return this.writingService.exportHistory(user.sub);
  }

  @Delete('history/:id')
  @Header('Cache-Control', 'private, no-store')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Xóa một bài trong lịch sử Writing' })
  @ApiOkResponse({ description: 'Số bản ghi đã xóa.' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy bài viết.' })
  deleteOne(
    @CurrentUser() user: JwtPayload,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.writingService.deleteOne(user.sub, id);
  }

  @Delete('history')
  @Header('Cache-Control', 'private, no-store')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @ApiOperation({ summary: 'Xóa toàn bộ lịch sử Writing của người dùng' })
  @ApiOkResponse({ description: 'Số bản ghi đã xóa.' })
  deleteAll(@CurrentUser() user: JwtPayload) {
    return this.writingService.deleteAll(user.sub);
  }

  @Get(':id')
  @Header('Cache-Control', 'private, no-store')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'Lấy chi tiết một bài Writing của người dùng' })
  @ApiOkResponse({ description: 'Chi tiết và bản chấm đầy đủ.' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy bài viết.' })
  detail(
    @CurrentUser() user: JwtPayload,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.writingService.getOne(user.sub, id);
  }
}
