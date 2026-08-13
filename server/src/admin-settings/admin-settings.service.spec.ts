import {
  BadGatewayException,
  GatewayTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { AdminSettingsService } from './admin-settings.service';

const DEPLOY_HOOK_URL =
  'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/test-secret';

describe('AdminSettingsService Cloudflare deployment', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.MockedFunction<typeof fetch>;

  function createService(
    deployHookUrl: string | undefined,
  ): AdminSettingsService {
    const configService = {
      get: jest.fn((key: string) =>
        key === 'CLOUDFLARE_PAGES_DEPLOY_HOOK_URL' ? deployHookUrl : undefined,
      ),
    } as unknown as ConfigService;

    return new AdminSettingsService({} as PrismaService, configService);
  }

  beforeEach(() => {
    fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    global.fetch = fetchMock;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('triggers the configured hook and returns only a safe response', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
    } as Response);
    const service = createService(`  ${DEPLOY_HOOK_URL}  `);

    const result = await service.triggerCloudflarePagesDeploy();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = fetchMock.mock.calls[0];
    expect(requestUrl).toBe(DEPLOY_HOOK_URL);
    expect(requestInit?.method).toBe('POST');
    expect(requestInit?.headers).toEqual({
      Accept: 'application/json',
    });
    expect(requestInit?.redirect).toBe('error');
    expect(requestInit?.signal).toBeInstanceOf(AbortSignal);
    expect(result.accepted).toBe(true);
    expect(result.message).toBe(
      'Đã gửi yêu cầu triển khai tới Cloudflare Pages.',
    );
    expect(Number.isNaN(Date.parse(result.triggeredAt))).toBe(false);
    expect(JSON.stringify(result)).not.toContain(DEPLOY_HOOK_URL);
  });

  it('returns 503 without contacting Cloudflare when the hook is missing', async () => {
    const service = createService(undefined);

    await expect(service.triggerCloudflarePagesDeploy()).rejects.toThrow(
      ServiceUnavailableException,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    'http://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/test-secret',
    'https://127.0.0.1/client/v4/pages/webhooks/deploy_hooks/test-secret',
    'data:application/json,{}',
    'https://api.cloudflare.com/client/v4/accounts/test',
  ])('rejects an invalid or non-Cloudflare hook URL: %s', async (url) => {
    const service = createService(url);

    await expect(service.triggerCloudflarePagesDeploy()).rejects.toThrow(
      ServiceUnavailableException,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps a rejected Cloudflare response to a safe 502 error', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
    } as Response);
    const service = createService(DEPLOY_HOOK_URL);

    let caughtError: unknown;

    try {
      await service.triggerCloudflarePagesDeploy();
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(BadGatewayException);
    expect((caughtError as Error).message).toContain('403');
    expect((caughtError as Error).message).not.toContain(DEPLOY_HOOK_URL);
  });

  it('maps network failures to a safe 502 error', async () => {
    fetchMock.mockRejectedValue(
      new Error(`request to ${DEPLOY_HOOK_URL} failed`),
    );
    const service = createService(DEPLOY_HOOK_URL);

    let caughtError: unknown;

    try {
      await service.triggerCloudflarePagesDeploy();
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(BadGatewayException);
    expect((caughtError as Error).message).not.toContain(DEPLOY_HOOK_URL);
  });

  it('maps an aborted request to a 504 timeout error', async () => {
    const timeoutError = new Error('request timed out');
    timeoutError.name = 'TimeoutError';
    fetchMock.mockRejectedValue(timeoutError);
    const service = createService(DEPLOY_HOOK_URL);

    await expect(service.triggerCloudflarePagesDeploy()).rejects.toThrow(
      GatewayTimeoutException,
    );
  });
});
