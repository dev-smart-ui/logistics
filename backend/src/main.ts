import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


dotenv.config(); // Завантажує .env файл

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Увімкнути CORS
  app.enableCors();

  await app.listen(3100);
}
bootstrap();

