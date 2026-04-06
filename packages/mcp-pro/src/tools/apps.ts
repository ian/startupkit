import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { apiRequest } from '../lib/api.js';
import { AppsInputSchema } from '../lib/schema.js';

export const appsTool: Tool = {
  name: 'apps',
  description: 'Research mobile applications on iOS App Store and Google Play Store',
  inputSchema: {
    type: 'object',
    properties: {
      app: {
        type: 'string',
        description: 'App name or package/bundle ID',
      },
      store: {
        type: 'string',
        enum: ['ios', 'android', 'both'],
        description: 'App store to search',
      },
    },
    required: ['app'],
  },
};

export async function appsHandler(args: Record<string, unknown>) {
  const input = AppsInputSchema.parse(args);

  const data = await apiRequest<{ data: unknown; creditsUsed: number }>({
    method: 'POST',
    path: '/apps',
    data: {
      app: input.app,
      store: input.store || 'both',
    },
  });

  return data.data;
}
