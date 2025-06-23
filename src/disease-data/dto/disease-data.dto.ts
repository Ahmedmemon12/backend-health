import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetDiseaseDataDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  disease?: string;

  @IsOptional()
  @IsString()
  indicatorCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(2000)
  yearFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(2030)
  yearTo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'timeDim';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class DiseaseDataResponseDto {
  id: number;
  indicatorCode: string;
  indicatorName: string;
  countryCode: string;
  countryName: string;
  year: number;
  value: string;
  numericValue: number;
  low: number;
  high: number;
  date: Date;
}

export class PaginatedDiseaseDataDto {
  data: DiseaseDataResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
