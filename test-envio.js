// Test script for the Envio integration
const { EnvioAdapter } = require('./packages/mcp-server/dist/tools/envio-adapter');

// Create an instance of the EnvioAdapter
const envioAdapter = new EnvioAdapter();

// Test contract address (Uniswap V2 Router)
const testAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

// Test the getVulnerabilitiesForContract method
async function testVulnerabilityDetection() {
  console.log('Testing vulnerability detection for contract:', testAddress);
  try {
    const vulnerabilities = await envioAdapter.getVulnerabilitiesForContract(testAddress);
    console.log('Vulnerabilities found:', vulnerabilities.length);
    console.log(JSON.stringify(vulnerabilities, null, 2));
  } catch (error) {
    console.error('Error in vulnerability detection:', error.message);
  }
}

// Test the getSecurityScanHistory method
async function testSecurityHistory() {
  console.log('\nTesting security scan history for contract:', testAddress);
  try {
    const scanHistory = await envioAdapter.getSecurityScanHistory(testAddress);
    console.log('Security scan records found:', scanHistory.length);
    console.log(JSON.stringify(scanHistory, null, 2));
  } catch (error) {
    console.error('Error in security history retrieval:', error.message);
  }
}

// Test the getSecurityMetrics method
async function testSecurityMetrics() {
  console.log('\nTesting security metrics for contract:', testAddress);
  try {
    const metrics = await envioAdapter.getSecurityMetrics(testAddress);
    console.log('Security metrics:');
    console.log(JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error('Error in security metrics retrieval:', error.message);
  }
}

// Test the registerForRealTimeMonitoring method
async function testMonitoringRegistration() {
  console.log('\nTesting monitoring registration for contract:', testAddress);
  const mockWebhook = 'https://example.com/webhook';
  try {
    const result = await envioAdapter.registerForRealTimeMonitoring(testAddress, mockWebhook);
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Error in monitoring registration:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('====== ENVIO INTEGRATION TEST ======');
  await testVulnerabilityDetection();
  await testSecurityHistory();
  await testSecurityMetrics();
  await testMonitoringRegistration();
  console.log('====== TEST COMPLETED ======');
}

// Execute tests
runTests();