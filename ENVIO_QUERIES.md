# N3 + Envio Integration - GraphQL Query Examples

## 🎯 What is Envio?

Envio is a **blockchain indexer** that listens to smart contract events and stores them in a queryable PostgreSQL database with a GraphQL API.

For N3, this means:
- ✅ **Historical security data** - Track vulnerabilities over time
- ✅ **Fast queries** - Get security info in milliseconds 
- ✅ **Analytics** - Build dashboards, trend analysis
- ✅ **Multi-chain** - Works across Ethereum, Polygon, Arbitrum, etc.

---

## 📊 GraphQL Query Examples

### 1. Get Contract Security Overview

```graphql
query GetContractSecurity($contractAddress: String!) {
  securityMetric(id: $contractAddress) {
    contractAddress
    totalScans
    criticalIssues
    highIssues
    mediumIssues
    lowIssues
    averageRiskScore
    lastScanTimestamp
    firstScanTimestamp
  }
}
```

**Variables:**
```json
{
  "contractAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response:**
```json
{
  "data": {
    "securityMetric": {
      "contractAddress": "0x1234...",
      "totalScans": 5,
      "criticalIssues": 2,
      "highIssues": 2,
      "mediumIssues": 0,
      "lowIssues": 0,
      "averageRiskScore": 87,
      "lastScanTimestamp": "1729785600",
      "firstScanTimestamp": "1729785000"
    }
  }
}
```

---

### 2. Get All Vulnerabilities for a Contract

```graphql
query GetVulnerabilities($contractAddress: String!) {
  vulnerabilityEvents(
    where: { contractAddress: $contractAddress }
    orderBy: detectedAt
    orderDirection: desc
  ) {
    id
    vulnerabilityType
    severity
    detectedAt
    blockNumber
    txHash
    exploited
    remediationStatus
  }
}
```

**Response:**
```json
{
  "data": {
    "vulnerabilityEvents": [
      {
        "id": "0xabc...123",
        "vulnerabilityType": "oracle-001",
        "severity": "CRITICAL",
        "detectedAt": "1729785500",
        "blockNumber": "18500003",
        "txHash": "0xdef...",
        "exploited": false,
        "remediationStatus": "OPEN"
      },
      {
        "id": "0xdef...456",
        "vulnerabilityType": "defi-001",
        "severity": "CRITICAL",
        "detectedAt": "1729785400",
        "blockNumber": "18500004",
        "txHash": "0xghi...",
        "exploited": false,
        "remediationStatus": "OPEN"
      }
    ]
  }
}
```

---

### 3. Get Scan History

```graphql
query GetScanHistory($contractAddress: String!) {
  securityScans(
    where: { contractAddress: $contractAddress }
    orderBy: scanTimestamp
    orderDirection: desc
    first: 10
  ) {
    id
    riskScore
    status
    severity
    scanTimestamp
    txHash
  }
}
```

**Use Case:** Track how security score changed over time

---

### 4. Find All Critical Vulnerabilities Across All Contracts

```graphql
query GetCriticalVulnerabilities {
  vulnerabilityEvents(
    where: { severity: CRITICAL, remediationStatus: OPEN }
    first: 100
  ) {
    contractAddress
    vulnerabilityType
    detectedAt
    exploited
  }
}
```

**Use Case:** Security dashboard showing unresolved critical issues

---

### 5. Get Contract Deployment Info

```graphql
query GetDeployment($contractAddress: String!) {
  contractDeployment(id: $contractAddress) {
    contractAddress
    deployer
    deployedAt
    blockNumber
    txHash
    initialRiskScore
  }
}
```

**Use Case:** Verify who deployed a contract and when

---

### 6. Aggregate Statistics - All Contracts

```graphql
query GetGlobalStats {
  securityMetrics(first: 1000) {
    contractAddress
    totalScans
    criticalIssues
    averageRiskScore
  }
}
```

**Use Case:** Generate leaderboard of most secure contracts

---

### 7. Time-Series Analysis - Vulnerability Trends

```graphql
query GetVulnerabilityTrends($startTime: BigInt!, $endTime: BigInt!) {
  vulnerabilityEvents(
    where: { 
      detectedAt_gte: $startTime,
      detectedAt_lte: $endTime
    }
    orderBy: detectedAt
  ) {
    vulnerabilityType
    severity
    detectedAt
    contractAddress
  }
}
```

**Variables:**
```json
{
  "startTime": "1729785000",
  "endTime": "1729871400"
}
```

**Use Case:** "Show all vulnerabilities detected this week"

---

### 8. Filter by Remediation Status

```graphql
query GetResolvedVulnerabilities($contractAddress: String!) {
  vulnerabilityEvents(
    where: { 
      contractAddress: $contractAddress,
      remediationStatus: RESOLVED
    }
  ) {
    vulnerabilityType
    severity
    detectedAt
    remediatedAt
  }
}
```

**Use Case:** Show which vulnerabilities have been fixed

---

## 🔄 Real-Time Subscriptions

Envio supports GraphQL subscriptions for real-time updates:

```graphql
subscription OnNewVulnerability($contractAddress: String!) {
  vulnerabilityEvent(
    where: { contractAddress: $contractAddress }
  ) {
    vulnerabilityType
    severity
    detectedAt
  }
}
```

**Use Case:** Alert users when new vulnerabilities are detected

---

## 💻 Frontend Integration Examples

### React Hook - Get Contract Security

```typescript
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';

