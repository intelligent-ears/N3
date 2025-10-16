#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { SecurityEngine, type Template } from '@n3/core';
import { Logger } from './utils/logger';
import { OutputFormatter } from './utils/formatter';
import { TemplateManager } from './utils/template-manager';
import { FileScanner } from './utils/file-scanner';
import * as path from 'path';
import * as fs from 'fs';

const program = new Command();
const logger = new Logger();

program
  .name('n3')
  .description('N3 - Nuclei for Web3: Security scanner for smart contracts')
  .version('0.1.0');

// Main scan command
program
  .argument('[target]', 'Target contract file or directory to scan')
  .option('-t, --templates <templates>', 'Templates to use (comma-separated IDs or directory)', '')
  .option('-s, --severity <severity>', 'Filter by severity (critical,high,medium,low,info)', 'critical,high,medium')
  .option('-c, --category <category>', 'Filter by category (smart-contract,defi,token,nft)', '')
  .option('-o, --output <file>', 'Output file for results (JSON, markdown, or HTML)')
  .option('-f, --format <format>', 'Output format (json, markdown, html, terminal)', 'terminal')
  .option('-d, --debug', 'Enable debug mode with verbose logging')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--fail-on-critical', 'Exit with error code if critical issues found', false)
  .option('--no-color', 'Disable colored output')
  .option('--template-dir <dir>', 'Custom template directory', '')
  .option('--list-templates', 'List all available templates')
  .option('--validate', 'Validate templates only, don\'t scan')
  .option('--stats', 'Show statistics after scan')
  .action(async (target: string, options: any) => {
    try {
      // Configure logger
      logger.setDebug(options.debug);
      logger.setVerbose(options.verbose);
      logger.setColor(!options.noColor);

      if (options.debug) {
        logger.debug('Debug mode enabled');
        logger.debug('Options:', options);
      }

      // Handle list templates
      if (options.listTemplates) {
        await listTemplates(options);
        return;
      }

      // Validate target
      if (!target) {
        logger.error('Target file or directory is required');
        program.help();
        return;
      }

      if (!fs.existsSync(target)) {
        logger.error(`Target not found: ${target}`);
        process.exit(1);
      }

      // Show banner
      showBanner(options);

      // Initialize engine
      const spinner = options.debug ? null : ora('Initializing N3 engine...').start();
      const engine = new SecurityEngine();
      
      // Determine template directory
      const templateDir = options.templateDir || 
        path.join(__dirname, '../../core/templates');
      
      logger.debug(`Loading templates from: ${templateDir}`);

      // Parse severity filter
      const severities = options.severity ? options.severity.split(',').map((s: string) => s.trim()) : undefined;
      const categories = options.category ? options.category.split(',').map((c: string) => c.trim()) : undefined;

      // Initialize with filters
      await engine.initialize({
        templatesDir: templateDir,
        severities,
        categories,
      });

      if (spinner) spinner.succeed('Templates loaded');
      logger.success(`Loaded templates from ${templateDir}`);
      logger.debug(`Severity filter: ${severities?.join(', ') || 'all'}`);
      logger.debug(`Category filter: ${categories?.join(', ') || 'all'}`);

      // Handle template validation
      if (options.validate) {
        logger.success('All templates validated successfully');
        return;
      }

      // Scan files
      const fileScanner = new FileScanner(logger);
      const files = await fileScanner.findContracts(target);

      if (files.length === 0) {
        logger.warn(`No Solidity files found in ${target}`);
        return;
      }

      logger.info(`Found ${files.length} contract(s) to scan`);
      logger.debug('Files:', files);

      // Scan each file
      const allReports = [];
      for (const file of files) {
        const scanSpinner = options.debug ? null : ora(`Scanning ${path.basename(file)}...`).start();
        
        logger.debug(`Reading file: ${file}`);
        const code = await fs.promises.readFile(file, 'utf-8');
        
        logger.debug(`File size: ${code.length} bytes`);
        logger.debug(`Starting scan...`);
        
        const startTime = Date.now();
        const report = await engine.scan(code, path.basename(file));
        const duration = Date.now() - startTime;

        if (scanSpinner) {
          const totalIssues = report.results.reduce((sum, r) => sum + r.findings.length, 0);
          if (totalIssues > 0) {
            scanSpinner.fail(`${path.basename(file)}: Found ${totalIssues} issue(s)`);
          } else {
            scanSpinner.succeed(`${path.basename(file)}: No issues found`);
          }
        }

        logger.debug(`Scan completed in ${duration}ms`);
        logger.debug(`Risk score: ${report.overallRiskScore}`);
        
        allReports.push({ file, report, duration });
      }

      // Format and display results
      const formatter = new OutputFormatter(logger, options.noColor);
      
      if (options.output) {
        await formatter.saveToFile(allReports, options.output, options.format);
        logger.success(`Results saved to ${options.output}`);
      } else {
        formatter.displayResults(allReports, options.stats);
      }

      // Handle fail on critical
      const hasCritical = allReports.some(r => r.report.summary.critical > 0);
      if (options.failOnCritical && hasCritical) {
        logger.error('Critical issues found. Exiting with error code 1');
        process.exit(1);
      }

    } catch (error: any) {
      logger.error(`Scan failed: ${error.message}`);
      if (options.debug) {
        logger.debug('Stack trace:', error.stack);
      }
      process.exit(1);
    }
  });

// List templates command
program
  .command('templates')
  .description('List all available security templates')
  .option('-v, --verbose', 'Show detailed template information')
  .option('--category <category>', 'Filter by category')
  .option('--severity <severity>', 'Filter by severity')
  .action(async (options) => {
    await listTemplates(options);
  });

