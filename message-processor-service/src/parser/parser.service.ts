import { Injectable } from '@nestjs/common';
import { DiscordMessage } from 'src/types/discord';

@Injectable()
export class ParserService {
  messageRegexParse(message: DiscordMessage) {
    const parsedMessage = {
      id: message.id,
      channelId: message.channel_id,
      timestamp: new Date(message.timestamp),
      type: message.type,
      content: message.content,
      editedTimestamp: message.edited_timestamp
        ? new Date(message.edited_timestamp)
        : null,
      mentionEveryone: message.mention_everyone,
      pinned: message.pinned,
      author: {
        id: message.author.id,
        username: message.author.username,
        discriminator: message.author.discriminator,
        avatar: message.author.avatar,
      },
    };
    const lowercasedContent = message.content
      .toLowerCase()
      .replace(/[^a-z0-9\s:.%]/g, '');

    let signal = null;
    let tradingStops = [];
    const signalRegex = {
      side: /(\w+)\s(?:swing\s)?(long|short)/i,
      entryPrice: /entry:\s*(\d+(\.\d+)?)/i,
      risk: /risk:\s*(\d+(\.\d+)?)%?/i,
      stopLoss: /sl:\s*(\d+(\.\d+)?)/i,
      takeProfits: /tp\s*\d*:\s*(\d+(\.\d+)?)/gi,
      positionSize: /position size:\s*(\d+(\.\d+)?)\s*(usd|contracts)?/i,
      closedStatus: /position closed:\s*(yes|no)/i,
      filledStatus: /position filled:\s*(yes|no)/i,
    };

    const sideMatch = signalRegex.side.exec(lowercasedContent);

    if (sideMatch) {
      const [_, ticker, side] = sideMatch;
      signal = {
        status: 'opened',
        side: side.toLowerCase(),
        entryType: 'market',
        entryPrice: parseFloat(
          (signalRegex.entryPrice.exec(lowercasedContent) || [])[1] || '0',
        ),
        risk: parseFloat(
          (signalRegex.risk.exec(lowercasedContent) || [])[1] || '0',
        ),
        ticker: ticker.toUpperCase(),
      };

      const stopLossMatch = signalRegex.stopLoss.exec(lowercasedContent);
      if (stopLossMatch) {
        tradingStops.push({
          type: 'stopLoss',
          price: parseFloat(stopLossMatch[1]),
        });
      }

      let match;
      while (
        (match = signalRegex.takeProfits.exec(lowercasedContent)) !== null
      ) {
        tradingStops.push({
          type: 'takeProfit',
          price: parseFloat(match[1]),
        });
      }
    }
    
    return {
      message: parsedMessage,
      signal,
      tradingStops,
    };
  }

  validateSignalAndStops(signal: any, tradingStops: any[]): boolean {
    if (!signal) return false;
    if (!signal.side) return false;
    if (!signal.entryPrice || signal.entryPrice <= 0) return false;
    if (!signal.ticker) return false;
    if (!signal.entryType) return false;

    for (const stop of tradingStops) {
      if (
        !stop.type ||
        (stop.type !== 'stopLoss' && stop.type !== 'takeProfit')
      ) {
        return false;
      }
      if (!stop.price || stop.price <= 0) {
        return false;
      }
    }

    return true;
  }
}
