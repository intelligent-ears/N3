import { task } from 'hardhat/config';

task('n3:fix', 'Auto-fix common vulnerabilities')
  .addOptionalParam('template', 'Specific template to fix')
  .setAction(async () => {
    console.log('Auto-fixing vulnerabilities...');
  });
