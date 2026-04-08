import { apiRequest, ApiError } from '../lib/api.js';
import { config } from '../lib/config.js';
import chalk from 'chalk';
import readline from 'readline';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  toolsUsed: string[];
  creditsUsed: number;
  creditsRemaining: number;
}

export async function chat(options?: { topic?: string }): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" first.'));
    process.exit(1);
  }

  const messages: ChatMessage[] = [];

  if (options?.topic) {
    messages.push({ role: 'user', content: options.topic });
    const response = await sendMessage(messages);
    messages.push({ role: 'assistant', content: response.message });
    printAssistant(response.message, response.toolsUsed);
  }

  console.log(chalk.gray('\n(type "exit" to quit, "help" for commands)\n'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = (): void => {
    rl.question(chalk.cyan('You: '), async (input: string) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      if (input.toLowerCase() === 'help') {
        console.log(chalk.gray('\nCommands:'));
        console.log('  trends <query>   - Search Google Trends');
        console.log('  seo <domain>     - Analyze domain SEO');
        console.log('  keywords <kw>   - Research keywords');
        console.log('  domains <name>  - Check domain availability');
        console.log('  apps <app>      - Research mobile app');
        console.log('  exit            - Exit chat\n');
        prompt();
        return;
      }

      messages.push({ role: 'user', content: input });

      try {
        const response = await sendMessage(messages);
        messages.push({ role: 'assistant', content: response.message });
        printAssistant(response.message, response.toolsUsed);
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 402) {
          console.error(chalk.red('✗ Insufficient credits for new research. Please upgrade your plan.'));
        } else {
          console.error(chalk.red('✗ Failed to get response. Please try again.'));
        }
      }

      prompt();
    });
  };

  prompt();
}

async function sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  return apiRequest<ChatResponse>({
    method: 'POST',
    path: '/chat',
    data: { messages },
    timeout: 120000,
  });
}

function printAssistant(content: string, toolsUsed: string[]): void {
  console.log(chalk.green('\nAssistant:'));

  for (const line of content.split('\n')) {
    console.log('  ' + line);
  }

  if (toolsUsed.length > 0) {
    console.log(chalk.gray(`\n  (Tools used: ${toolsUsed.join(', ')})`));
  }
  console.log();
}
