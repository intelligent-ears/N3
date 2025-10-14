import { Template, ScanResult, Finding, SecurityReport } from './types';
import { TemplateParser } from './parser';
import { RiskCalculator } from './risk-calculator';

export interface EngineConfig {
  templatesDir: string;
  severities?: string[];
  categories?: string[];
}

export class SecurityEngine {
  private parser: TemplateParser;
  private riskCalculator: RiskCalculator;
  private templates: Template[] = [];

  constructor() {
    this.parser = new TemplateParser();
    this.riskCalculator = new RiskCalculator();
  }

  /**
   * Initialize engine with templates
   */
  async initialize(config: EngineConfig): Promise<void> {
    this.templates = await this.parser.loadTemplates(config.templatesDir);

    if (config.severities) {
      this.templates = this.parser.filterBySeverity(this.templates, config.severities);
    }

    if (config.categories) {
      this.templates = this.parser.filterByCategory(this.templates, config.categories);
    }
  }

  /**
   * Scan contract code with loaded templates
   */
  async scan(contractCode: string, contractName?: string): Promise<SecurityReport> {
    const results: ScanResult[] = [];

    for (const template of this.templates) {
      const scanResult = await this.scanWithTemplate(contractCode, template);
      results.push(scanResult);
    }

    const overallRiskScore = this.riskCalculator.calculateOverallRisk(results);
    const summary = this.riskCalculator.generateSummary(results);

    return {
      contractName,
      timestamp: Date.now(),
      overallRiskScore,
      totalScans: results.length,
      results,
      summary,
    };
  }

  /**
   * Scan with a specific template
   */
  private async scanWithTemplate(contractCode: string, template: Template): Promise<ScanResult> {
    const findings: Finding[] = [];

    // Check each pattern in the template
    for (const pattern of template.detection.patterns) {
      const patternFindings = this.checkPattern(contractCode, pattern, template);
      findings.push(...patternFindings);
    }

    const vulnerable = findings.length > 0;
    const riskScore = this.riskCalculator.calculateTemplateRisk(template, findings);

    return {
      template,
      vulnerable,
      riskScore,
      findings,
      remediation: vulnerable ? template.remediation.fixes : undefined,
    };
  }

  /**
   * Check a specific pattern against contract code
   */
  private checkPattern(
    contractCode: string,
    pattern: any,
    template: Template
  ): Finding[] {
    const findings: Finding[] = [];

    // Solidity pattern matching
    if (pattern.solidity) {
      const regex = new RegExp(pattern.solidity.replace(/\s+/g, '\\s*'), 'gi');
      const matches = contractCode.match(regex);

      if (matches && matches.length > 0) {
        findings.push({
          severity: template.severity,
          message: `Pattern "${pattern.name}" detected: ${template.description}`,
          pattern: pattern.name,
        });
      }
    }

    // Check pattern matching
    if (pattern.check) {
      const checkResult = this.performCheck(contractCode, pattern.check, pattern);
      if (!checkResult) {
        findings.push({
          severity: template.severity,
          message: `Check failed: ${pattern.check}`,
          pattern: pattern.name,
        });
      }
    }

    return findings;
  }

  /**
   * Perform custom checks
   */
  private performCheck(contractCode: string, check: string, pattern: any): boolean {
    switch (check) {
      case 'no_nonReentrant_modifier':
        return !contractCode.includes('nonReentrant');
      
      case 'no_fee_calculation':
        return !contractCode.match(/fee\s*=.*\*/gi);
      
      default:
        // For functions check
        if (pattern.functions) {
          return pattern.functions.some((fn: string) =>
            contractCode.includes(`function ${fn}`)
          );
        }
        return false;
    }
  }

  /**
   * Get all loaded templates
   */
  getTemplates(): Template[] {
    return this.templates;
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): Template | undefined {
    return this.parser.getTemplateById(this.templates, id);
  }
}
