import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';

import { User, UserRole, UserStatus } from '../../generated/prisma/client';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

type UsersServiceMock = {
  createPasswordResetToken: jest.Mock<any, any>;
  consumePasswordResetToken: jest.Mock<any, any>;
  findAuthById: jest.Mock<any, any>;
  updateOwnProfile: jest.Mock<any, any>;
  updatePasswordAndRevokeSessions: jest.Mock<any, any>;
};

const now = new Date('2026-07-31T00:00:00.000Z');

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: '2c440960-b84d-4d25-b07f-a360f49fc631',
    email: 'student@example.com',
    passwordHash: 'current-password-hash',
    refreshTokenHash: 'refresh-token-hash',
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
    firstName: 'Minh',
    lastName: 'Nguyen',
    avatarUrl: null,
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function toResponse(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

describe('AuthService security-sensitive flows', () => {
  let usersService: UsersServiceMock;
  let jwtService: JwtService;
  const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;
  const bcryptHashMock = bcryptMock.hash as unknown as jest.Mock<any, any>;
  const bcryptCompareMock = bcryptMock.compare as unknown as jest.Mock<
    any,
    any
  >;

  function createService(
    configOverrides: Record<string, string> = {},
  ): AuthService {
    const config: Record<string, string> = {
      JWT_ACCESS_SECRET: 'test-access-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      NODE_ENV: 'test',
      PASSWORD_RESET_EXPOSE_TOKEN: 'false',
      ...configOverrides,
    };
    const configService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        return config[key] ?? defaultValue;
      }),
      getOrThrow: jest.fn((key: string) => {
        const value = config[key];

        if (value === undefined) {
          throw new Error(`Missing config: ${key}`);
        }

        return value;
      }),
    } as unknown as ConfigService;

    return new AuthService(
      usersService as unknown as UsersService,
      jwtService,
      configService,
    );
  }

  beforeEach(() => {
    usersService = {
      createPasswordResetToken: jest.fn(),
      consumePasswordResetToken: jest.fn(),
      findAuthById: jest.fn(),
      updateOwnProfile: jest.fn(),
      updatePasswordAndRevokeSessions: jest.fn(),
    };
    jwtService = {} as JwtService;
    jest.clearAllMocks();
  });

  it('refuses to expose reset tokens outside development and test', () => {
    expect(() =>
      createService({
        NODE_ENV: 'production',
        PASSWORD_RESET_EXPOSE_TOKEN: 'true',
      }),
    ).toThrow(
      'PASSWORD_RESET_EXPOSE_TOKEN chỉ được bật trong môi trường development hoặc test.',
    );
  });

  it('returns a reset token only for an existing active account in local/test mode', async () => {
    usersService.createPasswordResetToken.mockResolvedValue(true);
    const service = createService({
      NODE_ENV: 'development',
      PASSWORD_RESET_EXPOSE_TOKEN: 'true',
    });

    const response = await service.requestPasswordReset(
      ' Student@Example.com ',
    );

    expect(response.resetToken).toMatch(/^[a-f0-9]{64}$/);
    expect(usersService.createPasswordResetToken).toHaveBeenCalledWith(
      ' Student@Example.com ',
      createHash('sha256').update(response.resetToken!).digest('hex'),
      expect.any(Date),
    );
  });

  it('does not reveal a reset token when no account was updated', async () => {
    usersService.createPasswordResetToken.mockResolvedValue(false);
    const service = createService({
      NODE_ENV: 'test',
      PASSWORD_RESET_EXPOSE_TOKEN: 'true',
    });

    const response = await service.requestPasswordReset('missing@example.com');

    expect(response).toEqual({
      message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được tạo.',
    });
  });

  it('atomically consumes a valid reset token and stores only a password hash', async () => {
    bcryptHashMock.mockResolvedValue('new-password-hash');
    usersService.consumePasswordResetToken.mockResolvedValue(true);
    const service = createService();

    await service.resetPassword('reset-token-value', 'NewPassword123!');

    expect(usersService.consumePasswordResetToken).toHaveBeenCalledWith(
      createHash('sha256').update('reset-token-value').digest('hex'),
      'new-password-hash',
    );
  });

  it('rejects an expired or already-consumed reset token', async () => {
    bcryptHashMock.mockResolvedValue('new-password-hash');
    usersService.consumePasswordResetToken.mockResolvedValue(false);
    const service = createService();

    await expect(
      service.resetPassword('used-token-value', 'NewPassword123!'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('changes a password only after verifying the current password and revokes sessions', async () => {
    const user = createUser();
    usersService.findAuthById.mockResolvedValue(user);
    usersService.updatePasswordAndRevokeSessions.mockResolvedValue(true);
    bcryptCompareMock.mockResolvedValue(true);
    bcryptHashMock.mockResolvedValue('new-password-hash');
    const service = createService();

    await service.changePassword(user.id, {
      currentPassword: 'CurrentPassword123!',
      newPassword: 'NewPassword123!',
    });

    expect(bcryptMock.compare).toHaveBeenCalledWith(
      'CurrentPassword123!',
      user.passwordHash,
    );
    expect(usersService.updatePasswordAndRevokeSessions).toHaveBeenCalledWith(
      user.id,
      'new-password-hash',
    );
  });

  it('does not change a password when the current password is wrong', async () => {
    const user = createUser();
    usersService.findAuthById.mockResolvedValue(user);
    bcryptCompareMock.mockResolvedValue(false);
    const service = createService();

    await expect(
      service.changePassword(user.id, {
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword123!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(usersService.updatePasswordAndRevokeSessions).not.toHaveBeenCalled();
  });

  it('rejects reusing the current password after verifying it', async () => {
    const user = createUser();
    usersService.findAuthById.mockResolvedValue(user);
    bcryptCompareMock.mockResolvedValue(true);
    const service = createService();

    await expect(
      service.changePassword(user.id, {
        currentPassword: 'CurrentPassword123!',
        newPassword: 'CurrentPassword123!',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(bcryptMock.hash).not.toHaveBeenCalled();
    expect(usersService.updatePasswordAndRevokeSessions).not.toHaveBeenCalled();
  });

  it('requires the current password when the normalized email changes', async () => {
    const user = createUser();
    usersService.findAuthById.mockResolvedValue(user);
    const service = createService();

    await expect(
      service.updateCurrentUser(user.id, {
        email: 'new@example.com',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(usersService.updateOwnProfile).not.toHaveBeenCalled();
  });

  it('marks a changed email unverified after checking the current password', async () => {
    const user = createUser();
    const updatedUser = createUser({
      email: 'new@example.com',
      emailVerified: false,
    });
    usersService.findAuthById.mockResolvedValue(user);
    usersService.updateOwnProfile.mockResolvedValue(toResponse(updatedUser));
    bcryptCompareMock.mockResolvedValue(true);
    const service = createService();

    const response = await service.updateCurrentUser(user.id, {
      email: ' NEW@example.com ',
      currentPassword: 'CurrentPassword123!',
    });

    expect(bcryptMock.compare).toHaveBeenCalledWith(
      'CurrentPassword123!',
      user.passwordHash,
    );
    expect(usersService.updateOwnProfile).toHaveBeenCalledWith(
      user.id,
      { email: 'new@example.com' },
      true,
    );
    expect(response.emailVerified).toBe(false);
  });

  it('does not require a password when the normalized email is unchanged', async () => {
    const user = createUser();
    usersService.findAuthById.mockResolvedValue(user);
    usersService.updateOwnProfile.mockResolvedValue(toResponse(user));
    const service = createService();

    await service.updateCurrentUser(user.id, {
      email: ' STUDENT@example.com ',
    });

    expect(bcryptMock.compare).not.toHaveBeenCalled();
    expect(usersService.updateOwnProfile).toHaveBeenCalledWith(
      user.id,
      { email: 'student@example.com' },
      false,
    );
  });

  it('preserves explicit nulls so profile names can be cleared', async () => {
    const user = createUser();
    const updatedUser = createUser({
      firstName: 'Lan',
      lastName: null,
    });
    usersService.findAuthById.mockResolvedValue(user);
    usersService.updateOwnProfile.mockResolvedValue(toResponse(updatedUser));
    const service = createService();

    await service.updateCurrentUser(user.id, {
      firstName: 'Lan',
      lastName: null,
    });

    expect(usersService.updateOwnProfile).toHaveBeenCalledWith(
      user.id,
      { firstName: 'Lan', lastName: null },
      false,
    );
  });
});
