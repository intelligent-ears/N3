#!/usr/bin/env node

const axios = require('axios');
const contractAddress = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'; // Uniswap V2 Router
const network = 'ethereum';

async function testIntegration() {
  console.log('Testing N3 Blockscout Integration');
  console.log('---------------------------------');
  
  try {
    // Test the analyze endpoint
    console.log(`1. Testing /api/analyze with contract ${contractAddress} on ${network}`);
    const analysisResponse = await axios.get(`http://localhost:8080/api/analyze`, {
      params: { address: contractAddress, network }
    });
    
    console.log('Analysis Response:');
    console.log(`  Risk Score: ${analysisResponse.data.riskScore}/100`);
    console.log(`  Vulnerabilities: ${analysisResponse.data.vulnerabilities?.length || 0} found`);
    if (analysisResponse.data.vulnerabilities?.length > 0) {
      console.log('  Vulnerability Details:');
      analysisResponse.data.vulnerabilities.forEach((vuln, i) => {
        console.log(`    ${i+1}. ${vuln.name} (${vuln.severity})`);
      });
    }
    console.log('  Recommendations:');
    analysisResponse.data.recommendations?.forEach((rec, i) => {
      console.log(`    ${i+1}. ${rec}`);
    });
    
    // Test the contract info endpoint
    console.log(`\n2. Testing /api/contract with contract ${contractAddress} on ${network}`);
    const contractResponse = await axios.get(`http://localhost:8080/api/contract`, {
      params: { address: contractAddress, network }
    });
    
    console.log('Contract Info:');
    console.log(`  Name: ${contractResponse.data.name}`);
    console.log(`  Verified: ${contractResponse.data.verified}`);
    console.log(`  Compiler: ${contractResponse.data.compiler}`);
    
    console.log('\nIntegration test completed successfully!');
    console.log('\nDemo is now available at http://localhost:8080');
    console.log('MCP server is running at http://localhost:3000');
    
  } catch (error) {
    console.error('Error during integration test:');
    console.error(error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testIntegration();