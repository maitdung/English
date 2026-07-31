import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import {
  Prisma,
  User,
  UserRole,
  UserStatus,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

export type SelfProfileUpdate = {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const normalizedEmail = this.normalizeEmail(createUserDto.email);

    await this.ensureEmailAvailable(normalizedEmail);

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName: this.normalizeOptionalText(createUserDto.firstName),
          lastName: this.normalizeOptionalText(createUserDto.lastName),
          avatarUrl: createUserDto.avatarUrl,
          role: createUserDto.role ?? UserRole.STUDENT,
        },
      });

      return this.toResponse(user);
    } catch (error) {
      this.handleUniqueEmailError(error);
      throw error;
    }
  }

  async createForRegistration(
    registerDto: RegisterDto,
    passwordHash: string,
  ): Promise<User> {
    const normalizedEmail = this.normalizeEmail(registerDto.email);

    await this.ensureEmailAvailable(normalizedEmail);

    try {
      return await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName: this.normalizeOptionalText(registerDto.firstName),
          lastName: this.normalizeOptionalText(registerDto.lastName),
          role: UserRole.STUDENT,
          status: UserStatus.ACTIVE,
        },
      });
    } catch (error) {
      this.handleUniqueEmailError(error);
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => this.toResponse(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.findUserByIdOrThrow(id);

    return this.toResponse(user);
  }

  async findAuthByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: this.normalizeEmail(email),
      },
    });
  }

  async findAuthById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createPasswordResetToken(
    email: string,
    passwordResetTokenHash: string,
    passwordResetExpiresAt: Date,
  ): Promise<boolean> {
    const result = await this.prisma.user.updateMany({
      where: {
        email: this.normalizeEmail(email),
        status: UserStatus.ACTIVE,
      },
      data: { passwordResetTokenHash, passwordResetExpiresAt },
    });

    return result.count === 1;
  }

  async consumePasswordResetToken(
    passwordResetTokenHash: string,
    passwordHash: string,
  ): Promise<boolean> {
    const result = await this.prisma.user.updateMany({
      where: {
        passwordResetTokenHash,
        passwordResetExpiresAt: { gt: new Date() },
        status: UserStatus.ACTIVE,
      },
      data: {
        passwordHash,
        refreshTokenHash: null,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });

    return result.count === 1;
  }

  async updatePasswordAndRevokeSessions(
    id: string,
    passwordHash: string,
  ): Promise<boolean> {
    const result = await this.prisma.user.updateMany({
      where: { id },
      data: {
        passwordHash,
        refreshTokenHash: null,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });

    return result.count === 1;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async setRefreshTokenHash(
    id: string,
    refreshTokenHash: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshTokenHash,
      },
    });
  }

  async clearRefreshTokenHash(id: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id,
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.findUserByIdOrThrow(id);

    const data: Prisma.UserUpdateInput = {};

    if (updateUserDto.email !== undefined) {
      data.email = this.normalizeEmail(updateUserDto.email);
    }

    if (updateUserDto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(updateUserDto.password, 12);
      data.refreshTokenHash = null;
      data.passwordResetTokenHash = null;
      data.passwordResetExpiresAt = null;
    }

    if (updateUserDto.firstName !== undefined) {
      data.firstName = this.normalizeOptionalText(updateUserDto.firstName);
    }

    if (updateUserDto.lastName !== undefined) {
      data.lastName = this.normalizeOptionalText(updateUserDto.lastName);
    }

    if (updateUserDto.avatarUrl !== undefined) {
      data.avatarUrl = updateUserDto.avatarUrl;
    }

    if (updateUserDto.role !== undefined) {
      data.role = updateUserDto.role;
    }

    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data,
      });

      return this.toResponse(user);
    } catch (error) {
      this.handleUniqueEmailError(error);
      throw error;
    }
  }

  async updateOwnProfile(
    id: string,
    profile: SelfProfileUpdate,
    emailChanged: boolean,
  ): Promise<UserResponseDto> {
    const data: Prisma.UserUpdateInput = {};

    if (profile.email !== undefined) {
      data.email = this.normalizeEmail(profile.email);
    }

    if (emailChanged) {
      data.emailVerified = false;
    }

    if (profile.firstName !== undefined) {
      data.firstName = this.normalizeNullableText(profile.firstName);
    }

    if (profile.lastName !== undefined) {
      data.lastName = this.normalizeNullableText(profile.lastName);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      return this.toResponse(user);
    } catch (error) {
      this.handleUniqueEmailError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findUserByIdOrThrow(id);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  toResponse(user: User): UserResponseDto {
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

  private async findUserByIdOrThrow(id: string): Promise<User> {
    const user = await this.findAuthById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }

    return user;
  }

  private async ensureEmailAvailable(email: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng.');
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeOptionalText(value: string | undefined): string | undefined {
    const normalizedValue = value?.trim();

    return normalizedValue || undefined;
  }

  private normalizeNullableText(value: string | null): string | null {
    return value?.trim() || null;
  }

  private handleUniqueEmailError(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Email đã được sử dụng.');
    }
  }
}
