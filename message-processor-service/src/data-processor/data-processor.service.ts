import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

export class DataProcessorService {
  private readonly queue: string;

  constructor(
    @Inject('DATABASE_SERVICE') private rabbitClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.queue = configService.get<string>('RABBITMQ_QUEUE_PROCESSED');
  }

  async emitProcessedData(processedData: unknown) {
    this.rabbitClient.emit(this.queue, {
      processedData,
    });
  }
}
