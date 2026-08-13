import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from '../../users/dto/user-response.dto';

export class TokenPairDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({
    example: 900,
    description: 'Thời gian sống của access token, tính bằng giây.',
  })
  accessTokenExpiresIn: number;

  @ApiProperty({
    example: 604800,
    description: 'Thời gian sống của refresh token, tính bằng giây.',
  })
  refreshTokenExpiresIn: number;
}

export class AuthResponseDto extends TokenPairDto {
  @ApiProperty({
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
