import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { apiRequest } from '../lib/api.js';
import { ResearchInputSchema } from '../lib/schema.js';

export const researchTool: Tool = {
  name: 'research',
  description: 'Comprehensive market research combining multiple tools into a single report',
  inputSchema: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: 'Research topic or industry',
      },
      tools: {
        type: 'array',
        items: { type: 'string' },
        description: 'Tools to use (trends, seo, keywords, domains)',
      },
    },
    required: ['topic'],
  },
};

export async function researchHandler(args: Record<string, unknown>) {
  const input = ResearchInputSchema.parse(args);

  const data = await apiRequest<{ data: unknown; creditsUsed: number }>({
    method: 'POST',
    path: '/research',
    data: {
      topic: input.topic,
      tools: input.tools || ['trends', 'seo', 'keywords', 'domains'],
    },
    timeout: 120000,
  });

  return data.data;
}
