# N3 - Nuclei for Web3 🛡️

> **Template-Based Security Scanner for Smart Contracts & DApps**
> 
> *From Development to Deployment - Continuous Security at Every Stage*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built for ETHOnline 2025](https://img.shields.io/badge/Built%20for-ETHOnline%202025-blue)](https://ethglobal.com)

---

## 🎯 What is N3?

**N3** (Nuclei for Web3) brings the power of template-based vulnerability detection to the blockchain ecosystem. Inspired by ProjectDiscovery's Nuclei, N3 enables developers to:

- ✅ **Detect vulnerabilities** during development with smart contract scanning
- ✅ **Run security tests** automatically with auto-generated Hardhat tests
- ✅ **Monitor deployed contracts** in real-time with CVE detection
- ✅ **Generate comprehensive audits** with HTML/JSON/Markdown reports
- ✅ **Track security coverage** with template coverage analysis
- ✅ **Scan infrastructure** for known CVEs and exposures
- ✅ **Support multiple chains** for comprehensive coverage

### Why N3?

| Feature | N3 | Traditional Tools |
|---------|----|--------------------|
| **Template-Based** | ✅ YAML templates (extensible) | ❌ Hardcoded rules |
| **Smart Contract Scanning** | ✅ Solidity analysis | ✅ Limited support |
| **CVE Detection** | ✅ HTTP-based scanning | ❌ Not included |
| **Auto-Generated Tests** | ✅ Hardhat test generation | ❌ Manual only |
| **Coverage Analysis** | ✅ Template coverage metrics | ❌ Code coverage only |
| **Multi-Format Reports** | ✅ HTML/JSON/MD | ⚠️ Limited formats |
| **CLI & Hardhat Plugin** | ✅ Both included | ⚠️ Usually separate |
| **Real-time Monitoring** | ✅ MCP server + Envio integration | ❌ Not available |
| **Indexed Contract Data** | ✅ Envio HyperIndex integration | ❌ Not available |
| **Open Source** | ✅ MIT License | ⚠️ Varies |

## 🚀 Quick Start

### ✅ Status: FULLY OPERATIONAL!

**N3 is production-ready!** The complete security scanner with CLI, core engine, advanced Hardhat tasks, and CVE detection has been successfully built and tested.

**Latest Features (October 2025):**
- 🎯 **Advanced Hardhat Tasks**: Test generation, comprehensive audit, coverage analysis
- 🔍 **CVE Scanner**: HTTP-based vulnerability detection with Nuclei-style templates
- 📊 **Multi-format Reports**: HTML, JSON, and Markdown output
- 🎨 **Enhanced Terminal Output**: Beautiful colorized reports with emoji indicators
- 🧪 **Auto-generated Tests**: Generate Hardhat tests from security findings
- 📈 **Coverage Analysis**: Track security template coverage with thresholds
- 🔄 **Envio Integration**: Scan indexed contract data and real-time security monitoring

**Live Test Results:**
```
🔍 Scanning VulnerableBank.sol...
📊 Found 7 vulnerabilities
🔥 Risk Score: 87.35/10 (CRITICAL)
✅ Templates: reentrancy, access-control, math, oracle, flash-loan

🔴 Critical: 2 issues
🟠 High: 2 issues
✅ Scan completed in 2ms
```

**CVE Scanner Test Results:**
```
🔍 CVE SCAN RESULTS
Target: http://localhost:8765
Total Checks: 3
Vulnerabilities Found: 1

🟠 Profanity weak cryptography [CVE-2022-40769]
   Severity: HIGH
   ✅ Successfully detected vulnerable patterns
```

### Installation

```bash
# Install dependencies (monorepo)
npm install

# Build all packages
npm run build

# Use n3 command directly from repo
./bin/n3 --help

# Make n3 available globally (method 1 - symlink)
mkdir -p ~/bin
ln -sf $(pwd)/bin/n3 ~/bin/n3
export PATH="$PATH:$HOME/bin"

# Make n3 available globally (method 2 - requires sudo)
cd packages/cli
sudo npm link
```

### Quick Scan with CLI

```bash
# Scan a single contract (assuming n3 is in PATH)
n3 contracts/MyContract.sol

# Scan with debug output
n3 contracts/MyContract.sol -d

# Scan with specific templates
n3 contracts/MyContract.sol -t reentrancy,access

# Filter by severity
n3 contracts/MyContract.sol -s critical,high

# Export results to JSON
n3 contracts/MyContract.sol -o report.json
```

### Hardhat Plugin Installation

```bash
npm install --save-dev @n3/hardhat-plugin
```

### Hardhat Configuration

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

### Hardhat Usage

```bash
# Scan your contracts
npx hardhat n3:scan

# Generate security tests from vulnerabilities
npx hardhat n3:test --generate

# Run generated security tests
npx hardhat n3:test --run

# Do both: generate and run tests
npx hardhat n3:test --generate --run

# Comprehensive audit with multiple formats
npx hardhat n3:audit --output audit.html --format html
npx hardhat n3:audit --output audit.json --format json
npx hardhat n3:audit --output audit.md --format markdown

# Check security template coverage
npx hardhat n3:coverage --threshold 80

# Coverage with detailed metrics
npx hardhat n3:coverage --show-details
```

### CVE Scanning

Scan URLs for known Common Vulnerabilities and Exposures:

```bash
# Basic CVE scan
n3 cve http://example.com

# Scan with custom templates
n3 cve http://example.com --templates ./cve-templates

# Filter by severity
n3 cve http://example.com --severity critical,high

# Filter by tags
n3 cve http://example.com --tags exposure,keys

# Save results to file
n3 cve http://example.com --save report.json

# Debug mode
n3 cve http://example.com --debug
```

## 📚 Features

### 🖥️ Command-Line Interface (CLI)

N3 provides a powerful Nuclei-style CLI for security scanning:

**Smart Contract Scanning:**
```bash
# Basic scan
n3 contracts/MyContract.sol

# Debug mode (verbose logging)
n3 contracts/MyContract.sol -d

# Template selection
n3 contracts/ -t reentrancy,access,math

# Severity filtering
n3 contracts/ -s critical,high

# Multiple output formats
n3 contracts/ -o report.json -f json
n3 contracts/ -o report.md -f markdown
n3 contracts/ -o report.html -f html

# CI/CD integration
n3 contracts/ --fail-on-critical

# List available templates
n3 templates

# Validate custom templates
n3 validate ./my-templates/
```

**CVE Infrastructure Scanning:**
```bash
# Basic CVE scan
n3 cve http://example.com

# Scan with severity filtering
n3 cve http://example.com --severity critical,high

# Save results
n3 cve http://example.com --save report.json

# Filter by tags
n3 cve http://example.com --tags exposure,keys

# Custom templates
n3 cve http://example.com --templates ./my-cve-templates
```

**CLI Features:**
- ✅ Nuclei-style interface (`-t`, `-d`, `-s` flags)
- ✅ Debug mode with verbose logging
- ✅ Multiple output formats (JSON, Markdown, HTML, Terminal)
- ✅ Colored terminal output with emoji severity indicators
- ✅ Template filtering by severity and category
- ✅ CI/CD integration with exit codes
- ✅ Statistics mode for overview
- ✅ Glob pattern support for directory scanning
- ✅ **CVE scanning for deployed infrastructure**
- ✅ **HTTP-based vulnerability detection**
- ✅ **Word, regex, status, and DSL matchers**

### �🔍 Template-Based Scanning

N3 uses YAML templates to define security checks:

```yaml
id: reentrancy-001
name: Reentrancy Vulnerability Detection
severity: critical
category: smart-contract

detection:
  patterns:
    - name: external_call_before_state_change
      solidity: |
        payable(.*).transfer(.*);
        .*\[.*\]\s*=

risk_calculation:
  base_score: 90
  modifiers:
    has_reentrancy_guard: -80

remediation:
  priority: 1
  fixes:
    - Add nonReentrant modifier from OpenZeppelin
    - Follow Checks-Effects-Interactions pattern
```

### 🧪 Advanced Hardhat Tasks

N3 provides comprehensive Hardhat tasks for security testing and auditing:

**1. Security Test Generation & Execution (`n3:test`)**
```bash
# Generate Hardhat tests from vulnerability findings
npx hardhat n3:test --generate

# Run generated security tests
npx hardhat n3:test --run

# Generate and run in one command
npx hardhat n3:test --generate --run

# Specify contracts to test
npx hardhat n3:test --generate --contracts MyContract,MyToken
```

Features:
- Auto-generates Hardhat test files from security templates
- Creates comprehensive test suites with risk scores
- Includes remediation TODOs in generated tests
- Supports running tests with Hardhat's test runner

**2. Comprehensive Security Audit (`n3:audit`)**
```bash
# Generate HTML audit report
npx hardhat n3:audit --output audit.html --format html

# Generate JSON report
npx hardhat n3:audit --output audit.json --format json

# Generate Markdown report
npx hardhat n3:audit --output audit.md --format markdown

# Audit with network simulation
npx hardhat n3:audit --network localhost
```

Features:
- Executive summary with overall risk assessment
- Contract-by-contract breakdown
- Top vulnerabilities by severity
- Visual HTML dashboard with charts
- Multiple export formats (HTML, JSON, Markdown)

**3. Security Coverage Analysis (`n3:coverage`)**
```bash
# Check security template coverage
npx hardhat n3:coverage

# Set minimum coverage threshold
npx hardhat n3:coverage --threshold 80

# Show detailed coverage metrics
npx hardhat n3:coverage --show-details

# Coverage by severity
npx hardhat n3:coverage --by-severity
```

Features:
- Overall coverage percentage
- Coverage by severity (critical, high, medium, low)
- Coverage by category (access, reentrancy, oracle, etc.)
- Lists most triggered templates
- Shows uncovered templates
- Threshold enforcement for CI/CD

For complete documentation, see [TASKS.md](./packages/hardhat-plugin/TASKS.md).

### 🔍 CVE Detection System

N3 includes a powerful CVE scanner for detecting known vulnerabilities in deployed infrastructure:

**Features:**
- ✅ HTTP-based vulnerability scanning
- ✅ Nuclei-style YAML templates
- ✅ Multiple matcher types (word, regex, status, DSL)
- ✅ DSL expression support (`contains()`, `status_code`, `len()`)
- ✅ Severity and tag filtering
- ✅ JSON report generation
- ✅ Colorized terminal output

**Included CVE Templates:**
- **CVE-2022-40769** - Profanity weak cryptography detection (HIGH)
- **CVE-2023-PRIVATE-KEY** - Exposed Ethereum private keys (CRITICAL)
- **CVE-2023-ETHERSCAN** - Exposed Etherscan API keys (MEDIUM)

**Example CVE Template:**
```yaml
id: CVE-2022-40769
info:
  name: Profanity weak cryptography
  author: intelligent-ears
  severity: high
  description: Detects exposure of Profanity vanity address generator
  reference:
    - https://github.com/johguse/profanity
  tags:
    - cve
    - profanity
    - exposure

requests:
  - method: GET
    path:
      - "{{BaseURL}}/README.md"
      - "{{BaseURL}}/scripts/generate.sh"
    matchers-condition: or
    matchers:
      - type: word
        words:
          - "profanity --leading"
          - "johguse/profanity"
        condition: or
      - type: dsl
        dsl:
          - "contains(body, 'profanity --leading')"
```

For complete CVE testing guide, see [CVE_TESTING.md](./CVE_TESTING.md).

### 🧪 Auto-Generated Security Tests

N3 automatically generates Solidity tests from templates (coming soon):

```solidity
// Auto-generated by N3 from template: reentrancy-001
contract N3_Reentrancy_Test is Test {
    function test_ReentrancyAttack() public {
        // Test implementation
    }
}
```

### 📊 Comprehensive Reporting

**Terminal Output:**
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███╗   ██╗██████╗                                       ║
║   ████╗  ██║╚════██╗                                      ║
║   ██╔██╗ ██║ █████╔╝                                      ║
║   ██║╚██╗██║ ╚═══██╗                                      ║
║   ██║ ╚████║██████╔╝                                      ║
║   ╚═╝  ╚═══╝╚═════╝                                       ║
║                                                           ║
║   N3 - Nuclei for Web3                                    ║
║   Template-Based Security Scanner v0.1.0                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

📄 VulnerableBank.sol
   Risk Score: 87.35/10
   Duration: 2ms

🔴 [CRITICAL] Price Oracle Manipulation (oracle-001)
   Category: defi
   Risk Score: 90.00/10
   Findings: 1

� [HIGH] Missing Access Controls (access-001)
   Category: smart-contract
   Risk Score: 85.00/10
   Findings: 2

┌─────────────┬───────┐
│ Severity    │ Count │
├─────────────┼───────┤
│ 🔴 Critical │ 2     │
│ 🟠 High     │ 2     │
│ 🟡 Medium   │ 0     │
└─────────────┴───────┘
```

**JSON Output:**
```json
{
  "file": "VulnerableBank.sol",
  "duration": 2,
  "riskScore": 87.35,
  "summary": {
    "critical": 2,
    "high": 2,
    "medium": 0,
    "low": 0,
    "info": 0
  },
  "results": [...]
}
```

### 🔍 Envio Integration for Advanced Security Analytics

N3 integrates with Envio's HyperIndex and HyperSync for enhanced security analytics:

```typescript
// Import the N3 Envio client
import { EnvioAdapter } from '@n3/mcp-server/tools/envio-adapter';
import { getSecurityHistory, registerForMonitoring } from '@n3/mcp-server/tools';

// Create an instance of the EnvioAdapter
const envioAdapter = new EnvioAdapter(
  'https://api.envio.dev/v1/hyperindex',
  'https://api.envio.dev/v1/hypersync'
);

// Fetch security scan history for a contract
const contractAddress = '0x1234...';
const securityHistory = await getSecurityHistory(contractAddress, 'ethereum');
console.log(`Found ${securityHistory.scanCount} security scans`);
console.log(`Risk trend: ${securityHistory.riskTrend}`);

// Register for real-time security monitoring via HyperSync
const webhookUrl = 'https://your-webhook.com/security-events';
await registerForMonitoring(contractAddress, webhookUrl, 'ethereum');

// Query vulnerability events directly
const vulnerabilities = await envioAdapter.getVulnerabilitiesForContract(contractAddress);
console.log(`Found ${vulnerabilities.length} vulnerabilities`);
```

**Features:**
- Query security scan history from Envio's HyperIndex
- Access comprehensive security metrics for contracts
- Register for real-time monitoring with webhook notifications
- Get detailed vulnerability events with severity ratings
- Multi-chain support for comprehensive coverage
- Fallback to local analysis when Envio data is not available

### 🤖 AI-Powered Analysis with Blockscout MCP

N3 integrates with Blockscout's MCP and SDK for enhanced security analysis:

```typescript
// Import the N3 Blockscout client
import { createN3BlockscoutClient, BlockscoutAdapter } from '@n3/blockscout-widget';

// Create a client with configuration
const client = createN3BlockscoutClient({
  baseUrl: 'http://localhost:3000',
  apiKey: 'your-api-key' // Optional
});

// Analyze contract with AI via Blockscout MCP
const analysis = await client.analyzeContract(contractAddress, 'ethereum');

// Get rich contract data
const adapter = new BlockscoutAdapter('ethereum');
const contractInfo = await adapter.getSmartContract(contractAddress);
const sourceCode = await adapter.getContractSourceCode(contractAddress);
const transactions = await adapter.getTransactions(contractAddress);

// Combine N3 analysis with Blockscout data
const securityReport = {
  contract: contractInfo,
  source: sourceCode,
  vulnerabilities: analysis.vulnerabilities,
  riskScore: analysis.riskScore,
  recommendations: analysis.recommendations,
  recentTransactions: transactions.slice(0, 10)
};
```

**Features:**
- Verified contract source code analysis from Blockscout API
- Multi-chain support (Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche)
- Transaction pattern analysis for anomaly detection
- MCP server for AI integration with LLMs
- React widget for embedded security analysis
- Custom dashboards and alerts with Blockscout integration

### 🔍 Blockscout Integration

N3 seamlessly integrates with Blockscout to enhance smart contract security analysis:

**1. N3 Widget for Blockscout Explorer**

Embed N3 security analytics directly in Blockscout using our React widget:

```jsx
import { BlockscoutSecurityWidget } from '@n3/blockscout-widget';

function ExplorerPage() {
  return (
    <div className="explorer-container">
      <h1>Contract Details</h1>
      
      {/* Embed the N3 security widget */}
      <BlockscoutSecurityWidget 
        contractAddress="0x1234..."
        network="ethereum"
        apiEndpoint="https://api.n3scan.io"
        apiKey="your-optional-key"
      />
    </div>
  );
}
```

Or use it with vanilla JavaScript:

```html
<div id="n3-security-widget"></div>
<script src="https://cdn.n3scan.io/widget.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    N3BlockscoutWidget.renderSecurityWidget({
      contractAddress: '0x1234...',
      network: 'ethereum',
      container: document.getElementById('n3-security-widget')
    });
  });
