# N3 - Nuclei for Web3 🛡️

> **Template-Based Security Scanner for Smart Contracts & DApps**  
> *From Development to Deployment - Continuous Security at Every Stage*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built for ETHGlobal](https://img.shields.io/badge/Built%20for-ETHGlobal%202025-blue)](https://ethglobal.com)

---

## 🎯 What is N3?

**N3 (Nuclei for Web3)** is a template-based security scanner inspired by [ProjectDiscovery's Nuclei](https://github.com/projectdiscovery/nuclei). Instead of rigid static analysis rules, N3 uses **human-readable YAML templates** to detect vulnerabilities in Solidity smart contracts.

### Core Philosophy: Templates > Hardcoded Rules

Traditional scanners have fixed, hardcoded rules. N3 lets you:

-  **Create custom templates** for new vulnerability patterns
-  **Share templates** across teams and communities
-  **Update detection logic** without changing code
-  **Combine multiple templates** for comprehensive scans
-  **Calculate risk scores** based on template matches

### Example Template

```yaml
id: reentrancy-001
name: Reentrancy Vulnerability
severity: CRITICAL
category: smart-contract
description: Detects potential reentrancy attack patterns

patterns:
  - pattern: "call.value"
    before: "balance[msg.sender] -= amount"
    message: "External call before state change"
  
  - pattern: "withdraw"
    missing: "nonReentrant"
    message: "Missing reentrancy guard"

remediation: |
  1. Use checks-effects-interactions pattern
  2. Add ReentrancyGuard from OpenZeppelin
  3. Update state before external calls

cvss: 9.8
references:
  - https://swcregistry.io/docs/SWC-107
  - https://consensys.github.io/smart-contract-best-practices/
```

---

## 🚀 Features

### 1. Template Library (40+ Pre-Built Templates)

| Category | Templates | Examples |
|----------|-----------|----------|
| **SWC (Smart Contract Weakness)** | 20+ | Reentrancy, Access Control, Integer Overflow |
| **DeFi Vulnerabilities** | 10+ | Flash Loan Attacks, Oracle Manipulation, Price Manipulation |
| **Smart Contract Patterns** | 10+ | Initialization Issues, Upgrade Patterns, Gas Optimization |
| **CVE Detection** | 3+ | HTTP-based infrastructure scanning |

### 2. Multi-Platform Integration

N3's template engine integrates seamlessly across the development workflow:

```
┌─────────────────────────────────────────────┐
│     N3 TEMPLATE-BASED SCANNER CORE          │
│  (YAML Templates + Risk Calculator)         │
└──────────────┬──────────────────────────────┘
               │
      ┌────────┴────────┐
      │  Scan Contract  │
      │  Match Templates│
      │  Calculate Risk │
      └────────┬────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌───▼───┐  ┌──▼────┐
│  CLI  │  │Hardhat│  │  MCP  │
│Scanner│  │Plugin │  │Server │
└───┬───┘  └───┬───┘  └───┬───┘
    │          │          │
    │      ┌───▼───┐      │
    │      │ Build │      │
    │      │ Time  │      │
    │      └───────┘      │
    │                     │
┌───▼─────────────────────▼───┐
│   Blockscout Widget Display │
│   + Envio Real-Time Index   │
└─────────────────────────────┘
```

---

## 📦 Architecture

```
N3/
├── packages/
│   ├── core/                 #  TEMPLATE ENGINE (Core)
│   │   ├── templates/        #    40+ YAML templates
│   │   │   ├── SWC/         #    Smart Contract Weakness
│   │   │   ├── defi/        #    DeFi attack patterns
│   │   │   └── smart-contract/  # General patterns
│   │   ├── src/
│   │   │   ├── engine.ts    #    Template matching engine
│   │   │   ├── parser.ts    #    YAML template parser
│   │   │   └── risk-calculator.ts # CVSS-based scoring
│   │   └── cve-templates/   #    CVE definitions
│   │
│   ├── cli/                  #  Command-line scanner
│   ├── hardhat-plugin/       #  Hardhat 3 integration
│   ├── mcp-server/           #  AI Model Context Protocol
│   ├── blockscout-widget/    #  Explorer visualization
│   └── envio-indexer/        #  Real-time event indexing
│
├── contracts/
│   └── N3SecurityOracle.sol  # On-chain scan result storage
│
└── scripts/
    └── deploy-oracle.js      # Contract deployment
```

---

## 🛠️ Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Smart Contracts** | Hardhat | 3.0.9 | Development & deployment |
| **Indexing** | Envio HyperIndex | 2.31.0 | Event monitoring |
| **AI Integration** | Blockscout SDK | 1.20.2 | AI-powered analysis |
| **Explorer** | Blockscout | API + Widget | Block explorer integration |
| **Database** | PostgreSQL | 17.5 | Event storage |
| **API** | Hasura GraphQL | 2.43.0 | Query interface |
| **Runtime** | Node.js | 22.21.0 | JavaScript execution |
| **Package Manager** | pnpm | 10.19.0 | Monorepo management |

---

## 🔧 Installation

### Prerequisites

**IMPORTANT**: Hardhat 3.x requires Node.js 22.10.0 or later. Node.js 20.x is not compatible.

```bash
# Install Node.js 22 (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify version
node --version  # Should be 22.10.0 or higher
```

Other requirements:
- pnpm 10.x or npm 10.x
- Docker & Docker Compose (for Envio)
- PostgreSQL 17+ (or use Docker)

### Quick Start

```bash
# Clone repository
git clone https://github.com/intelligent-ears/N3.git
cd N3

# Install dependencies
pnpm install

# Build all packages
pnpm run build
```

---

## 📚 Usage

### 1. CLI Scanner

```bash
# Scan a single contract
n3 scan contracts/MyContract.sol

# Scan with specific templates
n3 scan MyContract.sol --template reentrancy-001

# Generate detailed report
n3 scan MyContract.sol --format html --output report.html

# Scan with severity filter
n3 scan MyContract.sol --severity critical,high
```

### 2. Hardhat Plugin

```javascript
// hardhat.config.js
require('@n3-security/hardhat-plugin');

module.exports = {
  solidity: "0.8.20",
  n3: {
    templates: './n3-templates',
    severity: ['critical', 'high', 'medium'],
    failOnCritical: true,
    reportFormat: 'json'
  }
};
```

```bash
# Run security scan
npx hardhat scan

# Run comprehensive audit
npx hardhat audit

# Generate security tests
npx hardhat test:generate

# Check template coverage
npx hardhat coverage:security
```

### 3. MCP Server (AI Integration)

```bash
# Start MCP server
node mcp-blockscout-server.mjs

# The server runs on http://localhost:3000
# AI assistants can query: /api/analyze
```

Example API call:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "chain": "ethereum"
  }'
```

### 4. Envio Indexer (Real-time Monitoring)

```bash
# Navigate to indexer
cd packages/envio-indexer

# Start Envio development server
envio dev

# Access Hasura console at http://localhost:8080
# GraphQL endpoint: http://localhost:8080/v1/graphql
```

Query vulnerability events:
```graphql
query GetVulnerabilities {
  VulnerabilityEvent(
    where: { severity: { _eq: "CRITICAL" } }
    order_by: { detectedAt: desc }
  ) {
    id
    contractAddress
    vulnerabilityType
    severity
    detectedAt
  }
}
```

---

## 🧪 Example Output

### CLI Scan Results

```
🔍 Scanning VulnerableBank.sol...

📊 Found 7 vulnerabilities

🔥 Risk Score: 87.35/100 (CRITICAL)

✅ Templates: reentrancy, access-control, math, oracle, flash-loan

🔴 Critical: 2 issues
  - Reentrancy vulnerability in withdraw()
  - Unprotected initialization function

🟠 High: 2 issues
  - Integer overflow in calculateReward()
  - Missing access control on admin functions

🟡 Medium: 3 issues
  - Unchecked external call return value
  - Block timestamp dependency
  - Gas optimization needed

✅ Scan completed in 234ms
```

### Hardhat Integration Output

```
Compiling contracts...
✓ Compiled 3 contracts

Running N3 Security Scan...
✓ Scanned 3 contracts with 40 templates

SecurityToken.sol: ✅ PASSED (Risk: 15/100)
VulnerableBank.sol: ❌ FAILED (Risk: 87/100)
  - 2 CRITICAL issues found
  - Build stopped (failOnCritical: true)

Error: Security scan failed. Fix critical issues before deployment.
```

---

## 🎯 Template Coverage

N3 includes comprehensive template coverage across multiple categories:

### Smart Contract Weaknesses (SWC)

-  SWC-101: Integer Overflow/Underflow
-  SWC-107: Reentrancy
-  SWC-115: Authorization through tx.origin
-  SWC-116: Timestamp Dependence
-  SWC-120: Weak Sources of Randomness
-  SWC-134: Message call with hardcoded gas
- ... and 15+ more

### DeFi Attack Patterns

-  Flash Loan Attacks
-  Oracle Manipulation
-  Price Manipulation
-  Front-running vulnerabilities
-  Sandwich attacks
-  MEV exploitation
- ... and more

### General Smart Contract Issues

-  Uninitialized storage pointers
-  Delegate call issues
-  Selfdestruct vulnerabilities
-  Gas optimization patterns
-  Upgrade pattern violations
	
---

## 📊 Risk Scoring

N3 uses a CVSS-inspired risk calculation methodology:

```bash
Risk Score = Σ (Template_Match_Score × Severity_Weight)

Severity Weights:
- CRITICAL: 10.0
- HIGH:     7.5
- MEDIUM:   5.0
- LOW:      2.5
- INFO:     1.0
```

**Risk Levels:**
- 🟢 **0-30**: LOW - Minor issues, safe to deploy
- 🟡 **31-60**: MEDIUM - Review recommended
- 🟠 **61-80**: HIGH - Fix before deployment
- 🔴 **81-100**: CRITICAL - Do not deploy

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Adding New Templates

1. Create a YAML file in `packages/core/templates/`
2. Follow the template schema (see examples)
3. Test with sample vulnerable contracts
4. Submit a PR with test cases

### Template Schema

```yaml
id: unique-identifier
name: Human-readable name
severity: CRITICAL|HIGH|MEDIUM|LOW|INFO
category: smart-contract|defi|infrastructure
description: What this template detects

patterns:
  - pattern: "regex or string to match"
    context: "where to look (optional)"
    message: "Issue description"

remediation: |
  Step-by-step fix instructions

cvss: 0.0-10.0
references:
  - https://relevant-documentation.com
```

---

## 📖 Documentation

- [**Quick Reference**](./QUICK_REFERENCE.md) - Essential commands and workflows
- [**Integration Guide**](./INTEGRATION_GUIDE.md) - Platform integrations (1006 lines)
- [**Architecture**](./ARCHITECTURE.md) - System design and components


---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

---

## 🔗 Links

- **Repository**: https://github.com/intelligent-ears/N3
- **Documentation**: See `DOCUMENTATION_INDEX.md`
- **Templates**: `packages/core/templates/`
- **Examples**: `examples/`

---

## 🙏 Acknowledgments

- Inspired by [Nuclei](https://github.com/projectdiscovery/nuclei) by ProjectDiscovery
- Built with [Hardhat](https://hardhat.org/), [Envio](https://envio.dev/), and [Blockscout](https://blockscout.com/)
- Smart contract security patterns from [SWC Registry](https://swcregistry.io/)

---

<div align="center">
  <strong>N3: Securing Web3, Templates for security</strong> 🛡️
</div>
