import axios from 'axios';

// Interface for Envio HyperIndex query responses
interface HyperIndexResponse<T> {
  data: {
    [key: string]: T[];
  };
}

// Interface for vulnerability event data
export interface VulnerabilityEventData {
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

// Interface for security scan data
export interface SecurityScanData {
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

// Interface for security metrics
export interface SecurityMetricData {
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

export class EnvioAdapter {
  private readonly hyperIndexEndpoint: string;
  private readonly hyperSyncEndpoint: string;

  constructor(
    hyperIndexEndpoint: string = 'https://api.envio.dev/v1/hyperindex',
    hyperSyncEndpoint: string = 'https://api.envio.dev/v1/hypersync'
  ) {
    this.hyperIndexEndpoint = hyperIndexEndpoint;
    this.hyperSyncEndpoint = hyperSyncEndpoint;
  }

  /**
   * Fetches vulnerability events for a specific contract from Envio HyperIndex
   * @param contractAddress The contract address to query
   * @param limit Maximum number of events to return
   */
  async getVulnerabilitiesForContract(
    contractAddress: string,
    limit: number = 10
  ): Promise<VulnerabilityEventData[]> {
    try {
      const query = `
        query {
          vulnerabilityEvents(
            first: ${limit},
            where: { contractAddress: "${contractAddress.toLowerCase()}" },
            orderBy: detectedAt,
            orderDirection: desc
          ) {
            id
            contractAddress
            vulnerabilityType
            severity
            detectedAt
            blockNumber
            txHash
            exploited
            remediationStatus
          }
        }
      `;

      const response = await axios.post<HyperIndexResponse<VulnerabilityEventData>>(
        this.hyperIndexEndpoint,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data?.vulnerabilityEvents || [];
    } catch (error) {
      console.error('Error fetching vulnerabilities from Envio:', error);
      return [];
    }
  }

  /**
   * Fetches security scan history for a contract
   * @param contractAddress The contract address to query
   * @param limit Maximum number of scans to return
   */
  async getSecurityScanHistory(
    contractAddress: string,
    limit: number = 10
  ): Promise<SecurityScanData[]> {
    try {
      const query = `
        query {
          securityScans(
            first: ${limit},
            where: { contractAddress: "${contractAddress.toLowerCase()}" },
            orderBy: scanTimestamp,
            orderDirection: desc
          ) {
            id
            contractAddress
            chainId
            scanTimestamp
            templateId
            severity
            status
            riskScore
            details
            txHash
          }
        }
      `;

      const response = await axios.post<HyperIndexResponse<SecurityScanData>>(
        this.hyperIndexEndpoint,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data?.securityScans || [];
    } catch (error) {
      console.error('Error fetching security scans from Envio:', error);
      return [];
    }
  }

  /**
   * Fetches security metrics for a contract
   * @param contractAddress The contract address to query
   */
  async getSecurityMetrics(contractAddress: string): Promise<SecurityMetricData | null> {
    try {
      const query = `
        query {
          securityMetrics(
            where: { contractAddress: "${contractAddress.toLowerCase()}" }
          ) {
            id
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
      `;

      const response = await axios.post<HyperIndexResponse<SecurityMetricData>>(
        this.hyperIndexEndpoint,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const metrics = response.data.data?.securityMetrics || [];
      return metrics.length > 0 ? metrics[0] : null;
    } catch (error) {
      console.error('Error fetching security metrics from Envio:', error);
      return null;
    }
  }

  /**
   * Registers a contract for real-time security monitoring via HyperSync
   * @param contractAddress The contract address to monitor
   * @param webhookUrl Webhook URL to notify when security events are detected
   */
  async registerForRealTimeMonitoring(
    contractAddress: string,
    webhookUrl: string
  ): Promise<boolean> {
    try {
      // This is a mock implementation for the concept
      // In a real implementation, we would call HyperSync API to register for events
      const response = await axios.post(
        this.hyperSyncEndpoint,
        {
          contractAddress: contractAddress.toLowerCase(),
          events: ['VulnerabilityDetected', 'SecurityScanCompleted'],
          webhook: webhookUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Error registering for real-time monitoring:', error);
      return false;
    }
  }

  /**
   * Simulates creating a security event in the Envio index
   * This is a mock method for testing purposes
   */
  async simulateSecurityEvent(contractAddress: string, vulnType: string, severity: string): Promise<boolean> {
    // In a real implementation, we would emit events to a smart contract or directly index
    console.log(`[MOCK] Created security event for ${contractAddress}: ${vulnType} (${severity})`);
    return true;
  }
}