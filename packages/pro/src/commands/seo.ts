import { apiRequest, ApiError } from '../lib/api.js';
import { config } from '../lib/config.js';
import chalk from 'chalk';
import ora from 'ora';

interface SeoData {
  domain: string;
  overview: {
    domainAuthority: number;
    pageAuthority: number;
    backlinks: number;
    referringDomains: number;
    monthlyVisits: number;
    organicKeywords: number;
  };
  topKeywords: Array<{ keyword: string; position: number; traffic: number; trafficPercent: number }>;
  topPages: Array<{ url: string; traffic: number; keywords: number }>;
}

export async function seo(options: { domain: string }): Promise<void> {
  if (!config.isLoggedIn) {
    console.error(chalk.red('✗ Not logged in. Run "startupkit-pro login" first.'));
    process.exit(1);
  }

  const spinner = ora('Analyzing domain SEO...').start();

  try {
    const data = await apiRequest<{ data: SeoData; creditsUsed: number }>({
      method: 'POST',
      path: '/seo/overview',
      data: { domain: options.domain },
    });

    spinner.succeed();

    console.log(`\n${chalk.bold.cyan('SEO Overview: ' + options.domain)}`);
    console.log(chalk.gray(`  Credits used: ${chalk.cyan(data.creditsUsed.toString())}`));
    console.log(chalk.gray(`  Credits remaining: ${chalk.cyan((config.credits || 0).toString())}`));

    console.log('\n' + chalk.bold.cyan('Authority Scores'));
    console.log(`  ${chalk.gray('Domain Authority:')} ${chalk.white(data.data.overview.domainAuthority.toString())}`);
    console.log(`  ${chalk.gray('Page Authority:')} ${chalk.white(data.data.overview.pageAuthority.toString())}`);

    console.log('\n' + chalk.bold.cyan('Backlinks'));
    console.log(`  ${chalk.gray('Total Backlinks:')} ${chalk.white(data.data.overview.backlinks.toLocaleString())}`);
    console.log(`  ${chalk.gray('Referring Domains:')} ${chalk.white(data.data.overview.referringDomains.toLocaleString())}`);

    console.log('\n' + chalk.bold.cyan('Traffic'));
    console.log(`  ${chalk.gray('Monthly Visits:')} ${chalk.white(data.data.overview.monthlyVisits.toLocaleString())}`);
    console.log(`  ${chalk.gray('Organic Keywords:')} ${chalk.white(data.data.overview.organicKeywords.toLocaleString())}`);

    if (data.data.topKeywords.length > 0) {
      console.log('\n' + chalk.bold.cyan('Top Keywords'));
      for (const kw of data.data.topKeywords.slice(0, 10)) {
        const posColor = kw.position <= 3 ? chalk.green : kw.position <= 10 ? chalk.yellow : chalk.gray;
        console.log(
          `  ${posColor('#' + kw.position)} ${kw.keyword} ${chalk.dim(`(${kw.trafficPercent}%)`)}`
        );
      }
    }

    if (data.data.topPages.length > 0) {
      console.log('\n' + chalk.bold.cyan('Top Pages'));
      for (const page of data.data.topPages.slice(0, 5)) {
        console.log(`  ${chalk.gray('▸')} ${chalk.dim(page.url)}`);
        console.log(`    ${chalk.cyan(page.traffic.toLocaleString())} visits | ${page.keywords} keywords`);
      }
    }
  } catch (error) {
    spinner.fail();
    if (error instanceof ApiError) {
      console.error(chalk.red('✗ ' + error.message));
      process.exit(error.statusCode || 1);
    }
    console.error(chalk.red('✗ Failed to analyze domain'));
    process.exit(1);
  }
}
