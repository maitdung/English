import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { AdminWebsiteSettingsDto } from './dto/admin-website-settings.dto';

const WEBSITE_SETTINGS_KEY = 'website-deploy';

@Injectable()
export class AdminSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getWebsiteSettings(): Promise<AdminWebsiteSettingsDto> {
    const setting = await this.prisma.adminSetting.findUnique({
      where: { key: WEBSITE_SETTINGS_KEY },
    });

    return this.toDto(setting?.value);
  }

  async saveWebsiteSettings(
    settings: AdminWebsiteSettingsDto,
    updatedById: string,
  ): Promise<AdminWebsiteSettingsDto> {
    await this.prisma.adminSetting.upsert({
      where: { key: WEBSITE_SETTINGS_KEY },
      create: {
        key: WEBSITE_SETTINGS_KEY,
        value: settings as unknown as Prisma.InputJsonValue,
        description: 'Website deployment settings',
        updatedById,
      },
      update: {
        value: settings as unknown as Prisma.InputJsonValue,
        updatedById,
      },
    });

    return settings;
  }

  private toDto(
    value: Prisma.JsonValue | null | undefined,
  ): AdminWebsiteSettingsDto {
    const defaults: AdminWebsiteSettingsDto = {
      frontendUrl: 'https://your-domain.com',
      apiUrl: 'https://api.your-domain.com/api',
      buildCommand: 'npm run build',
      backendCommand: 'cd server && npm run build && npm run start:prod',
    };

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return defaults;
    }

    return {
      ...defaults,
      ...(value as Partial<AdminWebsiteSettingsDto>),
    };
  }
}
