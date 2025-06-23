import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('disease_data')
@Index(['indicatorCode', 'spatialDim', 'timeDim'])
export class DiseaseData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'indicator_code' })
  indicatorCode: string;

  @Column({ name: 'spatial_dim_type' })
  spatialDimType: string;

  @Column({ name: 'spatial_dim' })
  spatialDim: string;

  @Column({ name: 'time_dim_type' })
  timeDimType: string;

  @Column({ name: 'parent_location_code', nullable: true })
  parentLocationCode: string;

  @Column({ name: 'parent_location', nullable: true })
  parentLocation: string;

  @Column({ name: 'dim1_type', nullable: true })
  dim1Type: string;

  @Column({ name: 'time_dim' })
  timeDim: number;

  @Column({ name: 'dim1', nullable: true })
  dim1: string;

  @Column({ name: 'dim2_type', nullable: true })
  dim2Type: string;

  @Column({ name: 'dim2', nullable: true })
  dim2: string;

  @Column({ name: 'dim3_type', nullable: true })
  dim3Type: string;

  @Column({ name: 'dim3', nullable: true })
  dim3: string;

  @Column({ name: 'data_source_dim_type', nullable: true })
  dataSourceDimType: string;

  @Column({ name: 'data_source_dim', nullable: true })
  dataSourceDim: string;

  @Column({ nullable: true })
  value: string;

  @Column({
    name: 'numeric_value',
    type: 'decimal',
    precision: 20, // Increased from 10 to 20
    scale: 4,
    nullable: true,
  })
  numericValue: number;

  @Column({
    type: 'decimal',
    precision: 20, // Increased from 10 to 20
    scale: 4,
    nullable: true,
  })
  low: number;

  @Column({
    type: 'decimal',
    precision: 20, // Increased from 10 to 20
    scale: 4,
    nullable: true,
  })
  high: number;

  @Column({ nullable: true })
  comments: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ name: 'time_dimension_value' })
  timeDimensionValue: string;

  @Column({ name: 'time_dimension_begin', type: 'timestamp' })
  timeDimensionBegin: Date;

  @Column({ name: 'time_dimension_end', type: 'timestamp' })
  timeDimensionEnd: Date;

  @Column({ name: 'indicator_name' })
  indicatorName: string;

  @Column({ name: 'country_name' })
  countryName: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
