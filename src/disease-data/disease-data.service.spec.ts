import { Test, TestingModule } from '@nestjs/testing';
import { DiseaseDataService } from './disease-data.service';

describe('DiseaseDataService', () => {
  let service: DiseaseDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiseaseDataService],
    }).compile();

    service = module.get<DiseaseDataService>(DiseaseDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
