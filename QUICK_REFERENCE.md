# N3 Quick Reference

**Template-Based Security Scanner for Web3**

---

## 🚀 Quick Start

```bash
# Install
git clone https://github.com/intelligent-ears/N3.git
cd N3
pnpm install

# Scan a contract
n3 scan Contract.sol

# Use with Hardhat
npx hardhat compile  # Auto-scans during compilation
```

---

## 📦 Core Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **Template Engine** | Core scanner | `packages/core/` |
| **Templates** | 40+ YAML patterns | `packages/core/templates/` |
| **CLI** | Command-line tool | `packages/cli/` |
| **Hardhat Plugin** | Build integration | `packages/hardhat-plugin/` |
| **MCP Server** | AI/Blockscout API | `mcp-blockscout-server.mjs` |
| **Envio Indexer** | Event indexing | `packages/envio-indexer/` |

---

## 🎯 Template Categories

```
📁 templates/
├── SWC/              # 20+ Smart Contract Weakness patterns
│   ├── reentrancy-001.yaml
│   ├── access-001.yaml
│   └── overflow-001.yaml
│
├── defi/             # 10+ DeFi vulnerabilities
│   ├── flash-loan-001.yaml
│   ├── oracle-001.yaml
│   └── price-manipulation-001.yaml
│
└── smart-contract/   # 10+ General patterns
    ├── initialization-001.yaml
    ├── upgrade-001.yaml
    └── gas-optimization-001.yaml
```

---

## 💻 CLI Usage

```bash
# Basic scan
n3 scan Contract.sol

# With category filter
n3 scan Contract.sol --category defi

# With specific template
n3 scan Contract.sol --template reentrancy-001

# JSON output
n3 scan Contract.sol --json > report.json

# Verbose mode
n3 scan Contract.sol --verbose
```

---

## 🔨 Hardhat Integration

**Config (`hardhat.config.js`):**

```javascript
import "@n3/hardhat-plugin";

export default {
  n3: {
    enabled: true,
    categories: ["swc", "defi", "smart-contract"],
    stopOnCritical: false,
    reportFile: "./n3-report.json"
  }
};
```

**Commands:**

```bash
npx hardhat compile        # Auto-scan
npx hardhat n3:scan       # Manual scan
npx hardhat n3:monitor    # Monitor deployed contract
```

---

## 🌐 Blockscout Integration

**MCP Server:**

```bash
# Start server
node mcp-blockscout-server.mjs

# Running on http://localhost:3000
```

**API Endpoints:**

```bash
# Analyze contract
POST /api/analyze
  Body: { "address": "0x...", "code": "..." }

# Get report
GET /api/report/:address?network=ethereum

# AI prompts
GET /api/prompt?address=0x...
```

**Widget:**

```html
<div id="n3-security-widget"></div>
<script src="https://unpkg.com/@n3/blockscout-widget"></script>
<script>
  N3BlockscoutWidget.render({
    containerId: 'n3-security-widget',
    contractAddress: '0x...',
    network: 'ethereum',
    apiEndpoint: 'http://localhost:3000'
  });
</script>
```

---

## ⚡ Envio Integration

**Start Indexer:**

```bash
cd packages/envio-indexer
envio codegen    # Generate code
envio dev        # Start indexer
```

**GraphQL Queries:**

```graphql
# Recent vulnerabilities
query {
  vulnerabilityEvents(
    orderBy: { timestamp: desc }
    limit: 10
  ) {
    contractAddress
    vulnerabilityType
    severity
    riskScore
  }
}

# Contract security history
query {
  securityScans(
    where: { contractAddress: { _eq: "0x..." } }
  ) {
    riskScore
    totalVulnerabilities
    timestamp
  }
}
```

**GraphQL Endpoint:** http://localhost:8080/v1/graphql

---

## 📊 Risk Scoring

| Risk Score | Level | Action |
|------------|-------|--------|
| 90-100 | ✅ LOW | Deploy with confidence |
| 70-89 | 🟡 MEDIUM | Review warnings |
| 50-69 | 🟠 HIGH | Fix issues before deploy |
| 0-49 | 🔴 CRITICAL | Do not deploy |

**Severity Levels:**
- 🔴 **Critical (5)**: Immediate exploit risk
- 🟠 **High (4)**: Significant vulnerability
- 🟡 **Medium (3)**: Potential issue
- 🟢 **Low (2)**: Minor concern
- ℹ️ **Info (1)**: Best practice suggestion

---

## 🔧 Template YAML Structure

