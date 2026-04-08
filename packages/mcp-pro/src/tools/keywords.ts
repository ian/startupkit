import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { apiRequest } from '../lib/api.js';
import { KeywordsInputSchema } from '../lib/schema.js';

export const keywordsTool: Tool = {
  name: 'keywords',
  description: 'Research keywords for SEO and content strategy with search volume, competition, and CPC data',
  inputSchema: {
    type: 'object',
    properties: {
      keyword: {
        type: 'string',
        description: 'Seed keyword to research',
      },
      limit: {
        type: 'number',
        description: 'Maximum results',
      },
    },
    required: ['keyword'],
  },
};

export async function keywordsHandler(args: Record<string, unknown>) {
  const input = KeywordsInputSchema.parse(args);

  const data = await apiRequest<{ data: unknown; creditsUsed: number }>({
    method: 'POST',
    path: '/keywords',
    data: {
      keyword: input.keyword,
      limit: input.limit || 20,
    },
  });

  return data.data;
}
