# N3 × Envio Integration Guide

This guide demonstrates how to use N3 with Envio indexer for real-time smart contract security monitoring.

## 🎯 Overview

The N3-Envio integration provides:
- **Real-time vulnerability tracking** across multiple chains
- **Historical security metrics** and trend analysis  
- **Event-driven security alerts** for deployed contracts
- **GraphQL API** for querying security data
- **Automated scanning** on contract deployments

## 📦 Installation

```bash
# Install Envio CLI
npm install -g envio

# Navigate to the Envio indexer
cd packages/envio-indexer

# Install dependencies
pnpm install

# Generate types
pnpm run codegen
```

## 🔧 Configuration

### 1. Configure `config.yaml`

```yaml
name: n3-security-indexer
description: Real-time security monitoring for smart contracts
networks:
  - id: 1
    rpc_config:
      url: https://eth.llamarpc.com
    start_block: 18000000
  - id: 137
    rpc_config:
      url: https://polygon-rpc.com
    start_block: 48000000

contracts:
  - name: N3SecurityOracle
    abi_file_path: ./abis/N3SecurityOracle.json
    address:
      - "0x1234567890123456789012345678901234567890"  # Ethereum
      - "0x0987654321098765432109876543210987654321"  # Polygon
    handler: ./src/handlers/security-events.ts
    events:
      - event: VulnerabilityDetected(address indexed contractAddress, string vulnType, uint8 severity)
      - event: SecurityScanCompleted(address indexed contractAddress, uint256 riskScore, uint256 timestamp)
      - event: ContractDeployed(address indexed contractAddress, address deployer, uint256 timestamp)
```

### 2. Schema Definition (`schema.graphql`)

```graphql
type VulnerabilityEvent @entity {
  id: ID!
  contractAddress: String!
  vulnerabilityType: String!
  severity: String!
  detectedAt: BigInt!
  blockNumber: BigInt!
  txHash: String!
  exploited: Boolean!
  remediationStatus: String!
}

type SecurityScan @entity {
  id: ID!
  contractAddress: String!
  chainId: Int!
  scanTimestamp: BigInt!
  templateId: String!
  severity: String!
  status: String!
  riskScore: Int!
  details: String!
  txHash: String!
}

type SecurityMetric @entity {
  id: ID!
  contractAddress: String!
  totalScans: Int!
  criticalIssues: Int!
  highIssues: Int!
  mediumIssues: Int!
  lowIssues: Int!
  averageRiskScore: Float!
  lastScanTimestamp: BigInt!
  firstScanTimestamp: BigInt!
}

type ContractDeployment @entity {
  id: ID!
  contractAddress: String!
  deployer: String!
  deployedAt: BigInt!
  blockNumber: BigInt!
  txHash: String!
}
```

## 🚀 Running the Indexer

```bash
# Start the indexer
pnpm run dev

# Or in production
pnpm run start
```

The GraphQL API will be available at `http://localhost:8080/graphql`

## 📊 GraphQL Queries

### Query 1: Get Contract Security Overview

```graphql
query GetContractSecurity($address: String!) {
  securityMetric(id: $address) {
    contractAddress
    totalScans
    criticalIssues
    highIssues
    mediumIssues
    lowIssues
    averageRiskScore
    lastScanTimestamp
  }
  
  vulnerabilityEvents(
    where: { contractAddress: $address }
    orderBy: detectedAt
    orderDirection: desc
    first: 10
  ) {
    id
    vulnerabilityType
    severity
    detectedAt
    exploited
    remediationStatus
  }
}
```

**Example Response:**
```json
{
  "data": {
    "securityMetric": {
      "contractAddress": "0x1234...7890",
      "totalScans": 24,
      "criticalIssues": 2,
      "highIssues": 5,
      "mediumIssues": 8,
      "lowIssues": 3,
      "averageRiskScore": 67.5,
      "lastScanTimestamp": "1729798800"
    },
    "vulnerabilityEvents": [
      {
        "id": "0xabc...123",
        "vulnerabilityType": "reentrancy",
        "severity": "CRITICAL",
        "detectedAt": "1729798800",
        "exploited": false,
        "remediationStatus": "OPEN"
      }
    ]
  }
}
```

### Query 2: Historical Security Scans

```graphql
query GetSecurityHistory($address: String!, $limit: Int!) {
  securityScans(
    where: { contractAddress: $address }
    orderBy: scanTimestamp
    orderDirection: desc
    first: $limit
  ) {
    id
    scanTimestamp
    riskScore
    severity
    status
    details
    txHash
  }
}
```

### Query 3: Real-time Vulnerability Monitoring

```graphql
subscription OnVulnerabilityDetected($address: String!) {
  vulnerabilityEvent(
    where: { contractAddress: $address }
  ) {
    id
    contractAddress
    vulnerabilityType
    severity
    detectedAt
    txHash
  }
}
```

### Query 4: Multi-Contract Dashboard

