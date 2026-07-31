import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'node:crypto';

import { User, UserStatus } from '../../generated/prisma/client';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { type SelfProfileUpdate, UsersService } from '../users/users.service';
import { AuthResponseDto, TokenPairDto } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTokenTtlSeconds: number;
  private readonly refreshTokenTtlSeconds: number;
  private readonly passwordResetTtlMinutes: number;
  private readonly exposePasswordResetToken: boolean;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret =
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');

    this.refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    this.accessTokenTtlSeconds = this.getPositiveIntegerConfig(
      'JWT_ACCESS_TTL_SECONDS',
      900,
    );

    this.refreshTokenTtlSeconds = this.getPositiveIntegerConfig(
      'JWT_REFRESH_TTL_SECONDS',
      604800,
    );

    this.passwordResetTtlMinutes = this.getPositiveIntegerConfig(
      'PASSWORD_RESET_TTL_MINUTES',
      30,
    );

    this.exposePasswordResetToken = this.getPasswordResetTokenExposureConfig();
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findAuthByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const user = await this.usersService.createForRegistration(
      registerDto,
      passwordHash,
    );

    const tokens = await this.issueAndStoreTokens(user);

    return {
      user: this.usersService.toResponse(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findAuthByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    this.ensureUserCanAuthenticate(user);

    await this.usersService.updateLastLogin(user.id);

    const updatedUser = await this.usersService.findAuthById(user.id);

    if (!updatedUser) {
      throw new UnauthorizedException('Tài khoản không còn tồn tại.');
    }

    const tokens = await this.issueAndStoreTokens(updatedUser);

    return {
      user: this.usersService.toResponse(updatedUser),
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<TokenPairDto> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn.',
      );
    }

    const user = await this.usersService.findAuthById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Phiên đăng nhập không còn hợp lệ.');
    }

    this.ensureUserCanAuthenticate(user);

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Refresh token không hợp lệ.');
    }

    return this.issueAndStoreTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.clearRefreshTokenHash(userId);
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findAuthById(userId);

    if (!user) {
      throw new UnauthorizedException('Tài khoản không còn tồn tại.');
    }

    this.ensureUserCanAuthenticate(user);

    return this.usersService.toResponse(user);
  }

  async updateCurrentUser(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findAuthById(userId);

    if (!user) {
      throw new UnauthorizedException('Tài khoản không còn tồn tại.');
    }

    this.ensureUserCanAuthenticate(user);

    const normalizedEmail =
      updateProfileDto.email === undefined
        ? undefined
        : this.normalizeEmail(updateProfileDto.email);
    const emailChanged =
      normalizedEmail !== undefined &&
      normalizedEmail !== this.normalizeEmail(user.email);

    if (emailChanged) {
      if (!updateProfileDto.currentPassword) {
        throw new BadRequestException(
          'Mật khẩu hiện tại là bắt buộc khi thay đổi email.',
        );
      }

      await this.ensureCurrentPasswordMatches(
        user,
        updateProfileDto.currentPassword,
      );
    }

    const profileUpdate: SelfProfileUpdate = {};

    if (normalizedEmail !== undefined) {
      profileUpdate.email = normalizedEmail;
    }

    if (updateProfileDto.firstName !== undefined) {
      profileUpdate.firstName = updateProfileDto.firstName;
    }

    if (updateProfileDto.lastName !== undefined) {
      profileUpdate.lastName = updateProfileDto.lastName;
    }

    return this.usersService.updateOwnProfile(
      userId,
      profileUpdate,
      emailChanged,
    );
  }

  async requestPasswordReset(
    email: string,
  ): Promise<{ message: string; resetToken?: string }> {
    const message =
      'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được tạo.';

    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashPasswordResetToken(resetToken);
    const expiresAt = new Date(
      Date.now() + this.passwordResetTtlMinutes * 60 * 1000,
    );

    const tokenCreated = await this.usersService.createPasswordResetToken(
      email,
      tokenHash,
      expiresAt,
    );

    return this.exposePasswordResetToken && tokenCreated
      ? { message, resetToken }
      : { message };
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const tokenHash = this.hashPasswordResetToken(token);
    const passwordHash = await bcrypt.hash(password, 12);
    const tokenConsumed = await this.usersService.consumePasswordResetToken(
      tokenHash,
      passwordHash,
    );

    if (!tokenConsumed) {
      throw new UnauthorizedException(
        'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
      );
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findAuthById(userId);

    if (!user) {
      throw new UnauthorizedException('Tài khoản không còn tồn tại.');
    }

    this.ensureUserCanAuthenticate(user);

    await this.ensureCurrentPasswordMatches(
      user,
      changePasswordDto.currentPassword,
    );

    if (changePasswordDto.newPassword === changePasswordDto.currentPassword) {
      throw new BadRequestException(
        'Mật khẩu mới phải khác mật khẩu hiện tại.',
      );
    }

    const passwordHash = await bcrypt.hash(changePasswordDto.newPassword, 12);
    const passwordChanged =
      await this.usersService.updatePasswordAndRevokeSessions(
        userId,
        passwordHash,
      );

    if (!passwordChanged) {
      throw new UnauthorizedException('Tài khoản không còn tồn tại.');
    }
  }

  private async issueAndStoreTokens(user: User): Promise<TokenPairDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.accessSecret,
        expiresIn: this.accessTokenTtlSeconds,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshTokenTtlSeconds,
      }),
    ]);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: this.accessTokenTtlSeconds,
      refreshTokenExpiresIn: this.refreshTokenTtlSeconds,
    };
  }

  private ensureUserCanAuthenticate(user: User): void {
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Tài khoản đã bị đình chỉ.');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Tài khoản chưa hoạt động.');
    }
  }

  private getPositiveIntegerConfig(key: string, defaultValue: number): number {
    const rawValue = this.configService.get<string>(key);

    if (!rawValue) {
      return defaultValue;
    }

    const parsedValue = Number.parseInt(rawValue, 10);

    return Number.isInteger(parsedValue) && parsedValue > 0
      ? parsedValue
      : defaultValue;
  }

  private hashPasswordResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async ensureCurrentPasswordMatches(
    user: User,
    currentPassword: string,
  ): Promise<void> {
    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác.');
    }
  }

  private getPasswordResetTokenExposureConfig(): boolean {
    const rawValue = String(
      this.configService.get<string>('PASSWORD_RESET_EXPOSE_TOKEN', 'false') ??
        'false',
    )
      .trim()
      .toLowerCase();

    if (rawValue !== 'true' && rawValue !== 'false') {
      throw new Error(
        'PASSWORD_RESET_EXPOSE_TOKEN phải có giá trị true hoặc false.',
      );
    }

    if (rawValue === 'false') {
      return false;
    }

    const nodeEnvironment = String(
      this.configService.get<string>('NODE_ENV', '') ?? '',
    )
      .trim()
      .toLowerCase();

    if (nodeEnvironment !== 'development' && nodeEnvironment !== 'test') {
      throw new Error(
        'PASSWORD_RESET_EXPOSE_TOKEN chỉ được bật trong môi trường development hoặc test.',
      );
    }

    return true;
  }
}
