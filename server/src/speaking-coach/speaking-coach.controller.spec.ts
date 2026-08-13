import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ThrottlerGuard } from '@nestjs/throttler';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SpeakingCoachController } from './speaking-coach.controller';
import { SpeakingCoachService } from './speaking-coach.service';

describe('SpeakingCoachController', () => {
  const speakingCoachService = {
    getFeedback: jest.fn(),
    getChatReply: jest.fn(),
  };
  const controller = new SpeakingCoachController(
    speakingCoachService as unknown as SpeakingCoachService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('protects every route with JWT authentication and throttling', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      SpeakingCoachController,
    ) as unknown[];

    expect(guards).toEqual(
      expect.arrayContaining([JwtAuthGuard, ThrottlerGuard]),
    );
  });

  it.each([
    ['getFeedback', 8],
    ['getChatReply', 12],
  ] as const)(
    'sets a dedicated one-minute throttle for %s',
    (method, limit) => {
      // Metadata is attached to the original method, not a bound copy.
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const handler = controller[method];

      expect(Reflect.getMetadata('THROTTLER:LIMITdefault', handler)).toBe(
        limit,
      );
      expect(Reflect.getMetadata('THROTTLER:TTLdefault', handler)).toBe(60_000);
    },
  );

  it('delegates feedback without changing the learner input', async () => {
    speakingCoachService.getFeedback.mockResolvedValue({ score: 80 });

    await controller.getFeedback({
      topic: 'Travel',
      response: 'I would like to visit Japan next year.',
    });

    expect(speakingCoachService.getFeedback).toHaveBeenCalledWith(
      'Travel',
      'I would like to visit Japan next year.',
    );
  });

  it('uses safe defaults for optional chat fields', async () => {
    speakingCoachService.getChatReply.mockResolvedValue({ reply: 'Hello!' });

    await controller.getChatReply({
      topic: 'Introductions',
      input: 'Hello!',
    });

    expect(speakingCoachService.getChatReply).toHaveBeenCalledWith(
      'Introductions',
      'Hello!',
      [],
      'coach',
    );
  });
});
