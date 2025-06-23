import { Module } from '@nestjs/common';
import { DiseaseDataService } from './disease-data.service';
import { DiseaseDataController } from './disease-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseaseData } from './entities/disease-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiseaseData])],
  controllers: [DiseaseDataController],
  providers: [DiseaseDataService],
  exports: [DiseaseDataService],
})
export class DiseaseDataModule {}
