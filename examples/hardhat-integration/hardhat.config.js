require('@nomiclabs/hardhat-waffle');
require('@n3/hardhat-plugin');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  
  // N3 Security Scanner Configuration
  n3: {
    // Template directory (default: ./n3-templates)
    templates: './n3-templates',
    
    // Severity levels to check
    severity: ['critical', 'high', 'medium'],
    
    // Fail build on critical issues
    failOnCritical: true,
    
    // Report format: 'json', 'markdown', 'html', 'terminal'
    reportFormat: 'json',
    
    // Auto-fix simple issues (experimental)
    autoFix: false,
    
    // Blockchain networks to consider
    chains: ['ethereum', 'polygon', 'arbitrum'],
    
    // Output directory for reports
    outputDir: './security-reports',
    
    // Integration with Blockscout
    blockscout: {
      enabled: true,
      apiUrl: 'https://eth.blockscout.com/api',
      verifyContracts: true,
    },
    
    // Integration with Envio for real-time monitoring
    envio: {
      enabled: true,
      indexerUrl: 'http://localhost:8080',
      trackDeployments: true,
      monitorVulnerabilities: true,
    },
  },
  
  networks: {
    hardhat: {
      chainId: 31337,
    },
    ethereum: {
      url: process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
