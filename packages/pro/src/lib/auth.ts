import axios from 'axios';
import { config } from './config.js';
import chalk from 'chalk';

export interface User {
  id: string;
  email: string;
  plan: 'starter' | 'pro' | 'enterprise';
  credits: number;
  bonusCredits: number;
  createdAt: string;
}

export async function login(apiKey: string): Promise<User> {
  const response = await axios.post(`${config.apiBaseUrl}/auth/login`, { apiKey });

  const { user, token } = response.data;

  config.apiKey = token;
  config.userId = user.id;
  config.email = user.email;
  config.plan = user.plan;
  config.credits = user.credits;

  console.log(chalk.green('✓') + ' Logged in successfully');
  console.log(chalk.gray(`  Plan: ${user.plan}`));
  console.log(chalk.gray(`  Credits: ${user.credits}`));

  return user;
}

export async function logout(): Promise<void> {
  if (config.apiKey) {
    try {
      await axios.post(
        `${config.apiBaseUrl}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${config.apiKey}` } }
      );
    } catch {
      // Ignore errors on logout
    }
  }
  config.clear();
  console.log(chalk.green('✓') + ' Logged out');
}

export async function whoami(): Promise<User | null> {
  if (!config.apiKey) {
    return null;
  }

  try {
    const response = await axios.get(`${config.apiBaseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });
    return response.data.user;
  } catch (error) {
    config.clear();
    return null;
  }
}

export async function getCredits(): Promise<{ balance: number; used: number; total: number } | null> {
  if (!config.apiKey) {
    return null;
  }

  try {
    const response = await axios.get(`${config.apiBaseUrl}/credits/balance`, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });
    return response.data;
  } catch {
    return null;
  }
}
