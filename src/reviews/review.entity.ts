import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Tourist } from '../tourists/tourist.entity';
import { TouristSpot } from '../spots/tourist-spot.entity';

@Entity('review')
@Check('CHK_review_rating', '`Rating` BETWEEN 1 AND 5')
@Unique('UQ_review_tourist_spot', ['touristId', 'spotId'])
export class Review {
  @PrimaryGeneratedColumn({ name: 'ReviewID' })
  id: number;

  @Column({ name: 'TouristID' })
  touristId: number;

  @ManyToOne(() => Tourist, (t) => t.reviews, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'TouristID' })
  tourist: Tourist;

  @Column({ name: 'SpotID' })
  spotId: number;

  @ManyToOne(() => TouristSpot, (s) => s.reviews, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'SpotID' })
  spot: TouristSpot;

  @Column({ name: 'Rating', type: 'tinyint' })
  rating: number;

  @Column({ name: 'Comment', type: 'text', nullable: true })
  comment: string | null;

  @Column({ name: 'DateReviewed', type: 'date' })
  dateReviewed: string;
}