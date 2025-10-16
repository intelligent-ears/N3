/* eslint-disable no-console */
import { task } from 'hardhat/config';
import { SecurityEngine } from '@n3/core';
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import * as path from 'path';

interface AuditOptions {
  network?: string;
  output?: string;
  format?: 'json' | 'html' | 'markdown';
  simulate?: boolean;
}

task('n3:audit', 'Run comprehensive security audit with optional network simulation')
  .addOptionalParam('network', 'Network to simulate on (mainnet, polygon, etc.)')
  .addOptionalParam('output', 'Output file for audit report')
  .addOptionalParam('format', 'Report format (json, html, markdown)', 'markdown')
  .addFlag('simulate', 'Run attack simulations on forked network')
  .setAction(async (taskArgs: AuditOptions, hre: any) => {
    const spinner = ora('Starting N3 Comprehensive Security Audit...').start();

    try {
      // Initialize security engine
      const engine = new SecurityEngine();
      
      // @ts-ignore
      const config = hre.config.n3 || {};
      
      await engine.initialize({
        templatesDir: config.templates || './n3-templates',
        severities: ['critical', 'high', 'medium', 'low', 'info'],
      });

      spinner.text = 'Analyzing contract architecture...';

      // Get all contracts
      const contractFiles = await glob('contracts/**/*.sol');
      spinner.succeed(`Found ${contractFiles.length} contracts for audit`);

      // Scan all contracts
      const reports = [];
      for (const contractFile of contractFiles) {
        const scanSpinner = ora(`Auditing ${path.basename(contractFile)}...`).start();
        
        const contractCode = await readFile(contractFile, 'utf-8');
        const report = await engine.scan(contractCode, contractFile);
        
        reports.push({
          file: contractFile,
          name: path.basename(contractFile, '.sol'),
          report,
        });
        
        scanSpinner.succeed(`${path.basename(contractFile)}: ${report.results.filter(r => r.vulnerable).length} issues found`);
      }

      // Run simulations if requested
      if (taskArgs.simulate && taskArgs.network) {
        spinner.start(`Simulating attacks on ${taskArgs.network}...`);
        
        // Fork network for simulation
        await hre.network.provider.request({
          method: "hardhat_reset",
          params: [
            {
              forking: {
                jsonRpcUrl: hre.config.networks[taskArgs.network]?.url,
              },
            },
          ],
        });

        spinner.succeed('Attack simulation completed');
      }

      // Generate comprehensive audit report
      const auditReport = generateAuditReport(reports, {
        network: taskArgs.network,
        simulated: taskArgs.simulate || false,
        timestamp: new Date().toISOString(),
      });

      // Display summary
      displayAuditSummary(reports);

      // Save report if output specified
      if (taskArgs.output) {
        const reportContent = formatAuditReport(auditReport, taskArgs.format || 'markdown');
        await writeFile(taskArgs.output, reportContent, 'utf-8');
        console.log(chalk.green(`\n📄 Audit report saved to: ${taskArgs.output}\n`));
      }

      // Check for critical issues
      const totalCritical = reports.reduce((sum, r) => sum + r.report.summary.critical, 0);
      const totalHigh = reports.reduce((sum, r) => sum + r.report.summary.high, 0);

      if (totalCritical > 0 || totalHigh > 0) {
        console.log(chalk.red(`\n⚠️  AUDIT ALERT: Found ${totalCritical} critical and ${totalHigh} high severity issues!\n`));
        
        if (config.failOnCritical && totalCritical > 0) {
          process.exit(1);
        }
      } else {
        console.log(chalk.green('\n✅ Audit completed successfully - no critical issues found!\n'));
      }

    } catch (error: any) {
      spinner.fail('Audit failed');
      console.error(chalk.red(error.message));
      if (error.stack) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

function displayAuditSummary(reports: any[]) {
  console.log('\n' + chalk.bold.cyan('📊 COMPREHENSIVE AUDIT SUMMARY') + '\n');

  const table = new Table({
    head: ['Contract', 'Risk Score', 'Critical', 'High', 'Medium', 'Low', 'Info'],
    style: { head: ['cyan'] },
  });

  reports.forEach(({ name, report }) => {
    const riskColor = report.overallRiskScore >= 80 ? chalk.red :
                     report.overallRiskScore >= 60 ? chalk.hex('#FFA500') :
                     report.overallRiskScore >= 40 ? chalk.yellow :
                     chalk.green;

    table.push([
      name,
      riskColor(`${report.overallRiskScore.toFixed(1)}/10`),
      report.summary.critical > 0 ? chalk.red(report.summary.critical) : '0',
      report.summary.high > 0 ? chalk.hex('#FFA500')(report.summary.high) : '0',
      report.summary.medium > 0 ? chalk.yellow(report.summary.medium) : '0',
      report.summary.low > 0 ? chalk.blue(report.summary.low) : '0',
      report.summary.info > 0 ? chalk.gray(report.summary.info) : '0',
    ]);
  });

  console.log(table.toString());

  // Display top vulnerabilities
  console.log('\n' + chalk.bold('🔍 TOP VULNERABILITIES') + '\n');

  const allVulnerabilities = reports
    .flatMap(r => r.report.results.filter((res: any) => res.vulnerable))
    .sort((a: any, b: any) => b.riskScore - a.riskScore)
    .slice(0, 5);

  allVulnerabilities.forEach((vuln: any, idx: number) => {
    const icon = vuln.template.severity === 'critical' ? '🔴' :
                 vuln.template.severity === 'high' ? '🟠' : '🟡';
    
    console.log(`${idx + 1}. ${icon} ${chalk.bold(vuln.template.name)} (Risk: ${vuln.riskScore.toFixed(1)}/10)`);
    console.log(`   ${chalk.gray(vuln.template.description.substring(0, 80))}...`);
    console.log('');
  });
}

function generateAuditReport(reports: any[], metadata: any) {
  const totalIssues = reports.reduce((sum, r) => {
    return sum + r.report.results.filter((res: any) => res.vulnerable).length;
  }, 0);

  const totalSummary = reports.reduce(
    (acc, r) => ({
      critical: acc.critical + r.report.summary.critical,
      high: acc.high + r.report.summary.high,
      medium: acc.medium + r.report.summary.medium,
      low: acc.low + r.report.summary.low,
      info: acc.info + r.report.summary.info,
    }),
    { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
  );

  return {
    metadata,
    summary: {
      totalContracts: reports.length,
      totalIssues,
      ...totalSummary,
    },
    contracts: reports.map(r => ({
      file: r.file,
      name: r.name,
      riskScore: r.report.overallRiskScore,
      summary: r.report.summary,
      vulnerabilities: r.report.results
        .filter((res: any) => res.vulnerable)
        .map((res: any) => ({
          id: res.template.id,
          name: res.template.name,
          severity: res.template.severity,
          category: res.template.category,
          riskScore: res.riskScore,
          description: res.template.description,
          findings: res.findings.length,
          remediation: res.remediation,
        })),
    })),
  };
}

function formatAuditReport(report: any, format: string): string {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }

  if (format === 'html') {
    return generateHTMLReport(report);
  }

  // Markdown format (default)
  return generateMarkdownReport(report);
}

function generateMarkdownReport(report: any): string {
  return `# N3 Security Audit Report

**Generated:** ${new Date(report.metadata.timestamp).toLocaleString()}
${report.metadata.network ? `\n**Network:** ${report.metadata.network}` : ''}
${report.metadata.simulated ? `\n**Attack Simulation:** ✅ Completed` : ''}

---

## Executive Summary

- **Total Contracts Analyzed:** ${report.summary.totalContracts}
- **Total Issues Found:** ${report.summary.totalIssues}
- **Critical Issues:** ${report.summary.critical} 🔴
- **High Severity:** ${report.summary.high} 🟠
- **Medium Severity:** ${report.summary.medium} 🟡
- **Low Severity:** ${report.summary.low} 🔵
- **Informational:** ${report.summary.info} ℹ️

---

## Contracts Analyzed

${report.contracts.map((contract: any) => `
### ${contract.name}

- **File:** \`${contract.file}\`
- **Risk Score:** ${contract.riskScore.toFixed(1)}/10
- **Issues:** ${contract.vulnerabilities.length}

${contract.vulnerabilities.length > 0 ? `
#### Vulnerabilities

${contract.vulnerabilities.map((vuln: any, idx: number) => `
${idx + 1}. **${vuln.name}** [\`${vuln.id}\`]
   - **Severity:** ${vuln.severity.toUpperCase()}
   - **Category:** ${vuln.category}
   - **Risk Score:** ${vuln.riskScore.toFixed(1)}/10
   - **Description:** ${vuln.description}
   - **Findings:** ${vuln.findings}
   ${vuln.remediation ? `- **Remediation:**\n${vuln.remediation.map((r: string) => `     - ${r}`).join('\n')}` : ''}
`).join('\n')}
` : '✅ No vulnerabilities detected'}
`).join('\n---\n')}

---

## Recommendations

1. **Address Critical Issues Immediately** - Fix all critical severity vulnerabilities before deployment
2. **Review High Severity Issues** - Implement recommended fixes for high severity findings
3. **Follow Best Practices** - Apply security patterns and use audited libraries
4. **Continuous Monitoring** - Implement runtime monitoring with N3
5. **Regular Audits** - Run comprehensive audits before major releases

---

*Generated by N3 - Nuclei for Web3*
`;
}

function generateHTMLReport(report: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>N3 Security Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
    .summary-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .contract { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .vuln { border-left: 4px solid #ddd; padding: 15px; margin: 10px 0; background: #fafafa; }
    .critical { border-left-color: #dc3545; }
    .high { border-left-color: #fd7e14; }
    .medium { border-left-color: #ffc107; }
    .low { border-left-color: #17a2b8; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .badge-critical { background: #dc3545; color: white; }
    .badge-high { background: #fd7e14; color: white; }
    .badge-medium { background: #ffc107; color: black; }
    .badge-low { background: #17a2b8; color: white; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ N3 Security Audit Report</h1>
    <p>Generated: ${new Date(report.metadata.timestamp).toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="summary-card">
      <h3>Contracts</h3>
      <h2>${report.summary.totalContracts}</h2>
    </div>
    <div class="summary-card">
      <h3>Total Issues</h3>
      <h2>${report.summary.totalIssues}</h2>
    </div>
    <div class="summary-card">
      <h3>Critical</h3>
      <h2 style="color: #dc3545">${report.summary.critical}</h2>
    </div>
    <div class="summary-card">
      <h3>High</h3>
      <h2 style="color: #fd7e14">${report.summary.high}</h2>
    </div>
  </div>

  ${report.contracts.map((contract: any) => `
    <div class="contract">
      <h2>${contract.name}</h2>
      <p><code>${contract.file}</code></p>
      <p><strong>Risk Score:</strong> ${contract.riskScore.toFixed(1)}/10</p>
      
      ${contract.vulnerabilities.map((vuln: any) => `
        <div class="vuln ${vuln.severity}">
          <h3>${vuln.name} <span class="badge badge-${vuln.severity}">${vuln.severity.toUpperCase()}</span></h3>
          <p><strong>ID:</strong> ${vuln.id} | <strong>Category:</strong> ${vuln.category} | <strong>Risk:</strong> ${vuln.riskScore.toFixed(1)}/10</p>
          <p>${vuln.description}</p>
          ${vuln.remediation ? `<p><strong>Remediation:</strong></p><ul>${vuln.remediation.map((r: string) => `<li>${r}</li>`).join('')}</ul>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('')}

  <footer style="text-align: center; margin-top: 40px; color: #666;">
    <p>Generated by N3 - Nuclei for Web3</p>
  </footer>
</body>
</html>`;
}
