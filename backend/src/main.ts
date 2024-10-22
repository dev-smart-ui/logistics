import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Увімкнути CORS
  app.enableCors();

  await app.listen(3100);
}
bootstrap();