</script>
```

**2. Multi-Chain Support**

Analyze contracts across any blockchain supported by Blockscout:
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Base
- Avalanche
- and more

**3. MCP AI Integration**

Connect Blockscout data with AI models through our MCP server:

```bash
# Start MCP server with HTTP transport for Blockscout
export TRANSPORT=http
export PORT=3000
cd packages/mcp-server
npm start

# Or with Docker
docker run -p 3000:3000 -e TRANSPORT=http n3/mcp-server
```

**4. Security API**

Access N3 security analysis through a REST API:

```bash
# Analyze contract with Blockscout data
curl http://localhost:3000/api/analyze?address=0x1234&network=ethereum

# Get recent transactions with security analysis
curl http://localhost:3000/api/transactions?address=0x1234&limit=50&network=ethereum

# Check for specific vulnerability types
curl http://localhost:3000/api/vulnerabilities?address=0x1234&type=reentrancy&network=ethereum
```

**5. Widget Customization**

The N3 security widget can be customized for different Blockscout instances:

```jsx
<BlockscoutSecurityWidget 
  contractAddress="0x1234..."
  network="ethereum"
  apiEndpoint="https://api.n3scan.io"
  theme="dark" // light or dark theme
  showRecommendations={true} // show security recommendations
  compact={false} // full or compact display
