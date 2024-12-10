import { Module } from '@nestjs/common';
import { DataProcessorModule } from './data-processor/data-processor.module';
import { ParserModule } from './parser/parser.module';
import { OpenAiModule } from './open-ai/open-ai.module';
@Module({
  imports: [DataProcessorModule, ParserModule, OpenAiModule],
})
export class AppModule {}
