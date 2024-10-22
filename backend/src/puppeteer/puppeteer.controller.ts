import { Controller, Post, Body } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';

@Controller('puppeteer')
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Post('scrape')
  async scrapeUrl(
    @Body('url') url: string,
    @Body('selector') selector: string
  ): Promise<any> {
    return this.puppeteerService.scrapeData(url, selector);
  }
}
