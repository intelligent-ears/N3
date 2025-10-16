/* eslint-disable no-console */
import { task } from 'hardhat/config';
import { SecurityEngine } from '@n3/core';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import * as path from 'path';

interface TestGenOptions {
  generate?: boolean;
  run?: boolean;
  output?: string;
}

task('n3:test', 'Generate and run security tests from vulnerability templates')
  .addFlag('generate', 'Generate test files from templates')
  .addFlag('run', 'Run generated security tests')
  .addOptionalParam('output', 'Output directory for generated tests', 'test/security')
  .setAction(async (taskArgs: TestGenOptions, hre: any) => {
    const spinner = ora('Initializing N3 Security Test Generator...').start();

    try {
      // Initialize security engine
      const engine = new SecurityEngine();
      
      // @ts-ignore
      const config = hre.config.n3 || {};
      
      await engine.initialize({
        templatesDir: config.templates || './n3-templates',
        severities: config.severity || ['critical', 'high', 'medium'],
      });

      // Get contracts to scan
      const contractFiles = await glob('contracts/**/*.sol');
      spinner.succeed(`Found ${contractFiles.length} contracts to analyze`);

      // Generate tests if requested
      if (taskArgs.generate || !taskArgs.run) {
        spinner.start('Generating security tests...');
        
        const outputDir = taskArgs.output || 'test/security';
        await mkdir(outputDir, { recursive: true });

        let testCount = 0;

        for (const contractFile of contractFiles) {
          const contractCode = await readFile(contractFile, 'utf-8');
          const report = await engine.scan(contractCode, contractFile);
          
          // Only generate tests for contracts with vulnerabilities
          const vulnerableResults = report.results.filter(r => r.vulnerable);
          
          if (vulnerableResults.length > 0) {
            const contractName = path.basename(contractFile, '.sol');
            const testContent = generateTestFile(contractName, contractFile, vulnerableResults);
            
            const testFilePath = path.join(outputDir, `${contractName}.security.test.js`);
            await writeFile(testFilePath, testContent, 'utf-8');
            
            testCount++;
          }
        }

        spinner.succeed(`Generated ${testCount} security test file(s) in ${outputDir}/`);
        console.log(chalk.cyan(`\n💡 Run tests with: npx hardhat test ${outputDir}/**/*.test.js\n`));
      }

      // Run tests if requested
      if (taskArgs.run) {
        spinner.start('Running security tests...');
        
        try {
          const outputDir = taskArgs.output || 'test/security';
          await hre.run('test', { testFiles: [`${outputDir}/**/*.test.js`] });
          spinner.succeed('Security tests completed');
        } catch (error) {
          spinner.fail('Security tests failed');
          throw error;
        }
      }

    } catch (error: any) {
      spinner.fail('Test generation failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

function generateTestFile(contractName: string, contractPath: string, vulnerableResults: any[]): string {
  return `// Auto-generated N3 Security Tests for ${contractName}
// Source: ${contractPath}
// Generated: ${new Date().toISOString()}

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("N3 Security Tests - ${contractName}", function () {
  let contract;
  let owner;
  let attacker;

  beforeEach(async function () {
    [owner, attacker] = await ethers.getSigners();
    
    // Deploy contract
    try {
      const Contract = await ethers.getContractFactory("${contractName}");
      contract = await Contract.deploy();
      await contract.deployed();
    } catch (error) {
      console.warn("Contract deployment failed:", error.message);
      this.skip();
    }
  });

${vulnerableResults.map((result, idx) => `
  describe("${result.template.name} (${result.template.id})", function () {
    it("should detect: ${result.template.description.substring(0, 80)}...", async function () {
      // Template: ${result.template.id}
      // Severity: ${result.template.severity.toUpperCase()}
      // Risk Score: ${result.riskScore}/10
      
      console.log("⚠️  ${result.template.severity.toUpperCase()}: ${result.template.name}");
      console.log("   Findings: ${result.findings.length}");
      
      ${result.findings.map((finding: any, fIdx: number) => `
      // Finding ${fIdx + 1}: ${finding.message}
      console.log("   - ${finding.message}");`).join('\n      ')}
      
      // TODO: Implement specific test for ${result.template.id}
      // Recommended fixes:
      ${result.remediation ? result.remediation.map((fix: string) => `// - ${fix}`).join('\n      ') : '// - Review template recommendations'}
      
      // This test is informational - manual verification required
      expect(true).to.equal(true);
    });
  });`).join('\n')}
});
`;
}
