import { ApiProperty } from '@nestjs/swagger';

export class AdminWebsiteSettingsDto {
  @ApiProperty()
  frontendUrl: string;

  @ApiProperty()
  apiUrl: string;

  @ApiProperty()
  buildCommand: string;

  @ApiProperty()
  backendCommand: string;
}
