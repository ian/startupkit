import { apiRequest, ApiError } from '../lib/api.js';
import { config } from '../lib/config.js';
import chalk from 'chalk';
import ora from 'ora';

interface DomainResult {
  name: string;
  available: boolean;
  price?: number;
  renewalPrice?: number;
  registrar: string;
}

export async function domains(options: { seed: string; tlds?: string }): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" first.'));
    process.exit(1);
  }

  const spinner = ora('Checking domain availability...').start();

  const extensions = options.tlds 
    ? options.tlds.split(',').map((e) => (e.startsWith('.') ? e : `.${e}`))
    : ['.com', '.io', '.co', '.ai', '.app'];

  try {
    const data = await apiRequest<{ data: DomainResult[]; creditsUsed: number }>({
      method: 'POST',
      path: '/domains/search',
      data: { name: options.seed, extensions },
    });

    spinner.succeed();

    console.log(`\n${chalk.bold.cyan('Domain Search: ' + options.seed)}`);
    console.log(chalk.gray(`  Credits used: ${chalk.cyan(data.creditsUsed.toString())}`));
    console.log(chalk.gray(`  Credits remaining: ${chalk.cyan((config.credits || 0).toString())}`));

    console.log('\n' + chalk.bold.cyan('Results'));
    console.log(chalk.gray('Domain'.padEnd(30)) + 'Status'.padEnd(12) + 'Price'.padEnd(12) + 'Renewal');
    console.log(chalk.gray('─'.repeat(70)));

    for (const d of data.data) {
      const statusColor = d.available ? chalk.green : chalk.gray;
      const status = d.available ? 'Available' : 'Taken';
      const priceStr = d.price ? `$${d.price.toFixed(2)}` : '-';
      const renewStr = d.renewalPrice ? `$${d.renewalPrice.toFixed(2)}` : '-';
      console.log(
        chalk.white(d.name.padEnd(30)) +
        statusColor(status.padEnd(12)) +
        chalk.cyan(priceStr.padEnd(12)) +
        chalk.gray(renewStr)
      );
    }

    const available = data.data.filter((d) => d.available);
    if (available.length > 0) {
      console.log(`\n${chalk.green('✓')} ${available.length} domain(s) available!`);
    }
  } catch (error) {
    spinner.fail();
    if (error instanceof ApiError) {
      console.error(chalk.red('✗ ' + error.message));
      process.exit(error.statusCode || 1);
    }
    console.error(chalk.red('✗ Failed to check domain availability'));
    process.exit(1);
  }
}
