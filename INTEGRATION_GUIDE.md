# N3 Integration Guide

**Complete guide to using N3's template-based scanner across Hardhat, Blockscout, and Envio**

> N3's core template engine scans smart contracts for vulnerabilities. This guide shows how to access those scan results through three different platforms.

---

## Table of Contents

1. [Hardhat Integration](#hardhat-integration) - Build-time scanning
2. [Blockscout Integration](#blockscout-integration) - Block explorer visualization
3. [Envio Integration](#envio-integration) - Real-time event indexing
4. [Complete Workflow Example](#complete-workflow-example)

---

## Hardhat Integration

**Use Case**: Scan contracts automatically during compilation, before deployment

### Installation

```bash
# Install N3 Hardhat plugin
pnpm add -D @n3/hardhat-plugin

# Or using npm
npm install --save-dev @n3/hardhat-plugin
```

### Configuration

Add to your `hardhat.config.js`:

```javascript
import "@nomicfoundation/hardhat-ethers";
import "@n3/hardhat-plugin";
import "dotenv/config";

export default {
  solidity: "0.8.20",
  
  // N3 Template Scanner Configuration
  n3: {
    enabled: true,                    // Enable/disable scanner
    templatesDir: "node_modules/@n3/core/templates",  // Template directory
    
    // Which template categories to use
    categories: [
      "swc",              // Smart Contract Weakness patterns
      "defi",             // DeFi-specific vulnerabilities
      "smart-contract"    // General smart contract issues
    ],
    
    // Specific templates to include/exclude
    templates: {
      include: [
        "reentrancy-001",
        "access-001",
        "oracle-001"
      ],
      exclude: [
        "gas-optimization-001"  // Skip non-critical templates
      ]
    },
    
    // Scan behavior
    stopOnCritical: false,        // Don't halt build on critical issues
    stopOnHigh: false,            // Don't halt build on high severity
    failBuildOnIssues: false,     // Allow build with vulnerabilities
    
    // Output configuration
    reportFile: "./reports/n3-scan.json",   // JSON report location
    reportFormat: "json",                    // json, html, or markdown
    verbose: true,                           // Detailed console output
    
    // Integration with other tools
    blockscout: {
      enabled: false,             // Auto-push to Blockscout (when deployed)
      apiUrl: "https://eth.blockscout.com/api",
      verifyContracts: true,      // Verify contracts on Blockscout
      publishSecurityScore: true  // Publish template scan scores
    }
  },
  
  networks: {
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
```

### Usage

#### Automatic Scanning During Compilation

```bash
# Compile contracts - N3 scanner runs automatically
npx hardhat compile
```

**Output:**

```
Compiling 3 files with Solc 0.8.20
Compilation finished successfully

🛡️  N3 Template-Based Security Scanner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Loaded 42 templates
   ├─ SWC: 20 templates
   ├─ DeFi: 10 templates
   └─ Smart Contract: 12 templates

🔍 Scanning contracts...
   ├─ ✅ SecureBank.sol (0 issues)
   └─ ⚠️  VulnerableBank.sol (3 issues)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 VULNERABILITIES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contract: VulnerableBank.sol

🔴 CRITICAL | Reentrancy Vulnerability
   Template:  reentrancy-001
   Location:  Line 45, function withdraw()
   Pattern:   External call before state change
   Risk:      CVSS 9.8
   
   Code:
   44:   function withdraw(uint256 amount) public {
   45:     (bool success, ) = msg.sender.call{value: amount}("");
   46:     require(success);
   47:     balances[msg.sender] -= amount;  // ⚠️ State change after external call
   
   Fix: Move line 47 before line 45, or add ReentrancyGuard

🟠 HIGH | Missing Access Control
   Template:  access-001
   Location:  Line 23, function setFee()
   Pattern:   Public admin function without modifier
   Risk:      CVSS 7.5
   
   Fix: Add onlyOwner or similar access control modifier

🟡 MEDIUM | Unchecked External Call
   Template:  unchecked-call-001
   Location:  Line 60
   
   Fix: Check return value or use transfer/send

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SCAN SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contracts Scanned:  2
Templates Matched:  3/42
Risk Score:         35/100 (CRITICAL)

Severity Breakdown:
  🔴 Critical: 1
  🟠 High:     1
  🟡 Medium:   1
  🟢 Low:      0
  ℹ️  Info:    0

📄 Full report: ./reports/n3-scan.json

⚠️  Build completed with security issues
   Review the report before deploying!
```

#### Manual Scanning

```bash
# Scan without compiling
npx hardhat n3:scan

# Scan specific contract
npx hardhat n3:scan --contract contracts/MyContract.sol

# Scan with specific templates
npx hardhat n3:scan --template reentrancy-001

# Scan and generate HTML report
npx hardhat n3:scan --format html --output ./reports/scan.html
```

#### Continuous Monitoring

Monitor deployed contracts for new vulnerabilities:

```bash
# Monitor a deployed contract
npx hardhat n3:monitor \
  --network sepolia \
  --contract 0x1234567890abcdef... \
  --interval 3600  # Rescan every hour

# Monitor with Blockscout integration
npx hardhat n3:monitor \
  --network ethereum \
  --contract 0x1234... \
  --blockscout-push \
  --webhook https://your-webhook.com/alerts
```

**Monitor Output:**

```
🔍 N3 Contract Monitor

Contract:   0x1234567890abcdef...
Network:    sepolia
Interval:   1 hour
Blockscout: ✅ Connected

[14:32:15] Scan #1 started...
[14:32:18] ✅ Scan complete - Risk: 92/100 (LOW)
[14:32:18] Updated Blockscout widget
[14:32:18] Vulnerabilities: 0 Critical, 1 Low

[15:32:15] Scan #2 started...
[15:32:18] ✅ Scan complete - Risk: 92/100 (LOW)
[15:32:18] No changes detected

[16:32:15] Scan #3 started...
[16:32:19] ⚠️  NEW VULNERABILITY DETECTED!
[16:32:19] Risk score changed: 92 → 65/100
[16:32:19] 🔴 CRITICAL: Reentrancy detected in tx 0xabcd...
[16:32:19] Template matched: reentrancy-001
[16:32:19] Updated Blockscout: 🚨 CRITICAL badge shown
[16:32:19] ✅ Alert sent to webhook
```

### Advanced Usage

#### Custom Template Integration

Create project-specific templates:

```bash
# Create custom templates directory
mkdir -p templates/custom

# Add your template
cat > templates/custom/my-pattern.yaml << 'EOF'
id: custom-001
name: Project Specific Pattern
severity: HIGH
category: custom

patterns:
  - pattern: "myDangerousFunction"
    context: "public"
    message: "Dangerous function exposed"

remediation: |
  Change function visibility to internal
EOF
```

Update `hardhat.config.js`:

```javascript
n3: {
  templatesDir: [
    "node_modules/@n3/core/templates",  // Built-in templates
    "./templates/custom"                 // Your templates
  ]
}
```

#### CI/CD Integration

`.github/workflows/security-scan.yml`:

```yaml
name: N3 Security Scan

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js 22
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run N3 Template Scanner
        run: npx hardhat compile
        continue-on-error: true
      
      - name: Upload scan results
        uses: actions/upload-artifact@v3
        with:
          name: n3-scan-report
          path: ./reports/n3-scan.json
      
      - name: Fail on Critical
        run: |
          CRITICAL=$(jq '.summary.critical' reports/n3-scan.json)
          if [ "$CRITICAL" -gt 0 ]; then
            echo "❌ Critical vulnerabilities detected!"
            exit 1
          fi
```

---

## Blockscout Integration

**Use Case**: Visualize template scan results on a block explorer

### MCP Server Setup

N3 provides an MCP (Model Context Protocol) server that exposes template scan results to AI tools and Blockscout:

```bash
# Start MCP server
node mcp-blockscout-server.mjs

# Server runs on http://localhost:3000
```

### Widget Integration

Embed N3 security widget on Blockscout contract pages:

```html
<!-- Add to contract page -->
<div id="n3-security-widget"></div>

<script src="https://unpkg.com/@n3/blockscout-widget"></script>
<script>
  N3BlockscoutWidget.render({
    containerId: 'n3-security-widget',
    contractAddress: '0x1234567890abcdef...',
    network: 'ethereum',
    apiEndpoint: 'http://localhost:3000',  // Your MCP server
    
    // Display options
    theme: 'light',              // light or dark
    showRemediation: true,       // Show fix suggestions
    showTemplateInfo: true,      // Show which templates matched
    expandByDefault: false,      // Collapse details initially
    
    // Refresh settings
    autoRefresh: true,
    refreshInterval: 60000       // Refresh every minute
  });
</script>
```

**Widget Display:**

```
╔═══════════════════════════════════════════════════════════════╗
║ 🛡️ N3 Security Analysis                  [🔴 CRITICAL RISK]   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║   Risk Score: 35/100                                          ║
║                                                               ║
║   📊 Vulnerability Summary:                                   ║
║   ├─ 🔴 Critical: 2                                           ║
║   ├─ 🟠 High: 3                                               ║
║   ├─ 🟡 Medium: 1                                             ║
║   ├─ 🟢 Low: 0                                                ║
║   └─ ℹ️  Info: 0                                              ║
║                                                               ║
║   🔍 Detected Issues:                                         ║
║                                                               ║
║   🔴 Reentrancy Vulnerability (reentrancy-001)                ║
║      ├─ Function withdraw() vulnerable to reentrancy attack  ║
║      ├─ Template: SWC/reentrancy-001.yaml                    ║
║      └─ Fix: Add nonReentrant modifier                       ║
║                                                               ║
║   🔴 Flash Loan Attack Vector (defi-001)                      ║
║      ├─ No flash loan fee mechanism detected                 ║
║      ├─ Template: defi/flash-loan-001.yaml                   ║
║      └─ Fix: Implement 0.09% fee                             ║
║                                                               ║
║   🟠 Missing Access Controls (access-001)                     ║
║      ├─ Critical functions lack onlyOwner modifier           ║
║      ├─ Template: smart-contract/access-001.yaml             ║
║      └─ Fix: Implement role-based access control             ║
║                                                               ║
║   [View Full Report] [Request Audit] [Scan History]          ║
╚═══════════════════════════════════════════════════════════════╝
```

### MCP API Endpoints

The MCP server exposes template scan results via REST API:

#### Analyze Contract

```bash
# POST /api/analyze
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234567890abcdef...",
    "network": "ethereum",
    "code": "pragma solidity ^0.8.0; contract Test { ... }"
  }'
```

**Response:**

```json
{
  "contractAddress": "0x1234567890abcdef...",
  "network": "ethereum",
  "riskScore": 35,
  "riskLevel": "CRITICAL",
  "templatesScanned": 42,
  "templatesMatched": 3,
  "vulnerabilities": [
    {
      "id": "reentrancy-001",
      "name": "Reentrancy Vulnerability",
      "severity": "CRITICAL",
      "template": "SWC/reentrancy-001.yaml",
      "location": {
        "file": "Contract.sol",
        "line": 45,
        "function": "withdraw"
      },
      "pattern": "External call before state change",
      "cvss": 9.8,
      "remediation": "Add nonReentrant modifier or use checks-effects-interactions pattern",
      "references": [
        "https://swcregistry.io/docs/SWC-107"
      ]
    }
  ],
  "summary": {
    "critical": 2,
    "high": 3,
    "medium": 1,
    "low": 0,
    "info": 0
  },
  "scannedAt": "2025-10-24T18:30:00Z"
}
```

#### Get Security Report

```bash
# GET /api/report/:address
curl http://localhost:3000/api/report/0x1234567890abcdef...?network=ethereum
```

#### Get AI-Ready Prompts

```bash
# GET /api/prompt
curl http://localhost:3000/api/prompt?address=0x1234...&network=ethereum
```

**Response:**

```json
{
  "prompt": "You are analyzing a smart contract for security vulnerabilities using N3's template-based scanner...",
  "context": {
    "contractAddress": "0x1234...",
    "vulnerabilities": [...],
    "templates": [...]
  }
}
```

### Autoscout Deployment

Deploy custom Blockscout explorer with N3 widget pre-installed:

1. **Visit**: https://deploy.blockscout.com
2. **Request hackathon credits** via Discord #hackathon channel
3. **Deploy** for your network (localhost, testnet, or mainnet)
4. **Configure** N3 widget in explorer settings
5. **Integrate** MCP server endpoint

---

## Envio Integration

**Use Case**: Index security scan events in real-time for analytics and monitoring

### Configuration

`packages/envio-indexer/config.yaml`:

```yaml
name: n3-security-indexer
description: Real-time indexing of N3 template scan events

# Blockchain networks to index
networks:
  - id: 31337
    name: localhost
    rpc_config:
      url: http://localhost:8545
    start_block: 0
    
  - id: 11155111
    name: sepolia
    rpc_config:
      url: ${SEPOLIA_RPC_URL}
    start_block: 5000000

# N3SecurityOracle contract
contracts:
  - name: N3SecurityOracle
    address: 
      - address: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        network: localhost
    abi_file_path: ../contracts/N3SecurityOracle.json
    
    # Events to index (from template scans)
    events:
      - name: VulnerabilityDetected
        requiredEntities:
          - name: VulnerabilityEvent
      - name: SecurityScanCompleted
        requiredEntities:
          - name: SecurityScan
      - name: ContractDeployed
        requiredEntities:
          - name: SecurityScan

# PostgreSQL database
database:
  postgres:
    host: localhost
    port: 5433
    user: postgres
    password: ${DB_PASSWORD}
    database: envio_indexer
```

### Schema Definition

`packages/envio-indexer/schema.graphql`:

```graphql
# Vulnerability event from template match
type VulnerabilityEvent @entity {
  id: ID!
  contractAddress: String!
  vulnerabilityType: String!     # Template ID (e.g., "reentrancy-001")
  templateCategory: String!       # "swc", "defi", "smart-contract"
  severity: Int!                  # 1=Info, 2=Low, 3=Medium, 4=High, 5=Critical
  riskScore: Int!                 # 0-100
  timestamp: BigInt!
  blockNumber: BigInt!
  transactionHash: String!
  deployer: String!
}

# Complete security scan result
type SecurityScan @entity {
  id: ID!
  contractAddress: String!
  deployer: String!
  totalVulnerabilities: Int!
  criticalCount: Int!
  highCount: Int!
  mediumCount: Int!
  lowCount: Int!
  riskScore: Int!
  templatesScanned: Int!
  templatesMatched: Int!
  timestamp: BigInt!
  blockNumber: BigInt!
}

# Aggregated metrics
type SecurityMetric @entity {
  id: ID!
  totalScans: Int!
  totalVulnerabilities: Int!
  avgRiskScore: Int!
  criticalContracts: Int!
  lastUpdated: BigInt!
}
```

### Event Handlers

`packages/envio-indexer/src/handlers/security-events.ts`:

```typescript
import { VulnerabilityDetected, SecurityScanCompleted, ContractDeployed } from "generated";

// Handle individual vulnerability detection
VulnerabilityDetected.handler(async ({ event, context }) => {
  const { contractAddress, vulnerabilityType, severity, deployer } = event.params;
  
  // Create vulnerability event entity
  await context.VulnerabilityEvent.set({
    id: `${event.transactionHash}-${event.logIndex}`,
    contractAddress: contractAddress.toLowerCase(),
    vulnerabilityType,
    templateCategory: getTemplateCategory(vulnerabilityType),
    severity: Number(severity),
    riskScore: calculateRiskScore(severity),
    timestamp: BigInt(event.block.timestamp),
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transactionHash,
    deployer: deployer.toLowerCase()
  });
  
  // Update aggregated metrics
  await updateMetrics(context);
});

// Handle complete security scan
SecurityScanCompleted.handler(async ({ event, context }) => {
  const { contractAddress, deployer, vulnerabilityCount, riskScore } = event.params;
  
  await context.SecurityScan.set({
    id: `${contractAddress.toLowerCase()}-${event.block.timestamp}`,
    contractAddress: contractAddress.toLowerCase(),
    deployer: deployer.toLowerCase(),
    totalVulnerabilities: Number(vulnerabilityCount),
    riskScore: Number(riskScore),
    templatesScanned: 42,  // From template library
    templatesMatched: Number(vulnerabilityCount),
    timestamp: BigInt(event.block.timestamp),
    blockNumber: BigInt(event.block.number)
  });
});

// Helper functions
function getTemplateCategory(templateId: string): string {
  if (templateId.startsWith('swc-')) return 'swc';
  if (templateId.startsWith('defi-')) return 'defi';
  return 'smart-contract';
}

function calculateRiskScore(severity: bigint): number {
  const scores = { 1: 10, 2: 25, 3: 50, 4: 75, 5: 95 };
  return scores[Number(severity)] || 50;
}

async function updateMetrics(context: any) {
  const metrics = await context.SecurityMetric.get("global") || {
    id: "global",
    totalScans: 0,
    totalVulnerabilities: 0,
    avgRiskScore: 0,
    criticalContracts: 0
  };
  
  metrics.totalScans++;
  metrics.lastUpdated = BigInt(Date.now());
  
  await context.SecurityMetric.set(metrics);
}
```

### Running the Indexer

```bash
cd packages/envio-indexer

# Generate code from schema
envio codegen

# Start local development indexer
envio dev

# Deploy to Envio hosted service
envio deploy
```

**Indexer Output:**

```
Envio HyperIndex - N3 Security Indexer

Network:     localhost (31337)
Contract:    N3SecurityOracle (0x5FbD...)
Database:    PostgreSQL (localhost:5433)
GraphQL:     http://localhost:8080

[2025-10-24 18:30:15] ✅ Indexer started
[2025-10-24 18:30:15] 📊 Processing block 1...
[2025-10-24 18:30:16] 🔍 VulnerabilityDetected event
                          Contract: 0x1234...
                          Template: reentrancy-001
                          Severity: CRITICAL
[2025-10-24 18:30:16] ✅ Indexed 1 event
[2025-10-24 18:30:20] 📊 Processing block 2...
[2025-10-24 18:30:21] 🎯 SecurityScanCompleted event
                          Contract: 0x1234...
                          Risk Score: 35/100
                          Vulnerabilities: 3
[2025-10-24 18:30:21] ✅ Indexed 1 event

📈 Statistics:
   Blocks processed: 2
   Events indexed:   2
   Entities created: 2
```

### GraphQL Queries

Query indexed template scan data:

```bash
# Open Hasura console
open http://localhost:8080
```

#### Get Recent Vulnerabilities

```graphql
query RecentVulnerabilities {
  vulnerabilityEvents(
    orderBy: { timestamp: desc }
    limit: 10
  ) {
    id
    contractAddress
    vulnerabilityType
    templateCategory
    severity
    riskScore
    timestamp
    deployer
  }
}
```

#### Get Contract Security History

```graphql
query ContractSecurityHistory($address: String!) {
  securityScans(
    where: { contractAddress: { _eq: $address } }
    orderBy: { timestamp: desc }
  ) {
    id
    riskScore
    totalVulnerabilities
    criticalCount
    highCount
    mediumCount
    timestamp
    blockNumber
  }
}
```

#### Get High-Risk Contracts

```graphql
query HighRiskContracts {
  securityScans(
    where: {
      _or: [
        { criticalCount: { _gt: 0 } }
        { riskScore: { _lt: 50 } }
      ]
    }
    orderBy: { riskScore: asc }
  ) {
    contractAddress
    riskScore
    criticalCount
    highCount
    totalVulnerabilities
    timestamp
  }
}
```

#### Get Template Usage Statistics

```graphql
query TemplateStatistics {
  vulnerabilityEvents(
    groupBy: [vulnerabilityType, templateCategory]
  ) {
    vulnerabilityType
    templateCategory
    count
  }
}
```

#### Real-Time Subscriptions

```graphql
subscription NewVulnerabilities {
  vulnerabilityEvents(
    orderBy: { timestamp: desc }
    limit: 1
    where: { severity: { _gte: 4 } }  # Critical and High only
  ) {
    id
    contractAddress
    vulnerabilityType
    severity
    timestamp
  }
}
```

### AI-Enhanced Dashboard

Build a dashboard using indexed data:

```javascript
// React component example
import { useQuery, useSubscription } from '@apollo/client';

function SecurityDashboard() {
  // Real-time vulnerability feed
  const { data: newVulns } = useSubscription(NEW_VULNERABILITIES);
  
  // Contract statistics
  const { data: stats } = useQuery(TEMPLATE_STATISTICS);
  
  return (
    <div>
      <h1>N3 Security Dashboard</h1>
      
      {/* Real-time alerts */}
      <AlertFeed vulnerabilities={newVulns} />
      
      {/* Template match statistics */}
      <TemplateChart data={stats} />
      
      {/* Risk score trends */}
      <RiskTrends />
      
      {/* Contract rankings */}
      <ContractRankings />
    </div>
  );
}
```

---

## Complete Workflow Example

**Scenario**: Develop, scan, deploy, and monitor a smart contract using all three integrations

### Step 1: Development with Hardhat

```bash
# Write your contract
cat > contracts/MyToken.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyToken {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount);
        
        // Vulnerability: External call before state change
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        
        balances[msg.sender] -= amount;  // ⚠️ Reentrancy risk!
    }
}
EOF

# Compile and scan
npx hardhat compile
```

**Output:**

```
🛡️  N3 Template Scanner

🔴 CRITICAL | Reentrancy Vulnerability
   Template: reentrancy-001
   Location: Line 10
   Fix: Move state change before external call
```

### Step 2: Fix and Redeploy

```solidity
// Fixed version
function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount);
    
    balances[msg.sender] -= amount;  // ✅ State change first
    
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}
```

```bash
# Recompile
npx hardhat compile
# ✅ No vulnerabilities detected!

# Deploy
npx hardhat run scripts/deploy.js --network sepolia
```

### Step 3: Blockscout Integration

```bash
# Start MCP server
node mcp-blockscout-server.mjs &

# Contract automatically appears on Blockscout with N3 widget
# Visit: https://sepolia.blockscout.com/address/0xYourContract
```

Widget shows:
- ✅ Risk Score: 95/100 (LOW RISK)
- ✅ No critical vulnerabilities
- ✅ Template scan results
- ✅ Deployment history

### Step 4: Envio Real-Time Monitoring

```bash
# Start indexer
cd packages/envio-indexer
envio dev &

# Query security events
curl -X POST http://localhost:8080/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ securityScans { contractAddress riskScore } }"
  }'
```

### Step 5: Continuous Monitoring

```bash
# Monitor contract for changes
npx hardhat n3:monitor \
  --network sepolia \
  --contract 0xYourContract \
  --blockscout-push \
  --interval 3600
```

Now you have:
- ✅ **Hardhat**: Build-time scanning
- ✅ **Blockscout**: Public security dashboard
- ✅ **Envio**: Real-time event indexing
- ✅ **Monitoring**: Continuous vulnerability detection

---

## Summary

| Integration | Purpose | Key Feature |
|-------------|---------|-------------|
| **Hardhat** | Development | Template scanning during compilation |
| **Blockscout** | Visualization | Public security dashboard widget |
| **Envio** | Indexing | Real-time vulnerability event tracking |

All three integrations use **N3's template-based scanner** as their core engine, delivering scan results through different channels to cover the entire smart contract lifecycle.

---

## Next Steps

1. **Customize Templates**: Create project-specific vulnerability patterns
2. **Set Up CI/CD**: Automate template scanning in GitHub Actions
3. **Deploy Autoscout**: Get custom Blockscout instance
4. **Build Dashboard**: Use Envio GraphQL for analytics
5. **Integrate Alerts**: Connect webhooks for real-time notifications

For more information:
- [Template Creation Guide](./docs/TEMPLATES.md)
- [API Documentation](./docs/API.md)
- [Hackathon Status](./HACKATHON_STATUS.md)
