import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import {
  GetDiseaseDataDto,
  PaginatedDiseaseDataDto,
} from './dto/disease-data.dto';
import { DiseaseDataService } from './disease-data.service';

@Controller('disease-data')
export class DiseaseDataController {
  constructor(private readonly diseaseDataService: DiseaseDataService) {}

  @Get()
  async getDiseaseData(
    @Query(new ValidationPipe({ transform: true })) filters: GetDiseaseDataDto,
  ): Promise<PaginatedDiseaseDataDto> {
    return this.diseaseDataService.getDiseaseData(filters);
  }

  @Get('countries')
  async getCountries() {
    return this.diseaseDataService.getCountries();
  }

  @Get('indicators')
  async getIndicators(@Query('country') country?: string) {
    return this.diseaseDataService.getIndicators(country);
  }

  @Get('stats')
  async getStats() {
    return this.diseaseDataService.getStats();
  }
}
