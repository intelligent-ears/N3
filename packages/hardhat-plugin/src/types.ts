export interface N3Config {
  templates: string;
  severity: string[];
  failOnCritical: boolean;
  reportFormat: 'json' | 'html' | 'markdown' | 'console';
  autoFix: boolean;
  chains: string[];
}

export interface N3TaskArgs {
  file?: string;
  templates?: string;
  output?: string;
  fix?: boolean;
}

// Extend Hardhat config types
declare module 'hardhat/types/config' {
  export interface HardhatUserConfig {
    n3?: Partial<N3Config>;
  }

  export interface HardhatConfig {
    n3: N3Config;
  }
}
