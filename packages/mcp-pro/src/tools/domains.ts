import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { apiRequest } from '../lib/api.js';
import { DomainsInputSchema } from '../lib/schema.js';

export const domainsTool: Tool = {
  name: 'domains',
  description: 'Search and check domain name availability across multiple TLDs',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Domain name to search (without TLD)',
      },
      extensions: {
        type: 'array',
        items: { type: 'string' },
        description: 'TLDs to check (e.g., [".com", ".io", ".co"])',
      },
    },
    required: ['name'],
  },
};

export async function domainsHandler(args: Record<string, unknown>) {
  const input = DomainsInputSchema.parse(args);

  const data = await apiRequest<{ data: unknown; creditsUsed: number }>({
    method: 'POST',
    path: '/domains/search',
    data: {
      name: input.name,
      extensions: input.extensions || ['.com', '.io', '.co', '.ai', '.app'],
    },
  });

  return data.data;
}
