import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Message, Signal, TradingStop } from 'prisma/generated';
import { MessageService } from 'src/message/message.service';
import { SignalService } from 'src/signal/signal.service';
import { TradingStopService } from 'src/trading-stop/trading-stop.service';

@Controller()
export class DataProcessedController {
  private readonly logger = new Logger(DataProcessedController.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly signalService: SignalService,
    private readonly tradingStopService: TradingStopService,
  ) {}

  @EventPattern('data-processed')
  async handleDataRow(
    @Payload()
    data: {
      processedData: {
        message: Message;
        signal: Signal;
        tradingStops: TradingStop[];
      };
    },
  ) {
    this.logger.log('Received "data-processed" event with processed data.');

    try {
      const { message, signal, tradingStops } = data.processedData;

      const isMessageAlreadyExist = await this.messageService.isExist(
        message.id,
      );

      if (isMessageAlreadyExist) {
        return;
      }

      const newMessage = await this.messageService.create(message);
      this.logger.log(`Message with ID ${newMessage.id} created.`);
      const newSignal = await this.signalService.create(signal, newMessage.id);
      this.logger.log(
        `Signal with ID ${newSignal.id} created for Message ID ${newMessage.id}.`,
      );

      const newTradingStops = await this.tradingStopService.createMany(
        tradingStops,
        newSignal.id,
      );
      this.logger.log(
        `${newTradingStops.length} trading stops created for Signal ID ${newSignal.id}.`,
      );
    } catch (error) {
      this.logger.error(
        'An error occurred while processing data.',
        error.stack,
      );
    }
  }
}
