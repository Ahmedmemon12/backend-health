import { Injectable, Logger } from '@nestjs/common';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import { DiseaseData } from './entities/disease-data.entity';
import {
  DiseaseDataResponseDto,
  GetDiseaseDataDto,
  PaginatedDiseaseDataDto,
} from './dto/disease-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class DiseaseDataService {
  private readonly logger = new Logger(DiseaseDataService.name);

  private readonly keywords = [
    'disease',
    'HIV',
    'TB',
    'tuberculosis',
    'malaria',
    'measles',
    'diabetes',
    'cancer',
    'infection',
    'communicable',
    'noncommunicable',
    'NCD',
    'mortality',
    'COVID',
    'influenza',
    'pneumonia',
  ];

  private readonly middleEastISOCodes = [
    'ARE',
    'SAU',
    'KWT',
    'QAT',
    'OMN',
    'BHR',
    'IRN',
    'IRQ',
    'JOR',
    'LBN',
    'SYR',
    'YEM',
    'ISR',
    'PSE',
    'EGY',
  ];

  private readonly isoToCountryMap = {
    ARE: 'United Arab Emirates',
    SAU: 'Saudi Arabia',
    KWT: 'Kuwait',
    QAT: 'Qatar',
    OMN: 'Oman',
    BHR: 'Bahrain',
    IRN: 'Iran',
    IRQ: 'Iraq',
    JOR: 'Jordan',
    LBN: 'Lebanon',
    SYR: 'Syria',
    YEM: 'Yemen',
    ISR: 'Israel',
    PSE: 'Palestine',
    EGY: 'Egypt',
  };

  constructor(
    @InjectRepository(DiseaseData)
    private readonly diseaseDataRepository: Repository<DiseaseData>,
  ) {}

  async getDiseaseData(
    filters: GetDiseaseDataDto,
  ): Promise<PaginatedDiseaseDataDto> {
    // Check if we have data in database
    const hasData = await this.checkIfDataExists();

    if (!hasData) {
      this.logger.log('No data found in database, fetching from WHO API...');
      await this.fetchAndSaveData();
    }

    return this.getFilteredData(filters);
  }

  private async checkIfDataExists(): Promise<boolean> {
    const count = await this.diseaseDataRepository.count();
    return count > 0;
  }

  private async getFilteredData(
    filters: GetDiseaseDataDto,
  ): Promise<PaginatedDiseaseDataDto> {
    const queryBuilder =
      this.diseaseDataRepository.createQueryBuilder('disease');

    this.applyFilters(queryBuilder, filters);

    // Apply sorting
    const sortField = this.getSortField(filters.sortBy!);
    queryBuilder.orderBy(
      sortField,
      filters.sortOrder?.toUpperCase() as 'ASC' | 'DESC',
    );

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map(this.mapToResponseDto),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<DiseaseData>,
    filters: GetDiseaseDataDto,
  ) {
    if (filters.country) {
      queryBuilder.andWhere('LOWER(disease.countryName) LIKE LOWER(:country)', {
        country: `%${filters.country}%`,
      });
    }

    if (filters.countryCode) {
      queryBuilder.andWhere('disease.spatialDim = :countryCode', {
        countryCode: filters.countryCode.toUpperCase(),
      });
    }

    if (filters.disease) {
      queryBuilder.andWhere(
        'LOWER(disease.indicatorName) LIKE LOWER(:disease)',
        {
          disease: `%${filters.disease}%`,
        },
      );
    }

    if (filters.indicatorCode) {
      queryBuilder.andWhere('disease.indicatorCode = :indicatorCode', {
        indicatorCode: filters.indicatorCode,
      });
    }

    if (filters.year) {
      queryBuilder.andWhere('disease.timeDim = :year', { year: filters.year });
    }

    if (filters.yearFrom) {
      queryBuilder.andWhere('disease.timeDim >= :yearFrom', {
        yearFrom: filters.yearFrom,
      });
    }

    if (filters.yearTo) {
      queryBuilder.andWhere('disease.timeDim <= :yearTo', {
        yearTo: filters.yearTo,
      });
    }

    // Only show Middle East countries
    queryBuilder.andWhere('disease.spatialDim IN (:...middleEastCodes)', {
      middleEastCodes: this.middleEastISOCodes,
    });
  }

  private getSortField(sortBy: string): string {
    const allowedSortFields = {
      year: 'disease.timeDim',
      country: 'disease.countryName',
      indicator: 'disease.indicatorName',
      value: 'disease.numericValue',
      date: 'disease.date',
    };

    return allowedSortFields[sortBy] || 'disease.timeDim';
  }

  private mapToResponseDto(entity: DiseaseData): DiseaseDataResponseDto {
    return {
      id: entity.id,
      indicatorCode: entity.indicatorCode,
      indicatorName: entity.indicatorName,
      countryCode: entity.spatialDim,
      countryName: entity.countryName,
      year: entity.timeDim,
      value: entity.value,
      numericValue: entity.numericValue,
      low: entity.low,
      high: entity.high,
      date: entity.date,
    };
  }

  private async fetchAndSaveData(): Promise<void> {
    const baseUrl = 'https://ghoapi.azureedge.net/api/';
    const indicatorListUrl = baseUrl + 'Indicator?$format=json';

    try {
      this.logger.log('Fetching indicators from WHO API...');
      const response = await fetch(indicatorListUrl);
      const indicatorJson = await response.json();

      const diseaseIndicators = indicatorJson.value.filter((indicator) => {
        const name = indicator.IndicatorName.toLowerCase();
        return this.keywords.some((keyword) => name.includes(keyword));
      });

      this.logger.log(
        `Found ${diseaseIndicators.length} disease-related indicators`,
      );

      let totalSaved = 0;
      for (let i = 0; i < diseaseIndicators.length; i++) {
        const indicator = diseaseIndicators[i];
        const code = indicator.IndicatorCode;
        const indicatorName = indicator.IndicatorName;

        this.logger.log(
          `Processing ${i + 1}/${diseaseIndicators.length}: ${indicatorName}`,
        );

        const url = `${baseUrl}${code}?$format=json`;
        const dataRes = await fetch(url);
        const dataJson = await dataRes.json();

        if (!dataJson.value || dataJson.value.length === 0) {
          this.logger.warn(`No data for indicator: ${code}`);
          continue;
        }

        const filteredData = dataJson.value.filter((item) =>
          this.middleEastISOCodes.includes(item.SpatialDim),
        );

        if (filteredData.length === 0) {
          this.logger.warn(`No Middle East data for indicator: ${code}`);
          continue;
        }

        const entities = filteredData.map((item) => {
          const entity = new DiseaseData();
          entity.indicatorCode = item.IndicatorCode || code;
          entity.spatialDimType = item.SpatialDimType;
          entity.spatialDim = item.SpatialDim;
          entity.timeDimType = item.TimeDimType;
          entity.parentLocationCode = item.ParentLocationCode;
          entity.parentLocation = item.ParentLocation;
          entity.dim1Type = item.Dim1Type;
          entity.timeDim = item.TimeDim;
          entity.dim1 = item.Dim1;
          entity.dim2Type = item.Dim2Type;
          entity.dim2 = item.Dim2;
          entity.dim3Type = item.Dim3Type;
          entity.dim3 = item.Dim3;
          entity.dataSourceDimType = item.DataSourceDimType;
          entity.dataSourceDim = item.DataSourceDim;
          entity.value = item.Value;
          entity.numericValue = item.NumericValue;
          entity.low = item.Low;
          entity.high = item.High;
          entity.comments = item.Comments;
          entity.date = new Date(item.Date);
          entity.timeDimensionValue = item.TimeDimensionValue;
          entity.timeDimensionBegin = new Date(item.TimeDimensionBegin);
          entity.timeDimensionEnd = new Date(item.TimeDimensionEnd);
          entity.indicatorName = indicatorName;
          entity.countryName =
            this.isoToCountryMap[item.SpatialDim] || item.SpatialDim;

          return entity;
        });

        // Save in batches to avoid memory issues
        const batchSize = 1000;
        for (let j = 0; j < entities.length; j += batchSize) {
          const batch = entities.slice(j, j + batchSize);
          await this.diseaseDataRepository.save(batch);
          totalSaved += batch.length;
        }

        this.logger.log(
          `Saved ${entities.length} records for ${indicatorName}`,
        );
      }

      this.logger.log(
        `Data fetch completed. Total records saved: ${totalSaved}`,
      );
    } catch (error) {
      this.logger.error('Error fetching data from WHO API:', error);
      throw error;
    }
  }

  async getCountries(): Promise<{ code: string; name: string }[]> {
    return Object.entries(this.isoToCountryMap).map(([code, name]) => ({
      code,
      name,
    }));
  }

  async getIndicators(
    countryName?: string,
  ): Promise<{ code: string; name: string }[]> {
    const queryBuilder = this.diseaseDataRepository
      .createQueryBuilder('disease')
      .select(['disease.indicatorCode', 'disease.indicatorName']);

    // Filter by country if provided
    if (countryName && countryName.toLowerCase() !== 'all') {
      queryBuilder.andWhere('LOWER(disease.countryName) LIKE LOWER(:country)', {
        country: `%${countryName}%`,
      });
    }

    // Only show Middle East countries
    queryBuilder.andWhere('disease.spatialDim IN (:...middleEastCodes)', {
      middleEastCodes: this.middleEastISOCodes,
    });

    queryBuilder.groupBy('disease.indicatorCode, disease.indicatorName');

    const indicators = await queryBuilder.getRawMany();

    return indicators.map((indicator) => ({
      code: indicator.disease_indicator_code,
      name: indicator.disease_indicator_name,
    }));
  }

  async getStats(): Promise<any> {
    const totalRecords = await this.diseaseDataRepository.count();
    const countryCount = await this.diseaseDataRepository
      .createQueryBuilder('disease')
      .select('COUNT(DISTINCT disease.spatialDim)', 'count')
      .getRawOne();

    const indicatorCount = await this.diseaseDataRepository
      .createQueryBuilder('disease')
      .select('COUNT(DISTINCT disease.indicatorCode)', 'count')
      .getRawOne();

    const yearRange = await this.diseaseDataRepository
      .createQueryBuilder('disease')
      .select('MIN(disease.timeDim)', 'minYear')
      .addSelect('MAX(disease.timeDim)', 'maxYear')
      .getRawOne();

    return {
      totalRecords,
      countries: Number.parseInt(countryCount.count),
      indicators: Number.parseInt(indicatorCount.count),
      yearRange: {
        from: yearRange.minYear,
        to: yearRange.maxYear,
      },
    };
  }
}
