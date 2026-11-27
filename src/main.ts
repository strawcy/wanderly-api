import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1'); // every URL starts with /api/v1
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // drops fields that aren't in the DTO
      forbidNonWhitelisted: true, // rejects them with a 400
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter()); // your Lab 5 error format
  app.enableCors(); // lets the Leaflet page call the API
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Wanderly API running on http://localhost:${port}/api/v1`);
}
bootstrap();