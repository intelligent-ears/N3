# N3 - Nuclei for Web3 🛡️# N3: Template-Based Vulnerability Scanner for Web3# N3 - Nuclei for Web3 🛡️



> **Template-Based Vulnerability Scanner for Smart Contracts**  

> *Detect security issues using customizable YAML templates - from development to deployment*

**N3** (Nuclei for Web3) is an AI-powered, template-based security scanner for smart contracts and DApps, built with modern blockchain development tools.> **Template-Based Security Scanner for Smart Contracts & DApps**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Hardhat 3](https://img.shields.io/badge/Hardhat-3.0-yellow)](https://hardhat.org/)> 

[![Node 22](https://img.shields.io/badge/Node-22.21-green)](https://nodejs.org/)

## 🏆 Hackathon Tracks> *From Development to Deployment - Continuous Security at Every Stage*

---



## 🎯 What is N3?

N3 is designed to compete in three hackathon tracks:[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**N3 (Nuclei for Web3)** is a template-based security scanner inspired by [ProjectDiscovery's Nuclei](https://github.com/projectdiscovery/nuclei). Instead of rigid static analysis rules, N3 uses **human-readable YAML templates** to detect vulnerabilities in Solidity smart contracts.

[![Built for ETHOnline 2025](https://img.shields.io/badge/Built%20for-ETHOnline%202025-blue)](https://ethglobal.com)

### Core Philosophy: Templates > Hardcoded Rules

### 1. Blockscout Track ($10,000 Prize Pool)

Traditional scanners have fixed, hardcoded rules. N3 lets you:

- ✅ **Create custom templates** for new vulnerability patterns- **MCP Integration** ($3,500): AI-powered security analysis via Model Context Protocol---

- ✅ **Share templates** across teams and communities

- ✅ **Update detection logic** without changing code- **SDK Usage** ($3,000): Interactive UI components using Blockscout SDK  

- ✅ **Combine multiple templates** for comprehensive scans

- ✅ **Calculate risk scores** based on template matches- **Autoscout** ($3,500): Custom explorer deployment at deploy.blockscout.com## 🎯 What is N3?



### Example Template



```yaml### 2. Envio Track ($5,000 Prize Pool)**N3** (Nuclei for Web3) brings the power of template-based vulnerability detection to the blockchain ecosystem. Inspired by ProjectDiscovery's Nuclei, N3 enables developers to:

id: reentrancy-001

name: Reentrancy Vulnerability  - **HyperIndex Integration** ($1,500): Real-time blockchain event indexing

severity: CRITICAL

category: smart-contract- **AI Tooling** ($3,500): AI-enhanced security analytics and dashboards- ✅ **Detect vulnerabilities** during development with smart contract scanning

description: Detects potential reentrancy attack patterns

- ✅ **Run security tests** automatically with auto-generated Hardhat tests

patterns:

  - pattern: "call.value"### 3. Hardhat Track ($5,000 Prize Pool)- ✅ **Monitor deployed contracts** in real-time with CVE detection

    before: "balance[msg.sender] -= amount"

    message: "External call before state change"- **Hardhat 3.x Plugin**: Security scanner integration with Hardhat workflow- ✅ **Generate comprehensive audits** with HTML/JSON/Markdown reports

  

  - pattern: "withdraw"- Uses Hardhat **3.0.8** (Prize requires 3.0.0+) ✅- ✅ **Track security coverage** with template coverage analysis

    missing: "nonReentrant"

    message: "Missing reentrancy guard"- ✅ **Scan infrastructure** for known CVEs and exposures



remediation: |## 🚀 Features- ✅ **Support multiple chains** for comprehensive coverage

  1. Use checks-effects-interactions pattern

  2. Add ReentrancyGuard from OpenZeppelin

  3. Update state before external calls

### Core Capabilities### Why N3?

cvss: 9.8

references:- 📝 **Template-Based Scanning**: YAML-based vulnerability templates (SWC, DeFi, Smart Contract patterns)

  - https://swcregistry.io/docs/SWC-107

  - https://consensys.github.io/smart-contract-best-practices/- 🤖 **AI-Powered Analysis**: MCP server for AI-enhanced security insights| Feature | N3 | Traditional Tools |

```

- 📊 **Real-Time Indexing**: Envio HyperIndex for blockchain event monitoring|---------|----|--------------------|

---

- 🔧 **Hardhat Integration**: Native plugin for compilation-time security checks| **Template-Based** | ✅ YAML templates (extensible) | ❌ Hardcoded rules |

## 🚀 Features

- 🌐 **Blockscout Widget**: Embeddable security dashboard for explorers| **Smart Contract Scanning** | ✅ Solidity analysis | ✅ Limited support |

### 1. Template Library (40+ Pre-Built Templates)

- 📈 **Risk Calculator**: Automated CVSS-style security scoring| **CVE Detection** | ✅ HTTP-based scanning | ❌ Not included |

| Category | Templates | Examples |

|----------|-----------|----------|| **Auto-Generated Tests** | ✅ Hardhat test generation | ❌ Manual only |

| **SWC (Smart Contract Weakness)** | 20+ | Reentrancy, Access Control, Integer Overflow |

| **DeFi Vulnerabilities** | 10+ | Flash Loan Attacks, Oracle Manipulation, Price Manipulation |### Security Templates| **Coverage Analysis** | ✅ Template coverage metrics | ❌ Code coverage only |

| **Smart Contract Patterns** | 10+ | Initialization Issues, Upgrade Patterns, Gas Optimization |

- **SWC Templates**: 40+ Solidity weakness classifications| **Multi-Format Reports** | ✅ HTML/JSON/MD | ⚠️ Limited formats |

### 2. Multi-Platform Integration

- **DeFi Templates**: Flash loan attacks, oracle manipulation, liquidity exploits| **CLI & Hardhat Plugin** | ✅ Both included | ⚠️ Usually separate |

N3's template engine integrates seamlessly across the development workflow:

- **Smart Contract**: Reentrancy, access control, arithmetic issues| **Real-time Monitoring** | ✅ MCP server + Envio integration | ❌ Not available |

```

┌─────────────────────────────────────────────┐| **Indexed Contract Data** | ✅ Envio HyperIndex integration | ❌ Not available |

│     N3 TEMPLATE-BASED SCANNER CORE          │

│  (YAML Templates + Risk Calculator)         │## 📦 Architecture| **Open Source** | ✅ MIT License | ⚠️ Varies |

└──────────────┬──────────────────────────────┘

               │

      ┌────────┴────────┐

      │  Scan Contract  │```## 🚀 Quick Start

      │  Match Templates│

      │  Calculate Risk │N3/

      └────────┬────────┘

               │├── contracts/           # Smart contracts (N3SecurityOracle)### ✅ Status: FULLY OPERATIONAL!

    ┌──────────┼──────────┐

    │          │          │├── packages/

┌───▼───┐  ┌───▼───┐  ┌──▼────┐

│  CLI  │  │Hardhat│  │  MCP  ││   ├── cli/            # Command-line scanner**N3 is production-ready!** The complete security scanner with CLI, core engine, advanced Hardhat tasks, and CVE detection has been successfully built and tested.

│Scanner│  │Plugin │  │Server │

└───┬───┘  └───┬───┘  └───┬───┘│   ├── core/           # Template engine & risk calculator

    │          │          │

    │      ┌───▼───┐      ││   ├── hardhat-plugin/ # Hardhat 3.x integration**Latest Features (October 2025):**

    │      │ Build │      │

    │      │ Time  │      ││   ├── mcp-server/     # AI Model Context Protocol server- 🎯 **Advanced Hardhat Tasks**: Test generation, comprehensive audit, coverage analysis

    │      └───────┘      │

    │                     ││   ├── blockscout-widget/  # Explorer UI component- 🔍 **CVE Scanner**: HTTP-based vulnerability detection with Nuclei-style templates

┌───▼─────────────────────▼───┐

│   Blockscout Widget Display ││   └── envio-indexer/  # HyperIndex configuration- 📊 **Multi-format Reports**: HTML, JSON, and Markdown output

│   + Envio Real-Time Index   │

└─────────────────────────────┘├── scripts/            # Deployment & bootstrap scripts- 🎨 **Enhanced Terminal Output**: Beautiful colorized reports with emoji indicators

```

└── examples/           # Integration demos- 🧪 **Auto-generated Tests**: Generate Hardhat tests from security findings

### 3. Hackathon Track Integration

```- 📈 **Coverage Analysis**: Track security template coverage with thresholds

#### 🔍 Blockscout Track ($10,000)

- **MCP Server** ($3,500): AI-powered security analysis via Model Context Protocol- 🔄 **Envio Integration**: Scan indexed contract data and real-time security monitoring

- **Blockscout Widget** ($3,500): Visual security dashboard on block explorer

- **SDK Integration** ($3,000): Enhanced contract interaction UIs## 🛠️ Technology Stack



#### ⚡ Envio Track ($5,000)**Live Test Results:**

- **HyperIndex** ($1,500): Real-time indexing of security scan events

- **AI Dashboard** ($3,500): GraphQL-powered analytics interface| Component | Technology | Version | Purpose |```



#### 🛠️ Hardhat Track ($5,000)|-----------|-----------|---------|---------|🔍 Scanning VulnerableBank.sol...

- **Hardhat 3.x Plugin**: Automatic template scanning during compilation

- **Build-Time Security**: Catch vulnerabilities before deployment| **Smart Contracts** | Hardhat | 3.0.8 | Development & deployment |📊 Found 7 vulnerabilities



---| **Indexing** | Envio HyperIndex | 2.31.0 | Event monitoring |🔥 Risk Score: 87.35/10 (CRITICAL)



## 📦 Architecture| **AI Integration** | MCP SDK | 1.20.2 | AI-powered analysis |✅ Templates: reentrancy, access-control, math, oracle, flash-loan



```| **Explorer** | Blockscout | SDK + Autoscout | Block explorer integration |

N3/

├── packages/| **Database** | PostgreSQL | 17.5 | Event storage |🔴 Critical: 2 issues

│   ├── core/                 # 🎯 TEMPLATE ENGINE (Core)

│   │   ├── templates/        #    40+ YAML templates| **API** | Hasura GraphQL | 2.43.0 | Query interface |🟠 High: 2 issues

│   │   │   ├── SWC/         #    Smart Contract Weakness

│   │   │   ├── defi/        #    DeFi attack patterns| **Runtime** | Node.js | 22.10.0+ | Required for Hardhat 3 |✅ Scan completed in 2ms

│   │   │   └── smart-contract/  # General patterns

│   │   ├── src/```

│   │   │   ├── engine.ts    #    Template matching engine

│   │   │   ├── parser.ts    #    YAML template parser## 🔧 Prerequisites

│   │   │   └── risk-calculator.ts # CVSS-based scoring

│   │   └── cve-templates/   #    CVE definitions**CVE Scanner Test Results:**

│   │

│   ├── cli/                  # 💻 Command-line scanner**IMPORTANT**: Hardhat 3.x requires Node.js 22.10.0 or later. Node.js 20.x is not compatible.```

│   ├── hardhat-plugin/       # 🔨 Hardhat 3 integration

│   ├── mcp-server/           # 🤖 AI Model Context Protocol🔍 CVE SCAN RESULTS

│   ├── blockscout-widget/    # 📊 Explorer visualization

│   └── envio-indexer/        # ⚡ Real-time event indexing```bashTarget: http://localhost:8765

│

├── contracts/# Install Node.js 22 (Ubuntu/Debian)Total Checks: 3

│   └── N3SecurityOracle.sol  # On-chain scan result storage

│curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -Vulnerabilities Found: 1

└── scripts/

    └── deploy-oracle.js      # Contract deploymentsudo apt-get install -y nodejs

```

🟠 Profanity weak cryptography [CVE-2022-40769]

---

# Verify version   Severity: HIGH

## 🔧 Installation

node --version  # Should be 22.10.0 or higher   ✅ Successfully detected vulnerable patterns

### Prerequisites

``````

```bash

# Node.js 22+ required for Hardhat 3

node --version  # v22.21.0+

Other requirements:### Installation

# Install pnpm

npm install -g pnpm- pnpm 10.x or npm 10.x

```

- Docker & Docker Compose (for Envio)```bash

### Quick Start

- PostgreSQL 17+ (or use Docker)# Install dependencies (monorepo)

```bash

# Clone repositorynpm install

git clone https://github.com/intelligent-ears/N3.git

cd N3## 📥 Installation



# Install dependencies# Build all packages

pnpm install

### 1. Clone & Install Dependenciesnpm run build

# Build all packages

pnpm run build

```

```bash# Use n3 command directly from repo

---

git clone https://github.com/intelligent-ears/N3.git./bin/n3 --help

## 🎯 Usage

cd N3

### 1. CLI Scanner (Core Template Engine)

pnpm install# Make n3 available globally (method 1 - symlink)

Scan any Solidity contract using templates:

```mkdir -p ~/bin

```bash

# Scan with all templatesln -sf $(pwd)/bin/n3 ~/bin/n3

n3 scan path/to/Contract.sol

### 2. Build All Packagesexport PATH="$PATH:$HOME/bin"

# Use specific category

n3 scan Contract.sol --category defi



# Use specific template```bash# Make n3 available globally (method 2 - requires sudo)

n3 scan Contract.sol --template reentrancy-001

pnpm run buildcd packages/cli

# Get detailed output

n3 scan Contract.sol --verbose --json```sudo npm link

```

```

**Example Output:**

### 3. Install CLI Globally (Optional)

```

🔍 N3 Template-Based Security Scanner### Quick Scan with CLI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```bash

📄 Scanning: VulnerableBank.sol

📋 Templates loaded: 42./scripts/install-global.sh```bash

⚡ Engine: v0.1.0

# or manually:# Scan a single contract (assuming n3 is in PATH)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 VULNERABILITIES DETECTEDpnpm --filter @n3/cli buildn3 contracts/MyContract.sol

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm link packages/cli

🔴 CRITICAL | Reentrancy Vulnerability

   Template: reentrancy-001```# Scan with debug output

   Location: Line 45, function withdraw()

   Pattern:  External call before state changen3 contracts/MyContract.sol -d

   Risk:     CVSS 9.8

   Fix:      Add ReentrancyGuard modifier## 🎯 Quick Start



🟠 HIGH | Missing Access Control  # Scan with specific templates

   Template: access-001

   Location: Line 23, function setOwner()### CLI Scannern3 contracts/MyContract.sol -t reentrancy,access

   Pattern:  Public function without access control

   Risk:     CVSS 7.5

   Fix:      Add onlyOwner modifier

Scan a Solidity contract:# Filter by severity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SCAN SUMMARYn3 contracts/MyContract.sol -s critical,high

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```bash

Templates Matched: 2/42

Risk Score:        35/100 (CRITICAL)n3 scan path/to/Contract.sol# Export results to JSON

Critical:          1

High:              1# or without global install:n3 contracts/MyContract.sol -o report.json

Medium:            0

Low:               0node packages/cli/dist/cli.js scan path/to/Contract.sol```



🔗 Full Report: ./n3-scan-report.json```

```

### Hardhat Plugin Installation

### 2. Hardhat Plugin (Build-Time Scanning)

Scan with specific templates:

Add to `hardhat.config.js`:

```bash

```javascript

import "@nomicfoundation/hardhat-ethers";```bashnpm install --save-dev @n3/hardhat-plugin

import "@n3/hardhat-plugin";

n3 scan Contract.sol --template defi/flash-loan-001.yaml```

export default {

  solidity: "0.8.20",n3 scan Contract.sol --category smart-contract

  n3: {

    enabled: true,```### Hardhat Configuration

    templatesDir: "node_modules/@n3/core/templates",

    categories: ["swc", "defi", "smart-contract"],

    stopOnCritical: false,  // Don't fail build on critical issues

    reportFile: "./n3-report.json"### Hardhat PluginAdd to your `hardhat.config.js`:

  }

};

```

Add to your `hardhat.config.js`:```javascript

Automatic scanning during compilation:

require("@n3/hardhat-plugin");

```bash

npx hardhat compile```javascript



# Output:import "@n3/hardhat-plugin";module.exports = {

# Compiling 3 files...

# ✅ Compilation successful  solidity: "0.8.20",

# 

# 🛡️  Running N3 Template Scanner...export default {  n3: {

# 📋 Loaded 42 templates

# 🔍 Scanning Contract.sol...  n3: {    templates: "./n3-templates",

# ⚠️  2 vulnerabilities detected

# 📄 Report: ./n3-report.json    enabled: true,    severity: ["critical", "high", "medium"],

```

    templatesDir: "node_modules/@n3/core/templates",    failOnCritical: true,

### 3. MCP Server (AI Integration)

    stopOnCritical: false    reportFormat: "json",

Start the Blockscout MCP server:

  }  }

```bash

# Start server};};

node mcp-blockscout-server.mjs

``````

# Server running on http://localhost:3000

```



**API Endpoints:**Run security scan during compilation:### Hardhat Usage



```bash

# Analyze contract (runs template scanner)

curl -X POST http://localhost:3000/api/analyze \```bash```bash

  -H "Content-Type: application/json" \

  -d '{"address": "0x...", "code": "contract code here"}'npx hardhat compile  # Automatically runs N3 scanner# Scan your contracts



# Get AI-ready security promptsnpx hardhat n3:scan  # Manual scannpx hardhat n3:scan

curl http://localhost:3000/api/prompt

```

# Response includes:

# - Template scan results# Generate security tests from vulnerabilities

# - Risk scores

# - Remediation suggestions### MCP Server (AI Integration)npx hardhat n3:test --generate

# - AI-formatted context

```



### 4. Blockscout Widget (Visual Dashboard)Start the Blockscout MCP server:# Run generated security tests



Embed security scan results on Blockscout:npx hardhat n3:test --run



```html```bash

<div id="n3-security-widget"></div>

node mcp-blockscout-server.mjs# Do both: generate and run tests

<script src="https://unpkg.com/@n3/blockscout-widget"></script>

<script>```npx hardhat n3:test --generate --run

  N3BlockscoutWidget.render({

    containerId: 'n3-security-widget',

    contractAddress: '0x...',

    network: 'ethereum',API Endpoints:# Comprehensive audit with multiple formats

    // Widget automatically fetches template scan results

    apiEndpoint: 'https://api.n3security.io'- `GET /` - Health checknpx hardhat n3:audit --output audit.html --format html

  });

</script>- `POST /api/analyze` - Analyze contract codenpx hardhat n3:audit --output audit.json --format json

```

- `GET /api/report/:address` - Get security reportnpx hardhat n3:audit --output audit.md --format markdown

### 5. Envio Indexer (Real-Time Monitoring)

- `GET /api/prompt` - Get AI-ready security prompts

Index security scan events in real-time:

# Check security template coverage

```bash

cd packages/envio-indexerExample usage:npx hardhat n3:coverage --threshold 80

envio dev



# Indexes events from N3SecurityOracle contract

# Query via GraphQL at http://localhost:8080```bash# Coverage with detailed metrics

```

# Analyze a contractnpx hardhat n3:coverage --show-details

**GraphQL Query Example:**

curl -X POST http://localhost:3000/api/analyze \```

```graphql

query {  -H "Content-Type: application/json" \

  vulnerabilityEvents(

    where: { severity: { _gte: 3 } }  -d '{"address": "0x..."}'### CVE Scanning

    orderBy: { timestamp: desc }

  ) {

    id

    contractAddress# Get formatted AI promptScan URLs for known Common Vulnerabilities and Exposures:

    vulnerabilityType

    severitycurl http://localhost:3000/api/prompt

    templateId

    timestamp``````bash

  }

}# Basic CVE scan

```

### Deploy Smart Contractsn3 cve http://example.com

---



## 🔬 Creating Custom Templates

Start Hardhat local network:# Scan with custom templates

Create your own vulnerability detection templates:

n3 cve http://example.com --templates ./cve-templates

```yaml

# templates/custom/my-vulnerability.yaml```bash



id: my-vuln-001npx hardhat node# Filter by severity

name: My Custom Vulnerability

severity: HIGH```n3 cve http://example.com --severity critical,high

category: custom

description: Detects my specific vulnerability pattern



author: YourNameDeploy N3SecurityOracle:# Filter by tags

created: 2025-01-15

tags:n3 cve http://example.com --tags exposure,keys

  - security

  - custom```bash

  - defi

npx hardhat run scripts/deploy-oracle.js --network localhost# Save results to file

# Detection patterns

patterns:```n3 cve http://example.com --save report.json

  # Pattern 1: Function signature

  - pattern: "function dangerousOperation"

    context: "public|external"

    message: "Dangerous function is public"Contract will be deployed and emit test security events.# Debug mode

    

  # Pattern 2: Missing validationn3 cve http://example.com --debug

  - missing: "require(amount > 0)"

    in: "transfer"### Envio HyperIndex```

    message: "Missing amount validation"



# Remediation steps

remediation: |**Status**: Configured but requires schema fixes before deployment.## 📚 Features

  1. Change function visibility to internal/private

  2. Add input validation checks

  3. Add access control modifiers

  4. Add comprehensive testsConfiguration: `packages/envio-indexer/config.yaml`### 🖥️ Command-Line Interface (CLI)



# Risk scoring (CVSS-based)

cvss: 7.2

impact: HIGHStart indexer (when fixed):N3 provides a powerful Nuclei-style CLI for security scanning:

exploitability: MEDIUM



# References

references:```bash**Smart Contract Scanning:**

  - https://your-blog.com/vulnerability-analysis

  - https://github.com/your-repo/security-guidecd packages/envio-indexer```bash

```

envio dev# Basic scan

**Use your template:**

```n3 contracts/MyContract.sol

```bash

n3 scan Contract.sol --template custom/my-vuln-001

```

View GraphQL API:# Debug mode (verbose logging)

---

- Hasura Console: http://localhost:8080n3 contracts/MyContract.sol -d

## 📊 Template Categories

- GraphQL Endpoint: http://localhost:8080/v1/graphql

### SWC (Smart Contract Weakness Classification)

# Template selection

Based on [SWC Registry](https://swcregistry.io/):

## 🎨 Blockscout Integrationn3 contracts/ -t reentrancy,access,math

- **SWC-107**: Reentrancy

- **SWC-105**: Unprotected Ether Withdrawal

- **SWC-101**: Integer Overflow/Underflow

- **SWC-115**: Authorization through tx.origin### Widget Demo# Severity filtering

- **SWC-114**: Transaction Order Dependence

- ...and 15+ moren3 contracts/ -s critical,high



### DeFi Attack PatternsSee `examples/blockscout-widget-demo.html` for embeddable security dashboard.



Real-world DeFi vulnerabilities:# Multiple output formats



- Flash Loan Attacks### Autoscout Deploymentn3 contracts/ -o report.json -f json

- Oracle Manipulation

- Sandwich Attacksn3 contracts/ -o report.md -f markdown

- Price Manipulation

- Liquidity Pool ExploitsTo deploy custom Blockscout explorer:n3 contracts/ -o report.html -f html

- Yield Farming Vulnerabilities



### Smart Contract Best Practices

1. Visit https://deploy.blockscout.com# CI/CD integration

General security patterns:

2. Request hackathon credits via Discordn3 contracts/ --fail-on-critical

- Access Control Issues

- Initialization Vulnerabilities3. Deploy for your network

- Upgrade Pattern Issues

- Gas Optimization Antipatterns4. Integrate N3 widget# List available templates

- Event Emission Issues

n3 templates

---

## 📊 Example Workflow

## 🧪 Testing

# Validate custom templates

```bash

# Run all tests1. **Development**: Write smart contract in Hardhatn3 validate ./my-templates/

pnpm test

2. **Compilation**: Hardhat plugin scans on compile```

# Test template engine

pnpm test:core3. **Deployment**: Deploy to testnet/mainnet



# Test CLI scanner4. **Indexing**: Envio tracks security events**CVE Infrastructure Scanning:**

pnpm test:cli

5. **Monitoring**: MCP server provides AI analysis```bash

# Test Hardhat plugin

cd examples/hardhat-integration6. **Explorer**: Blockscout widget shows live status# Basic CVE scan

npx hardhat compile

```n3 cve http://example.com



---## 🧪 Testing



## 🚢 Deployment Status# Scan with severity filtering



### ✅ Completed```bashn3 cve http://example.com --severity critical,high



- **Template Engine**: 40+ YAML templates functional# Run all tests

- **CLI Scanner**: Working with all template categories

- **Hardhat Plugin**: Built and testedpnpm test# Save results

- **MCP Server**: Running on port 3000

- **Smart Contract**: Deployed to localhostn3 cve http://example.com --save report.json

- **Node.js 22**: Upgraded for Hardhat 3 support

# Test CLI scanner

### 🚧 In Progress

pnpm test-scan# Filter by tags

- **Envio Indexer**: Schema configuration complete (startup issues)

- **Blockscout SDK**: Integration plannedn3 cve http://example.com --tags exposure,keys

- **Autoscout**: Deployment pending

# Test Hardhat integration  

### 📋 Current Deployment

cd examples/hardhat-integration# Custom templates

```json

{npx hardhat compilen3 cve http://example.com --templates ./my-cve-templates

  "network": "localhost",

  "chainId": 31337,``````

  "contract": "N3SecurityOracle",

  "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",

  "scanner": "Template-Based Engine v0.1.0"

}## 📖 Documentation**CLI Features:**

```

- ✅ Nuclei-style interface (`-t`, `-d`, `-s` flags)

---

- [Envio Integration Flow](./ENVIO_FLOWCHART.md)- ✅ Debug mode with verbose logging

## 🐛 Known Issues

- [Envio Setup Guide](./ENVIO_MANUAL_SETUP.md)- ✅ Multiple output formats (JSON, Markdown, HTML, Terminal)

### Hardhat 3 + Node.js 20

**Fixed!** Upgraded to Node.js 22.21.0- [Envio Queries](./ENVIO_QUERIES.md)- ✅ Colored terminal output with emoji severity indicators



### Envio Schema Compatibility- [Contributing Guide](./CONTRIBUTING.md)- ✅ Template filtering by severity and category

**Status**: Configuration complete, ReScript schema issues preventing startup  

**Workaround**: Using mock data for demonstrations- [Documentation Index](./DOCUMENTATION_INDEX.md)- ✅ CI/CD integration with exit codes



---- ✅ Statistics mode for overview



## 📚 Documentation## 🐛 Known Issues- ✅ Glob pattern support for directory scanning



- **[Template Guide](./docs/TEMPLATES.md)**: How to create custom templates- ✅ **CVE scanning for deployed infrastructure**

- **[Envio Integration](./ENVIO_FLOWCHART.md)**: Real-time indexing setup

- **[Hackathon Status](./HACKATHON_STATUS.md)**: Prize track progress### Hardhat 3 + Node.js 20 Compatibility- ✅ **HTTP-based vulnerability detection**

- **[Contributing](./CONTRIBUTING.md)**: Development guidelines

- ✅ **Word, regex, status, and DSL matchers**

---

Hardhat 3.x is **not compatible** with Node.js 20.x. You will see this error:

## 🎯 Roadmap

### �🔍 Template-Based Scanning

### Short Term

- [ ] Fix Envio indexer startup```

- [ ] Add Blockscout SDK integration

- [ ] Deploy Autoscout explorer instanceTypeError: this[#dependenciesMap].values(...).flatMap is not a functionN3 uses YAML templates to define security checks:

- [ ] Create demo video

- [ ] Publish npm packages```



### Long Term```yaml

- [ ] Community template marketplace

- [ ] AI-assisted template generation**Solution**: Upgrade to Node.js 22.10.0+ (LTS)id: reentrancy-001

- [ ] Multi-chain support (Solana, Cosmos)

- [ ] IDE plugins (VS Code, Remix)name: Reentrancy Vulnerability Detection

- [ ] Continuous monitoring service

- [ ] Template verification system### Envio Indexer Schemaseverity: critical



---category: smart-contract



## 🤝 ContributingCurrent blocker: ReScript schema compatibility issue preventing indexer startup.



We welcome template contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md)detection:



**Ways to contribute:**Error: `The field 'id' defined twice with incompatible schemas`  patterns:

1. **Create templates** for new vulnerabilities

2. **Improve existing templates** with better patterns    - name: external_call_before_state_change

3. **Add integrations** for other tools

4. **Write documentation** and tutorials**Workaround**: Use mock data or wait for schema fix.      solidity: |

5. **Report bugs** and suggest features

        payable(.*).transfer(.*);

---

## 🏗️ Development Status        .*\[.*\]\s*=

## 📜 License



MIT License - see [LICENSE](./LICENSE)

| Component | Status | Notes |risk_calculation:

---

|-----------|--------|-------|  base_score: 90

## 🔗 Links

| CLI Scanner | ✅ Working | 5 templates functional |  modifiers:

- **GitHub**: https://github.com/intelligent-ears/N3

- **Nuclei Project**: https://github.com/projectdiscovery/nuclei| Hardhat Plugin | ✅ Working | Hardhat 3.0.8 installed |    has_reentrancy_guard: -80

- **SWC Registry**: https://swcregistry.io/

- **Blockscout**: https://www.blockscout.com/| MCP Server | ✅ Running | Port 3000, Blockscout integrated |

- **Envio**: https://envio.dev/

- **Hardhat**: https://hardhat.org/| Smart Contract | ✅ Deployed | localhost:8545 |remediation:



---| Envio Indexer | ⏳ Configured | Schema needs fixes |  priority: 1



## 🏆 Built For| Blockscout Widget | ✅ Demo | HTML example ready |  fixes:



- **ETHOnline 2025** (or respective hackathon)| Autoscout | ⏳ Pending | Awaiting deployment credits |    - Add nonReentrant modifier from OpenZeppelin

- **Blockscout Track**: MCP + SDK + Autoscout

- **Envio Track**: HyperIndex + AI Dashboard    - Follow Checks-Effects-Interactions pattern

- **Hardhat Track**: Hardhat 3.x Plugin

## 🚢 Deployment Info```

---



<p align="center">

  <strong>N3: Securing Web3, One Template at a Time</strong> 🛡️Current deployment (localhost):### 🧪 Advanced Hardhat Tasks

</p>

- **Network**: Hardhat localhost (Chain ID: 31337)

<p align="center">

  Made with ❤️ by the intelligent-ears team- **Contract**: `N3SecurityOracle`N3 provides comprehensive Hardhat tasks for security testing and auditing:

</p>

- **Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

- **Deployer**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`**1. Security Test Generation & Execution (`n3:test`)**

```bash

See `deployment-info.json` for details.# Generate Hardhat tests from vulnerability findings

npx hardhat n3:test --generate

## 🤝 Contributing

# Run generated security tests

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.npx hardhat n3:test --run



## 📜 License# Generate and run in one command

npx hardhat n3:test --generate --run

MIT License - see [LICENSE](./LICENSE) file for details.

# Specify contracts to test

## 🔗 Linksnpx hardhat n3:test --generate --contracts MyContract,MyToken

```

- **Repository**: https://github.com/intelligent-ears/N3

- **Blockscout**: https://www.blockscout.com/Features:

- **Envio**: https://envio.dev/- Auto-generates Hardhat test files from security templates

- **Hardhat**: https://hardhat.org/- Creates comprehensive test suites with risk scores

- **Model Context Protocol**: https://modelcontextprotocol.io/- Includes remediation TODOs in generated tests

- Supports running tests with Hardhat's test runner

## 🎯 Hackathon Prize Checklist

**2. Comprehensive Security Audit (`n3:audit`)**

### Blockscout Track```bash

- [x] MCP Server implemented (`mcp-blockscout-server.mjs`)# Generate HTML audit report

- [x] Blockscout API integrationnpx hardhat n3:audit --output audit.html --format html

- [ ] Blockscout SDK usage (TODO)

- [ ] Autoscout deployment (TODO)# Generate JSON report

- [x] Widget demo (`examples/blockscout-widget-demo.html`)npx hardhat n3:audit --output audit.json --format json



### Envio Track# Generate Markdown report

- [x] HyperIndex configuration (`packages/envio-indexer/`)npx hardhat n3:audit --output audit.md --format markdown

- [x] Event handlers implemented

- [ ] Deployed to hosted service (BLOCKED by schema)# Audit with network simulation

- [ ] AI-enhanced dashboard (TODO)npx hardhat n3:audit --network localhost

```

### Hardhat Track

- [x] Hardhat 3.0.8 installed (requires 3.0.0+)Features:

- [x] Plugin package (`packages/hardhat-plugin/`)- Executive summary with overall risk assessment

- [x] Integration example (`examples/hardhat-integration/`)- Contract-by-contract breakdown

- [ ] Node.js 22 migration (REQUIRED for compilation)- Top vulnerabilities by severity

- Visual HTML dashboard with charts

---- Multiple export formats (HTML, JSON, Markdown)



**Built with ❤️ for Web3 Security****3. Security Coverage Analysis (`n3:coverage`)**

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
