// Test script for the Envio integration with mock data focus
const { EnvioAdapter } = require('./packages/mcp-server/dist/tools/envio-adapter');
const {
  getSecurityHistory,
  registerForMonitoring
} = require('./packages/mcp-server/dist/tools/index');

// Test contract address (Uniswap V2 Router)
const testAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

// Test the higher-level functions that use EnvioAdapter but provide mock data when API fails
async function testSecurityHistoryWithMockData() {
  console.log('===== Testing getSecurityHistory with mock data fallback =====');
  try {
    const securityHistory = await getSecurityHistory(testAddress, 'ethereum');
    console.log('Security History:');
    console.log(JSON.stringify(securityHistory, null, 2));
    
    // Validate the structure of the returned data
    console.log('\nValidation:');
    console.log('Address present:', securityHistory.address === testAddress);
    console.log('Chain present:', !!securityHistory.chain);
    console.log('Risk trend calculated:', !!securityHistory.riskTrend);
    
    return securityHistory;
  } catch (error) {
    console.error('Error in security history test:', error.message);
  }
}

// Test the monitoring registration with mock data
async function testMonitoringWithMockData() {
  console.log('\n===== Testing registerForMonitoring with mock data fallback =====');
  const webhookUrl = 'https://example.com/webhook';
  
  try {
    const registration = await registerForMonitoring(testAddress, webhookUrl, 'ethereum');
    console.log('Registration Result:');
    console.log(JSON.stringify(registration, null, 2));
    
    // Validate the structure of the returned data
    console.log('\nValidation:');
    console.log('Address present:', registration.address === testAddress);
    console.log('Webhook present:', registration.webhook === webhookUrl);
    console.log('Status message present:', !!registration.message);
    
    return registration;
  } catch (error) {
    console.error('Error in monitoring registration test:', error.message);
  }
}

// Run the tests with mock data focus
async function runMockDataTests() {
  console.log('========== ENVIO INTEGRATION MOCK DATA TEST ==========');
  await testSecurityHistoryWithMockData();
  await testMonitoringWithMockData();
  console.log('========== TEST COMPLETED ==========');
}

// Execute tests
runMockDataTests();