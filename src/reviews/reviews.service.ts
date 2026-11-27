import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { TouristSpot } from '../spots/tourist-spot.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import type { JwtUser } from '../common/decorators/current-user.decorator';
import { isDuplicateError, today } from '../common/utils/db-errors';

// Only show the reviewer's name, never their email or password
const PUBLIC_SELECT = {
  id: true,
  rating: true,
  comment: true,
  dateReviewed: true,
  spotId: true,
  touristId: true,
  tourist: { id: true, firstName: true, lastName: true },
};

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(TouristSpot) private readonly spots: Repository<TouristSpot>,
  ) {}

  // GET /reviews?spotId=1&page=1
  async findAll(query: ReviewQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    if (query.spotId) await this.assertSpot(query.spotId);

    const [data, total] = await this.reviews.findAndCount({
      where: query.spotId ? { spotId: query.spotId } : {},
      select: PUBLIC_SELECT,
      relations: { tourist: true },
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, page, limit, total };
  }

  async findOne(id: number) {
    const review = await this.reviews.findOne({
      where: { id },
      select: PUBLIC_SELECT,
      relations: { tourist: true },
    });
    if (!review) throw new NotFoundException(`Review ${id} not found`);
    return review;
  }

  async create(touristId: number, dto: CreateReviewDto) {
    await this.assertSpot(dto.spotId);
    try {
      const saved = await this.reviews.save(
        this.reviews.create({ ...dto, touristId, dateReviewed: today() }),
      );
      return this.findOne(saved.id);
    } catch (e) {
      if (isDuplicateError(e)) {
        throw new ConflictException('You already reviewed this spot. Edit your review instead.');
      }
      throw e;
    }
  }

  async update(id: number, user: JwtUser, dto: UpdateReviewDto) {
    const review = await this.reviews.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Review ${id} not found`);
    if (review.touristId !== user.sub) {
      throw new ForbiddenException('You can only edit your own review');
    }
    Object.assign(review, dto);
    await this.reviews.save(review);
    return this.findOne(id);
  }

  async remove(id: number, user: JwtUser) {
    const review = await this.reviews.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Review ${id} not found`);
    // The owner or any admin may delete
    if (user.role !== 'admin' && review.touristId !== user.sub) {
      throw new ForbiddenException('You can only delete your own review');
    }
    await this.reviews.remove(review);
  }

  private async assertSpot(spotId: number) {
    const found = await this.spots.count({ where: { id: spotId } });
    if (found === 0) throw new NotFoundException(`Tourist spot ${spotId} not found`);
  }
}