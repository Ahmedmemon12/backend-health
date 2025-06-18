import { Controller, Get } from '@nestjs/common';
import { HealthMoniteringService } from './health-monitering.service';

@Controller('health-monitering')
export class HealthMoniteringController {
  constructor(
    private readonly healthMoniteringService: HealthMoniteringService,
  ) {}

  @Get()
  checkStatus() {
    return { status: 200, message: 'Health Monitoring is Running ✅' };
  }
}
