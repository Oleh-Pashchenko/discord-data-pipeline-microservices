import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [SignalService, PrismaService],
  exports: [SignalService],
})
export class SignalModule {}
