import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../../generated/prisma/client';

import { isCloudflarePagesDeployHookUrl } from '../config/cloudflare-pages-deploy-hook';
import { PrismaService } from '../prisma/prisma.service';
import { AdminWebsiteSettingsDto } from './dto/admin-website-settings.dto';
import { CloudflarePagesDeployResponseDto } from './dto/cloudflare-pages-deploy-response.dto';

const WEBSITE_SETTINGS_KEY = 'website-deploy';
const CLOUDFLARE_DEPLOY_TIMEOUT_MS = 10_000;

@Injectable()
export class AdminSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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

  async triggerCloudflarePagesDeploy(): Promise<CloudflarePagesDeployResponseDto> {
    const deployHookUrl = this.configService
      .get<string>('CLOUDFLARE_PAGES_DEPLOY_HOOK_URL')
      ?.trim();

    if (!deployHookUrl || !isCloudflarePagesDeployHookUrl(deployHookUrl)) {
      throw new ServiceUnavailableException(
        'Cloudflare Pages deploy hook chưa được cấu hình hợp lệ trên máy chủ.',
      );
    }

    let response: Response;

    try {
      response = await fetch(deployHookUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        redirect: 'error',
        signal: AbortSignal.timeout(CLOUDFLARE_DEPLOY_TIMEOUT_MS),
      });
    } catch (error) {
      if (this.isTimeoutError(error)) {
        throw new GatewayTimeoutException(
          'Cloudflare Pages deploy hook phản hồi quá thời gian cho phép.',
        );
      }

      throw new BadGatewayException(
        'Không thể kết nối tới Cloudflare Pages deploy hook.',
      );
    }

    if (!response.ok) {
      throw new BadGatewayException(
        `Cloudflare Pages deploy hook từ chối yêu cầu với mã ${response.status}.`,
      );
    }

    return {
      accepted: true,
      message: 'Đã gửi yêu cầu triển khai tới Cloudflare Pages.',
      triggeredAt: new Date().toISOString(),
    };
  }

  private toDto(
    value: Prisma.JsonValue | null | undefined,
  ): AdminWebsiteSettingsDto {
    const defaults: AdminWebsiteSettingsDto = {
      frontendUrl: 'https://english-c0h.pages.dev',
      apiUrl: 'https://english-3t66.onrender.com/api',
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

  private isTimeoutError(error: unknown): boolean {
    return (
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError')
    );
  }
}
