import * as bcrypt from 'bcrypt';

import { User, UserRole, UserStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

type PrismaUserMock = {
  findUnique: jest.Mock;
  update: jest.Mock;
  updateMany: jest.Mock;
};

const now = new Date('2026-07-31T00:00:00.000Z');

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: '2c440960-b84d-4d25-b07f-a360f49fc631',
    email: 'student@example.com',
    passwordHash: 'password-hash',
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

describe('UsersService security-sensitive persistence', () => {
  let service: UsersService;
  let userDelegate: PrismaUserMock;
  const bcryptHashMock = bcrypt.hash as unknown as jest.Mock;

  beforeEach(() => {
    userDelegate = {
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    };
    service = new UsersService({
      user: userDelegate,
    } as unknown as PrismaService);
    jest.clearAllMocks();
  });

  it('creates a reset token with one normalized, active-account update', async () => {
    const expiresAt = new Date('2026-07-31T00:30:00.000Z');
    userDelegate.updateMany.mockResolvedValue({ count: 1 });

    const created = await service.createPasswordResetToken(
      ' Student@Example.com ',
      'reset-token-hash',
      expiresAt,
    );

    expect(created).toBe(true);
    expect(userDelegate.updateMany).toHaveBeenCalledWith({
      where: {
        email: 'student@example.com',
        status: UserStatus.ACTIVE,
      },
      data: {
        passwordResetTokenHash: 'reset-token-hash',
        passwordResetExpiresAt: expiresAt,
      },
    });
  });

  it('atomically consumes a live reset token and revokes all reusable credentials', async () => {
    userDelegate.updateMany.mockResolvedValue({ count: 1 });

    const consumed = await service.consumePasswordResetToken(
      'reset-token-hash',
      'new-password-hash',
    );

    expect(consumed).toBe(true);
    expect(userDelegate.updateMany).toHaveBeenCalledWith({
      where: {
        passwordResetTokenHash: 'reset-token-hash',
        // Jest's asymmetric matcher is intentionally used for a moving timestamp.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        passwordResetExpiresAt: { gt: expect.any(Date) },
        status: UserStatus.ACTIVE,
      },
      data: {
        passwordHash: 'new-password-hash',
        refreshTokenHash: null,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
  });

  it('reports an expired or already-consumed reset token without a second update', async () => {
    userDelegate.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.consumePasswordResetToken(
        'expired-token-hash',
        'new-password-hash',
      ),
    ).resolves.toBe(false);
    expect(userDelegate.updateMany).toHaveBeenCalledTimes(1);
  });

  it('changes a password while clearing refresh and password-reset credentials', async () => {
    userDelegate.updateMany.mockResolvedValue({ count: 1 });

    await expect(
      service.updatePasswordAndRevokeSessions(
        '2c440960-b84d-4d25-b07f-a360f49fc631',
        'new-password-hash',
      ),
    ).resolves.toBe(true);
    expect(userDelegate.updateMany).toHaveBeenCalledWith({
      where: {
        id: '2c440960-b84d-4d25-b07f-a360f49fc631',
      },
      data: {
        passwordHash: 'new-password-hash',
        refreshTokenHash: null,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
  });

  it('revokes sessions and reset tokens when an admin assigns a new password', async () => {
    const user = createUser();
    userDelegate.findUnique.mockResolvedValue(user);
    userDelegate.update.mockResolvedValue({
      ...user,
      passwordHash: 'admin-assigned-password-hash',
      refreshTokenHash: null,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    });
    bcryptHashMock.mockResolvedValue('admin-assigned-password-hash');

    await service.update(user.id, {
      password: 'AdminAssignedPassword123!',
    });

    expect(userDelegate.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        passwordHash: 'admin-assigned-password-hash',
        refreshTokenHash: null,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
  });

  it('updates only self-service profile fields and supports clearing a last name', async () => {
    const updatedUser = createUser({
      email: 'new@example.com',
      firstName: 'Lan',
      lastName: null,
      emailVerified: false,
    });
    userDelegate.update.mockResolvedValue(updatedUser);

    const response = await service.updateOwnProfile(
      updatedUser.id,
      {
        email: ' NEW@example.com ',
        firstName: ' Lan ',
        lastName: null,
      },
      true,
    );

    expect(userDelegate.update).toHaveBeenCalledWith({
      where: { id: updatedUser.id },
      data: {
        email: 'new@example.com',
        emailVerified: false,
        firstName: 'Lan',
        lastName: null,
      },
    });
    expect(response).toMatchObject({
      email: 'new@example.com',
      firstName: 'Lan',
      lastName: null,
      emailVerified: false,
    });
  });

  it('normalizes blank profile names to null', async () => {
    const updatedUser = createUser({
      firstName: null,
      lastName: null,
    });
    userDelegate.update.mockResolvedValue(updatedUser);

    await service.updateOwnProfile(
      updatedUser.id,
      {
        firstName: '   ',
        lastName: '',
      },
      false,
    );

    expect(userDelegate.update).toHaveBeenCalledWith({
      where: { id: updatedUser.id },
      data: {
        firstName: null,
        lastName: null,
      },
    });
  });
});
