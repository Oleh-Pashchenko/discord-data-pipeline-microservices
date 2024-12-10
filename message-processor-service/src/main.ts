import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [new ConfigService().get<string>('RABBITMQ_URL')],
        queue: new ConfigService().get<string>('RABBITMQ_QUEUE'),
      },
    },
  );
  app.listen();
}
bootstrap();
