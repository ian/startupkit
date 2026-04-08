import { apiRequest, ApiError } from '../lib/api.js';
import { config } from '../lib/config.js';
import chalk from 'chalk';
import ora from 'ora';

interface AppData {
  name: string;
  appStore: string;
  developer: string;
  iconUrl: string;
  description: string;
  rating: number;
  ratingsCount: number;
  price: number;
  category: string;
  version: string;
  size: string;
  installCount: string;
  ageRating: string;
  released: string;
  updated: string;
  similarApps: Array<{ name: string; appId: string }>;
}

export async function apps(options: { query: string; store?: string }): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" first.'));
    process.exit(1);
  }

  const spinner = ora('Researching app...').start();

  try {
    const data = await apiRequest<{ data: AppData | AppData[]; creditsUsed: number }>({
      method: 'POST',
      path: '/apps',
      data: {
        app: options.query,
        store: options.store || 'both',
      },
    });

    spinner.succeed();

    const apps = Array.isArray(data.data) ? data.data : [data.data];

    console.log(`\n${chalk.bold.cyan('App Research: ' + options.query)}`);
    console.log(chalk.gray(`  Credits used: ${chalk.cyan(data.creditsUsed.toString())}`));
    console.log(chalk.gray(`  Credits remaining: ${chalk.cyan((config.credits || 0).toString())}`));

    for (const appData of apps) {
      console.log('\n' + chalk.bold.white(appData.name) + chalk.gray(` (${appData.appStore})`));
      console.log(chalk.gray(`by ${appData.developer}`));
      console.log(
        chalk.yellow('★'.repeat(Math.round(appData.rating))) +
        chalk.gray('★'.repeat(5 - Math.round(appData.rating))) +
        chalk.dim(` (${appData.ratingsCount.toLocaleString()} ratings)`)
      );

      console.log(`\n  ${chalk.gray('Category:')} ${chalk.white(appData.category)}`);
      console.log(`  ${chalk.gray('Price:')} ${appData.price === 0 ? chalk.green('Free') : chalk.cyan('$' + appData.price.toFixed(2))}`);
      console.log(`  ${chalk.gray('Version:')} ${chalk.white(appData.version)}`);
      console.log(`  ${chalk.gray('Size:')} ${chalk.white(appData.size)}`);
      console.log(`  ${chalk.gray('Age Rating:')} ${chalk.white(appData.ageRating)}`);

      if (appData.description) {
        console.log('\n  ' + chalk.dim(appData.description.slice(0, 200) + (appData.description.length > 200 ? '...' : '')));
      }

      if (appData.similarApps.length > 0) {
        console.log('\n  ' + chalk.gray('Similar: ') + appData.similarApps.map((a) => a.name).join(', '));
      }
    }
  } catch (error) {
    spinner.fail();
    if (error instanceof ApiError) {
      console.error(chalk.red('✗ ' + error.message));
      process.exit(error.statusCode || 1);
    }
    console.error(chalk.red('✗ Failed to research app'));
    process.exit(1);
  }
}
