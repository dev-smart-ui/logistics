import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PupeeteerModule } from './puppeteer/puppeteer.module';
import { TelegramService } from './telegram/telegram.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PupeeteerModule,
    RedisModule
  ],
  controllers: [AppController, ],
  providers: [AppService, TelegramService],
  exports: [TelegramService]
})
export class AppModule {}
