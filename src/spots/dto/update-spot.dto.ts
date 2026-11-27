import { PartialType } from '@nestjs/mapped-types';
import { CreateSpotDto } from './create-spot.dto';

// Same rules as create, but every field is optional (used by PATCH)
export class UpdateSpotDto extends PartialType(CreateSpotDto) {}