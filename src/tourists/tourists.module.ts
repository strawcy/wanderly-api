import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tourist } from './tourist.entity';
import { Admin } from '../admins/admin.entity';
import { TouristsService } from './tourists.service';
import { TouristsController } from './tourists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tourist, Admin])],
  controllers: [TouristsController],
  providers: [TouristsService],
  exports: [TypeOrmModule],
})
export class TouristsModule {}