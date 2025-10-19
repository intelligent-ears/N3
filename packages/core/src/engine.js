"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityEngine = void 0;
const parser_1 = require("./parser");
const risk_calculator_1 = require("./risk-calculator");
class SecurityEngine {
    constructor() {
        this.templates = [];
        this.parser = new parser_1.TemplateParser();
        this.riskCalculator = new risk_calculator_1.RiskCalculator();
    }
    /**
     * Initialize engine with templates
     */
    async initialize(config) {
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
    async scan(contractCode, contractName) {
        const results = [];
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
    async scanWithTemplate(contractCode, template) {
        const findings = [];
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
    checkPattern(contractCode, pattern, template) {
        const findings = [];
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
    performCheck(contractCode, check, pattern) {
        switch (check) {
            case 'no_nonReentrant_modifier':
                return !contractCode.includes('nonReentrant');
            case 'no_fee_calculation':
                return !contractCode.match(/fee\s*=.*\*/gi);
            default:
                // For functions check
                if (pattern.functions) {
                    return pattern.functions.some((fn) => contractCode.includes(`function ${fn}`));
                }
                return false;
        }
    }
    /**
     * Get all loaded templates
     */
    getTemplates() {
        return this.templates;
    }
    /**
     * Get template by ID
     */
    getTemplate(id) {
        return this.parser.getTemplateById(this.templates, id);
    }
}
exports.SecurityEngine = SecurityEngine;