// Update templates command
program
  .command('update')
  .description('Update security templates from repository')
  .action(async () => {
    logger.info('Template update functionality coming soon');
  });

// Validate command
program
  .command('validate <directory>')
  .description('Validate custom templates')
  .action(async (directory) => {
    const spinner = ora('Validating templates...').start();
    try {
      const engine = new SecurityEngine();
      await engine.initialize({ templatesDir: directory });
      spinner.succeed('All templates are valid');
    } catch (error: any) {
      spinner.fail(`Template validation failed: ${error.message}`);
      process.exit(1);
    }
  });

async function listTemplates(options: any) {
  const templateDir = options.templateDir || 
    path.join(__dirname, '../../core/templates');
  
  const manager = new TemplateManager(logger);
  const templates = await manager.loadTemplates(templateDir);
  
  // Apply filters
  let filtered = templates;
  if (options.category) {
    filtered = filtered.filter((t: Template) => t.category === options.category);
  }
  if (options.severity) {
    filtered = filtered.filter((t: Template) => t.severity === options.severity);
  }

  // Display templates
  const formatter = new OutputFormatter(logger, options.noColor);
  formatter.displayTemplates(filtered, options.verbose);
}

// CVE scanning command
program
  .command('cve <target>')
  .description('Scan a URL for known CVEs (Common Vulnerabilities and Exposures)')
  .option('--templates <dir>', 'CVE templates directory')
  .option('--severity <severity>', 'Filter by severity', 'critical,high,medium')
  .option('--tags <tags>', 'Filter by tags (comma-separated)')
  .option('--save <file>', 'Save results to file')
  .option('--format <format>', 'Output format (json, markdown, html, terminal)', 'terminal')
  .option('--debug', 'Enable debug mode')
  .action(async (target, options) => {
    // Lazy load CVE scanner to avoid errors if not used
    const { CVEScanner } = await import('@n3/core');
    
    logger.setDebug(options.debug);
    
    const spinner = ora('Initializing CVE Scanner...').start();
    
    try {
      const scanner = new CVEScanner();
      const templateDir = options.templates || path.join(__dirname, '../../core/cve-templates');
      
      await scanner.initialize({
        templatesDir: templateDir,
        severities: options.severity.split(',').map((s: string) => s.trim()),
        tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : undefined,
      });
      
      spinner.succeed(`Loaded ${scanner.getTemplates().length} CVE templates`);
      
      const scanSpinner = ora(`Scanning ${target}...`).start();
      const report = await scanner.scan(target);
      scanSpinner.succeed('Scan complete');
      
      // Display results
      console.log('\n' + chalk.bold.cyan('🔍 CVE SCAN RESULTS') + '\n');
      console.log(`Target: ${chalk.bold(target)}`);
      console.log(`Total Checks: ${report.totalChecks}`);
      console.log(`Vulnerabilities Found: ${chalk.red.bold(report.vulnerabilities.length)}\n`);
      
      if (report.vulnerabilities.length > 0) {
        report.vulnerabilities.forEach((vuln, idx) => {
          const icon = vuln.template.info.severity === 'critical' ? '🔴' :
                      vuln.template.info.severity === 'high' ? '🟠' : '🟡';
          
          console.log(`${idx + 1}. ${icon} ${chalk.bold(vuln.template.info.name)} [${vuln.template.id}]`);
          console.log(`   Severity: ${chalk.red(vuln.template.info.severity.toUpperCase())}`);
          console.log(`   Matched Path: ${vuln.matchedPath}`);
          console.log(`   Description: ${vuln.template.info.description}`);
          if (vuln.template.info.reference.length > 0) {
            console.log(`   Reference: ${vuln.template.info.reference[0]}`);
          }
          console.log('');
        });
        
        // Summary
        console.log(chalk.bold('📊 Summary:'));
        console.log(`   🔴 Critical: ${report.summary.critical}`);
        console.log(`   🟠 High: ${report.summary.high}`);
        console.log(`   🟡 Medium: ${report.summary.medium}`);
        console.log(`   🔵 Low: ${report.summary.low}`);
        console.log(`   ℹ️  Info: ${report.summary.info}\n`);
      } else {
        console.log(chalk.green('✅ No known CVEs detected!\n'));
      }
      
      // Save report if requested
      if (options.save) {
        try {
          const reportContent = options.format === 'json' 
            ? JSON.stringify(report, null, 2)
            : JSON.stringify(report, null, 2); // TODO: Add other formats
          
          const { writeFile } = await import('fs/promises');
          await writeFile(options.save, reportContent, 'utf-8');
          console.log(chalk.green(`\n📄 Report saved to: ${options.save}\n`));
        } catch (writeError: any) {
          console.error(chalk.red(`Failed to save report: ${writeError.message}`));
        }
      }
      
    } catch (error: any) {
      spinner.fail('CVE scan failed');
      console.error(chalk.red(error.message));
      if (options.debug) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

function showBanner(options: any) {
  if (options.noColor || options.output) return;

  console.log(chalk.magenta(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███╗   ██╗██████╗                                      ║
║   ████╗  ██║╚════██╗                                     ║
║   ██╔██╗ ██║ █████╔╝                                     ║
║   ██║╚██╗██║ ╚═══██╗                                     ║
║   ██║ ╚████║██████╔╝                                     ║
║   ╚═╝  ╚═══╝╚═════╝                                      ║
║                                                           ║
║   N3 - Nuclei for Web3                                   ║
║   Template-Based Security Scanner v0.1.0                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `));
}

program.parse(process.argv);
