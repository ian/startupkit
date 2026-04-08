import { z } from 'zod';

export const TrendsInputSchema = z.object({
  keyword: z.string().describe('The search term to analyze'),
  region: z.string().optional().describe('Geographic region code (US, GB, AU, CA)'),
  category: z.string().optional().describe('Category ID'),
  timeframe: z.string().optional().describe('Time range (7d, 30d, 90d, 365d)'),
});

export const SeoInputSchema = z.object({
  domain: z.string().describe('Domain to analyze (e.g., example.com)'),
});

export const KeywordsInputSchema = z.object({
  keyword: z.string().describe('Seed keyword to research'),
  limit: z.number().optional().describe('Maximum results'),
});

export const DomainsInputSchema = z.object({
  name: z.string().describe('Domain name to search (without TLD)'),
  extensions: z.array(z.string()).optional().describe('TLDs to check'),
});

export const AppsInputSchema = z.object({
  app: z.string().describe('App name or package/bundle ID'),
  store: z.enum(['ios', 'android', 'both']).optional().describe('App store'),
});

export const ResearchInputSchema = z.object({
  topic: z.string().describe('Research topic or industry'),
  tools: z.array(z.string()).optional().describe('Tools to use'),
});

export const ChatInputSchema = z.object({
  topic: z.string().describe('What you want to research'),
});

export const CreditsInputSchema = z.object({
  action: z.enum(['balance', 'history']).optional().describe('Action to perform'),
});

export type TrendsInput = z.infer<typeof TrendsInputSchema>;
export type SeoInput = z.infer<typeof SeoInputSchema>;
export type KeywordsInput = z.infer<typeof KeywordsInputSchema>;
export type DomainsInput = z.infer<typeof DomainsInputSchema>;
export type AppsInput = z.infer<typeof AppsInputSchema>;
export type ResearchInput = z.infer<typeof ResearchInputSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;
export type CreditsInput = z.infer<typeof CreditsInputSchema>;
