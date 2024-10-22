import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PupeeteerModule } from './puppeteer/puppeteer.module';

@Module({
  imports: [PupeeteerModule],
  controllers: [AppController, ],
  providers: [AppService],
})
export class AppModule {}
