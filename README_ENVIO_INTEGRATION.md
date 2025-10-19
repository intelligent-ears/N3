# Envio Integration for N3

This document explains how N3 integrates with Envio's HyperIndex and HyperSync capabilities to provide enhanced security analytics for smart contracts.

## Overview

The N3 security scanner now integrates with Envio to provide:

1. **Historical Security Analysis**: Query Envio's HyperIndex for comprehensive security scan history of smart contracts
2. **Real-time Security Monitoring**: Register contracts for real-time security monitoring via Envio's HyperSync
3. **Enhanced Vulnerability Detection**: Access Envio's indexed vulnerability event data for deeper security insights

## Architecture

The integration consists of two main components:

### 1. EnvioAdapter

The `EnvioAdapter` class provides direct interaction with Envio's HyperIndex and HyperSync APIs:

```typescript
export class EnvioAdapter {
  // Query vulnerability events for a contract
  async getVulnerabilitiesForContract(contractAddress: string, limit?: number): Promise<VulnerabilityEventData[]>;

  // Get security scan history for a contract
  async getSecurityScanHistory(contractAddress: string, limit?: number): Promise<SecurityScanData[]>;

  // Get aggregated security metrics for a contract
  async getSecurityMetrics(contractAddress: string): Promise<SecurityMetricData | null>;

  // Register a contract for real-time monitoring
  async registerForRealTimeMonitoring(contractAddress: string, webhookUrl: string): Promise<boolean>;
}
```

### 2. High-level Integration Functions

These functions provide a higher-level interface to EnvioAdapter with fallback mechanisms:

```typescript
// Get security history with fallback to mock data
export async function getSecurityHistory(address: string, chain: string = 'ethereum'): Promise<SecurityHistoryResponse>;

// Register for monitoring with fallback mechanism
export async function registerForMonitoring(address: string, webhookUrl: string, chain?: string): Promise<MonitoringResponse>;
```

## Features

### Security History Analysis

- Query indexed security scan history for any smart contract
- Get detailed vulnerability events with severity ratings and timestamps
- Access aggregated security metrics including risk scores and issue counts
- Track security risk trends over time
- Fall back to local analysis when Envio data is unavailable

### Real-time Security Monitoring

- Register contracts for real-time security monitoring
- Receive webhook notifications when security events are detected
- Monitor for new vulnerabilities as they're discovered
- Get notified about potential exploit attempts
- Support for multiple blockchain networks

## Usage

### Via MCP Server

The MCP server exposes Envio functionality via HTTP endpoints:

```bash
# Get security history
curl -X POST "http://localhost:3000/api/tool" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "envio_security_history",
    "arguments": {
      "address": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", 
      "chain": "ethereum"
    }
  }'

# Register for monitoring
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

### Via Direct API

```typescript
import { EnvioAdapter } from '@n3/mcp-server/tools/envio-adapter';
import { getSecurityHistory, registerForMonitoring } from '@n3/mcp-server/tools';

// Direct usage example
const adapter = new EnvioAdapter();
const vulnerabilities = await adapter.getVulnerabilitiesForContract('0x1234...');

// Higher-level functions with fallback
const securityHistory = await getSecurityHistory('0x1234...', 'ethereum');
const result = await registerForMonitoring('0x1234...', 'https://webhook.com');
```

## Testing

Test the Envio integration using the provided test scripts:

```bash
# Test with actual Envio endpoints (if available)
node test-envio.js

# Test with mock data fallback mechanism
node test-envio-mock.js
```

## Data Types

### VulnerabilityEventData

```typescript
interface VulnerabilityEventData {
  id: string;
  contractAddress: string;
  vulnerabilityType: string;
  severity: string;
  detectedAt: string;
  blockNumber: string;
  txHash: string;
  exploited: boolean;
  remediationStatus: string;
}
```

### SecurityScanData

```typescript
interface SecurityScanData {
  id: string;
  contractAddress: string;
  chainId: number;
  scanTimestamp: string;
  templateId: string;
  severity: string;
  status: string;
  riskScore: number;
  details: string;
  txHash?: string;
}
```

### SecurityMetricData

```typescript
interface SecurityMetricData {
  id: string;
  contractAddress: string;
  totalScans: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  averageRiskScore: number;
  lastScanTimestamp: string;
  firstScanTimestamp: string;
}
```

## Future Enhancements

- Custom Envio indexers for specific security event types
- Integration with Hardhat plugin for automatic monitoring
- Enhanced visualizations of security history in reports
- Custom templates for Envio-specific security patterns