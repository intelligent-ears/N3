# N3 Security Scanner - Quick Start Guide 🚀

## What is N3?

N3 (Nuclei for Web3) is a template-based security scanner for smart contracts that works across your entire development lifecycle: from writing code to deployment to runtime monitoring.

## Installation

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm
- Hardhat project (for plugin usage)

### Install Core Package

```bash
npm install @n3/core
# or
pnpm add @n3/core
```

### Install Hardhat Plugin

```bash
npm install --save-dev @n3/hardhat-plugin
# or
pnpm add -D @n3/hardhat-plugin
```

## Usage

### 1. Standalone Scanning (Node.js)

```javascript
const { SecurityEngine } = require('@n3/core');

async function scanContract() {
  const engine = new SecurityEngine();
  
  // Initialize with templates
  await engine.initialize({ 
    templatesDir: './node_modules/@n3/core/templates' 
  });
  
  // Scan contract code
  const contractCode = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
    
    contract MyContract {
      function withdraw(uint amount) public {
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount; // Reentrancy risk!
      }
    }
  `;
  
  const report = await engine.scan(contractCode, 'MyContract');
  
  console.log('Risk Score:', report.overallRiskScore);
  console.log('Critical Issues:', report.summary.critical);
  console.log('High Issues:', report.summary.high);
}
```

### 2. Hardhat Plugin

Add to your `hardhat.config.js`:

```javascript
require('@n3/hardhat-plugin');

module.exports = {
  solidity: "0.8.19",
  n3: {
    severity: ['critical', 'high'],
    failOnCritical: true,
    reportFormat: 'terminal',
    autoFix: false,
  }
};
```

Run scans:

```bash
# Scan all contracts
npx hardhat n3:scan

# Scan specific file
npx hardhat n3:scan --file contracts/MyToken.sol

# Scan with specific templates
npx hardhat n3:scan --templates reentrancy-001,access-001

# Generate detailed report
npx hardhat n3:scan --output report.json
```

### 3. Test Example (Current Demo)

```bash
# Clone the repository
git clone <your-repo-url>
cd n3

# Install dependencies
npm install

# Build all packages
npm run build

# Run the demo test
node test-scan.js
```

**Expected Output:**
```
🔍 N3 Security Scanner - Test Run

📂 Loading templates from: /packages/core/templates
✅ Templates loaded successfully

🎯 Scanning vulnerable contract: VulnerableBank.sol

📊 Scan Results: Found 7 issues

Template: math-001 - Integer Overflow/Underflow
  Severity: HIGH
  Risk Score: 75.00/10
  ...

📈 Risk Assessment:
  Overall Risk Score: 87.35/10
  Critical: 2
  High: 2
```

## Available Templates

### Smart Contract Security
- **reentrancy-001**: Reentrancy vulnerability detection
- **access-001**: Missing access control checks
- **math-001**: Integer overflow/underflow (pre-0.8.0)

### DeFi Security
- **defi-001**: Flash loan attack vectors
- **oracle-001**: Price oracle manipulation

## Configuration

### Template Filtering

```javascript
// Only scan for critical issues
await engine.initialize({
  templatesDir: './templates',
  severities: ['critical']
});

// Only DeFi-related templates
await engine.initialize({
  templatesDir: './templates',
  categories: ['defi']
});
```

### Custom Templates

Create your own YAML template:

```yaml
# my-template.yaml
id: custom-001
name: My Custom Security Check
severity: high
category: smart-contract
description: Detects my specific vulnerability pattern

detection:
  patterns:
    - name: unsafe_pattern
      solidity: |
        myUnsafeFunction\(\)

risk_calculation:
  base_score: 80
  modifiers:
    has_mitigation: -60

remediation:
  priority: 1
  fixes:
    - Replace with safeFunction()
    - Add proper validation
```

Place in `templates/` directory and it will be auto-loaded!

## CI/CD Integration

### GitHub Actions

```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npx hardhat compile
      - run: npx hardhat n3:scan --fail-on-critical
```

## Output Formats

### Terminal (Default)
Colored, human-readable output with tables and summaries

### JSON
```bash
npx hardhat n3:scan --output report.json
```

### Markdown
```bash
npx hardhat n3:scan --output report.md
```

### HTML
```bash
npx hardhat n3:scan --output report.html
```

## Troubleshooting

### Templates not loading
- Check templates directory path is correct
- Ensure YAML files are valid (use YAML linter)
- Verify file permissions

### No vulnerabilities detected
- Templates may need tuning for your contract patterns
- Try lowering severity filter
- Check if patterns match your Solidity version

### Build errors
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

## Advanced Features

### Auto-Fix (Experimental)
```bash
npx hardhat n3:scan --auto-fix
```

### Real-time Monitoring
```bash
npx hardhat n3:monitor --network mainnet
```

### Coverage Analysis
```bash
npx hardhat n3:coverage
```

## Get Help

- 📚 Documentation: [See STRUCTURE.md](./STRUCTURE.md)
- 🐛 Issues: [GitHub Issues](https://github.com/yourorg/n3/issues)
- 💬 Discord: [Join our community](#)
- 📧 Email: security@n3scanner.dev

## What's Next?

1. ✅ **Core scanning works** - You can scan contracts now!
2. ⏳ **Hardhat integration** - Test the plugin in your Hardhat project
3. ⏳ **MCP Server** - Connect to Blockscout for real-time monitoring
4. ⏳ **Dashboard** - Visual analytics (coming soon)

---

**Happy Scanning! 🛡️**
