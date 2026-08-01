import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UserRole } from '../../generated/prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AdminWebsiteSettingsDto } from './dto/admin-website-settings.dto';
import { CloudflarePagesDeployResponseDto } from './dto/cloudflare-pages-deploy-response.dto';
import { AdminSettingsService } from './admin-settings.service';

@ApiTags('Admin Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get('website')
  @ApiOperation({ summary: 'Lấy cấu hình website admin' })
  @ApiOkResponse({ type: AdminWebsiteSettingsDto })
  getWebsiteSettings(): Promise<AdminWebsiteSettingsDto> {
    return this.adminSettingsService.getWebsiteSettings();
  }

  @Patch('website')
  @ApiOperation({ summary: 'Cập nhật cấu hình website admin' })
  @ApiOkResponse({ type: AdminWebsiteSettingsDto })
  updateWebsiteSettings(
    @CurrentUser() user: JwtPayload,
    @Body() dto: AdminWebsiteSettingsDto,
  ): Promise<AdminWebsiteSettingsDto> {
    return this.adminSettingsService.saveWebsiteSettings(dto, user.sub);
  }

  @Post('deploy')
  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Kích hoạt triển khai Cloudflare Pages' })
  @ApiAcceptedResponse({ type: CloudflarePagesDeployResponseDto })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Deploy hook chưa được cấu hình trên máy chủ.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Cloudflare Pages từ chối yêu cầu hoặc không thể kết nối.',
  })
  @ApiResponse({
    status: HttpStatus.GATEWAY_TIMEOUT,
    description: 'Cloudflare Pages không phản hồi trong thời gian cho phép.',
  })
  @ApiTooManyRequestsResponse({
    description: 'Một yêu cầu triển khai khác vừa được gửi gần đây.',
  })
  triggerCloudflarePagesDeploy(): Promise<CloudflarePagesDeployResponseDto> {
    return this.adminSettingsService.triggerCloudflarePagesDeploy();
  }
}
