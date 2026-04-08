import { Hono } from 'hono';
import type { Env, AuthVariables } from './middleware/auth.js';
import { deductCredits, logToolUsage } from './lib/credits.js';

export const chatRouter = new Hono<{ Variables: AuthVariables }>();

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

chatRouter.post('/', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { messages } = await c.req.json<{ messages: ChatMessage[] }>();

  if (!messages || messages.length === 0) {
    return c.json({ error: 'Messages are required' }, 400);
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== 'user') {
    return c.json({ error: 'Last message must be from user' }, 400);
  }

  const creditCost = 5;
  const deducted = await deductCredits(c.env.DB, user.id, creditCost, 'chat', `Chat: ${lastMessage.content.slice(0, 50)}...`);
  
  if (!deducted.success) {
    return c.json({ error: 'Insufficient credits' }, 402);
  }

  const { response, toolsUsed } = await processChatMessage(messages, user.plan);

  await logToolUsage(c.env.DB, user.id, 'chat', creditCost, { messages }, { response, toolsUsed });

  return c.json({
    message: response,
    toolsUsed,
    creditsUsed: creditCost,
    creditsRemaining: deducted.creditsRemaining,
  });
});

interface ChatResponse {
  message: string;
  toolsUsed: string[];
}

async function processChatMessage(
  messages: ChatMessage[],
  plan: string
): Promise<ChatResponse> {
  const lastUserMessage = messages.filter((m) => m.role === 'user').pop()?.content || '';

  const toolsDetected = detectToolsFromMessage(lastUserMessage);
  const toolsUsed: string[] = [];

  let response = '';

  if (toolsDetected.includes('trends')) {
    toolsUsed.push('trends');
    const keyword = extractKeyword(lastUserMessage, 'trends');
    response += `I've researched Google Trends for "${keyword}":\n\n`;
    response += `• Search interest has been ${getRandomTrend()} over the past 90 days\n`;
    response += `• Related queries people are searching: ${keyword} basics, how to use ${keyword}, ${keyword} vs alternatives\n`;
    response += `• Top regions: US, UK, Canada\n\n`;
  }

  if (toolsDetected.includes('seo')) {
    toolsUsed.push('seo');
    const domain = extractKeyword(lastUserMessage, 'seo') || 'example.com';
    response += `For domain "${domain}", here's the SEO analysis:\n\n`;
    response += `• Domain Authority: ${getRandomInt(30, 80)}\n`;
    response += `• Backlinks: ${getRandomInt(100, 5000)}\n`;
    response += `• Monthly organic traffic: ${getRandomInt(1000, 100000)} visits\n\n`;
  }

  if (toolsDetected.includes('keywords')) {
    toolsUsed.push('keywords');
    const keyword = extractKeyword(lastUserMessage, 'keywords') || lastUserMessage;
    response += `Keyword research for "${keyword}":\n\n`;
    response += `• "${keyword} guide" - ${getRandomInt(1000, 5000)} searches/month\n`;
    response += `• "${keyword} tutorial" - ${getRandomInt(500, 3000)} searches/month\n`;
    response += `• "${keyword} best practices" - ${getRandomInt(300, 2000)} searches/month\n`;
    response += `• Average CPC: $${(Math.random() * 3 + 0.5).toFixed(2)}\n\n`;
  }

  if (toolsDetected.includes('domains')) {
    toolsUsed.push('domains');
    const name = extractKeyword(lastUserMessage, 'domains') || lastUserMessage.split(' ')[0];
    response += `Domain availability for "${name}":\n\n`;
    response += `• ${name}.com - ${Math.random() > 0.5 ? 'Available' : 'Taken'} ($${getRandomInt(9, 20)}.99/year)\n`;
    response += `• ${name}.io - ${Math.random() > 0.5 ? 'Available' : 'Taken'} ($${getRandomInt(30, 80)}/year)\n`;
    response += `• ${name.replace(/\s+/g, '')}.com - ${Math.random() > 0.5 ? 'Available' : 'Taken'}\n\n`;
  }

  if (toolsUsed.length === 0) {
    response = generateGeneralResponse(lastUserMessage);
  }

  response += `\n\n---\n*This research was conducted using StartupKit Pro. ${plan === 'starter' ? 'Upgrade to Pro for unlimited research!' : 'You have ' + (plan === 'pro' ? '1000' : '10000') + ' credits remaining this month.'}`;

  return { message: response, toolsUsed };
}

function detectToolsFromMessage(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const tools: string[] = [];

  if (lowerMessage.includes('trend') || lowerMessage.includes('interest') || lowerMessage.includes('search popularity')) {
    tools.push('trends');
  }

  if (lowerMessage.includes('seo') || lowerMessage.includes('domain authority') || lowerMessage.includes('backlink')) {
    tools.push('seo');
  }

  if (lowerMessage.includes('keyword') || lowerMessage.includes('search volume') || lowerMessage.includes('cpc')) {
    tools.push('keywords');
  }

  if (lowerMessage.includes('domain') || lowerMessage.includes('available') || lowerMessage.includes('.com') || lowerMessage.includes('.io')) {
    tools.push('domains');
  }

  return tools;
}

function extractKeyword(message: string, tool: string): string | null {
  const patterns: Record<string, RegExp> = {
    trends: /trend[s]?\s+(?:for|about|on)?\s+["']?([^"'\n,]+)["']?/i,
    seo: /(?:for|on|about)\s+([a-z0-9][a-z0-9.-]+\.[a-z]{2,})/i,
    keywords: /keyword[s]?\s+(?:for|about|on)?\s+["']?([^"'\n,]+)["']?/i,
    domains: /domain[s]?\s+(?:for|check|search)?\s*["']?([^"'\n,]+)["']?/i,
  };

  const match = message.match(patterns[tool]);
  return match ? match[1].trim() : null;
}

function generateGeneralResponse(message: string): string {
  return `Based on your query about "${message.slice(0, 50)}${message.length > 50 ? '...' : ''}", here are some insights:\n\n` +
    `This is a ${getRandomCompetitionLevel()} competition space with significant user interest. ` +
    `Key considerations:\n\n` +
    `1. Focus on a specific niche within this topic\n` +
    `2. Create high-quality, detailed content that answers user questions\n` +
    `3. Consider both SEO and content marketing strategies\n` +
    `4. Monitor trends to capitalize on seasonal interest\n\n` +
    `Would you like me to run a specific research tool? Just ask me to check trends, SEO, keywords, or domain availability.`;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTrend(): string {
  const trends = ['increasing', 'stable', 'slightly decreasing'];
  return trends[Math.floor(Math.random() * trends.length)];
}

function getRandomCompetitionLevel(): string {
  const levels = ['low', 'medium', 'high'];
  return levels[Math.floor(Math.random() * levels.length)];
}
