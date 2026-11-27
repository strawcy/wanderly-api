import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TouristSpot } from '../spots/tourist-spot.entity';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn({ name: 'AdminID' })
  id: number;

  @Column({ name: 'FirstName', length: 50 })
  firstName: string;

  @Column({ name: 'LastName', length: 50 })
  lastName: string;

  @Column({ name: 'Email', length: 100, unique: true })
  email: string;

  @Column({ name: 'PasswordHash', length: 255, select: false })
  passwordHash: string;

  @Column({ name: 'Position', length: 50 })
  position: string;

  @OneToMany(() => TouristSpot, (spot) => spot.admin)
  spots: TouristSpot[];
}