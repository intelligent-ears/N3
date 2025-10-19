import { Template, ScanResult, Finding, Severity } from './types';

export class RiskCalculator {
  /**
   * Calculate risk score for a single template match
   */
  calculateTemplateRisk(template: Template, findings: Finding[]): number {
    let score = template.risk_calculation.base_score;

      // Apply modifiers based on findings
      if (template.risk_calculation.modifiers) {
        // This would be expanded based on actual contract analysis
        // For now, return base score if vulnerabilities found
        if (findings.length === 0) {
          // No vulnerability found, apply all positive modifiers
          const modifierValues = Object.values(template.risk_calculation.modifiers) as number[];
          score += modifierValues.reduce((sum: number, val: number) => sum + val, 0);
        }
      }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate overall risk score from multiple scan results
   */
  calculateOverallRisk(results: ScanResult[]): number {
    if (results.length === 0) return 100; // No scans = perfect score

    const vulnerableResults = results.filter((r) => r.vulnerable);
    if (vulnerableResults.length === 0) return 100; // No vulnerabilities

    // Weight by severity
    const severityWeights: Record<Severity, number> = {
      critical: 1.0,
      high: 0.7,
      medium: 0.4,
      low: 0.2,
      info: 0.1,
    };

    let totalWeight = 0;
    let weightedScore = 0;

    vulnerableResults.forEach((result) => {
      const weight = severityWeights[result.template.severity];
      totalWeight += weight;
      // Vulnerable templates contribute negatively
      weightedScore += weight * (100 - result.riskScore);
    });

    const averageDeduction = totalWeight > 0 ? weightedScore / totalWeight : 0;
    const overallScore = 100 - averageDeduction;

    return Math.max(0, Math.min(100, overallScore));
  }

  /**
   * Generate risk summary
   */
  generateSummary(results: ScanResult[]): {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  } {
    const summary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    results
      .filter((r) => r.vulnerable)
      .forEach((result) => {
        const severity = result.template.severity as keyof typeof summary;
        summary[severity]++;
      });

    return summary;
  }

  /**
   * Get risk level label
   */
  getRiskLevel(score: number): string {
    if (score >= 90) return 'LOW RISK';
    if (score >= 70) return 'MEDIUM RISK';
    if (score >= 40) return 'HIGH RISK';
    return 'CRITICAL RISK';
  }
}
