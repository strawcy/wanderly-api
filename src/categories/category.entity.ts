import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TouristSpot } from '../spots/tourist-spot.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'CategoryID' })
  id: number;

  @Column({ name: 'CategoryName', length: 50, unique: true })
  categoryName: string;

  @Column({ name: 'Description', type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @OneToMany(() => TouristSpot, (spot) => spot.category)
  spots: TouristSpot[];
}