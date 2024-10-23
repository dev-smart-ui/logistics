import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private chatId: string = this.configService.get<string>('TELEGRAM_CHAT_ID');
  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new TelegramBot(token);
  }

  async sendMessage(message: string): Promise<void> {
    try {
      await this.bot.sendMessage(this.chatId, message);
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  }
}
