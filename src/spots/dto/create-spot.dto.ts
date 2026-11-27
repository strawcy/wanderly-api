import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const TIME = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export class CreateSpotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  spotName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNumber()
  @Min(0)
  entranceFee: number;

  @Matches(TIME, { message: 'openingTime must be HH:mm or HH:mm:ss' })
  openingTime: string;

  @Matches(TIME, { message: 'closingTime must be HH:mm or HH:mm:ss' })
  closingTime: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId: number;
}