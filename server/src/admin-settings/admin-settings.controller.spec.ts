import { HttpStatus, RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  HTTP_CODE_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { ThrottlerGuard } from '@nestjs/throttler';

import { UserRole } from '../../generated/prisma/client';
import { ROLES_KEY } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminSettingsController } from './admin-settings.controller';
import { AdminSettingsService } from './admin-settings.service';

describe('AdminSettingsController deployment endpoint', () => {
  const deployResponse = {
    accepted: true,
    message: 'Đã gửi yêu cầu triển khai tới Cloudflare Pages.',
    triggeredAt: '2026-08-01T10:30:00.000Z',
  };
  const adminSettingsService = {
    triggerCloudflarePagesDeploy: jest.fn(),
  };
  const controller = new AdminSettingsController(
    adminSettingsService as unknown as AdminSettingsService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes an ADMIN-only POST deploy endpoint', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      AdminSettingsController,
    ) as unknown[];
    const roles = Reflect.getMetadata(
      ROLES_KEY,
      AdminSettingsController,
    ) as UserRole[];
    // Metadata is attached to the original controller method.
    /* eslint-disable @typescript-eslint/unbound-method */
    const method =
      AdminSettingsController.prototype.triggerCloudflarePagesDeploy;
    /* eslint-enable @typescript-eslint/unbound-method */

    expect(guards).toEqual(
      expect.arrayContaining([JwtAuthGuard, RolesGuard, ThrottlerGuard]),
    );
    expect(roles).toEqual([UserRole.ADMIN]);
    expect(Reflect.getMetadata(PATH_METADATA, method)).toBe('deploy');
    expect(Reflect.getMetadata(METHOD_METADATA, method)).toBe(
      RequestMethod.POST,
    );
    expect(Reflect.getMetadata(HTTP_CODE_METADATA, method)).toBe(
      HttpStatus.ACCEPTED,
    );
    expect(Reflect.getMetadata('THROTTLER:LIMITdefault', method)).toBe(1);
    expect(Reflect.getMetadata('THROTTLER:TTLdefault', method)).toBe(60_000);
  });

  it('delegates deployment without accepting a hook URL from the request', async () => {
    adminSettingsService.triggerCloudflarePagesDeploy.mockResolvedValue(
      deployResponse,
    );

    await expect(controller.triggerCloudflarePagesDeploy()).resolves.toEqual(
      deployResponse,
    );
    expect(
      adminSettingsService.triggerCloudflarePagesDeploy,
    ).toHaveBeenCalledWith();
  });
});
