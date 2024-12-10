import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks-service/tasks-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'MESSAGE_PROCESSOR',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('RABBITMQ_QUEUE'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DiscordModule,
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
