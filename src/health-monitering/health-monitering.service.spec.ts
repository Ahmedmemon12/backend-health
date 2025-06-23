import { Test, TestingModule } from '@nestjs/testing';
import { HealthMoniteringService } from './health-monitering.service';

describe('HealthMoniteringService', () => {
  let service: HealthMoniteringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthMoniteringService],
    }).compile();

    service = module.get<HealthMoniteringService>(HealthMoniteringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
