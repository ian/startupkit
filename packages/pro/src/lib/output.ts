import chalk from 'chalk';

export function formatCredits(credits: number): string {
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}k`;
  }
  return credits.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function printHeader(text: string): void {
  console.log(`\n${chalk.bold.cyan(text)}`);
  console.log(chalk.gray('─'.repeat(50)));
}

export function printSuccess(text: string): void {
  console.log(chalk.green('✓') + ` ${text}`);
}

export function printError(text: string): void {
  console.error(chalk.red('✗') + ` ${text}`);
}

export function printWarning(text: string): void {
  console.warn(chalk.yellow('⚠') + ` ${text}`);
}

export function printInfo(label: string, value: string): void {
  console.log(`  ${chalk.gray(label + ':')} ${chalk.white(value)}`);
}

export function printCredits(used: number, remaining: number): void {
  console.log(chalk.gray(`  Credits used: ${chalk.cyan(used.toString())}`));
  console.log(chalk.gray(`  Credits remaining: ${chalk.cyan(remaining.toString())}`));
}

export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function printTable(headers: string[], rows: string[][]): void {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => (r[i] || '').length))
  );

  const headerRow = headers.map((h, i) => h.padEnd(widths[i])).join(' | ');
  console.log(chalk.bold(headerRow));
  console.log(chalk.gray(widths.map(w => '─'.repeat(w)).join('-+-')));

  for (const row of rows) {
    console.log(row.map((c, i) => (c || '').padEnd(widths[i])).join(' | '));
  }
}