/>
```

### 🌐 Envio API Integration

Access Envio's HyperIndex and HyperSync data through N3's MCP server:

```bash
# Get security history for a contract
curl -X POST "http://localhost:3000/api/tool" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "envio_security_history",
    "arguments": {
      "address": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "chain": "ethereum"
    }
  }'

# Register for real-time security monitoring
curl -X POST "http://localhost:3000/api/tool" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "envio_register_monitoring",
    "arguments": {
      "address": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "webhook": "https://your-webhook.com/security-events",
      "chain": "ethereum"
    }
  }'
```

**Features:**
- RESTful API for accessing Envio's security data
- Register contracts for real-time monitoring
- Get detailed security history and metrics
- Multi-chain support (Ethereum, Polygon, etc.)
- JSON response format for easy integration

### ⛓️ Multi-Chain Support

- Ethereum
- Polygon
- Hedera
- Base
- Optimism
- Arbitrum

## 🏗️ Project Structure

```
n3/
├── bin/                   # CLI executable wrappers ✅
│   └── n3                 # Main CLI executable  
│
├── packages/
│   ├── core/              # Core security engine ✅
│   │   ├── src/
│   │   │   ├── engine.ts          # Main scanning engine
│   │   │   ├── parser.ts          # Template parser
│   │   │   ├── risk-calculator.ts # Risk score calculator
│   │   │   ├── types.ts           # Core type definitions
│   │   │   ├── cve-types.ts       # CVE type definitions
│   │   │   ├── cve-parser.ts      # CVE template parser
│   │   │   └── cve-scanner.ts     # CVE scanning engine
│   │   ├── templates/             # Smart contract templates
│   │   │   ├── defi/
│   │   │   │   ├── flash-loan-001.yaml
│   │   │   │   └── oracle-001.yaml
│   │   │   └── smart-contract/
│   │   │       ├── access-001.yaml
│   │   │       ├── math-001.yaml
│   │   │       └── reentrancy-001.yaml
│   │   └── cve-templates/         # CVE detection templates
│   │       ├── CVE-2022-40769.yaml    # Profanity vulnerability
│   │       ├── CVE-2023-PRIVATE-KEY.yaml
│   │       └── CVE-2023-ETHERSCAN.yaml
│   │
│   ├── cli/               # Command-line interface ✅
│   │   ├── src/
│   │   │   ├── cli.ts            # Main CLI with CVE command
│   │   │   └── utils/
│   │   │       ├── logger.ts
│   │   │       ├── formatter.ts
│   │   │       ├── file-scanner.ts
│   │   │       └── template-manager.ts
│   │
│   ├── hardhat-plugin/    # Hardhat integration ✅
│   │   ├── src/tasks/
│   │   │   ├── scan.ts        # Basic security scanning
│   │   │   ├── test.ts        # Test generation & execution
│   │   │   ├── audit.ts       # Comprehensive audit
│   │   │   ├── fix.ts         # Auto-fix suggestions
│   │   │   ├── coverage.ts    # Coverage analysis
│   │   │   └── monitor.ts     # Real-time monitoring
│   │   └── TASKS.md           # Task documentation
│   │
│   ├── mcp-server/        # MCP server with Blockscout integration ✅
│   │   ├── src/
│   │   │   ├── index.ts              # MCP server initialization
│   │   │   ├── blockscout-widget.tsx # Blockscout widget component
│   │   │   ├── prompts/
│   │   │   │   └── index.js          # Security prompts
│   │   │   └── tools/
│   │   │       ├── index.ts          # Core security tools
│   │   │       ├── blockscout-adapter.ts # Blockscout API adapter
│   │       └── envio-adapter.ts     # Envio API adapter
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── blockscout-widget/ # Blockscout explorer widget ✅
│   │   └── src/
│   │       └── widget.tsx         # Embeddable security widget
│   │
│   └── envio-indexer/     # Envio indexer ✅
│       ├── config.yaml         # Indexer configuration
│       ├── schema.graphql      # GraphQL schema
│       └── src/
│           ├── generated.ts    # Generated code
│           └── handlers/
│               └── security-events.ts # Security event handlers
│
├── examples/
│   └── vulnerable-contracts/
│       ├── SecureBank.sol
│       └── VulnerableBank.sol
│
├── scripts/               # Utility scripts
│   └── bootstrap.sh       # Setup script
│
├── CVE_FEATURE_SUMMARY.md # CVE feature documentation
├── CVE_TESTING.md         # CVE scanner testing guide
└── README.md

