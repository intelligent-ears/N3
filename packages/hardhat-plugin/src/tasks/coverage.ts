import { task } from 'hardhat/config';

task('n3:coverage', 'Generate security coverage report')
  .setAction(async () => {
    console.log('Generating coverage report...');
  });
