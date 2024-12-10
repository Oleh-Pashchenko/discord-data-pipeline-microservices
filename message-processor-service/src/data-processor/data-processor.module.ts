import { Module } from '@nestjs/common';
import { DataProcessorController } from './data-processor.controller';
import { DataProcessorService } from './data-processor.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParserModule } from 'src/parser/parser.module';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'DATABASE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('RABBITMQ_QUEUE_PROCESSED'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ParserModule,
    OpenAiModule
  ],
  controllers: [DataProcessorController],
  providers: [DataProcessorService],
})
export class DataProcessorModule {}
