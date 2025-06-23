import { PartialType } from '@nestjs/mapped-types';
import { CreateDiseaseDatumDto } from './create-disease-datum.dto';

export class UpdateDiseaseDatumDto extends PartialType(CreateDiseaseDatumDto) {}
