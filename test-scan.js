#!/usr/bin/env node

/**
 * Quick test script to verify N3 core scanning works
 * This demonstrates the security engine detecting vulnerabilities
 */

const { SecurityEngine } = require('./packages/core/dist/index.js');
const path = require('path');
const fs = require('fs');

async function testScan() {
  console.log('🔍 N3 Security Scanner - Test Run\n');
  
  try {
    // Initialize the security engine
    const engine = new SecurityEngine();
    const templatesPath = path.join(__dirname, 'packages/core/templates');
    
    console.log('📂 Loading templates from:', templatesPath);
    await engine.initialize({ templatesDir: templatesPath });
    console.log('✅ Templates loaded successfully\n');
    
    // Test scanning the vulnerable contract
    const vulnerableContractPath = path.join(__dirname, 'examples/vulnerable-contracts/VulnerableBank.sol');
    console.log('🎯 Scanning vulnerable contract:', vulnerableContractPath);
    
    const vulnerableCode = fs.readFileSync(vulnerableContractPath, 'utf-8');
    const report = await engine.scan(vulnerableCode, 'VulnerableBank');
    
    // Count total findings across all scan results
    const totalFindings = report.results.reduce((sum, result) => sum + result.findings.length, 0);
    console.log(`\n📊 Scan Results: Found ${totalFindings} issues\n`);
    
    report.results.forEach((result, index) => {
      if (result.vulnerable && result.findings.length > 0) {
        console.log(`Template: ${result.template.id} - ${result.template.name}`);
        console.log(`  Severity: ${result.template.severity.toUpperCase()}`);
        console.log(`  Category: ${result.template.category}`);
        console.log(`  Risk Score: ${result.riskScore.toFixed(2)}/10`);
        console.log(`  Findings: ${result.findings.length}`);
        result.findings.forEach((finding, fidx) => {
          const location = finding.location?.line ? `Line ${finding.location.line}` : 'Unknown location';
          console.log(`    ${fidx + 1}. ${location}: ${finding.message}`);
        });
        console.log('');
      }
    });
    
    console.log('📈 Risk Assessment:');
    console.log(`  Overall Risk Score: ${report.overallRiskScore.toFixed(2)}/10`);
    console.log(`  Critical: ${report.summary.critical}`);
    console.log(`  High: ${report.summary.high}`);
    console.log(`  Medium: ${report.summary.medium}`);
    console.log(`  Low: ${report.summary.low}`);
    console.log(`  Info: ${report.summary.info}`);
    
    // Test secure contract
    console.log('\n\n🔍 Now scanning secure contract...');
    const secureContractPath = path.join(__dirname, 'examples/vulnerable-contracts/SecureBank.sol');
    const secureCode = fs.readFileSync(secureContractPath, 'utf-8');
    const secureReport = await engine.scan(secureCode, 'SecureBank');
    
    const secureTotalFindings = secureReport.results.reduce((sum, result) => sum + result.findings.length, 0);
    console.log(`\n📊 Secure Contract Results: Found ${secureTotalFindings} issues`);
    
    if (secureTotalFindings === 0) {
      console.log('✅ No vulnerabilities detected! The secure contract is safe.');
    } else {
      secureReport.results.forEach((result) => {
        if (result.vulnerable && result.findings.length > 0) {
          console.log(`Template: ${result.template.id} - ${result.template.name}`);
          console.log(`  Severity: ${result.template.severity.toUpperCase()}`);
          console.log(`  Findings: ${result.findings.length}`);
          console.log('');
        }
      });
    }
    
    console.log('\n✨ Test completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testScan();
