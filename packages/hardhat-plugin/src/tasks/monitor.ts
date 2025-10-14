import { task } from 'hardhat/config';

task('n3:monitor', 'Monitor deployed contract for vulnerabilities')
  .addParam('address', 'Contract address to monitor')
  .setAction(async () => {
    console.log('Monitoring contract...');
  });
