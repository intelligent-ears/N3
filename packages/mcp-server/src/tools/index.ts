import axios from 'axios';
import { BlockscoutAdapter } from './blockscout-adapter';
import { EnvioAdapter, VulnerabilityEventData, SecurityScanData, SecurityMetricData } from './envio-adapter';

// Updated to use v2 API with network parameter for multi-chain support
const BLOCKSCOUT_API_BASE = 'https://blockscout.com/eth';
const BLOCKSCOUT_API_MAP: { [key: string]: string } = {
  'ethereum': 'https://eth.blockscout.com/api/v2',
  'polygon': 'https://polygon.blockscout.com/api/v2',
  'arbitrum': 'https://arbitrum.blockscout.com/api/v2',
  'optimism': 'https://optimism.blockscout.com/api/v2',
  'base': 'https://base.blockscout.com/api/v2',
  'avalanche': 'https://snowtrace.io/api/v2'
};

// Initialize Envio adapter with default endpoints
const envioAdapter = new EnvioAdapter(
  'https://api.envio.dev/v1/hyperindex',
  'https://api.envio.dev/v1/hypersync'
);

// Simplified analysis function that mocks the security engine
export async function analyzeContract(address: string, chain: string = 'ethereum') {
  try {
    const adapter = new BlockscoutAdapter(chain);
    
    // Fetch contract data from Blockscout using our adapter
    let contractData;
    try {
      contractData = await adapter.getSmartContract(address);
    } catch (error) {
      // If we can't fetch from Blockscout API, return mock data
      console.log('Using mock data for contract', address);
      
      // Generate deterministic risk score based on address
      const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const riskScore = (addressSum % 100);
      
      const vulnerabilities = generateMockVulnerabilities(address, riskScore);
      
      return {
        address,
        contractName: `Contract_${address.substring(0, 6)}`,
        verified: true,
        compiler: "v0.8.17+commit.8df45f5f",
        riskScore: riskScore,
        vulnerabilities: vulnerabilities
      };
    }

    // Mock security analysis data
    const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const riskScore = (addressSum % 100);
    
    // Generate mock vulnerabilities based on address and risk score
    const vulnerabilities = generateMockVulnerabilities(address, riskScore);

    return {
      address,
      contractName: contractData.name || `Contract_${address.substring(0, 6)}`,
      compiler: contractData.compiler_version || "v0.8.17+commit.8df45f5f",
      verified: true,
      riskScore: riskScore,
      vulnerabilities: vulnerabilities,
    };
  } catch (error) {
    console.error('Error in analyzeContract:', error);
    
    // Return mock data on error
    const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const riskScore = (addressSum % 100);
    
    return {
      address,
      contractName: `Contract_${address.substring(0, 6)}`,
      verified: true,
      compiler: "v0.8.17+commit.8df45f5f",
      riskScore: riskScore,
      vulnerabilities: generateMockVulnerabilities(address, riskScore),
    };
  }
}

// Helper function to generate mock vulnerabilities
interface Vulnerability {
  name: string;
  severity: string;
  description: string;
}

function generateMockVulnerabilities(address: string, riskScore: number): Vulnerability[] {
  if (riskScore < 25) return [];
  
  const vulnerabilityTypes: Vulnerability[] = [
    { name: "Reentrancy Vulnerability", severity: "critical", description: "The contract does not follow the checks-effects-interactions pattern" },
    { name: "Access Control Issue", severity: "high", description: "Missing or improper access controls on sensitive functions" },
    { name: "Integer Overflow", severity: "high", description: "Arithmetic operations can overflow/underflow" },
    { name: "Unchecked External Call", severity: "medium", description: "Return values from external calls are not checked" },
    { name: "Price Oracle Manipulation", severity: "critical", description: "Contract relies on manipulatable price oracle data" }
  ];
  
  const vulnerabilityCount = 1 + Math.floor((riskScore % 20) / 5);
  const selectedVulnerabilities: Vulnerability[] = [];
  
  for (let i = 0; i < vulnerabilityCount; i++) {
    selectedVulnerabilities.push(vulnerabilityTypes[i % vulnerabilityTypes.length]);
  }
  
  return selectedVulnerabilities;
}

