import { Module } from '@nestjs/common';
import { HealthMoniteringService } from './health-monitering.service';
import { HealthMoniteringController } from './health-monitering.controller';

@Module({
  controllers: [HealthMoniteringController],
  providers: [HealthMoniteringService],
})
export class HealthMoniteringModule {}
