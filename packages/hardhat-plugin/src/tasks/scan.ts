/* eslint-disable no-console */
import { task } from 'hardhat/config';
import { SecurityEngine } from '@n3/core';
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';

task('n3:scan', 'Scan contracts for security vulnerabilities')
  .addOptionalParam('contract', 'Specific contract to scan')
  .addFlag('ci', 'CI mode - exit with code 1 if critical issues found')
  .setAction(async (taskArgs: { contract?: string; ci?: boolean }, hre: any) => {
    const spinner = ora('Initializing N3 Security Scanner...').start();

    try {
      // Initialize security engine
      const engine = new SecurityEngine();
      
      // @ts-ignore
      const config = hre.config.n3;
      
      await engine.initialize({
        templatesDir: config.templates,
        severities: config.severity,
      });

      spinner.text = 'Loading contracts...';

      // Get contracts to scan
      const contractFiles = taskArgs.contract
        ? [taskArgs.contract]
        : await glob('contracts/**/*.sol');

      spinner.succeed(`Found ${contractFiles.length} contracts to scan`);

      const results = [];
      for (const contractFile of contractFiles) {
        const scanSpinner = ora(`Scanning ${contractFile}...`).start();
        
        const contractCode = await readFile(contractFile, 'utf-8');
        const report = await engine.scan(contractCode, contractFile);
        
        results.push(report);
        
        const riskLevel = report.overallRiskScore >= 90 ? 'LOW' : 
                         report.overallRiskScore >= 70 ? 'MEDIUM' : 
                         report.overallRiskScore >= 40 ? 'HIGH' : 'CRITICAL';
        
        const color = report.overallRiskScore >= 90 ? chalk.green :
                     report.overallRiskScore >= 70 ? chalk.yellow :
                     report.overallRiskScore >= 40 ? chalk.hex('#FFA500') :
                     chalk.red;
        
        scanSpinner.succeed(
          `${contractFile}: ${color(`${report.overallRiskScore}/100 (${riskLevel} RISK)`)}`
        );
      }

      // Display summary
      // eslint-disable-next-line no-console
      console.log('\n' + chalk.bold('📊 Security Scan Summary') + '\n');

      const table = new Table({
        head: ['Severity', 'Count'],
        style: { head: ['cyan'] },
      });

      const totalSummary = results.reduce(
        (acc, r) => ({
          critical: acc.critical + r.summary.critical,
          high: acc.high + r.summary.high,
          medium: acc.medium + r.summary.medium,
          low: acc.low + r.summary.low,
          info: acc.info + r.summary.info,
        }),
        { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
      );

      table.push(
        [chalk.red('❌ CRITICAL'), totalSummary.critical],
        [chalk.hex('#FFA500')('⚠️  HIGH'), totalSummary.high],
        [chalk.yellow('⚠️  MEDIUM'), totalSummary.medium],
        [chalk.blue('ℹ️  LOW'), totalSummary.low],
        [chalk.gray('ℹ️  INFO'), totalSummary.info]
      );

      console.log(table.toString());

      // Display vulnerable findings
      for (const report of results) {
        const vulnerableResults = report.results.filter((r) => r.vulnerable);
        
        if (vulnerableResults.length > 0) {
          console.log(`\n${chalk.bold(report.contractName || 'Contract')}:`);
          
          vulnerableResults.forEach((result) => {
            const icon = result.template.severity === 'critical' ? '❌' :
                        result.template.severity === 'high' ? '⚠️ ' : 'ℹ️ ';
            
            console.log(`  ${icon} ${chalk.bold(result.template.name)}`);
            console.log(`     ${chalk.gray(result.template.description.substring(0, 100))}...`);
            
            if (result.remediation) {
              console.log(`     ${chalk.cyan('Fixes:')}`);
              result.remediation.slice(0, 2).forEach((fix) => {
                console.log(`       • ${fix}`);
              });
            }
          });
        }
      }

      // Check if should fail
      if (config.failOnCritical && totalSummary.critical > 0) {
        console.log(chalk.red('\n💥 Critical vulnerabilities found! Failing build.\n'));
        process.exit(1);
      }

      if (taskArgs.ci && (totalSummary.critical > 0 || totalSummary.high > 0)) {
        console.log(chalk.red('\n💥 Security issues found in CI mode! Failing build.\n'));
        process.exit(1);
      }

      console.log(chalk.green('\n✅ Security scan completed!\n'));

    } catch (error) {
      spinner.fail('Scan failed');
      console.error(chalk.red(error));
      process.exit(1);
    }
  });
