import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tourist } from './tourist.entity';
import { Admin } from '../admins/admin.entity';
import { CreateTouristDto } from './dto/create-tourist.dto';
import type { JwtUser } from '../common/decorators/current-user.decorator';
import { today } from '../common/utils/db-errors';

@Injectable()
export class TouristsService {
  constructor(
    @InjectRepository(Tourist) private readonly repo: Repository<Tourist>,
    @InjectRepository(Admin) private readonly admins: Repository<Admin>,
  ) {}

  async create(dto: CreateTouristDto) {
    // The email must not be used by any tourist or admin
        const taken =
      (await this.repo.count({ where: { email: dto.email } })) > 0 ||
      (await this.admins.count({ where: { email: dto.email } })) > 0;
    if (taken) throw new ConflictException('Email is already registered');

    const tourist = await this.repo.save(
      this.repo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash: await bcrypt.hash(dto.password, 10), // never store the plain password
        dateRegistered: today(),
      }),
    );

    // Send back everything except the password hash
    return {
      id: tourist.id,
      firstName: tourist.firstName,
      lastName: tourist.lastName,
      email: tourist.email,
      dateRegistered: tourist.dateRegistered,
    };
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number, user: JwtUser) {
    // A tourist may only view their own profile; admins may view anyone
    if (user.role === 'tourist' && user.sub !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    const tourist = await this.repo.findOne({ where: { id } });
    if (!tourist) throw new NotFoundException(`Tourist ${id} not found`);
    return tourist;
  }
}