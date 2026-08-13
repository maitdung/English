import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponseDto, TokenPairDto } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@ApiTags('Authentication')
@ApiTooManyRequestsResponse({
  description: 'Đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
})
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Đăng ký tài khoản học viên',
  })
  @ApiCreatedResponse({
    type: AuthResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email đã được sử dụng.',
  })
  register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
  })
  @ApiOkResponse({
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đổi refresh token lấy token mới',
  })
  @ApiOkResponse({
    type: TokenPairDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token không hợp lệ hoặc đã hết hạn.',
  })
  refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto> {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 15 * 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Yêu cầu đặt lại mật khẩu' })
  requestPasswordReset(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string; resetToken?: string }> {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Đặt mật khẩu mới bằng reset token' })
  @ApiNoContentResponse({ description: 'Mật khẩu đã được đặt lại.' })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @Post('change-password')
  @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu của tài khoản đang đăng nhập' })
  @ApiNoContentResponse({ description: 'Mật khẩu đã được thay đổi.' })
  @ApiUnauthorizedResponse({
    description: 'Access token hoặc mật khẩu hiện tại không hợp lệ.',
  })
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(user.sub, changePasswordDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đăng xuất',
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không hợp lệ.',
  })
  logout(@CurrentUser() user: JwtPayload): Promise<void> {
    return this.authService.logout(user.sub);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin tài khoản đang đăng nhập',
  })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không hợp lệ.',
  })
  me(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    return this.authService.getCurrentUser(user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật hồ sơ tài khoản đang đăng nhập' })
  @ApiOkResponse({ type: UserResponseDto })
  updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.authService.updateCurrentUser(user.sub, updateProfileDto);
  }
}
