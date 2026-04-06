import inquirer from 'inquirer';
import { login as doLogin } from '../lib/auth.js';
import chalk from 'chalk';

export async function login(): Promise<void> {
  const { apiKey } = await (inquirer as any).prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your API key:',
      validate: (input: string) => {
        if (!input || input.length < 10) {
          return 'Please enter a valid API key';
        }
        return true;
      },
    },
  ]);

  try {
    await doLogin(apiKey);
  } catch (error) {
    console.error(chalk.red('✗ Login failed:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
