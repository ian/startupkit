import { apiRequest, ApiError } from '../lib/api.js';
import { config } from '../lib/config.js';
import chalk from 'chalk';
import ora from 'ora';

interface ResearchResult {
  trends: unknown;
  seo: unknown;
  keywords: unknown;
  domains: unknown;
  summary: string;
}

export async function research(options: { topic: string }): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" first.'));
    process.exit(1);
  }

  const spinner = ora(`Conducting market research on "${options.topic}"...`).start();

  try {
    const data = await apiRequest<{ data: ResearchResult; creditsUsed: number }>({
      method: 'POST',
      path: '/research',
      data: { topic: options.topic },
      timeout: 120000,
    });

    spinner.succeed();

    console.log(`\n${chalk.bold.cyan('Market Research: ' + options.topic)}`);
    console.log(chalk.gray(`  Credits used: ${chalk.cyan(data.creditsUsed.toString())}`));
    console.log(chalk.gray(`  Credits remaining: ${chalk.cyan((config.credits || 0).toString())}`));

    console.log('\n' + chalk.bold.cyan('Summary'));
    console.log(chalk.white(data.data.summary));

    if (data.data.keywords) {
      console.log('\n' + chalk.bold.cyan('Keywords'));
      console.log(chalk.gray(JSON.stringify(data.data.keywords, null, 2)));
    }

    if (data.data.domains) {
      console.log('\n' + chalk.bold.cyan('Domains'));
      console.log(chalk.gray(JSON.stringify(data.data.domains, null, 2)));
    }
  } catch (error) {
    spinner.fail();
    if (error instanceof ApiError) {
      console.error(chalk.red('✗ ' + error.message));
      process.exit(error.statusCode || 1);
    }
    console.error(chalk.red('✗ Failed to conduct research'));
    process.exit(1);
  }
}