const GET_SECURITY = gql`
  query GetSecurity($address: String!) {
    securityMetric(id: $address) {
      criticalIssues
      highIssues
      averageRiskScore
    }
  }
`;

function SecurityBadge({ contractAddress }) {
  const { data, loading } = useQuery(GET_SECURITY, {
    variables: { address: contractAddress }
  });

  if (loading) return <div>Loading...</div>;
  
  const { criticalIssues, averageRiskScore } = data.securityMetric;
  
  return (
    <div className={criticalIssues > 0 ? 'danger' : 'safe'}>
      Risk Score: {averageRiskScore}/100
      {criticalIssues > 0 && <span>⚠️ {criticalIssues} Critical Issues</span>}
    </div>
  );
}
```

---

### Fetch API - Simple Query

```javascript
async function getContractSecurity(contractAddress) {
  const response = await fetch('https://indexer.envio.dev/your-project/graphql', {
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
console.log(`Risk Score: ${security.averageRiskScore}/100`);
```

---

## 🚀 How to Start Indexing

### 1. Install Envio CLI

```bash
npm install -g envio
```

### 2. Navigate to N3 Envio Package

```bash
cd packages/envio-indexer
```

### 3. Generate Code from Schema

```bash
envio codegen
```

### 4. Start Indexer (Development)

```bash
envio dev
```

### 5. Deploy to Production

```bash
envio deploy
```

---

## 📡 GraphQL Endpoint

After deployment, your GraphQL endpoint will be:

```
https://indexer.envio.dev/n3-security-indexer/v1/graphql
```

---

## 🎨 Playground

Envio provides a GraphQL playground at:

```
https://indexer.envio.dev/n3-security-indexer/v1/graphiql
```

Try queries interactively with autocomplete!

---

## 🔧 Custom Event Handlers

Located in: `packages/envio-indexer/src/handlers/security-events.ts`

Current handlers:
- `VulnerabilityDetected` - When a vulnerability is found
- `SecurityScanCompleted` - When a scan finishes
- `ContractDeployed` - When a contract is deployed

You can add custom logic to process events as they're indexed.

---

## 📈 Performance

- ⚡ **Sub-second indexing** - Events indexed within 1-2 seconds
- 🔍 **Fast queries** - GraphQL responses in <50ms
- 📦 **Scalable** - Handles millions of events
- 🌍 **Multi-chain** - Index multiple chains simultaneously

---

## 🎯 Use Cases Summary

| Use Case | Query Type | Example |
|----------|------------|---------|
| Wallet Warning | Single Contract | Show risk before transaction |
| Security Dashboard | Aggregate Stats | Top 10 most vulnerable contracts |
| Audit Trail | Historical Scans | When was vulnerability X detected? |
| Compliance Report | Time-Range Filter | Q4 2024 security summary |
| DeFi Insurance | Risk Calculation | Premium based on security metrics |
| Developer Dashboard | Personal Portfolio | All my deployed contracts' security |

---

## 🔗 Links

- **Envio Docs**: https://docs.envio.dev
- **N3 Envio Config**: `packages/envio-indexer/config.yaml`
- **GraphQL Schema**: `packages/envio-indexer/schema.graphql`
- **Event Handlers**: `packages/envio-indexer/src/handlers/`

---

**Run the demo:**
```bash
node demo-envio-integration.js
```
