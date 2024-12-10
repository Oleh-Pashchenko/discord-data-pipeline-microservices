import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { DiscordService } from 'src/discord/discord.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly queue: string;

  constructor(
    @Inject('MESSAGE_PROCESSOR') private rabbitClient: ClientProxy,
    private readonly configService: ConfigService,
    private readonly discordService: DiscordService,
  ) {
    this.queue = configService.get<string>('RABBITMQ_QUEUE');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  // @Timeout(10000)
  async handleCron() {
    try {
      const messages = await this.discordService.getChannelMessages(
        '1315807571357208688',
      );

      this.logger.log(`Fetched ${messages.length} messages from Discord.`);

      messages.forEach((message) => {
        this.rabbitClient.emit(this.queue, message);
        this.logger.log(
          `Emitted message ID: ${message.id} to queue: ${this.queue}.`,
        );
      });

      this.logger.log('Finished processing messages.');
    } catch (error) {
      this.logger.error(
        'An error occurred while handling the scheduled task.',
        error.stack,
      );
    }
  }
}
