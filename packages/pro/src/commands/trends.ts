import { apiRequest, ApiError } from '../lib/api.js';
import { config } from '../lib/config.js';
import chalk from 'chalk';
import ora from 'ora';

interface TrendsInterest {
  keyword: string;
  timestamp: string;
  value: number;
}

interface TrendsData {
  keyword: string;
  region: string;
  timeframe: string;
  interest: TrendsInterest[];
  relatedQueries: Array<{ query: string; value: number }>;
  relatedTopics: Array<{ topic: string; type: string; value: number }>;
}

export async function trends(options: { query: string; region?: string; timeframe?: string }): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" first.'));
    process.exit(1);
  }

  const spinner = ora('Fetching trends data...').start();

  try {
    const data = await apiRequest<{ data: TrendsData; creditsUsed: number }>({
      method: 'POST',
      path: '/trends',
      data: {
        keyword: options.query,
        region: options.region || 'US',
        timeframe: options.timeframe || '90d',
      },
    });

    spinner.succeed();

    console.log(`\n${chalk.bold.cyan('Google Trends: ' + options.query)}`);
    console.log(chalk.green('✓') + ` Region: ${data.data.region} | Timeframe: ${data.data.timeframe}`);
    console.log(chalk.gray(`  Credits used: ${chalk.cyan(data.creditsUsed.toString())}`));
    console.log(chalk.gray(`  Credits remaining: ${chalk.cyan((config.credits || 0).toString())}`));

    console.log('\n' + chalk.bold.cyan('Interest Over Time'));
    for (const point of data.data.interest.slice(-10)) {
      const bar = '█'.repeat(Math.round(point.value / 10));
      console.log(`  ${new Date(point.timestamp).toLocaleDateString()} ${chalk.cyan(bar)} ${point.value}`);
    }

    if (data.data.relatedQueries.length > 0) {
      console.log('\n' + chalk.bold.cyan('Related Queries'));
      for (const q of data.data.relatedQueries.slice(0, 10)) {
        console.log(`  ${chalk.gray('▸')} ${q.query} ${chalk.dim(`(${q.value})`)}`);
      }
    }

    if (data.data.relatedTopics.length > 0) {
      console.log('\n' + chalk.bold.cyan('Related Topics'));
      for (const t of data.data.relatedTopics.slice(0, 10)) {
        console.log(`  ${chalk.gray('▸')} ${t.topic} ${chalk.dim(`[${t.type}]`)}`);
      }
    }
  } catch (error) {
    spinner.fail();
    if (error instanceof ApiError) {
      console.error(chalk.red('✗ ' + error.message));
      process.exit(error.statusCode || 1);
    }
    console.error(chalk.red('✗ Failed to fetch trends data'));
    process.exit(1);
  }
}
