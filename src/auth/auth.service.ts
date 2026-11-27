import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admins/admin.entity';
import { Tourist } from '../tourists/tourist.entity';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) private readonly admins: Repository<Admin>,
    @InjectRepository(Tourist) private readonly tourists: Repository<Tourist>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Runs once when the app starts: creates the first admin from .env
  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) return;
    if ((await this.admins.count()) > 0) return;
    await this.admins.save(
      this.admins.create({
        firstName: 'Default',
        lastName: 'Admin',
        email,
        position: 'Tourism Officer',
        passwordHash: await bcrypt.hash(password, 10),
      }),
    );
    console.log(`Seeded default admin: ${email}`);
  }

    async login(dto: LoginDto) {
    const select = {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      passwordHash: true,
    };

    // Look up the email, then compare the typed password with the stored hash
    const admin = await this.admins.findOne({ where: { email: dto.email }, select });
    if (admin && (await bcrypt.compare(dto.password, admin.passwordHash))) {
      return this.issueToken(admin.id, admin.email, Role.Admin, `${admin.firstName} ${admin.lastName}`);
    }

    const tourist = await this.tourists.findOne({ where: { email: dto.email }, select });
    if (tourist && (await bcrypt.compare(dto.password, tourist.passwordHash))) {
      return this.issueToken(tourist.id, tourist.email, Role.Tourist, `${tourist.firstName} ${tourist.lastName}`);
    }

    // Same message for a wrong email or a wrong password, so attackers learn nothing
    throw new UnauthorizedException('Invalid email or password');
  }

  // Create the JWT with the user id, email and role inside
  private async issueToken(id: number, email: string, role: Role, name: string) {
    const access_token = await this.jwt.signAsync({ sub: id, email, role });
    return { access_token, user: { id, email, role, name } };
  }
}