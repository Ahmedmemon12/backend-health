import { Test, TestingModule } from '@nestjs/testing';
import { HealthMoniteringController } from './health-monitering.controller';
import { HealthMoniteringService } from './health-monitering.service';

describe('HealthMoniteringController', () => {
  let controller: HealthMoniteringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthMoniteringController],
      providers: [HealthMoniteringService],
    }).compile();

    controller = module.get<HealthMoniteringController>(HealthMoniteringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
