# N3 CLI - Command Line Interface

## Installation

### Local Development
```bash
cd packages/cli
npm install
npm run build

# Link globally for testing
npm link
```

### From npm (when published)
```bash
npm install -g @n3/cli
```

## Usage

### Basic Scan

Scan a single contract:
```bash
n3 contracts/MyToken.sol
```

Scan all contracts in a directory:
```bash
n3 contracts/
```

### Template Selection

Use specific templates:
```bash
n3 -t reentrancy-001,access-001 contracts/MyToken.sol
```

Filter by severity:
```bash
n3 -s critical,high contracts/
```

Filter by category:
```bash
n3 -c defi contracts/DeFiProtocol.sol
```

### Debug Mode

Enable debug output:
```bash
n3 -d contracts/MyToken.sol
```

Enable verbose output:
```bash
n3 -v contracts/MyToken.sol
```

### Output Formats

Save to JSON:
```bash
n3 contracts/MyToken.sol -o report.json
```

Save to Markdown:
```bash
n3 contracts/ -o report.md
```

Save to HTML:
```bash
n3 contracts/ -o report.html
```

### CI/CD Integration

Fail on critical issues:
```bash
n3 contracts/ --fail-on-critical
```

Example GitHub Actions:
```yaml
- name: Security Scan
  run: |
    npm install -g @n3/cli
    n3 contracts/ --fail-on-critical -o security-report.json
```

## Commands

### Scan (default)
```bash
n3 [target] [options]
```

**Arguments:**
- `target` - Contract file or directory to scan

**Options:**
- `-t, --templates <templates>` - Templates to use (comma-separated)
- `-s, --severity <severity>` - Filter by severity (default: critical,high,medium)
- `-c, --category <category>` - Filter by category
- `-o, --output <file>` - Output file for results
- `-f, --format <format>` - Output format (json, markdown, html, terminal)
- `-d, --debug` - Enable debug mode
- `-v, --verbose` - Enable verbose output
- `--fail-on-critical` - Exit with error code if critical issues found
- `--no-color` - Disable colored output
- `--template-dir <dir>` - Custom template directory
- `--list-templates` - List all available templates
- `--validate` - Validate templates only
- `--stats` - Show statistics after scan

### List Templates
```bash
n3 templates

# With filters
n3 templates --severity critical
n3 templates --category defi
n3 templates -v  # verbose
```

### Validate Templates
```bash
n3 validate ./custom-templates
```

## Examples

### Example 1: Quick Scan
```bash
# Scan a single contract with default settings
n3 MyToken.sol
```

**Output:**
```
╔═══════════════════════════════════════════════════════════╗
║   N3 - Nuclei for Web3                                   ║
║   Template-Based Security Scanner v0.1.0                 ║
╚═══════════════════════════════════════════════════════════╝

✔ Templates loaded
[*] Found 1 contract(s) to scan
✔ MyToken.sol: No issues found

════════════════════════════════════════════════════════════
  SUMMARY
════════════════════════════════════════════════════════════
[✓] All contracts are secure! No vulnerabilities detected.
```

### Example 2: Critical Issues Only
```bash
# Only scan for critical vulnerabilities
n3 -s critical contracts/
```

### Example 3: Debug Mode
```bash
# Show detailed debug information
n3 -d VulnerableBank.sol
```

**Output:**
```
[DEBUG] Debug mode enabled
[DEBUG] Options: { templates: '', severity: 'critical,high,medium', ... }
[DEBUG] Loading templates from: /path/to/templates
[✓] Loaded templates from /path/to/templates
[DEBUG] Severity filter: critical, high, medium
[DEBUG] Category filter: all
[DEBUG] Found single Solidity file: VulnerableBank.sol
[*] Found 1 contract(s) to scan
[DEBUG] Files: [ 'VulnerableBank.sol' ]
[DEBUG] Reading file: VulnerableBank.sol
[DEBUG] File size: 2742 bytes
[DEBUG] Starting scan...
[DEBUG] Scan completed in 2ms
[DEBUG] Risk score: 87.35

[Results...]
```

### Example 4: Export to JSON
```bash
# Generate JSON report for programmatic use
n3 contracts/ -o security-report.json

# View the report
cat security-report.json
```

**Output:**
```json
[
  {
    "file": "contracts/MyToken.sol",
    "duration": 5,
    "riskScore": 25.5,
    "summary": {
      "critical": 0,
      "high": 0,
      "medium": 1,
      "low": 2,
      "info": 0
    },
    "results": [...]
  }
]
```

