import { ApiProperty } from '@nestjs/swagger';

export class CloudflarePagesDeployResponseDto {
  @ApiProperty({ example: true })
  accepted: boolean;

  @ApiProperty({
    example: 'Đã gửi yêu cầu triển khai tới Cloudflare Pages.',
  })
  message: string;

  @ApiProperty({
    example: '2026-08-01T10:30:00.000Z',
    format: 'date-time',
  })
  triggeredAt: string;
}
