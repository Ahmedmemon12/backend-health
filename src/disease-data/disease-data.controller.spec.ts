import { Test, TestingModule } from '@nestjs/testing';
import { DiseaseDataController } from './disease-data.controller';
import { DiseaseDataService } from './disease-data.service';

describe('DiseaseDataController', () => {
  let controller: DiseaseDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiseaseDataController],
      providers: [DiseaseDataService],
    }).compile();

    controller = module.get<DiseaseDataController>(DiseaseDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