```yaml
id: vulnerability-id-001
name: Human Readable Name
severity: CRITICAL  # CRITICAL, HIGH, MEDIUM, LOW, INFO
category: swc       # swc, defi, smart-contract

description: |
  Detailed description of the vulnerability

patterns:
  - pattern: "call.value"
    before: "balance[msg.sender] -= amount"
    message: "External call before state change"
  
  - pattern: "withdraw"
    missing: "nonReentrant"
    message: "Missing reentrancy guard"

remediation: |
  1. Move state changes before external calls
  2. Add ReentrancyGuard modifier
  3. Use checks-effects-interactions pattern

cvss: 9.8
references:
  - https://swcregistry.io/docs/SWC-107
```

---

## 🏗️ Project Structure

```
N3/
├── packages/
│   ├── core/                # Template engine ⭐
│   │   ├── templates/       # 40+ YAML templates
│   │   └── src/
│   │       ├── engine.ts    # Pattern matching
│   │       ├── parser.ts    # YAML parser
│   │       └── risk-calculator.ts
│   │
│   ├── cli/                 # Command-line tool
│   ├── hardhat-plugin/      # Hardhat integration
│   ├── mcp-server/          # AI/Blockscout server
│   ├── blockscout-widget/   # Visual widget
│   └── envio-indexer/       # Event indexing
│
├── contracts/
│   └── N3SecurityOracle.sol # On-chain storage
│
└── scripts/
    └── deploy-oracle.mjs    # Deployment
```

---

## 🎯 Common Workflows

### Development Workflow

```bash
1. Write contract → contracts/MyContract.sol
2. Compile → npx hardhat compile  (auto-scans)
3. Fix issues → Based on template matches
4. Re-compile → Verify fixes
5. Deploy → npx hardhat run scripts/deploy.js
```

### CI/CD Workflow

```yaml
# .github/workflows/security.yml
- run: npx hardhat compile
- run: |
    CRITICAL=$(jq '.summary.critical' n3-report.json)
    if [ "$CRITICAL" -gt 0 ]; then exit 1; fi
```

### Monitoring Workflow

```bash
1. Deploy contract → On mainnet/testnet
2. Start MCP → node mcp-blockscout-server.mjs
3. Start Envio → cd packages/envio-indexer && envio dev
4. Monitor → npx hardhat n3:monitor --contract 0x...
```

---

## 🐛 Troubleshooting

### Hardhat Issues

```bash
# Check Node.js version (need 22+)
node --version

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verify Hardhat version
npx hardhat --version  # Should be 3.0.9
```

### MCP Server Issues

```bash
# Check if port 3000 is free
lsof -i:3000

# Start with debug logging
DEBUG=* node mcp-blockscout-server.mjs
```

### Envio Issues

```bash
# Check PostgreSQL
psql -h localhost -p 5433 -U postgres

# Regenerate code
cd packages/envio-indexer
envio codegen --force

# Check Hasura
curl http://localhost:8080/healthz
```

---

## 📚 Documentation

- **[README](./README.md)** - Full project overview
- **[Integration Guide](./INTEGRATION_GUIDE.md)** - Detailed usage (1000+ lines)
- **[Hackathon Status](./HACKATHON_STATUS.md)** - Current progress
- **[Envio Flowchart](./ENVIO_FLOWCHART.md)** - Architecture diagram

---

## 🔗 Quick Links

| Link | Purpose |
|------|---------|
| [GitHub](https://github.com/intelligent-ears/N3) | Source code |
| [Nuclei](https://github.com/projectdiscovery/nuclei) | Inspiration |
| [SWC Registry](https://swcregistry.io/) | Vulnerability database |
| [Blockscout](https://www.blockscout.com/) | Block explorer |
| [Envio](https://envio.dev/) | Indexer platform |
| [Hardhat](https://hardhat.org/) | Dev environment |

---

## 🎯 Hackathon Tracks

| Track | Prize | Status |
|-------|-------|--------|
| **Blockscout** | $10,000 | MCP ✅, SDK 🚧, Autoscout 🚧 |
| **Envio** | $5,000 | Config ✅, Schema 🔴 |
| **Hardhat** | $5,000 | Plugin ✅, Node 22 ✅ |

---

## ⚡ One-Liner Commands

```bash
# Full scan with all templates
n3 scan contracts/**/*.sol --json | jq '.summary'

# Deploy and monitor
npx hardhat run scripts/deploy.js && \
npx hardhat n3:monitor --contract $(jq -r '.address' deployment.json)

# Start all services
node mcp-blockscout-server.mjs & \
cd packages/envio-indexer && envio dev &

# Check security score
curl localhost:3000/api/report/0x... | jq '.riskScore'
```

---

<p align="center">
  <strong>N3: Securing Web3, One Template at a Time</strong> 🛡️
</p>
