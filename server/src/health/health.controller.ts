import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';

import { HealthResponse, HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Kiểm tra trạng thái API và các dịch vụ phụ thuộc',
  })
  @ApiOkResponse({
    description: 'API, PostgreSQL và Redis đang hoạt động bình thường.',
  })
  @ApiServiceUnavailableResponse({
    description: 'PostgreSQL hoặc Redis đang không hoạt động.',
  })
  check(): Promise<HealthResponse> {
    return this.healthService.check();
  }
}
