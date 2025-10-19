import React from 'react';
import axios from 'axios';
import { BlockscoutSecurityWidget } from './widget';

export { BlockscoutSecurityWidget };

// Adapter for Blockscout API
export class BlockscoutAdapter {
  private apiBaseUrl: string;
  
  constructor(network: string = 'ethereum') {
    const networkMap: Record<string, string> = {
      'ethereum': 'https://eth.blockscout.com/api/v2',
      'polygon': 'https://polygon.blockscout.com/api/v2',
      'arbitrum': 'https://arbitrum.blockscout.com/api/v2',
      'optimism': 'https://optimism.blockscout.com/api/v2',
      'base': 'https://base.blockscout.com/api/v2',
      'avalanche': 'https://snowtrace.io/api/v2',
    };
    
    this.apiBaseUrl = networkMap[network.toLowerCase()] || networkMap['ethereum'];
  }
  
  async getSmartContract(address: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/smart-contracts/${address}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching smart contract:', error);
      throw new Error(`Failed to fetch smart contract: ${error}`);
    }
  }
  
  async getContractSourceCode(address: string): Promise<string> {
    try {
      const contract = await this.getSmartContract(address);
      if (contract.sources && contract.sources.length > 0) {
        return contract.sources.map((src: any) => src.source_code).join('\n\n');
      }
      return '';
    } catch (error) {
      console.error('Error fetching contract source code:', error);
      throw new Error(`Failed to fetch contract source code: ${error}`);
    }
  }
  
  async getTransactions(address: string, limit: number = 100): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/addresses/${address}/transactions`, {
        params: { limit }
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error(`Failed to fetch transactions: ${error}`);
    }
  }
  
  async getTokenTransfers(address: string, limit: number = 100): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/addresses/${address}/token-transfers`, {
        params: { limit }
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      throw new Error(`Failed to fetch token transfers: ${error}`);
    }
  }
}

// Create N3 security client with Blockscout integration
export const createN3BlockscoutClient = (config?: { 
  baseUrl?: string,
  apiKey?: string 
}) => {
  const baseUrl = config?.baseUrl || 'http://localhost:3000';
  
  return {
    analyzeContract: async (address: string, chain: string = 'ethereum') => {
      try {
        const response = await axios.get(`${baseUrl}/api/analyze`, {
          params: { address, chain },
          headers: config?.apiKey ? { 'X-API-Key': config.apiKey } : undefined,
        });
        return response.data;
      } catch (error) {
        console.error('Error analyzing contract:', error);
        throw new Error(`Failed to analyze contract: ${error}`);
      }
    },
    
    getContractTransactions: async (address: string, limit: number = 100, chain: string = 'ethereum') => {
      try {
        const response = await axios.get(`${baseUrl}/api/transactions`, {
          params: { address, limit, chain },
          headers: config?.apiKey ? { 'X-API-Key': config.apiKey } : undefined,
        });
        return response.data;
      } catch (error) {
        console.error('Error getting transactions:', error);
        throw new Error(`Failed to get transactions: ${error}`);
      }
    },
    
    checkVulnerabilities: async (address: string, type: string, chain: string = 'ethereum') => {
      try {
        const response = await axios.get(`${baseUrl}/api/vulnerabilities`, {
          params: { address, type, chain },
          headers: config?.apiKey ? { 'X-API-Key': config.apiKey } : undefined,
        });
        return response.data;
      } catch (error) {
        console.error('Error checking vulnerabilities:', error);
        throw new Error(`Failed to check vulnerabilities: ${error}`);
      }
    },
  };
};