import { Module } from '@nestjs/common';
import { DataProcessedController } from './data-processes/data-processes.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { MessageModule } from './message/message.module';
import { TradingStopModule } from './trading-stop/trading-stop.module';
import { SignalModule } from './signal/signal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessageModule,
    TradingStopModule,
    SignalModule,
  ],
  controllers: [DataProcessedController],
  providers: [PrismaService],
  exports: []
})
export class AppModule {}
