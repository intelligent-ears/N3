import { task } from 'hardhat/config';

task('n3:test', 'Run security tests generated from templates')
  .setAction(async (_, hre) => {
    console.log('Running N3 security tests...');
    // Implementation will run generated Solidity tests
  });
