import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscordMessage } from 'src/types/discord';

@Injectable()
export class DiscordService {
  constructor(private readonly configService: ConfigService) {}

  async getChannelMessages(channelId: string) {
    const baseUrl = this.configService.get<string>('DISCORD_API_BASE_URL');

    const searchParams = new URLSearchParams({ limit: '10' });

    const response = await fetch(
      `${baseUrl}/${channelId}/messages?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: this.configService.get<string>('DISCORD_AUTH_TOKEN'),
          Accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          Referer: 'https://discord.com/channels/@me',
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching messages: ${response.status} ${response.statusText}`,
      );
    }

    const messages: DiscordMessage[] = await response.json();
    return messages;
  }
}
