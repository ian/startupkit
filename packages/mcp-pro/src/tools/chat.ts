import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { apiRequest } from '../lib/api.js';
import { ChatInputSchema } from '../lib/schema.js';

export const chatTool: Tool = {
  name: 'chat',
  description: 'Interactive AI research assistant that intelligently uses research tools based on questions',
  inputSchema: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: 'What you want to research',
      },
    },
    required: ['topic'],
  },
};

export async function chatHandler(args: Record<string, unknown>) {
  const input = ChatInputSchema.parse(args);

  const data = await apiRequest<{
    message: string;
    toolsUsed: string[];
    creditsUsed: number;
    creditsRemaining: number;
  }>({
    method: 'POST',
    path: '/chat',
    data: {
      messages: [{ role: 'user', content: input.topic }],
    },
    timeout: 120000,
  });

  return data;
}
