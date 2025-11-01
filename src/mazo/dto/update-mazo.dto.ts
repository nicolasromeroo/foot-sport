import { PartialType } from '@nestjs/mapped-types';
import { CreateMazoDto } from './create-mazo.dto';

export class UpdateMazoDto extends PartialType(CreateMazoDto) {}
