import axios from 'axios';
import { SecurityEngine } from '@n3/core';

const BLOCKSCOUT_API_BASE = 'https://eth.blockscout.com/api';

export async function analyzeContract(address: string, chain: string = 'ethereum') {
  try {
    // Fetch contract source code from Blockscout
    const response = await axios.get(`${BLOCKSCOUT_API_BASE}`, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
      },
    });

    const contractData = response.data.result[0];
    
    if (!contractData.SourceCode) {
      return {
        error: 'Contract source code not available',
        address,
        verified: false,
      };
    }

    // Initialize N3 security engine
    const engine = new SecurityEngine();
    await engine.initialize({
      templatesDir: './templates',
      severities: ['critical', 'high', 'medium', 'low'],
    });

    // Scan the contract
    const report = await engine.scan(contractData.SourceCode, contractData.ContractName);

    return {
      address,
      contractName: contractData.ContractName,
      compiler: contractData.CompilerVersion,
      verified: true,
      securityReport: report,
      riskScore: report.overallRiskScore,
      vulnerabilities: report.results.filter((r) => r.vulnerable),
    };
  } catch (error) {
    return {
      error: `Failed to analyze contract: ${error}`,
      address,
    };
  }
}

export async function getContractTransactions(address: string, limit: number = 100) {
  try {
    const response = await axios.get(`${BLOCKSCOUT_API_BASE}`, {
      params: {
        module: 'account',
        action: 'txlist',
        address: address,
        page: 1,
        offset: limit,
        sort: 'desc',
      },
    });

    const transactions = response.data.result;

    // Analyze transaction patterns
    const analysis = {
      totalTransactions: transactions.length,
      failedTransactions: transactions.filter((tx: any) => tx.isError === '1').length,
      suspiciousPatterns: [],
      recentActivity: transactions.slice(0, 10).map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        success: tx.isError === '0',
      })),
    };

    return analysis;
  } catch (error) {
    return {
      error: `Failed to fetch transactions: ${error}`,
      address,
    };
  }
}

export async function checkVulnerabilities(address: string, type: string) {
  try {
    // Fetch and analyze contract for specific vulnerability type
    const contractAnalysis = await analyzeContract(address);

    if (contractAnalysis.error) {
      return contractAnalysis;
    }

    // Filter vulnerabilities by type
    const specificVulnerabilities = contractAnalysis.vulnerabilities?.filter(
      (v: any) => v.template.tags?.includes(type) || v.template.category === type
    );

    return {
      address,
      vulnerabilityType: type,
      found: (specificVulnerabilities?.length || 0) > 0,
      count: specificVulnerabilities?.length || 0,
      details: specificVulnerabilities,
      recommendations:
        specificVulnerabilities?.flatMap((v: any) => v.remediation || []) || [],
    };
  } catch (error) {
    return {
      error: `Failed to check vulnerabilities: ${error}`,
      address,
      type,
    };
  }
}