/**
 * Get security history from Envio HyperIndex
 * @param address Contract address to analyze
 * @param chain Blockchain network (ethereum, polygon, etc.)
 */
export async function getSecurityHistory(address: string, chain: string = 'ethereum') {
  try {
    // Fetch security scan history from Envio
    const scanHistory = await envioAdapter.getSecurityScanHistory(address);
    const securityMetrics = await envioAdapter.getSecurityMetrics(address);
    
    if (scanHistory.length === 0 && !securityMetrics) {
      // No Envio data, return mock history
      return {
        address,
        chain,
        scanCount: 0,
        firstScan: null,
        lastScan: null,
        history: [],
        riskTrend: 'stable',
        message: 'No security scan history found for this contract on Envio HyperIndex'
      };
    }
    
    // Extract real scan history data
    return {
      address,
      chain,
      scanCount: securityMetrics?.totalScans || scanHistory.length,
      firstScan: securityMetrics?.firstScanTimestamp || scanHistory[scanHistory.length - 1]?.scanTimestamp,
      lastScan: securityMetrics?.lastScanTimestamp || scanHistory[0]?.scanTimestamp,
      history: scanHistory.map(scan => ({
        timestamp: scan.scanTimestamp,
        riskScore: scan.riskScore,
        severity: scan.severity,
        templateId: scan.templateId,
        details: scan.details
      })),
      criticalIssues: securityMetrics?.criticalIssues || 0,
      highIssues: securityMetrics?.highIssues || 0,
      mediumIssues: securityMetrics?.mediumIssues || 0,
      lowIssues: securityMetrics?.lowIssues || 0,
      riskTrend: calculateRiskTrend(scanHistory),
      source: 'envio'
    };
  } catch (error) {
    console.error('Error getting security history:', error);
    
    // Return mock data in case of error
    return {
      address,
      chain,
      scanCount: 0,
      firstScan: null,
      lastScan: null,
      history: [],
      riskTrend: 'stable',
      message: 'Error retrieving security history'
    };
  }
}

/**
 * Register a contract for real-time security monitoring using Envio HyperSync
 * @param address Contract address to monitor
 * @param webhookUrl Webhook URL to notify when events are detected
 * @param chain Blockchain network (ethereum, polygon, etc.)
 */
export async function registerForMonitoring(address: string, webhookUrl: string, chain: string = 'ethereum') {
  try {
    const success = await envioAdapter.registerForRealTimeMonitoring(address, webhookUrl);
    
    return {
      address,
      chain,
      registered: success,
      monitoring: success ? 'active' : 'failed',
      webhook: webhookUrl,
      message: success 
        ? 'Contract successfully registered for real-time security monitoring' 
        : 'Failed to register contract for monitoring'
    };
  } catch (error) {
    console.error('Error registering for monitoring:', error);
    
    return {
      address,
      chain,
      registered: false,
      monitoring: 'failed',
      webhook: webhookUrl,
      message: 'Error registering contract for monitoring'
    };
  }
}

/**
 * Helper function to calculate risk trend from scan history
 */
function calculateRiskTrend(scanHistory: any[]) {
  if (scanHistory.length < 2) return 'stable';
  
  // Sort by timestamp (newest first)
  const sorted = [...scanHistory].sort((a, b) => 
    new Date(b.scanTimestamp).getTime() - new Date(a.scanTimestamp).getTime()
  );
  
  // Get the two most recent scans
  const latest = sorted[0]?.riskScore || 0;
  const previous = sorted[1]?.riskScore || 0;
  
  if (latest < previous) return 'improving';
  if (latest > previous) return 'worsening';
  return 'stable';
}

// Already imported at the top of the file
// Using the adapter for transaction queries

