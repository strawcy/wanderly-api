import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './admin.entity';
import { Tourist } from '../tourists/tourist.entity';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private readonly repo: Repository<Admin>,
    @InjectRepository(Tourist) private readonly tourists: Repository<Tourist>,
  ) {}

  async create(dto: CreateAdminDto) {
    // The email must not be used by any admin or tourist
    const taken =
      (await this.repo.count({ where: { email: dto.email } })) > 0 ||
      (await this.tourists.count({ where: { email: dto.email } })) > 0;
    if (taken) throw new ConflictException('Email is already registered');

    const admin = await this.repo.save(
      this.repo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        position: dto.position,
        passwordHash: await bcrypt.hash(dto.password, 10),
      }),
    );

    // Send back everything except the password hash
    return {
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      position: admin.position,
    };
  }
}