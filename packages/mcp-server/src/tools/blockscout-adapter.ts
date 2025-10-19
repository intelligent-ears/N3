import axios from 'axios';

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
  
  async getAddressInfo(address: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/addresses/${address}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching address info:', error);
      throw new Error(`Failed to fetch address info: ${error}`);
    }
  }
}