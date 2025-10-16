# N3 Hardhat Plugin - Tasks Reference

Complete guide to all available N3 Hardhat tasks for security scanning, testing, auditing, and coverage analysis.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Tasks Overview](#tasks-overview)
  - [n3:scan](#n3scan)
  - [n3:test](#n3test)
  - [n3:audit](#n3audit)
  - [n3:coverage](#n3coverage)
- [Examples](#examples)
- [CI/CD Integration](#cicd-integration)

---

## Installation

```bash
npm install --save-dev @n3/hardhat-plugin
```

Add to your `hardhat.config.js`:

```javascript
require("@n3/hardhat-plugin");

module.exports = {
  solidity: "0.8.20",
  n3: {
    templates: "./n3-templates",
    severity: ["critical", "high", "medium"],
    failOnCritical: true,
    reportFormat: "json",
  }
};
```

---

## Configuration

### N3 Config Options

```typescript
{
  templates: string;           // Path to templates directory
  severity: string[];          // Severity levels to check
  failOnCritical: boolean;     // Exit with error on critical issues
  reportFormat: string;        // Report format (json, html, markdown, console)
  autoFix: boolean;           // Enable auto-fix (future)
  chains: string[];           // Supported chains
}
```

---

## Tasks Overview

### n3:scan

**Scan contracts for security vulnerabilities**

Performs static analysis on your smart contracts using YAML-based security templates.

#### Usage

```bash
# Scan all contracts
npx hardhat n3:scan

# Scan specific contract
npx hardhat n3:scan --contract contracts/MyToken.sol

# CI mode (fail on critical/high issues)
npx hardhat n3:scan --ci
```

#### Options

- `--contract <path>` - Specific contract file to scan
- `--ci` - CI mode: exit with code 1 if critical or high severity issues found

#### Output

```
✔ Found 3 contracts to scan
✔ VulnerableBank.sol: 35/100 (CRITICAL RISK)
✔ SafeToken.sol: 95/100 (LOW RISK)

📊 Security Scan Summary

┌──────────┬───────┐
│ Severity │ Count │
├──────────┼───────┤
│ CRITICAL │ 2     │
│ HIGH     │ 3     │
│ MEDIUM   │ 1     │
└──────────┴───────┘
```

---

### n3:test

**Generate and run security tests from vulnerability templates**

Automatically generates test files based on detected vulnerabilities and optionally runs them.

#### Usage

```bash
# Generate security tests
npx hardhat n3:test --generate

# Generate and run tests
npx hardhat n3:test --generate --run

# Custom output directory
npx hardhat n3:test --generate --output test/n3-security

# Run existing tests
npx hardhat n3:test --run
```

#### Options

- `--generate` - Generate test files from templates
- `--run` - Run generated security tests
- `--output <dir>` - Output directory for tests (default: `test/security`)

#### Generated Test Structure

```javascript
// Auto-generated N3 Security Tests for VulnerableBank
describe("N3 Security Tests - VulnerableBank", function () {
  
  describe("Reentrancy Vulnerability (reentrancy-001)", function () {
    it("should detect: Reentrancy attack vector...", async function () {
      // Template: reentrancy-001
      // Severity: CRITICAL
      // Risk Score: 95.0/10
      
      // Test implementation
      // TODO: Implement specific test
    });
  });
  
});
```

#### Benefits

- **Automated Test Generation** - Saves time writing security tests
- **Template-Based** - Tests aligned with vulnerability templates
- **Integration Ready** - Works with existing Hardhat test suite
- **Documentation** - Each test includes severity, risk score, and remediation

---

### n3:audit

**Run comprehensive security audit with optional network simulation**

Performs deep security analysis across all contracts with detailed reporting.

#### Usage

```bash
# Basic audit
npx hardhat n3:audit

# Audit with network simulation
npx hardhat n3:audit --network mainnet --simulate

# Generate report
npx hardhat n3:audit --output audit-report.md

# HTML report
npx hardhat n3:audit --output audit.html --format html

# JSON report for CI
npx hardhat n3:audit --output audit.json --format json
```

#### Options

- `--network <name>` - Network to simulate on (requires forking)
- `--output <file>` - Output file for audit report
- `--format <type>` - Report format: `json`, `html`, `markdown` (default: markdown)
- `--simulate` - Run attack simulations on forked network

#### Output Formats

**Terminal Output:**
```
📊 COMPREHENSIVE AUDIT SUMMARY

┌─────────────────┬────────────┬──────────┬──────┬────────┬─────┬──────┐
│ Contract        │ Risk Score │ Critical │ High │ Medium │ Low │ Info │
├─────────────────┼────────────┼──────────┼──────┼────────┼─────┼──────┤
│ VulnerableBank  │ 8.7/10     │ 2        │ 2    │ 0      │ 0   │ 0    │
│ SafeToken       │ 2.1/10     │ 0        │ 0    │ 1      │ 2   │ 1    │
└─────────────────┴────────────┴──────────┴──────┴────────┴─────┴──────┘

🔍 TOP VULNERABILITIES

1. 🔴 Price Oracle Manipulation (Risk: 9.0/10)
   Lack of time-weighted average price (TWAP) oracles...

2. 🔴 Flash Loan Attack Vectors (Risk: 9.5/10)
   Missing flash loan fee or protection mechanisms...
```

**Markdown Report:**
- Executive summary with metrics
- Contract-by-contract breakdown
- Vulnerability details with remediation
- Risk assessment and recommendations

**HTML Report:**
- Interactive dashboard
- Visual risk indicators
- Severity badges
- Styled vulnerability cards

**JSON Report:**
- Machine-readable format
- CI/CD integration ready
- Structured data for automation

#### Network Simulation

When using `--simulate` with `--network`:

1. Forks the specified network
2. Deploys contracts to fork
3. Attempts to exploit detected vulnerabilities
4. Reports successful attack vectors
5. Provides proof-of-concept code

---

### n3:coverage

**Generate security template coverage report**

Analyzes which security templates are triggered by your contracts to measure security test coverage.

#### Usage

```bash
# Basic coverage report
npx hardhat n3:coverage

# Set coverage threshold
npx hardhat n3:coverage --threshold 90

# Generate report file
npx hardhat n3:coverage --output coverage.md

# HTML coverage report
npx hardhat n3:coverage --output coverage.html --format html

# JSON for CI integration
npx hardhat n3:coverage --output coverage.json --format json
```

#### Options

- `--output <file>` - Output file for coverage report
- `--format <type>` - Report format: `json`, `html`, `markdown` (default: markdown)
- `--threshold <percent>` - Minimum coverage threshold (0-100, default: 80)

#### Output

```
📊 SECURITY TEMPLATE COVERAGE

Overall Coverage: 75.5%
34 of 45 templates triggered

Coverage by Severity:

┌──────────┬─────────┬───────┬──────────┐
│ Severity │ Covered │ Total │ Coverage │
├──────────┼─────────┼───────┼──────────┤
│ CRITICAL │ 5       │ 8     │ 62.5%    │
│ HIGH     │ 12      │ 15    │ 80.0%    │
│ MEDIUM   │ 10      │ 12    │ 83.3%    │
│ LOW      │ 5       │ 7     │ 71.4%    │
│ INFO     │ 2       │ 3     │ 66.7%    │
└──────────┴─────────┴───────┴──────────┘

Coverage by Category:

┌────────────────┬─────────┬───────┬──────────┐
│ Category       │ Covered │ Total │ Coverage │
├────────────────┼─────────┼───────┼──────────┤
│ smart-contract │ 15      │ 20    │ 75.0%    │
│ defi           │ 12      │ 15    │ 80.0%    │
│ token          │ 5       │ 7     │ 71.4%    │
│ nft            │ 2       │ 3     │ 66.7%    │
└────────────────┴─────────┴───────┴──────────┘

⚠️  11 Uncovered Templates:

  • Advanced Flash Loan Protection (defi-015) - critical
  • Cross-Function Reentrancy (reentrancy-003) - high
  • Delegatecall to Untrusted (access-012) - critical
  ...
```

#### Coverage Metrics

- **Overall Coverage** - Percentage of templates triggered
- **Severity Coverage** - Coverage per severity level
- **Category Coverage** - Coverage per vulnerability category
- **Uncovered Templates** - Templates not triggered by any contract
- **Most Triggered** - Templates with most findings

#### Use Cases

- **Track Security Posture** - Monitor which attack vectors are covered
- **Identify Gaps** - Find untested vulnerability types
- **CI/CD Gates** - Fail builds below coverage threshold
- **Security Metrics** - Measure security testing effectiveness

---

## Examples

### Example 1: Complete Security Workflow

```bash
# 1. Scan contracts for vulnerabilities
npx hardhat n3:scan

# 2. Generate security tests
npx hardhat n3:test --generate

# 3. Run the tests
npx hardhat test test/security/**/*.test.js

# 4. Run comprehensive audit
npx hardhat n3:audit --output audit-report.md

# 5. Check coverage
npx hardhat n3:coverage --threshold 80
```

### Example 2: CI/CD Pipeline

```yaml
# .github/workflows/security.yml
name: Security Audit

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Compile contracts
        run: npx hardhat compile
      
      - name: Security Scan (CI mode)
        run: npx hardhat n3:scan --ci
      
      - name: Generate Tests
        run: npx hardhat n3:test --generate
      
      - name: Run Security Tests
        run: npx hardhat n3:test --run
      
      - name: Full Audit
        run: npx hardhat n3:audit --output audit.json --format json
      
      - name: Coverage Check
        run: npx hardhat n3:coverage --threshold 80 --output coverage.json --format json
      
      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: security-reports
          path: |
            audit.json
            coverage.json
```

### Example 3: Pre-deployment Audit

```bash
# Before mainnet deployment
npx hardhat n3:audit \
  --network mainnet \
  --simulate \
  --output pre-deployment-audit.html \
  --format html

# Check all critical templates are covered
npx hardhat n3:coverage \
  --threshold 100 \
  --output pre-deployment-coverage.md
```

---

## CI/CD Integration

### Exit Codes

- `0` - Success (no critical issues or threshold met)
- `1` - Failure (critical issues found or threshold not met)

### Fail Conditions

- `n3:scan --ci` - Fails on critical or high severity issues
- `n3:audit` - Fails on critical issues if `failOnCritical: true` in config
- `n3:coverage --threshold N` - Fails if coverage below N%

### Report Artifacts

All tasks support `--output` and `--format` for generating reports:

- **JSON** - Machine-readable for automation
- **HTML** - Human-readable dashboards
- **Markdown** - Documentation and PR comments

---

## Best Practices

1. **Run `n3:scan` on every commit** - Catch issues early
2. **Generate tests with `n3:test`** - Automate security testing
3. **Full `n3:audit` before releases** - Comprehensive review
4. **Track `n3:coverage` metrics** - Monitor security posture
5. **Set coverage thresholds** - Enforce minimum coverage
6. **Use CI mode** - Fail builds on critical issues
7. **Generate reports** - Document security status

---

## Troubleshooting

### Templates not found

```bash
# Set correct templates directory
npx hardhat n3:scan --templates ./templates
```

### Network simulation fails

```bash
# Ensure network is configured in hardhat.config.js
networks: {
  mainnet: {
    url: process.env.MAINNET_RPC_URL,
    chainId: 1
  }
}
```

### Tests generation error

```bash
# Ensure output directory is writable
mkdir -p test/security
npx hardhat n3:test --generate --output test/security
```

---

## Support

- **Documentation**: [N3 Docs](../../README.md)
- **Issues**: [GitHub Issues](https://github.com/intelligent-ears/n3/issues)
- **Discord**: [Community](https://discord.gg/n3-security)

---

*Built with ❤️ for ETHOnline 2025*
