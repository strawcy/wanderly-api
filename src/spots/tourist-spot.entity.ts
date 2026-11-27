import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Admin } from '../admins/admin.entity';
import { Review } from '../reviews/review.entity';
import { decimalTransformer } from '../common/transformers/decimal.transformer';

@Entity('touristspot')
@Check('CHK_spot_entrance_fee', '`EntranceFee` >= 0')
export class TouristSpot {
  @PrimaryGeneratedColumn({ name: 'SpotID' })
  id: number;

  @Column({ name: 'SpotName', length: 100 })
  spotName: string;

  @Column({ name: 'Description', type: 'text' })
  description: string;

  @Column({ name: 'Address', length: 255 })
  address: string;

  @Column({ name: 'Latitude', type: 'decimal', precision: 9, scale: 6, transformer: decimalTransformer })
  latitude: number;

  @Column({ name: 'Longitude', type: 'decimal', precision: 9, scale: 6, transformer: decimalTransformer })
  longitude: number;

  @Column({ name: 'EntranceFee', type: 'decimal', precision: 8, scale: 2, default: 0, transformer: decimalTransformer })
  entranceFee: number;

  @Column({ name: 'OpeningTime', type: 'time' })
  openingTime: string;

  @Column({ name: 'ClosingTime', type: 'time' })
  closingTime: string;

  @Column({ name: 'CategoryID' })
  categoryId: number;

  @ManyToOne(() => Category, (c) => c.spots, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'CategoryID' })
  category: Category;

  @Column({ name: 'AdminID' })
  adminId: number;

  @ManyToOne(() => Admin, (a) => a.spots, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'AdminID' })
  admin: Admin;

  @OneToMany(() => Review, (r) => r.spot)
  reviews: Review[];
}