import Conf from 'conf';
import { z } from 'zod';

const ConfigSchema = z.object({
  apiKey: z.string().optional(),
  apiBaseUrl: z.string().default('https://pro.startupkit.com/api'),
  userId: z.string().optional(),
  email: z.string().optional(),
  plan: z.string().optional(),
  credits: z.number().optional(),
});

export type ConfigStore = z.infer<typeof ConfigSchema>;

export class Config {
  private store: Conf<ConfigStore>;

  constructor() {
    this.store = new Conf<ConfigStore>({
      projectName: 'startupkit-pro',
      schema: {
        apiKey: { type: 'string' },
        apiBaseUrl: { type: 'string', default: 'https://pro.startupkit.com/api' },
        userId: { type: 'string' },
        email: { type: 'string' },
        plan: { type: 'string' },
        credits: { type: 'number' },
      },
    });
  }

  get apiKey(): string | undefined {
    return this.store.get('apiKey');
  }

  set apiKey(key: string | undefined) {
    this.store.set('apiKey', key);
  }

  get apiBaseUrl(): string {
    return this.store.get('apiBaseUrl') ?? 'https://pro.startupkit.com/api';
  }

  set apiBaseUrl(url: string) {
    this.store.set('apiBaseUrl', url);
  }

  get userId(): string | undefined {
    return this.store.get('userId');
  }

  set userId(id: string | undefined) {
    this.store.set('userId', id);
  }

  get email(): string | undefined {
    return this.store.get('email');
  }

  set email(email: string | undefined) {
    this.store.set('email', email);
  }

  get plan(): string | undefined {
    return this.store.get('plan');
  }

  set plan(plan: string | undefined) {
    this.store.set('plan', plan);
  }

  get credits(): number | undefined {
    return this.store.get('credits');
  }

  set credits(credits: number | undefined) {
    this.store.set('credits', credits);
  }

  get isLoggedIn(): boolean {
    return !!this.apiKey;
  }

  clear(): void {
    this.store.clear();
  }

  getAll(): ConfigStore {
    return {
      apiKey: this.apiKey,
      apiBaseUrl: this.apiBaseUrl,
      userId: this.userId,
      email: this.email,
      plan: this.plan,
      credits: this.credits,
    };
  }
}

export const config = new Config();
