import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { TouristsModule } from './tourists/tourists.module';
import { CategoriesModule } from './categories/categories.module';
import { SpotsModule } from './spots/spots.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'wanderly_db'),
        autoLoadEntities: true, // finds all your entities automatically
        synchronize: config.get('DB_SYNC', 'true') === 'true', // creates the tables for you
      }),
    }),
    AuthModule,
    AdminsModule,
    TouristsModule,
    CategoriesModule,
    SpotsModule,
    ReviewsModule,
  ],
})
export class AppModule {}