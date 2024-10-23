import { Module } from '@nestjs/common';
import { PuppeteerController } from './puppeteer.controller';
import { PuppeteerService } from './puppeteer.service';
import { TelegramModule } from 'src/telegram/telegram.module';


@Module({
  imports: [TelegramModule],
  controllers: [PuppeteerController],
  providers: [PuppeteerService],
})
export class PupeeteerModule {}