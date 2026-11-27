import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { TouristSpot } from './tourist-spot.entity';
import { Category } from '../categories/category.entity';
import { Review } from '../reviews/review.entity';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotQueryDto } from './dto/spot-query.dto';

@Injectable()
export class SpotsService {
  constructor(
    @InjectRepository(TouristSpot) private readonly spots: Repository<TouristSpot>,
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
  ) {}

  // GET /tourist-spots?page=1&limit=10&categoryId=1&sort=entranceFee&search=beach
  async findAll(query: SpotQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: FindOptionsWhere<TouristSpot> = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) where.spotName = Like(`%${query.search}%`);

    const [data, total] = await this.spots.findAndCount({
      where,
      relations: { category: true },
      order: { [query.sort ?? 'spotName']: 'ASC' } as any,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, page, limit, total };
  }

  async findOne(id: number) {
    const spot = await this.spots.findOne({ where: { id }, relations: { category: true } });
    if (!spot) throw new NotFoundException(`Tourist spot ${id} not found`);
    const rating = await this.ratingOf(id);
    return { ...spot, rating };
  }

  async create(dto: CreateSpotDto, adminId: number) {
    await this.assertCategory(dto.categoryId);
    return this.spots.save(this.spots.create({ ...dto, adminId }));
  }

  // Used by both PUT (all fields) and PATCH (some fields)
  async update(id: number, dto: UpdateSpotDto) {
    if (dto.categoryId) await this.assertCategory(dto.categoryId);
    const spot = await this.spots.findOne({ where: { id } });
    if (!spot) throw new NotFoundException(`Tourist spot ${id} not found`);
    Object.assign(spot, dto);
    return this.spots.save(spot);
  }

  async remove(id: number) {
    const spot = await this.spots.findOne({ where: { id } });
    if (!spot) throw new NotFoundException(`Tourist spot ${id} not found`);
    await this.spots.remove(spot); // its reviews are deleted too (ON DELETE CASCADE)
  }

  // Average rating and number of reviews for one spot
  private async ratingOf(spotId: number) {
    const row = await this.reviews
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'average')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.spotId = :spotId', { spotId })
      .getRawOne();
    return {
      average: row?.average ? Math.round(Number(row.average) * 10) / 10 : null,
      count: Number(row?.count ?? 0),
    };
  }

  private async assertCategory(categoryId: number) {
    const found = await this.categories.count({ where: { id: categoryId } });
    if (found === 0) throw new BadRequestException(`Category ${categoryId} does not exist`);
  }
}