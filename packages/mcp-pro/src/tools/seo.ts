import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { apiRequest } from '../lib/api.js';
import { SeoInputSchema } from '../lib/schema.js';

export const seoTool: Tool = {
  name: 'seo',
  description: 'Get comprehensive SEO analytics for any domain including authority scores, backlinks, and traffic data',
  inputSchema: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        description: 'Domain to analyze (e.g., example.com)',
      },
    },
    required: ['domain'],
  },
};

export async function seoHandler(args: Record<string, unknown>) {
  const input = SeoInputSchema.parse(args);

  const data = await apiRequest<{ data: unknown; creditsUsed: number }>({
    method: 'POST',
    path: '/seo/overview',
    data: { domain: input.domain },
  });

  return data.data;
}