### Example 5: Generate HTML Report
```bash
# Create a styled HTML report
n3 contracts/ -o security-report.html

# Open in browser
xdg-open security-report.html
```

### Example 6: DeFi-Specific Scan
```bash
# Only scan for DeFi vulnerabilities
n3 -c defi contracts/DeFiProtocol.sol
```

### Example 7: Custom Templates
```bash
# Use custom template directory
n3 --template-dir ./my-templates contracts/
```

### Example 8: CI/CD Pipeline
```bash
#!/bin/bash
# security-check.sh

echo "Running N3 security scan..."

# Scan with fail on critical
if n3 contracts/ --fail-on-critical -o security-report.json; then
    echo "✓ Security scan passed"
    exit 0
else
    echo "✗ Security scan failed - critical issues found"
    cat security-report.json
    exit 1
fi
```

### Example 9: Multiple Contracts with Stats
```bash
# Scan directory and show statistics
n3 contracts/ --stats
```

**Output:**
```
[Results for each contract...]

════════════════════════════════════════════════════════════
  STATISTICS
════════════════════════════════════════════════════════════

[*] Total Files Scanned: 5
[*] Total Template Checks: 25
[*] Vulnerable Checks: 3
[*] Average Scan Time: 3.20ms
[*] Total Scan Time: 16ms
```

### Example 10: Specific Templates Only
```bash
# Only check for reentrancy and access control
n3 -t reentrancy-001,access-001 contracts/Bank.sol
```

## Output Formats

### Terminal (Default)
Colored output with tables and emoji indicators:
- 🔴 Critical
- 🟠 High  
- 🟡 Medium
- 🟢 Low
- ℹ️ Info

### JSON
Structured data for programmatic use:
```json
{
  "file": "contract.sol",
  "riskScore": 85.5,
  "summary": { "critical": 2, "high": 1 },
  "results": [...]
}
```

### Markdown
Documentation-friendly format:
```markdown
# N3 Security Scan Report

## MyToken.sol

- **Risk Score**: 25.5/10
- **Scan Duration**: 5ms

### Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 0 |
...
```

### HTML
Styled web page with interactive elements (opens in browser).

## Configuration

### Environment Variables
```bash
# Custom template directory
export N3_TEMPLATE_DIR=/path/to/templates

# Disable colors
export NO_COLOR=1
```

### Configuration File (Coming Soon)
```yaml
# .n3config.yml
templates:
  directory: ./custom-templates
  severities: [critical, high]
  
output:
  format: json
  directory: ./security-reports
  
scan:
  failOnCritical: true
```

## Template System

Templates are YAML files that define vulnerability patterns:

```yaml
id: custom-001
name: My Custom Check
severity: high
category: smart-contract

detection:
  patterns:
    - name: unsafe_pattern
      solidity: |
        myUnsafeFunction\(\)

risk_calculation:
  base_score: 80
```

Place templates in a directory and use:
```bash
n3 --template-dir ./my-templates contracts/
```

## Debugging Tips

### Enable Debug Mode
```bash
n3 -d contract.sol
```

Shows:
- Options being used
- Templates loading process
- File discovery
- Scan duration
- Risk calculation

### Verbose Mode
```bash
n3 -v contract.sol
```

Shows additional information without full debug output.

### Validate Templates
```bash
n3 validate ./templates
```

Ensures all templates are valid YAML and pass schema validation.

## Exit Codes

- `0` - Scan completed successfully
- `1` - Scan failed or critical issues found (with --fail-on-critical)

## Common Issues

### Templates Not Found
```bash
# Specify template directory
n3 --template-dir /path/to/templates contract.sol
```

### No Color Output
```bash
# Disable color explicitly
n3 --no-color contract.sol

# Or use environment variable
NO_COLOR=1 n3 contract.sol
```

### Large Directories
```bash
# Exclude test files
n3 contracts/ --exclude "test/**,tests/**"
```

## Integration Examples

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

n3 contracts/ --fail-on-critical
```

### GitHub Actions
```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install N3
        run: npm install -g @n3/cli
      - name: Run Security Scan
        run: n3 contracts/ --fail-on-critical -o report.json
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: report.json
```

### GitLab CI
```yaml
security_scan:
  stage: test
  script:
    - npm install -g @n3/cli
    - n3 contracts/ --fail-on-critical -o security-report.json
  artifacts:
    reports:
      junit: security-report.json
```

## Support

- 📚 Documentation: See main README.md
- 🐛 Issues: GitHub Issues
- 💬 Discord: Join community
- 📧 Email: security@n3scanner.dev

## Version

Current version: 0.1.0

Check version:
```bash
n3 --version
```

## License

MIT License - See LICENSE file
