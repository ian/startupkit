import { getCredits } from '../lib/auth.js';
import { config } from '../lib/config.js';
import chalk from 'chalk';

interface CreditUsage {
  tool: string;
  count: number;
  creditsUsed: number;
  lastUsed: string;
}

export async function credits(): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" to get started.'));
    return;
  }

  console.log('\n' + chalk.bold.cyan('Credit Balance'));

  const balance = await getCredits();

  if (!balance) {
    console.error(chalk.red('✗ Unable to fetch credit balance. Please try again later.'));
    return;
  }

  console.log(`\n  ${chalk.gray('Available Credits:')} ${chalk.cyan(balance.balance.toString())}`);
  console.log(`  ${chalk.gray('Total Used:')} ${chalk.white(balance.used.toString())}`);
  console.log(`  ${chalk.gray('Total Allocated:')} ${chalk.white(balance.total.toString())}`);

  console.log('\n' + chalk.bold.cyan('Usage History'));
  console.log(chalk.gray('Tool'.padEnd(20)) + 'Requests'.padEnd(12) + 'Credits Used'.padEnd(15) + 'Last Used');
  console.log(chalk.gray('─'.repeat(65)));

  const usageHistory = await getUsageHistory();
  if (usageHistory.length > 0) {
    for (const u of usageHistory) {
      console.log(
        chalk.white(u.tool.padEnd(20)) +
        chalk.cyan(u.count.toString().padEnd(12)) +
        chalk.yellow(u.creditsUsed.toString().padEnd(15)) +
        chalk.gray(new Date(u.lastUsed).toLocaleDateString())
      );
    }
  } else {
    console.log(chalk.gray('  No usage yet. Start using the tools to see your history!'));
  }
}

async function getUsageHistory(): Promise<CreditUsage[]> {
  try {
    const response = await fetch(`${config.apiBaseUrl}/credits/history`, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  } catch {
    // Ignore errors
  }
  return [];
}
