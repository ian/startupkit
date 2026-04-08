import { apiRequest, ApiError } from '../lib/api.js';
import { config } from '../lib/config.js';
import chalk from 'chalk';
import ora from 'ora';

interface KeywordData {
  keyword: string;
  keywords: Array<{
    keyword: string;
    searchVolume: number;
    competition: string;
    cpc: number;
    trend: number[];
  }>;
  questions: Array<{ question: string; popularity: number }>;
}

export async function keywords(options: { seed: string; limit?: string; difficulty?: boolean }): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" first.'));
    process.exit(1);
  }

  const spinner = ora('Researching keywords...').start();

  try {
    const data = await apiRequest<{ data: KeywordData; creditsUsed: number }>({
      method: 'POST',
      path: '/keywords',
      data: {
        keyword: options.seed,
        limit: parseInt(options.limit || '20', 10),
      },
    });

    spinner.succeed();

    console.log(`\n${chalk.bold.cyan('Keywords: ' + options.seed)}`);
    console.log(chalk.gray(`  Credits used: ${chalk.cyan(data.creditsUsed.toString())}`));
    console.log(chalk.gray(`  Credits remaining: ${chalk.cyan((config.credits || 0).toString())}`));

    if (data.data.keywords.length > 0) {
      console.log('\n' + chalk.bold.cyan('Keyword Suggestions'));
      console.log(chalk.gray('Keyword'.padEnd(40)) + 'Search Vol'.padEnd(12) + 'Competition'.padEnd(12) + 'CPC'.padEnd(8) + 'Trend');
      console.log(chalk.gray('─'.repeat(80)));
      
      for (const kw of data.data.keywords) {
        const trendStr = kw.trend.slice(-6).map((t) => (t > 0 ? '↑' : t < 0 ? '↓' : '→')).join('');
        console.log(
          chalk.white(kw.keyword.padEnd(40)) +
          chalk.cyan(kw.searchVolume.toLocaleString().padEnd(12)) +
          chalk.yellow(kw.competition.padEnd(12)) +
          chalk.green(`$${kw.cpc.toFixed(2)}`.padEnd(8)) +
          chalk.gray(trendStr)
        );
      }
    }

    if (data.data.questions.length > 0) {
      console.log('\n' + chalk.bold.cyan('Related Questions'));
      for (const q of data.data.questions.slice(0, 8)) {
        const bar = '█'.repeat(Math.round(q.popularity / 10));
        console.log(`  ${chalk.gray('▸')} ${q.question} ${chalk.dim(bar)}`);
      }
    }
  } catch (error) {
    spinner.fail();
    if (error instanceof ApiError) {
      console.error(chalk.red('✗ ' + error.message));
      process.exit(error.statusCode || 1);
    }
    console.error(chalk.red('✗ Failed to research keywords'));
    process.exit(1);
  }
}
