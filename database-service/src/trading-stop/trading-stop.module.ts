import { Module } from '@nestjs/common';
import { TradingStopService } from './trading-stop.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [TradingStopService, PrismaService],
  exports: [TradingStopService],
})
export class TradingStopModule {}
