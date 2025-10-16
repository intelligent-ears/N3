/* eslint-disable no-console */
import { task } from 'hardhat/config';
import { SecurityEngine } from '@n3/core';
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import * as path from 'path';

interface CoverageOptions {
  output?: string;
  format?: 'json' | 'html' | 'markdown';
  threshold?: number;
}

task('n3:coverage', 'Generate security coverage report showing template coverage')
  .addOptionalParam('output', 'Output file for coverage report')
  .addOptionalParam('format', 'Report format (json, html, markdown)', 'markdown')
  .addOptionalParam('threshold', 'Minimum coverage threshold (0-100)', '80')
  .setAction(async (taskArgs: CoverageOptions, hre: any) => {
    const spinner = ora('Calculating N3 Security Coverage...').start();

    try {
      // Initialize security engine
      const engine = new SecurityEngine();
      
      // @ts-ignore
      const config = hre.config.n3 || {};
      
      await engine.initialize({
        templatesDir: config.templates || './n3-templates',
        severities: ['critical', 'high', 'medium', 'low', 'info'],
      });

      // Get all available templates
      const templates = engine.getTemplates();
      spinner.text = `Analyzing coverage for ${templates.length} security templates...`;

      // Get all contracts
      const contractFiles = await glob('contracts/**/*.sol');
      spinner.succeed(`Analyzing ${contractFiles.length} contracts`);

      // Scan all contracts and track template coverage
      const templateCoverage = new Map<string, {
        template: any;
        triggered: number;
        contracts: string[];
        findings: number;
      }>();

      // Initialize coverage tracking
      templates.forEach((template: any) => {
        templateCoverage.set(template.id, {
          template,
          triggered: 0,
          contracts: [],
          findings: 0,
        });
      });

      // Scan contracts and update coverage
      for (const contractFile of contractFiles) {
        const scanSpinner = ora(`Scanning ${path.basename(contractFile)}...`).start();
        
        const contractCode = await readFile(contractFile, 'utf-8');
        const report = await engine.scan(contractCode, contractFile);
        
        report.results.forEach((result: any) => {
          const coverage = templateCoverage.get(result.template.id);
          if (coverage && result.vulnerable) {
            coverage.triggered++;
            if (!coverage.contracts.includes(contractFile)) {
              coverage.contracts.push(contractFile);
            }
            coverage.findings += result.findings.length;
          }
        });

        scanSpinner.succeed(`${path.basename(contractFile)}`);
      }

      // Calculate coverage metrics
      const coverageStats = calculateCoverageStats(Array.from(templateCoverage.values()));

      // Display coverage summary
      displayCoverageSummary(coverageStats, Array.from(templateCoverage.values()));

      // Generate report
      const coverageReport = {
        timestamp: new Date().toISOString(),
        contracts: contractFiles.length,
        templates: templates.length,
        stats: coverageStats,
        details: Array.from(templateCoverage.values()).map(c => ({
          id: c.template.id,
          name: c.template.name,
          severity: c.template.severity,
          category: c.template.category,
          triggered: c.triggered,
          contracts: c.contracts.length,
          findings: c.findings,
          covered: c.triggered > 0,
        })),
      };

      // Save report if output specified
      if (taskArgs.output) {
        const reportContent = formatCoverageReport(coverageReport, taskArgs.format || 'markdown');
        await writeFile(taskArgs.output, reportContent, 'utf-8');
        console.log(chalk.green(`\n📄 Coverage report saved to: ${taskArgs.output}\n`));
      }

      // Check threshold
      const threshold = typeof taskArgs.threshold === 'number' ? taskArgs.threshold : parseInt(taskArgs.threshold || '80', 10);
      if (coverageStats.overallCoverage < threshold) {
        console.log(chalk.yellow(`\n⚠️  Coverage (${coverageStats.overallCoverage.toFixed(1)}%) is below threshold (${threshold}%)\n`));
        if (config.failOnCritical) {
          process.exit(1);
        }
      } else {
        console.log(chalk.green(`\n✅ Coverage meets threshold: ${coverageStats.overallCoverage.toFixed(1)}% >= ${threshold}%\n`));
      }

    } catch (error: any) {
      spinner.fail('Coverage analysis failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

function calculateCoverageStats(coverage: any[]) {
  const bySeverity = {
    critical: { total: 0, covered: 0 },
    high: { total: 0, covered: 0 },
    medium: { total: 0, covered: 0 },
    low: { total: 0, covered: 0 },
    info: { total: 0, covered: 0 },
  };

  const byCategory = new Map<string, { total: number; covered: number }>();

  coverage.forEach(c => {
    // By severity
    if (bySeverity[c.template.severity as keyof typeof bySeverity]) {
      bySeverity[c.template.severity as keyof typeof bySeverity].total++;
      if (c.triggered > 0) {
        bySeverity[c.template.severity as keyof typeof bySeverity].covered++;
      }
    }

    // By category
    if (!byCategory.has(c.template.category)) {
      byCategory.set(c.template.category, { total: 0, covered: 0 });
    }
    const catStat = byCategory.get(c.template.category)!;
    catStat.total++;
    if (c.triggered > 0) {
      catStat.covered++;
    }
  });

  const totalTemplates = coverage.length;
  const coveredTemplates = coverage.filter(c => c.triggered > 0).length;
  const overallCoverage = totalTemplates > 0 ? (coveredTemplates / totalTemplates) * 100 : 0;

  return {
    totalTemplates,
    coveredTemplates,
    overallCoverage,
    bySeverity: Object.fromEntries(
      Object.entries(bySeverity).map(([sev, stat]) => [
        sev,
        {
          ...stat,
          percentage: stat.total > 0 ? (stat.covered / stat.total) * 100 : 0,
        },
      ])
    ),
    byCategory: Object.fromEntries(
      Array.from(byCategory.entries()).map(([cat, stat]) => [
        cat,
        {
          ...stat,
          percentage: stat.total > 0 ? (stat.covered / stat.total) * 100 : 0,
        },
      ])
    ),
  };
}

function displayCoverageSummary(stats: any, coverage: any[]) {
  console.log('\n' + chalk.bold.cyan('📊 SECURITY TEMPLATE COVERAGE') + '\n');

  // Overall coverage
  const coverageColor = stats.overallCoverage >= 80 ? chalk.green :
                       stats.overallCoverage >= 60 ? chalk.yellow :
                       chalk.red;

  console.log(chalk.bold('Overall Coverage:'), coverageColor(`${stats.overallCoverage.toFixed(1)}%`));
  console.log(`${stats.coveredTemplates} of ${stats.totalTemplates} templates triggered\n`);

  // Coverage by severity
  console.log(chalk.bold('Coverage by Severity:') + '\n');

  const severityTable = new Table({
    head: ['Severity', 'Covered', 'Total', 'Coverage'],
    style: { head: ['cyan'] },
  });

  Object.entries(stats.bySeverity).forEach(([severity, stat]: [string, any]) => {
    const color = stat.percentage >= 80 ? chalk.green :
                  stat.percentage >= 60 ? chalk.yellow :
                  chalk.red;

    severityTable.push([
      severity.toUpperCase(),
      stat.covered,
      stat.total,
      color(`${stat.percentage.toFixed(1)}%`),
    ]);
  });

  console.log(severityTable.toString());

  // Coverage by category
  console.log('\n' + chalk.bold('Coverage by Category:') + '\n');

  const categoryTable = new Table({
    head: ['Category', 'Covered', 'Total', 'Coverage'],
    style: { head: ['cyan'] },
  });

  Object.entries(stats.byCategory).forEach(([category, stat]: [string, any]) => {
    const color = stat.percentage >= 80 ? chalk.green :
                  stat.percentage >= 60 ? chalk.yellow :
                  chalk.red;

    categoryTable.push([
      category,
      stat.covered,
      stat.total,
      color(`${stat.percentage.toFixed(1)}%`),
    ]);
  });

  console.log(categoryTable.toString());

  // Uncovered templates
  const uncovered = coverage.filter(c => c.triggered === 0);
  if (uncovered.length > 0) {
    console.log('\n' + chalk.bold.yellow(`⚠️  ${uncovered.length} Uncovered Templates:`) + '\n');
    
    uncovered.slice(0, 5).forEach(c => {
      console.log(`  • ${c.template.name} (${c.template.id}) - ${c.template.severity}`);
    });

    if (uncovered.length > 5) {
      console.log(chalk.gray(`  ... and ${uncovered.length - 5} more`));
    }
  }

  // Most triggered templates
  const mostTriggered = coverage
    .filter(c => c.triggered > 0)
    .sort((a, b) => b.triggered - a.triggered)
    .slice(0, 5);

  if (mostTriggered.length > 0) {
    console.log('\n' + chalk.bold.green('✅ Most Triggered Templates:') + '\n');
    
    mostTriggered.forEach((c, idx) => {
      console.log(`  ${idx + 1}. ${c.template.name} (${c.triggered} triggers, ${c.findings} findings)`);
    });
  }
}

function formatCoverageReport(report: any, format: string): string {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }

  if (format === 'html') {
    return generateHTMLCoverageReport(report);
  }

  // Markdown format (default)
  return generateMarkdownCoverageReport(report);
}

function generateMarkdownCoverageReport(report: any): string {
  return `# N3 Security Coverage Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}
**Contracts Analyzed:** ${report.contracts}
**Total Templates:** ${report.templates}

---

## Overall Coverage

**${report.stats.overallCoverage.toFixed(1)}%** (${report.stats.coveredTemplates}/${report.stats.totalTemplates} templates triggered)

---

## Coverage by Severity

| Severity | Covered | Total | Coverage |
|----------|---------|-------|----------|
${Object.entries(report.stats.bySeverity).map(([sev, stat]: [string, any]) => 
  `| ${sev.toUpperCase()} | ${stat.covered} | ${stat.total} | ${stat.percentage.toFixed(1)}% |`
).join('\n')}

---

## Coverage by Category

| Category | Covered | Total | Coverage |
|----------|---------|-------|----------|
${Object.entries(report.stats.byCategory).map(([cat, stat]: [string, any]) => 
  `| ${cat} | ${stat.covered} | ${stat.total} | ${stat.percentage.toFixed(1)}% |`
).join('\n')}

---

## Template Details

${report.details.map((d: any) => `
### ${d.name} [\`${d.id}\`]

- **Severity:** ${d.severity.toUpperCase()}
- **Category:** ${d.category}
- **Status:** ${d.covered ? '✅ Covered' : '❌ Not Covered'}
- **Triggered:** ${d.triggered} times
- **Contracts:** ${d.contracts}
- **Findings:** ${d.findings}
`).join('\n')}

---

*Generated by N3 - Nuclei for Web3*
`;
}

function generateHTMLCoverageReport(report: any): string {
  const coverageColor = report.stats.overallCoverage >= 80 ? '#28a745' :
                       report.stats.overallCoverage >= 60 ? '#ffc107' : '#dc3545';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>N3 Security Coverage Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
    .coverage-circle { width: 200px; height: 200px; border-radius: 50%; background: conic-gradient(${coverageColor} ${report.stats.overallCoverage}%, #e9ecef 0); display: flex; align-items: center; justify-content: center; margin: 20px auto; position: relative; }
    .coverage-inner { width: 150px; height: 150px; border-radius: 50%; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .coverage-percent { font-size: 48px; font-weight: bold; color: ${coverageColor}; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    table { width: 100%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e9ecef; }
    th { background: #f8f9fa; font-weight: 600; }
    .progress-bar { height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: #28a745; transition: width 0.3s; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ N3 Security Coverage Report</h1>
    <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
    <p>Contracts Analyzed: ${report.contracts} | Templates: ${report.templates}</p>
  </div>

  <div class="coverage-circle">
    <div class="coverage-inner">
      <div class="coverage-percent">${report.stats.overallCoverage.toFixed(1)}%</div>
      <div style="font-size: 14px; color: #666;">Coverage</div>
    </div>
  </div>

  <div class="stats-grid">
    ${Object.entries(report.stats.bySeverity).map(([sev, stat]: [string, any]) => `
      <div class="stat-card">
        <h3>${sev.toUpperCase()}</h3>
        <p>${stat.covered} / ${stat.total}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${stat.percentage}%; background: ${stat.percentage >= 80 ? '#28a745' : stat.percentage >= 60 ? '#ffc107' : '#dc3545'}"></div>
        </div>
        <p style="margin: 5px 0 0; font-size: 14px; color: #666;">${stat.percentage.toFixed(1)}%</p>
      </div>
    `).join('')}
  </div>

  <h2>Coverage by Category</h2>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Covered</th>
        <th>Total</th>
        <th>Coverage</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(report.stats.byCategory).map(([cat, stat]: [string, any]) => `
        <tr>
          <td><strong>${cat}</strong></td>
          <td>${stat.covered}</td>
          <td>${stat.total}</td>
          <td><span style="color: ${stat.percentage >= 80 ? '#28a745' : stat.percentage >= 60 ? '#ffc107' : '#dc3545'}">${stat.percentage.toFixed(1)}%</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <footer style="text-align: center; margin-top: 40px; color: #666;">
    <p>Generated by N3 - Nuclei for Web3</p>
  </footer>
</body>
</html>`;
}
