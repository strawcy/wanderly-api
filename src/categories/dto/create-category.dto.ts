import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  categoryName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}