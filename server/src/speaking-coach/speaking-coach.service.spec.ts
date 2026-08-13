import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SpeakingCoachService } from './speaking-coach.service';

function createConfig(values: Record<string, unknown> = {}): ConfigService {
  return {
    get: jest.fn((key: string, defaultValue?: unknown) =>
      values[key] === undefined ? defaultValue : values[key],
    ),
  } as unknown as ConfigService;
}

function requestUrl(input: URL | RequestInfo): string {
  if (typeof input === 'string') {
    return input;
  }

  return input instanceof URL ? input.href : input.url;
}

function requestBody(init: RequestInit | undefined): string {
  return typeof init?.body === 'string' ? init.body : '';
}

describe('SpeakingCoachService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('keeps speaking practice useful when no provider is configured', async () => {
    const service = new SpeakingCoachService(createConfig());

    await expect(
      service.getFeedback(
        'Daily life',
        'I wake up early because I like quiet mornings.',
      ),
    ).resolves.toMatchObject({ source: 'fallback' });
    await expect(
      service.getChatReply('Daily life', 'I wake up early.', [], 'coach'),
    ).resolves.toMatchObject({ source: 'fallback', mode: 'coach' });
  });

  it('uses the configured stable Gemini speaking model', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      score: 86,
                      feedback: 'Phản xạ tốt.',
                      improvement: 'Thêm một ví dụ cụ thể.',
                    }),
                  },
                ],
              },
            },
          ],
        }),
        { status: 200 },
      ),
    );
    const service = new SpeakingCoachService(
      createConfig({
        AI_PROVIDER: 'gemini',
        GEMINI_API_KEY: 'test-key',
        GEMINI_SPEAKING_MODEL: 'gemini-3.5-flash',
      }),
    );

    await expect(
      service.getFeedback('Travel', 'I want to visit Kyoto.'),
    ).resolves.toMatchObject({ source: 'gemini', score: 86 });

    const requestedUrl = requestUrl(
      (global.fetch as jest.MockedFunction<typeof fetch>).mock.calls[0][0],
    );
    expect(requestedUrl).toContain('/models/gemini-3.5-flash:generateContent');
  });

  it('fails over from the preferred provider to another configured key', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    score: 82,
                    feedback: 'Câu trả lời rõ ràng.',
                    improvement: 'Thêm một câu kết.',
                  }),
                },
              },
            ],
          }),
          { status: 200 },
        ),
      );
    const service = new SpeakingCoachService(
      createConfig({
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: 'openai-test-key',
        XAI_API_KEY: 'xai-test-key',
        XAI_SPEAKING_MODEL: 'grok-4.3',
      }),
    );

    await expect(
      service.getFeedback('Work', 'I enjoy working with my team.'),
    ).resolves.toMatchObject({ source: 'xai', score: 82 });

    const requests = (global.fetch as jest.MockedFunction<typeof fetch>).mock
      .calls;
    expect(requestUrl(requests[0][0])).toContain('api.openai.com');
    expect(requestUrl(requests[1][0])).toContain('api.x.ai');
    expect(requestBody(requests[1][1])).toContain('grok-4.3');
  });

  it('aborts a slow provider request and falls back safely', async () => {
    jest.useFakeTimers();
    const logger = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    global.fetch = jest.fn((_url, init) => {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        signal?.addEventListener('abort', () => {
          const error = new Error('upstream details must stay private');
          error.name = 'AbortError';
          reject(error);
        });
      });
    });
    const service = new SpeakingCoachService(
      createConfig({
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: 'test-key',
        AI_REQUEST_TIMEOUT_MS: 25,
      }),
    );
    const result = service.getFeedback(
      'Private learner topic',
      'Private learner transcript',
    );

    await jest.advanceTimersByTimeAsync(25);
    await expect(result).resolves.toMatchObject({ source: 'fallback' });

    const logs = JSON.stringify(logger.mock.calls);
    expect(logs).toContain('request timed out');
    expect(logs).not.toContain('Private learner');
    expect(logs).not.toContain('upstream details');
  });

  it('does not log an upstream response body or learner content', async () => {
    const logger = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        new Response('sensitive upstream response', { status: 429 }),
      );
    const service = new SpeakingCoachService(
      createConfig({
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: 'test-key',
      }),
    );

    await expect(
      service.getChatReply(
        'Private topic',
        'Private learner message',
        [],
        'coach',
      ),
    ).resolves.toMatchObject({ source: 'fallback' });

    const logs = JSON.stringify(logger.mock.calls);
    expect(logs).toContain('local fallback');
    expect(logs).toContain('openai');
    expect(logs).not.toContain('sensitive upstream response');
    expect(logs).not.toContain('Private learner message');
  });
});
