import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController security metadata', () => {
  const authService = {
    changePassword: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  };
  const controller = new AuthController(authService as unknown as AuthService);

  it('applies the throttler guard to authentication routes', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      AuthController,
    ) as unknown[];

    expect(guards).toContain(ThrottlerGuard);
  });

  it.each([
    ['requestPasswordReset', 3, 15 * 60_000],
    ['resetPassword', 5, 15 * 60_000],
    ['changePassword', 5, 15 * 60_000],
  ] as const)(
    'sets a dedicated throttle for %s',
    (methodName, expectedLimit, expectedTtl) => {
      // Metadata is attached to the original controller method, not a bound copy.
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const method = controller[methodName];

      expect(Reflect.getMetadata('THROTTLER:LIMITdefault', method)).toBe(
        expectedLimit,
      );
      expect(Reflect.getMetadata('THROTTLER:TTLdefault', method)).toBe(
        expectedTtl,
      );
    },
  );

  it('delegates authenticated password changes with the current user id', async () => {
    authService.changePassword.mockResolvedValue(undefined);
    const dto = {
      currentPassword: 'CurrentPassword123!',
      newPassword: 'NewPassword123!',
    };

    await controller.changePassword(
      {
        sub: '2c440960-b84d-4d25-b07f-a360f49fc631',
        email: 'student@example.com',
        role: 'STUDENT',
      },
      dto,
    );

    expect(authService.changePassword).toHaveBeenCalledWith(
      '2c440960-b84d-4d25-b07f-a360f49fc631',
      dto,
    );
  });
});
