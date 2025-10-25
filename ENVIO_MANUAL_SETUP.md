# Manual Envio Integration Setup Guide

## 🎯 What You'll Build

An Envio indexer that listens to N3 security events on-chain and stores them in a queryable PostgreSQL database with a GraphQL API.

---

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **PostgreSQL** installed (or use Envio's hosted DB)
3. **An Ethereum RPC URL** (Alchemy, Infura, or local node)
4. **Envio CLI** installed globally

---

## Step 1: Install Envio CLI

```bash
npm install -g envio
```

Verify installation:
```bash
envio --version
```

---

## Step 2: Navigate to Envio Package

```bash
cd /home/kali/Documents/N3/packages/envio-indexer
```

You should see:
- `config.yaml` - Indexer configuration
- `schema.graphql` - Data model
- `src/handlers/` - Event processing logic

---

## Step 3: Review the Schema

The GraphQL schema (`schema.graphql`) defines what data we'll index:

```graphql
type SecurityScan @entity {
  id: ID!
  contractAddress: String!
  riskScore: Int!
  severity: SeverityLevel!
  scanTimestamp: BigInt!
  # ... more fields
}

type VulnerabilityEvent @entity {
  id: ID!
  contractAddress: String!
  vulnerabilityType: String!
  severity: SeverityLevel!
  detectedAt: BigInt!
  # ... more fields
}
```

This is **already created** for you. No changes needed.

---

## Step 4: Configure the Indexer

Edit `config.yaml` to add your RPC endpoint:

```yaml
name: n3-security-indexer
description: N3 Security Vulnerability Tracking Indexer

networks:
  - id: 1  # Ethereum mainnet
    start_block: 18000000  # Start indexing from this block
    rpc_config:
      url: https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY  # ← ADD YOUR RPC URL
    
    contracts:
      - name: N3SecurityOracle
        address: "0x0000000000000000000000000000000000000000"  # ← REPLACE with deployed oracle address
        handler: src/handlers/security-events.ts
        events:
          - event: VulnerabilityDetected(address indexed contractAddress, string vulnType, uint8 severity, uint256 timestamp)
          - event: SecurityScanCompleted(address indexed contractAddress, uint256 riskScore, uint256 timestamp)
          - event: ContractDeployed(address indexed contractAddress, address indexed deployer, uint256 timestamp)
```

**Key configurations:**
- `rpc_config.url`: Your Ethereum RPC endpoint
- `contracts[].address`: The deployed N3SecurityOracle contract address
- `start_block`: Block number to start indexing from

---

## Step 5: Generate TypeScript Types

Envio generates TypeScript types from your schema:

```bash
cd /home/kali/Documents/N3/packages/envio-indexer
envio codegen
```

This creates/updates:
- `src/generated.ts` - TypeScript types for entities
- Type-safe database operations

Expected output:
```
✅ Generated types from schema.graphql
✅ Created src/generated.ts
```

---

## Step 6: Review Event Handlers

Event handlers are in `src/handlers/security-events.ts`. Here's what they do:

### Handler 1: Vulnerability Detected

```typescript
N3SecurityOracle.VulnerabilityDetected.handler(async ({ event, context }) => {
  // Store vulnerability event in database
  await context.VulnerabilityEvent.create({
    id: `${event.transaction.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    vulnerabilityType: event.params.vulnType,
    severity: mapSeverity(event.params.severity),
    detectedAt: event.block.timestamp,
    blockNumber: event.block.number,
    txHash: event.transaction.hash,
    exploited: false,
    remediationStatus: "OPEN",
  });
  
  // Update aggregate metrics
  await updateSecurityMetrics(event.params.contractAddress, context);
});
```

### Handler 2: Scan Completed

```typescript
N3SecurityOracle.SecurityScanCompleted.handler(async ({ event, context }) => {
  // Store scan result
  await context.SecurityScan.create({
    id: `${event.transaction.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    riskScore: event.params.riskScore,
    status: event.params.riskScore >= 70 ? "PASS" : "FAIL",
    scanTimestamp: event.params.timestamp,
    // ...
  });
});
```

**These handlers are already implemented** - no coding required!

---

## Step 7: Set Up Database

### Option A: Use Envio's Hosted Database (Recommended)

Envio provides a managed PostgreSQL instance automatically when you deploy.

### Option B: Use Local PostgreSQL

If you want to run locally:

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb n3_indexer

# Set connection string
export DATABASE_URL="postgresql://postgres:password@localhost:5432/n3_indexer"
```

---

## Step 8: Start the Indexer (Development Mode)

```bash
cd /home/kali/Documents/N3/packages/envio-indexer

# Start indexer in dev mode
envio dev
```

**What happens:**
1. Connects to Ethereum RPC
2. Starts listening for events from `start_block`
3. Processes events through handlers
4. Stores data in PostgreSQL
5. Starts GraphQL API on `http://localhost:8080/graphql`

Expected output:
```
🚀 Starting Envio indexer...
📡 Connected to Ethereum (Chain ID: 1)
🔍 Listening for events from block 18000000
📊 GraphQL API: http://localhost:8080/graphql
⚡ Indexing events...
```

---

## Step 9: Verify It's Working

### Check GraphQL Playground

Open in browser:
```
http://localhost:8080/graphql
```

Try this query:
```graphql
query TestQuery {
  securityScans(first: 10) {
    id
    contractAddress
    riskScore
  }
}
```

### Watch Logs

The indexer will show logs as it processes events:
```
[INFO] Processing VulnerabilityDetected event
[INFO] Block 18500001 - 4 events processed
[INFO] Indexed 1 security scan
```

---

## Step 10: Deploy to Production

Once testing looks good, deploy to Envio's hosted infrastructure:

```bash
cd /home/kali/Documents/N3/packages/envio-indexer

# Deploy to production
envio deploy
```

You'll get a production GraphQL endpoint:
```
https://indexer.envio.dev/n3-security-indexer/v1/graphql
```

---

## 🔧 How to Emit Events (Contract Side)

For the indexer to work, your smart contract needs to emit these events:

### 1. Deploy N3SecurityOracle Contract

```solidity
// N3SecurityOracle.sol
pragma solidity ^0.8.0;

contract N3SecurityOracle {
    event VulnerabilityDetected(
        address indexed contractAddress,
        string vulnType,
        uint8 severity,
        uint256 timestamp
    );
    
    event SecurityScanCompleted(
        address indexed contractAddress,
        uint256 riskScore,
        uint256 timestamp
    );
    
    event ContractDeployed(
        address indexed contractAddress,
        address indexed deployer,
        uint256 timestamp
    );
    
    function reportVulnerability(
        address _contract,
        string memory _vulnType,
        uint8 _severity
    ) public {
        emit VulnerabilityDetected(_contract, _vulnType, _severity, block.timestamp);
    }
    
    function reportScan(
        address _contract,
        uint256 _riskScore
    ) public {
        emit SecurityScanCompleted(_contract, _riskScore, block.timestamp);
    }
}
```

### 2. Deploy the Contract

```bash
# Using Hardhat
npx hardhat run scripts/deploy-oracle.js --network mainnet
```

### 3. Update config.yaml

Replace the placeholder address in `config.yaml`:
```yaml
contracts:
  - name: N3SecurityOracle
    address: "0xYOUR_DEPLOYED_ORACLE_ADDRESS_HERE"
```

### 4. Emit Events from N3

Integrate with N3 scanner to emit events:

```javascript
// In your Hardhat plugin or deployment script
const oracle = await ethers.getContractAt(
  "N3SecurityOracle",
  "0xYOUR_ORACLE_ADDRESS"
);

// After scanning
const report = await n3Scanner.scan(contractCode);

// Report each vulnerability
for (const vuln of report.results.filter(r => r.vulnerable)) {
  await oracle.reportVulnerability(
    contractAddress,
    vuln.template.id,
    getSeverityNumber(vuln.template.severity)
  );
}

// Report scan completion
await oracle.reportScan(contractAddress, report.overallRiskScore);
```

---

## 📊 Query the Indexed Data

Once events are being indexed, query them via GraphQL:

### Get Contract Security Metrics

```graphql
query GetSecurity($address: String!) {
  securityMetric(id: $address) {
    totalScans
    criticalIssues
    highIssues
    averageRiskScore
  }
}
```

### Get Vulnerability History

```graphql
query GetVulnerabilities($address: String!) {
  vulnerabilityEvents(
    where: { contractAddress: $address }
    orderBy: detectedAt
    orderDirection: desc
  ) {
    vulnerabilityType
    severity
    detectedAt
    remediationStatus
  }
}
```

### Real-time Subscriptions

```graphql
subscription OnNewVulnerability {
  vulnerabilityEvent {
    contractAddress
    vulnerabilityType
    severity
    detectedAt
  }
}
```

---

## 🎨 Frontend Integration

### Using Apollo Client (React)

```bash
npm install @apollo/client graphql
```

```typescript
import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

const GET_SECURITY = gql`
  query GetSecurity($address: String!) {
    securityMetric(id: $address) {
      criticalIssues
      averageRiskScore
    }
  }
`;

function SecurityWidget({ contractAddress }) {
  const { data, loading } = useQuery(GET_SECURITY, {
    variables: { address: contractAddress }
  });
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      Risk Score: {data.securityMetric.averageRiskScore}/100
      Critical Issues: {data.securityMetric.criticalIssues}
    </div>
  );
}
```

### Using Fetch API

```javascript
async function getContractSecurity(contractAddress) {
  const response = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetSecurity($address: String!) {
          securityMetric(id: $address) {
            criticalIssues
            averageRiskScore
          }
        }
      `,
      variables: { address: contractAddress }
    })
  });
  
  const { data } = await response.json();
  return data.securityMetric;
}

