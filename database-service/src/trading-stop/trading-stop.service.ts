import { Injectable } from '@nestjs/common';
import { Signal, TradingStop, TradingStopType } from 'prisma/generated';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TradingStopService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TradingStop, signalId: Signal['id']) {
    return await this.prisma.tradingStop.create({
      data: {
        ...data,
        type: TradingStopType[data.type],
        signalId,
      },
    });
  }

  async createMany(data: TradingStop[], signalId: Signal['id']) {
    return Promise.all(data.map((item) => this.create(item, signalId)));
  }
}
