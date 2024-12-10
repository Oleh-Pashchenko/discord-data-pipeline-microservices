import { Injectable } from '@nestjs/common';
import { Message } from 'prisma/generated';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(message: Message) {
    return this.prisma.message.create({ data: { ...message } });
  }

  async isExist(id: Message['id']) {
    const existingMessage = await this.prisma.message.findUnique({
      where: { id },
    });

    if (existingMessage) {
      return true;
    }

    return false;
  }
}
