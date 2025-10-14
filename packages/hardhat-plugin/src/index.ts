import { extendConfig } from 'hardhat/config';
import './tasks/scan';
import './tasks/test';
import './tasks/audit';
import './tasks/monitor';
import './tasks/fix';
import './tasks/coverage';

// Extend Hardhat config with N3 options
extendConfig((config: any) => {
  const defaultConfig = {
    templates: './n3-templates',
    severity: ['critical', 'high', 'medium'],
    failOnCritical: true,
    reportFormat: 'json',
    autoFix: false,
    chains: ['ethereum'],
  };

  config.n3 = { ...defaultConfig, ...config.n3 };
});

// Export types for TypeScript users
export type { N3Config } from './types';
