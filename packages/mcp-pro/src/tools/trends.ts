import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { apiRequest } from '../lib/api.js';
import { TrendsInputSchema } from '../lib/schema.js';

export const trendsTool: Tool = {
  name: 'trends',
  description: 'Search Google Trends data for keywords and topics',
  inputSchema: {
    type: 'object',
    properties: {
      keyword: {
        type: 'string',
        description: 'The search term to analyze',
      },
      region: {
        type: 'string',
        description: 'Geographic region code (US, GB, AU, CA)',
      },
      category: {
        type: 'string',
        description: 'Category ID',
      },
      timeframe: {
        type: 'string',
        description: 'Time range (7d, 30d, 90d, 365d)',
      },
    },
    required: ['keyword'],
  },
};

export async function trendsHandler(args: Record<string, unknown>) {
  const input = TrendsInputSchema.parse(args);

  const data = await apiRequest<{ data: unknown; creditsUsed: number }>({
    method: 'POST',
    path: '/trends',
    data: {
      keyword: input.keyword,
      region: input.region || 'US',
      category: input.category,
      timeframe: input.timeframe || '90d',
    },
  });

  return data.data;
}
