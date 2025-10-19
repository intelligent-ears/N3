const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'demo')));

// Mock API endpoints to simulate MCP server responses
app.get('/api/analyze', async (req, res) => {
  const { address, network } = req.query;
  
  try {
    console.log(`Analyzing contract ${address} on ${network}...`);
    
    // Mock response
    const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const riskScore = (addressSum % 100);
    
    // Generate mock data immediately without timeout
    res.json({
      address,
      network,
      timestamp: new Date().toISOString(),
      riskScore,
      vulnerabilities: generateMockVulnerabilities(address, riskScore),
      recommendations: [
        "Implement checks-effects-interactions pattern",
        "Add access control modifiers to sensitive functions",
        "Use SafeMath for arithmetic operations in pre-0.8.0 contracts",
        "Consider adding a time delay for sensitive operations"
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze contract' });
  }
});

app.get('/api/contract', async (req, res) => {
  const { address, network } = req.query;
  
  try {
    console.log(`Getting contract info for ${address} on ${network}...`);
    
    // Mock data
    res.json({
      address,
      name: `Contract_${address.substring(0, 6)}`,
      verified: true,
      compiler: "v0.8.17+commit.8df45f5f",
      optimization: true,
      constructorArguments: "0x0000000000000000000000000000000000000000",
      implementation: null,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get contract info' });
  }
});

// Serve the demo page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo', 'index.html'));
});

// Helper function to generate mock vulnerabilities
function generateMockVulnerabilities(address, riskScore) {
  if (riskScore < 25) return [];
  
  const vulnerabilityTypes = [
    { name: "Reentrancy Vulnerability", severity: "critical" },
    { name: "Access Control Issue", severity: "high" },
    { name: "Integer Overflow", severity: "high" },
    { name: "Unchecked External Call", severity: "medium" },
    { name: "Price Oracle Manipulation", severity: "critical" }
  ];
  
  const vulnerabilityCount = 1 + Math.floor((riskScore % 20) / 5);
  const selectedVulnerabilities = [];
  
  for (let i = 0; i < vulnerabilityCount; i++) {
    selectedVulnerabilities.push(vulnerabilityTypes[i % vulnerabilityTypes.length]);
  }
  
  return selectedVulnerabilities;
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Demo server running at http://0.0.0.0:${PORT}`);
  console.log(`Access the demo at http://localhost:${PORT}`);
  console.log(`For integration test use http://127.0.0.1:${PORT}`);
});