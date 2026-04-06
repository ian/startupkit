import { whoami as checkUser } from '../lib/auth.js';
import type { User } from '../lib/auth.js';
import chalk from 'chalk';
import { config } from '../lib/config.js';

export async function whoami(): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" to get started.'));
    return;
  }

  console.log('\n' + chalk.bold.cyan('Account Info'));

  const user: User | null = await checkUser();

  if (!user) {
    console.error(chalk.red('✗ Session expired or invalid. Please login again.'));
    config.clear();
    return;
  }

  console.log(`\n  ${chalk.gray('Email:')} ${chalk.white(user.email)}`);
  console.log(`  ${chalk.gray('Plan:')} ${chalk.white(user.plan.charAt(0).toUpperCase() + user.plan.slice(1))}`);
  console.log(`  ${chalk.gray('Credits:')} ${chalk.cyan(user.credits.toString())}`);
  console.log(`  ${chalk.gray('Bonus Credits:')} ${chalk.cyan(user.bonusCredits.toString())}`);
  console.log(`  ${chalk.gray('Member Since:')} ${chalk.white(new Date(user.createdAt).toLocaleDateString())}`);
}
