import { z } from 'zod';

const ConfigSchema = z.object({
  apiKey: z.string().optional(),
  apiBaseUrl: z.string().default('https://pro.startupkit.com/api'),
});

export type ConfigStore = z.infer<typeof ConfigSchema>;

export class Config {
  apiKey: string | undefined;
  apiBaseUrl: string;

  constructor() {
    this.apiKey = process.env.STARTUPKIT_API_KEY;
    this.apiBaseUrl = process.env.STARTUPKIT_API_URL || 'https://pro.startupkit.com/api';
  }

  get isLoggedIn(): boolean {
    return !!this.apiKey;
  }
}

export const config = new Config();