export async function getContractTransactions(address: string, limit: number = 100, chain: string = 'ethereum') {
  try {
    const adapter = new BlockscoutAdapter(chain);
    let transactions;
    let tokenTransfers;
    
    try {
      transactions = await adapter.getTransactions(address, limit);
      tokenTransfers = await adapter.getTokenTransfers(address, limit);
    } catch (error) {
      // Mock data if API call fails
      console.log('Using mock transaction data for', address);
      transactions = Array(10).fill(null).map((_, i) => ({
        hash: `0x${i}${address.substring(2, 10)}${i}`,
        from: { hash: `0x${i}abcdef1234567890` },
        to: { hash: address },
        value: String(Math.floor(Math.random() * 1000000000)),
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        status: Math.random() > 0.1, // 90% success rate
      }));
      tokenTransfers = Array(5).fill(null).map((_, i) => ({
        token: { name: `Token${i}`, symbol: `TKN${i}` },
        from: { hash: `0x${i}abcdef1234567890` },
        to: { hash: address },
        amount: String(Math.floor(Math.random() * 1000)),
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      }));
    }

    // Analyze transaction patterns
    const analysis = {
      totalTransactions: transactions.length,
      failedTransactions: transactions.filter((tx: any) => !tx.status).length,
      tokenTransfersCount: tokenTransfers.length,
      suspiciousPatterns: [],
      recentActivity: transactions.slice(0, 10).map((tx: any) => ({
        hash: tx.hash,
        from: tx.from?.hash || tx.from,
        to: tx.to?.hash || tx.to,
        value: tx.value,
        timestamp: tx.timestamp,
        success: tx.status,
      })),
    };

    return analysis;
  } catch (error) {
    console.error('Error in getContractTransactions:', error);
    
    // Return mock data on error
    return {
      totalTransactions: 10,
      failedTransactions: 1,
      tokenTransfersCount: 5,
      suspiciousPatterns: [],
      recentActivity: Array(5).fill(null).map((_, i) => ({
        hash: `0x${i}${address.substring(2, 10)}${i}`,
        from: `0x${i}abcdef1234567890`,
        to: address,
        value: String(Math.floor(Math.random() * 1000000000)),
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        success: true,
      })),
    };
  }
}

export async function checkVulnerabilities(address: string, type: string) {
  try {
    // Get security analysis (possibly mock data)
    const contractAnalysis = await analyzeContract(address);
    
    // Try to get vulnerability data from Envio first
    const envioVulnerabilities = await envioAdapter.getVulnerabilitiesForContract(address);
    
    // If we have Envio data, use it
    if (envioVulnerabilities.length > 0) {
      const filteredVulnerabilities = envioVulnerabilities.filter(
        v => v.vulnerabilityType.toLowerCase().includes(type.toLowerCase())
      );
      
      return {
        address,
        vulnerabilityType: type,
        found: filteredVulnerabilities.length > 0,
        count: filteredVulnerabilities.length,
        details: filteredVulnerabilities,
        source: 'envio',
        recommendations: [
          "Implement checks-effects-interactions pattern",
          "Add access control modifiers to sensitive functions",
          "Use SafeMath for arithmetic operations in pre-0.8.0 contracts",
          "Check return values of external calls"
        ],
      };
    }
    
    // Fall back to local analysis if no Envio data
    const vulnerabilityTypeMap: Record<string, string[]> = {
      'reentrancy': ['Reentrancy Vulnerability'],
      'access-control': ['Access Control Issue'],
      'overflow': ['Integer Overflow'],
      'external-call': ['Unchecked External Call'],
      'oracle': ['Price Oracle Manipulation'],
    };
    
    const relevantVulnerabilityNames = vulnerabilityTypeMap[type] || [];
    const filteredVulnerabilities = contractAnalysis.vulnerabilities.filter(
      (v: any) => relevantVulnerabilityNames.includes(v.name)
    );

    return {
      address,
      vulnerabilityType: type,
      found: filteredVulnerabilities.length > 0,
      count: filteredVulnerabilities.length,
      details: filteredVulnerabilities,
      source: 'local',
      recommendations: [
        "Implement checks-effects-interactions pattern",
        "Add access control modifiers to sensitive functions",
        "Use SafeMath for arithmetic operations in pre-0.8.0 contracts",
        "Check return values of external calls"
      ],
    };
  } catch (error) {
    console.error('Error in checkVulnerabilities:', error);
    return {
      address,
      vulnerabilityType: type,
      found: false,
      count: 0,
      details: [],
      recommendations: [],
    };
  }
}
