import chalk from 'chalk';
import Table from 'cli-table3';
import type { SecurityReport, Template } from '@n3/core';
import type { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

interface ScanReport {
  file: string;
  report: SecurityReport;
  duration: number;
}

export class OutputFormatter {
  constructor(
    private logger: Logger,
    private noColor: boolean = false
  ) {}

  displayResults(reports: ScanReport[], showStats: boolean = false): void {
    this.logger.newline();
    this.logger.raw(this.colorize('═'.repeat(60), chalk.cyan));
    this.logger.raw(this.colorize('  SCAN RESULTS', chalk.bold.cyan));
    this.logger.raw(this.colorize('═'.repeat(60), chalk.cyan));
    this.logger.newline();

    for (const { file, report, duration } of reports) {
      this.displaySingleReport(file, report, duration);
    }

    if (showStats) {
      this.displayStatistics(reports);
    }

    this.displaySummary(reports);
  }

  private displaySingleReport(file: string, report: SecurityReport, duration: number): void {
    const basename = path.basename(file);
    const totalIssues = report.results.reduce((sum, r) => sum + r.findings.length, 0);

    // File header
    this.logger.raw(this.colorize(`📄 ${basename}`, chalk.bold.white));
    const riskColor = this.getRiskColor(report.overallRiskScore);
    this.logger.raw(`   Risk Score: ${this.colorize(report.overallRiskScore.toFixed(2) + '/10', riskColor)}`);
    this.logger.raw(this.colorize(`   Duration: ${duration}ms`, chalk.gray));
    this.logger.newline();

    if (totalIssues === 0) {
      this.logger.success('No vulnerabilities detected');
      this.logger.newline();
      return;
    }

    // Display findings by template
    for (const result of report.results) {
      if (!result.vulnerable || result.findings.length === 0) continue;

      const severityColor = this.getSeverityColor(result.template.severity);
      const severityBadge = this.getSeverityBadge(result.template.severity);
      
      this.logger.raw(`  ${severityBadge} ${this.colorize(result.template.name, chalk.bold)} ${this.colorize(`(${result.template.id})`, chalk.gray)}`);
      this.logger.raw(`     ${this.colorize('Category:', chalk.gray)} ${result.template.category}`);
      this.logger.raw(`     ${this.colorize('Risk Score:', chalk.gray)} ${result.riskScore.toFixed(2)}/10`);
      this.logger.raw(`     ${this.colorize('Findings:', chalk.gray)} ${result.findings.length}`);

      // Display findings
      result.findings.forEach((finding, idx) => {
        const location = finding.location?.line ? `Line ${finding.location.line}` : 'Unknown';
        this.logger.raw(`       ${idx + 1}. ${this.colorize(location, chalk.yellow)}: ${finding.message}`);
      });

      this.logger.newline();
    }
  }

  private displayStatistics(reports: ScanReport[]): void {
    this.logger.raw(this.colorize('═'.repeat(60), chalk.cyan));
    this.logger.raw(this.colorize('  STATISTICS', chalk.bold.cyan));
    this.logger.raw(this.colorize('═'.repeat(60), chalk.cyan));
    this.logger.newline();

    const totalFiles = reports.length;
    const totalDuration = reports.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = totalDuration / totalFiles;

    const allResults = reports.flatMap(r => r.report.results);
    const totalScans = allResults.length;
    const vulnerableScans = allResults.filter(r => r.vulnerable).length;

    this.logger.info(`Total Files Scanned: ${totalFiles}`);
    this.logger.info(`Total Template Checks: ${totalScans}`);
    this.logger.info(`Vulnerable Checks: ${vulnerableScans}`);
    this.logger.info(`Average Scan Time: ${avgDuration.toFixed(2)}ms`);
    this.logger.info(`Total Scan Time: ${totalDuration}ms`);
    this.logger.newline();
  }

  private displaySummary(reports: ScanReport[]): void {
    this.logger.raw(this.colorize('═'.repeat(60), chalk.cyan));
    this.logger.raw(this.colorize('  SUMMARY', chalk.bold.cyan));
    this.logger.raw(this.colorize('═'.repeat(60), chalk.cyan));
    this.logger.newline();

    const summary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    reports.forEach(({ report }) => {
      summary.critical += report.summary.critical;
      summary.high += report.summary.high;
      summary.medium += report.summary.medium;
      summary.low += report.summary.low;
      summary.info += report.summary.info;
    });

    const table = new Table({
      head: ['Severity', 'Count'],
      style: {
        head: this.noColor ? [] : ['cyan'],
        border: this.noColor ? [] : ['gray'],
      },
    });

    table.push(
      [this.colorize('🔴 Critical', chalk.red.bold), summary.critical],
      [this.colorize('🟠 High', chalk.yellow.bold), summary.high],
      [this.colorize('🟡 Medium', chalk.blue.bold), summary.medium],
      [this.colorize('🟢 Low', chalk.green.bold), summary.low],
      [this.colorize('ℹ️  Info', chalk.gray.bold), summary.info]
    );

    console.log(table.toString());
    this.logger.newline();

    const total = Object.values(summary).reduce((a, b) => a + b, 0);
    if (total === 0) {
      this.logger.success('All contracts are secure! No vulnerabilities detected.');
    } else if (summary.critical > 0) {
      this.logger.error(`Found ${total} total issue(s) including ${summary.critical} CRITICAL`);
    } else if (summary.high > 0) {
      this.logger.warn(`Found ${total} total issue(s) including ${summary.high} HIGH`);
    } else {
      this.logger.info(`Found ${total} total issue(s)`);
    }
  }

  displayTemplates(templates: Template[], verbose: boolean = false): void {
    this.logger.newline();
    this.logger.raw(this.colorize('═'.repeat(60), chalk.cyan));
    this.logger.raw(this.colorize(`  AVAILABLE TEMPLATES (${templates.length})`, chalk.bold.cyan));
    this.logger.raw(this.colorize('═'.repeat(60), chalk.cyan));
    this.logger.newline();

    templates.forEach(template => {
      const severityBadge = this.getSeverityBadge(template.severity);
      this.logger.raw(`${severityBadge} ${this.colorize(template.id, chalk.bold)} - ${template.name}`);
      this.logger.raw(`   ${this.colorize('Category:', chalk.gray)} ${template.category}`);
      this.logger.raw(`   ${this.colorize('Severity:', chalk.gray)} ${template.severity.toUpperCase()}`);
      
      if (verbose) {
        this.logger.raw(`   ${this.colorize('Description:', chalk.gray)} ${template.description.trim().split('\n')[0]}`);
        this.logger.raw(`   ${this.colorize('Patterns:', chalk.gray)} ${template.detection.patterns.length}`);
        this.logger.raw(`   ${this.colorize('Base Risk:', chalk.gray)} ${template.risk_calculation.base_score}/100`);
      }
      
      this.logger.newline();
    });
  }

  async saveToFile(reports: ScanReport[], outputFile: string, format: string): Promise<void> {
    const ext = path.extname(outputFile).slice(1) || format;
    
    switch (ext) {
      case 'json':
        await this.saveAsJson(reports, outputFile);
        break;
      case 'md':
      case 'markdown':
        await this.saveAsMarkdown(reports, outputFile);
        break;
      case 'html':
        await this.saveAsHtml(reports, outputFile);
        break;
      default:
        throw new Error(`Unsupported output format: ${ext}`);
    }
  }

  private async saveAsJson(reports: ScanReport[], file: string): Promise<void> {
    const data = reports.map(({ file, report, duration }) => ({
      file,
      duration,
      riskScore: report.overallRiskScore,
      summary: report.summary,
      timestamp: report.timestamp,
      results: report.results.map(r => ({
        template: r.template.id,
        vulnerable: r.vulnerable,
        riskScore: r.riskScore,
        findings: r.findings,
      })),
    }));

    await fs.promises.writeFile(file, JSON.stringify(data, null, 2));
  }

  private async saveAsMarkdown(reports: ScanReport[], file: string): Promise<void> {
    let md = '# N3 Security Scan Report\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;

    for (const { file: contractFile, report, duration } of reports) {
      md += `## ${path.basename(contractFile)}\n\n`;
      md += `- **Risk Score**: ${report.overallRiskScore.toFixed(2)}/10\n`;
      md += `- **Scan Duration**: ${duration}ms\n`;
      md += `- **Timestamp**: ${new Date(report.timestamp).toISOString()}\n\n`;

      md += '### Summary\n\n';
      md += `| Severity | Count |\n`;
      md += `|----------|-------|\n`;
      md += `| 🔴 Critical | ${report.summary.critical} |\n`;
      md += `| 🟠 High | ${report.summary.high} |\n`;
      md += `| 🟡 Medium | ${report.summary.medium} |\n`;
      md += `| 🟢 Low | ${report.summary.low} |\n`;
      md += `| ℹ️ Info | ${report.summary.info} |\n\n`;

      md += '### Findings\n\n';
      for (const result of report.results) {
        if (!result.vulnerable) continue;

        md += `#### ${result.template.name} (${result.template.id})\n\n`;
        md += `- **Severity**: ${result.template.severity.toUpperCase()}\n`;
        md += `- **Category**: ${result.template.category}\n`;
        md += `- **Risk Score**: ${result.riskScore.toFixed(2)}/10\n`;
        md += `- **Findings**: ${result.findings.length}\n\n`;

        result.findings.forEach((finding, idx) => {
          const loc = finding.location?.line ? `Line ${finding.location.line}` : 'Unknown';
          md += `${idx + 1}. **${loc}**: ${finding.message}\n`;
        });

        md += '\n';
      }
    }

    await fs.promises.writeFile(file, md);
  }

  private async saveAsHtml(reports: ScanReport[], file: string): Promise<void> {
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>N3 Security Scan Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 2px solid #6b46c1; padding-bottom: 10px; }
    .file { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #6b46c1; }
    .critical { color: #dc2626; }
    .high { color: #f59e0b; }
    .medium { color: #3b82f6; }
    .low { color: #10b981; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #6b46c1; color: white; }
    .finding { margin: 10px 0; padding: 10px; background: #fff; border-left: 3px solid #f59e0b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛡️ N3 Security Scan Report</h1>
    <p>Generated: ${new Date().toISOString()}</p>
`;

    for (const { file: contractFile, report, duration } of reports) {
      html += `
    <div class="file">
      <h2>📄 ${path.basename(contractFile)}</h2>
      <p><strong>Risk Score:</strong> ${report.overallRiskScore.toFixed(2)}/10</p>
      <p><strong>Duration:</strong> ${duration}ms</p>
      
      <h3>Summary</h3>
      <table>
        <tr><th>Severity</th><th>Count</th></tr>
        <tr><td class="critical">🔴 Critical</td><td>${report.summary.critical}</td></tr>
        <tr><td class="high">🟠 High</td><td>${report.summary.high}</td></tr>
        <tr><td class="medium">🟡 Medium</td><td>${report.summary.medium}</td></tr>
        <tr><td class="low">🟢 Low</td><td>${report.summary.low}</td></tr>
        <tr><td>ℹ️ Info</td><td>${report.summary.info}</td></tr>
      </table>
      
      <h3>Findings</h3>
`;

      for (const result of report.results) {
        if (!result.vulnerable) continue;

        html += `
      <div class="finding">
        <h4>${result.template.name} (${result.template.id})</h4>
        <p><strong>Severity:</strong> <span class="${result.template.severity}">${result.template.severity.toUpperCase()}</span></p>
        <p><strong>Risk Score:</strong> ${result.riskScore.toFixed(2)}/10</p>
        <ul>
`;
        result.findings.forEach(finding => {
          const loc = finding.location?.line ? `Line ${finding.location.line}` : 'Unknown';
          html += `          <li><strong>${loc}:</strong> ${finding.message}</li>\n`;
        });
        html += `        </ul>\n      </div>\n`;
      }

      html += `    </div>\n`;
    }

    html += `
  </div>
</body>
</html>
`;

    await fs.promises.writeFile(file, html);
  }

  private colorize(text: string, color: typeof chalk.green): string {
    return this.noColor ? text : color(text);
  }

  private getSeverityColor(severity: string): typeof chalk.green {
    switch (severity.toLowerCase()) {
      case 'critical': return chalk.red.bold;
      case 'high': return chalk.yellow.bold;
      case 'medium': return chalk.blue.bold;
      case 'low': return chalk.green.bold;
      default: return chalk.gray.bold;
    }
  }

  private getSeverityBadge(severity: string): string {
    const badges = {
      critical: this.colorize('🔴 [CRITICAL]', chalk.red.bold),
      high: this.colorize('🟠 [HIGH]', chalk.yellow.bold),
      medium: this.colorize('🟡 [MEDIUM]', chalk.blue.bold),
      low: this.colorize('🟢 [LOW]', chalk.green.bold),
      info: this.colorize('ℹ️  [INFO]', chalk.gray.bold),
    };
    return badges[severity.toLowerCase() as keyof typeof badges] || badges.info;
  }

  private getRiskColor(score: number): typeof chalk.green {
    if (score >= 80) return chalk.red.bold;
    if (score >= 60) return chalk.yellow.bold;
    if (score >= 40) return chalk.blue.bold;
    return chalk.green.bold;
  }
}