// Usage
const security = await getContractSecurity('0x1234...');
console.log(`Risk: ${security.averageRiskScore}/100`);
```

---

## 🔍 Monitoring & Debugging

### View Indexer Status

```bash
envio status
```

Shows:
- Current block being indexed
- Number of events processed
- Database connection status
- GraphQL API health

### View Logs

```bash
envio logs --follow
```

### Reset and Re-index

If you need to start over:

```bash
envio reset
envio dev
```

---

## 🚀 Production Checklist

Before going live:

- [ ] Deploy N3SecurityOracle contract to mainnet
- [ ] Update `config.yaml` with production contract address
- [ ] Configure production RPC endpoint (with backup)
- [ ] Set appropriate `start_block` (when contract was deployed)
- [ ] Test queries in GraphQL playground
- [ ] Set up monitoring/alerts
- [ ] Deploy indexer: `envio deploy`
- [ ] Update frontend to use production endpoint
- [ ] Monitor initial sync progress

---

## 📁 Directory Structure

```
packages/envio-indexer/
├── config.yaml                      # Indexer configuration
├── schema.graphql                   # Data model (entities)
├── src/
│   ├── generated.ts                 # Auto-generated types
│   └── handlers/
│       └── security-events.ts       # Event processing logic
├── package.json
└── README.md
```

---

## 🐛 Troubleshooting

### Issue: "RPC URL not responding"

**Fix:** Check your RPC endpoint in `config.yaml`. Try a different provider.

### Issue: "No events being indexed"

**Check:**
1. Is the contract address correct in `config.yaml`?
2. Have any events been emitted on-chain?
3. Is `start_block` set correctly?
4. Check logs: `envio logs`

### Issue: "GraphQL query returns empty"

**Possible causes:**
1. No events have been indexed yet
2. Wrong contract address in query
3. Database not populated

**Debug:**
```graphql
query Debug {
  _meta {
    block {
      number
    }
  }
}
```

---

## 📚 Next Steps

1. **Integrate with N3 CLI** - Emit events after scans
2. **Build Dashboard** - Create analytics UI with queried data
3. **Set up Alerts** - Use subscriptions for real-time notifications
4. **Multi-chain** - Add Polygon, Arbitrum, etc. to `config.yaml`
5. **Custom Queries** - Add computed fields and custom resolvers

---

## 🔗 Resources

- **Envio Docs**: https://docs.envio.dev
- **GraphQL Docs**: https://graphql.org/learn/
- **N3 Schema**: `/packages/envio-indexer/schema.graphql`
- **Handler Code**: `/packages/envio-indexer/src/handlers/security-events.ts`
- **Query Examples**: `/ENVIO_QUERIES.md`

---

## ⚡ Quick Start Commands

```bash
# Install Envio
npm install -g envio

# Navigate to indexer
cd packages/envio-indexer

# Generate types
envio codegen

# Start dev server
envio dev

# Deploy to production
envio deploy

# View logs
envio logs --follow

# Check status
envio status
```

---

**That's it!** You now have a fully functional blockchain indexer for N3 security data. 🎉