Legend: ✅ Complete | ⏳ In Progress | 🔜 Planned
```

## 🛠️ Development

```bash
# Install dependencies (monorepo)
npm install

# Build all packages
npm run build

# Build specific packages
npm run build:core
npm run build:cli

# Run CLI from bin directory
./bin/n3 contracts/MyContract.sol -d

# Make CLI globally available for development
mkdir -p ~/bin
ln -sf $(pwd)/bin/n3 ~/bin/n3
# Add to PATH (also added automatically to ~/.bashrc)
export PATH="$PATH:$HOME/bin"
n3 --help

# Test the core engine
npm run test-scan

## 📖 Documentation

### Core Documentation
- **[CLI Guide](./packages/cli/CLI_GUIDE.md)** - Complete CLI usage and examples
- **[Hardhat Tasks](./packages/hardhat-plugin/TASKS.md)** - Advanced task documentation (800+ lines)
- **[CVE Testing Guide](./CVE_TESTING.md)** - CVE scanner setup and testing
- **[CVE Feature Summary](./CVE_FEATURE_SUMMARY.md)** - CVE implementation details
- **[Envio Integration](./README_ENVIO_INTEGRATION.md)** - Envio HyperIndex and HyperSync integration

### Quick Links
- [Installation Guide](#installation)
- [Creating Security Templates](#creating-security-templates)
- [Hardhat Integration](#hardhat-configuration)
- [CVE Scanner Usage](#cve-scanning)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Creating Security Templates

See our [Template Guide](./packages/core/templates/README.md) to create your own security templates.

Example template structure:
```yaml
id: your-check-001
name: Your Security Check
severity: high
category: smart-contract

detection:
  patterns:
    - name: vulnerable_pattern
      solidity: |
        // Pattern to detect

risk_calculation:
  base_score: 80
  modifiers:
    has_mitigation: -50

remediation:
  priority: 2
  fixes:
    - Apply security best practice
    - Use safe library functions
```

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Build and test: `npm run build && npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

For more details, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🙏 Acknowledgments

- ProjectDiscovery's [Nuclei](https://github.com/projectdiscovery/nuclei) for inspiration on template-based scanning
- OpenZeppelin for security standards and best practices
- ETHGlobal for organizing ETHOnline 2025
- The Web3 security community for continuous innovation

### Technologies Used
- **TypeScript** - Type-safe development
- **Hardhat** - Smart contract development framework
- **Axios** - HTTP client for CVE scanning
- **Commander.js** - CLI framework
- **Chalk & Ora** - Beautiful terminal output
- **js-yaml/yaml** - YAML template parsing
- **Zod** - Runtime type checking

**Built with ❤️ for ETHOnline 2025**
