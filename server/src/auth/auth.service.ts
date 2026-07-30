import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserStatus } from '../../generated/prisma/client';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersService } from '../users/users.service';
import { AuthResponseDto, TokenPairDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTokenTtlSeconds: number;
  private readonly refreshTokenTtlSeconds: number;

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
}
