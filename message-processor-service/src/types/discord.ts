export interface DiscordMessage {
  type: number;
  content: string;
  mentions: unknown[];
  mention_roles: unknown[];
  attachments: unknown[];
  embeds: Embed[];
  timestamp: string;
  edited_timestamp: string | null;
  flags: number;
  components: unknown[];
  id: string;
  channel_id: string;
  author: Author;
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
}

export interface Embed {
  type: string;
  url: string;
  title: string;
  color: number;
  provider: {
    name: string;
  };
  thumbnail: {
    url: string;
    proxy_url: string;
    width: number;
    height: number;
    placeholder?: string;
    placeholder_version?: number;
    flags?: number;
  };
}

export interface Author {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: string | null;
  global_name: string;
  avatar_decoration_data: unknown | null;
  banner_color: string | null;
  clan: unknown | null;
  primary_guild: unknown | null;
}
