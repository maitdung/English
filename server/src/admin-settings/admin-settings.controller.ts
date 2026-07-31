import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AdminWebsiteSettingsDto } from './dto/admin-website-settings.dto';
import { AdminSettingsService } from './admin-settings.service';

@ApiTags('Admin Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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
}
