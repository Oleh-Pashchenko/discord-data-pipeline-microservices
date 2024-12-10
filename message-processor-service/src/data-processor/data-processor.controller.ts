import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DataProcessorService } from './data-processor.service';
import { DiscordMessage } from 'src/types/discord';
import { ParserService } from 'src/parser/parser.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';

@Controller()
export class DataProcessorController {
  private readonly logger = new Logger(DataProcessorController.name);

  constructor(
    private readonly dataProcessorService: DataProcessorService,
    private readonly parserService: ParserService,
    private readonly openAiService: OpenAiService,
  ) {}

  @EventPattern('data-row')
  async handleDataRow(@Payload() messageData: DiscordMessage): Promise<void> {
    this.logger.log('Received event.');

    const { message, signal, tradingStops } =
      this.parserService.messageRegexParse(messageData);

    const processAndEmit = async (
      signalData: any,
      stopsData: any,
    ): Promise<boolean> => {
      const isValid = this.parserService.validateSignalAndStops(
        signalData,
        stopsData,
      );
      if (isValid) {
        this.dataProcessorService.emitProcessedData({
          message,
          signal: signalData,
          tradingStops: stopsData,
        });
        this.logger.log(
          `Processed and emitted data for message ID: ${message.id}`,
        );
      } else {
        this.logger.warn(
          `Validation failed for signal or trading stops of message ID: ${message.id}`,
        );
      }
      return isValid;
    };

    const isValid = await processAndEmit(signal, tradingStops);

    if (!isValid) {
      this.logger.log(
        `Fallback: Parsing message content using OpenAI for message ID: ${message.id}.`,
      );
      try {
        const aiResult = await this.openAiService.AiParseMessage(
          messageData.content,
        );

        await processAndEmit(aiResult.signal, aiResult.tradingStops);
      } catch (error) {
        this.logger.error(
          `Failed to process message ID: ${message.id} using OpenAI.`,
          error.stack,
        );
      }
    }
  }
}
