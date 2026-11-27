import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { isDuplicateError, isReferencedError } from '../common/utils/db-errors';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  findAll() {
    return this.repo.find({ order: { categoryName: 'ASC' } });
  }

  async findOne(id: number) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    try {
      return await this.repo.save(this.repo.create(dto));
    } catch (e) {
      if (isDuplicateError(e)) throw new ConflictException('Category name already exists');
      throw e;
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    try {
      await this.repo.remove(category);
    } catch (e) {
      if (isReferencedError(e)) {
        throw new ConflictException('Category still has tourist spots; reassign or delete them first');
      }
      throw e;
    }
  }
}