import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async AiParseMessage(text: string) {
    try {
      const content = `
  You are a trading assistant AI. Your task is to extract structured data from a trading signal message. Parse the following content and return the signal information and trading stops in JSON format. 
  
  Follow this structure:
  - For the signal, include:
    - "side" (long or short)
    - "entryPrice" (number)
    - "entryType" (market or limit, "market" as default)
    - "risk" (number, as percentage)
    - "ticker" (e.g., BTC, ETH)
    - "status" (opened or closed, default opened)
  - For trading stops, include an array of objects, each with:
    - "type" ("stopLoss" or "takeProfit")
    - "price" (number)
  
  If any required data is missing, set the value to null. Do not include extra text or explanations, only return the JSON object.
  
  Message:
  ${text}
      `;

      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content,
          },
        ],
        model: 'gpt-4-turbo',
      });

      const result = completion.choices[0].message.content
        .replaceAll('json', '')
        .replaceAll('```', '')
        .replaceAll('\n', '');

      const parsedData = JSON.parse(result);

      return parsedData;
    } catch (error) {
      throw error;
    }
  }
}
