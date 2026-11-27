import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouristSpot } from './tourist-spot.entity';
import { Category } from '../categories/category.entity';
import { Review } from '../reviews/review.entity';
import { SpotsService } from './spots.service';
import { SpotsController } from './spots.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TouristSpot, Category, Review])],
  controllers: [SpotsController],
  providers: [SpotsService],
  exports: [TypeOrmModule],
})
export class SpotsModule {}