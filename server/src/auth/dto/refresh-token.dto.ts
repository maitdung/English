import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token nhận được sau khi đăng nhập hoặc đăng ký.',
  })
  @IsString()
  @IsJWT()
  refreshToken: string;
}