```graphql
query SecurityDashboard {
  securityMetrics(
    orderBy: criticalIssues
    orderDirection: desc
    first: 20
  ) {
    contractAddress
    criticalIssues
    highIssues
    averageRiskScore
    totalScans
    lastScanTimestamp
  }
}
```

## 🔔 Event Handlers

The indexer automatically processes these events:

### 1. VulnerabilityDetected
Triggered when N3 finds a vulnerability:
```typescript
// packages/envio-indexer/src/handlers/security-events.ts
N3SecurityOracle.VulnerabilityDetected.handler(async ({ event, context }) => {
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
});
```

### 2. SecurityScanCompleted
Tracks completed security scans:
```typescript
N3SecurityOracle.SecurityScanCompleted.handler(async ({ event, context }) => {
  await context.SecurityScan.create({
    id: `${event.transaction.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    scanTimestamp: event.params.timestamp,
    riskScore: event.params.riskScore,
    status: event.params.riskScore >= 70 ? "PASS" : "FAIL",
    details: JSON.stringify({ score: event.params.riskScore }),
  });
});
```

### 3. ContractDeployed
Monitors new contract deployments for automatic scanning:
```typescript
N3SecurityOracle.ContractDeployed.handler(async ({ event, context }) => {
  await context.ContractDeployment.create({
    id: event.params.contractAddress,
    contractAddress: event.params.contractAddress,
    deployer: event.params.deployer,
    deployedAt: event.params.timestamp,
    blockNumber: event.block.number,
  });
  
  // Initialize security metrics for new contract
  await context.SecurityMetric.create({
    id: event.params.contractAddress,
    contractAddress: event.params.contractAddress,
    totalScans: 0,
    criticalIssues: 0,
    // ... other fields
  });
});
```

## 📈 Use Cases

### 1. Continuous Security Monitoring

```javascript
// Monitor a DeFi protocol in real-time
const monitor = async () => {
  const response = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        subscription {
          vulnerabilityEvent(where: { severity: "CRITICAL" }) {
            contractAddress
            vulnerabilityType
            detectedAt
          }
        }
      `
    })
  });
  
  const data = await response.json();
  if (data.data.vulnerabilityEvent) {
    sendAlert(data.data.vulnerabilityEvent);
  }
};
```

### 2. Security Dashboard Integration

```javascript
// Fetch data for dashboard
const getDashboardData = async () => {
  const response = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          securityMetrics(first: 100) {
            contractAddress
            criticalIssues
            highIssues
            averageRiskScore
            totalScans
          }
        }
      `
    })
  });
  
  return await response.json();
};
```

### 3. Automated Incident Response

```javascript
// Auto-pause contract on critical vulnerability
const handleCriticalVulnerability = async (event) => {
  if (event.severity === 'CRITICAL' && !event.exploited) {
    // Pause the contract
    await pauseContract(event.contractAddress);
    
    // Notify team
    await sendNotification({
      type: 'CRITICAL_VULNERABILITY',
      contract: event.contractAddress,
      vulnerability: event.vulnerabilityType,
      timestamp: event.detectedAt
    });
  }
};
```

## 🔗 Integration with N3 CLI

Trigger scans that emit events indexed by Envio:

```bash
# Scan and emit events to blockchain
n3 examples/vulnerable-contracts/VulnerableBank.sol \
  --emit-events \
  --network ethereum \
  --oracle-address 0x1234567890123456789012345678901234567890
```

## 📱 Frontend Integration Example

```javascript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache()
});

// Component to display contract security
const ContractSecurity = ({ address }) => {
  const { loading, error, data } = useQuery(gql`
    query GetContractSecurity($address: String!) {
      securityMetric(id: $address) {
        criticalIssues
        highIssues
        averageRiskScore
      }
    }
  `, { variables: { address } });

  if (loading) return <div>Loading security data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { criticalIssues, highIssues, averageRiskScore } = data.securityMetric;

  return (
    <div className="security-card">
      <h3>Security Score: {averageRiskScore}/100</h3>
      <div className="issues">
        <span className="critical">🔴 {criticalIssues} Critical</span>
        <span className="high">🟠 {highIssues} High</span>
      </div>
    </div>
  );
};
```

## 🎯 Benefits

✅ **Real-time Monitoring** - Track vulnerabilities as they're detected  
✅ **Historical Analysis** - View security trends over time  
✅ **Multi-chain Support** - Monitor contracts across Ethereum, Polygon, etc.  
✅ **GraphQL API** - Flexible querying for any use case  
✅ **Event-driven** - React to security events instantly  
✅ **Scalable** - Handles high-volume blockchain data efficiently  

## 📚 Additional Resources

- [Envio Documentation](https://docs.envio.dev)
- [N3 Core API](../packages/core/README.md)
- [GraphQL Schema Reference](../packages/envio-indexer/schema.graphql)
- [Event Handler Examples](../packages/envio-indexer/src/handlers/)

## 🆘 Support

For issues or questions:
- GitHub Issues: https://github.com/intelligent-ears/N3/issues
- Discord: https://discord.gg/n3scanner
- Email: support@n3scanner.io
