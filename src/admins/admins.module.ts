import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Tourist } from '../tourists/tourist.entity';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Tourist])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [TypeOrmModule],
})
export class AdminsModule {}