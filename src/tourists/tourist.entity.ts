import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from '../reviews/review.entity';

@Entity('tourist')
export class Tourist {
  @PrimaryGeneratedColumn({ name: 'TouristID' })
  id: number;

  @Column({ name: 'FirstName', length: 50 })
  firstName: string;

  @Column({ name: 'LastName', length: 50 })
  lastName: string;

  @Column({ name: 'Email', length: 100, unique: true })
  email: string;

  @Column({ name: 'PasswordHash', length: 255, select: false })
  passwordHash: string;

  @Column({ name: 'DateRegistered', type: 'date' })
  dateRegistered: string;

  @OneToMany(() => Review, (review) => review.tourist)
  reviews: Review[];
}