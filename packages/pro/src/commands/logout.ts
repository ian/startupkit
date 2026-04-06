import { logout as authLogout } from '../lib/auth.js';
import chalk from 'chalk';

export async function logout(): Promise<void> {
  try {
    await authLogout();
    console.log(chalk.green('✓ Logged out'));
  } catch (error) {
    console.error(chalk.red('✗ Logout failed:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
