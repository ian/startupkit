import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { trendsTool, trendsHandler } from './tools/trends.js';
import { seoTool, seoHandler } from './tools/seo.js';
import { keywordsTool, keywordsHandler } from './tools/keywords.js';
import { domainsTool, domainsHandler } from './tools/domains.js';
import { appsTool, appsHandler } from './tools/apps.js';
import { researchTool, researchHandler } from './tools/research.js';
import { chatTool, chatHandler } from './tools/chat.js';
import { creditsTool, creditsHandler } from './tools/credits.js';
import { Config } from './lib/config.js';

const config = new Config();

const tools: Tool[] = [
  trendsTool,
  seoTool,
  keywordsTool,
  domainsTool,
  appsTool,
  researchTool,
  chatTool,
  creditsTool,
];

const handlers: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  trends: trendsHandler,
  seo: seoHandler,
  keywords: keywordsHandler,
  domains: domainsHandler,
  apps: appsHandler,
  research: researchHandler,
  chat: chatHandler,
  credits: creditsHandler,
};

const server = new Server(
  {
    name: 'startupkit-pro',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {
        listChanged: true,
      },
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!config.apiKey) {
    return {
      content: [
        {
          type: 'text',
          text: 'Not logged in. Run "startupkit-pro login" first or set STARTUPKIT_API_KEY environment variable.',
        },
      ],
      isError: true,
    };
  }

  const handler = handlers[name];
  if (!handler) {
    return {
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${name}`,
        },
      ],
      isError: true,
    };
  }

  try {
    const result = await handler(args as Record<string, unknown>);
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('StartupKit Pro MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
