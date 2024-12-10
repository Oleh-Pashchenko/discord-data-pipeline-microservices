import { Injectable } from '@nestjs/common';
import { Message, Signal, TradingStop } from 'prisma/generated';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SignalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(signal: Signal, messageId: Message['id']) {
    return this.prisma.signal.create({ data: { ...signal, messageId } });
  }
}
