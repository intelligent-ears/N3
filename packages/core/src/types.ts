import { z } from 'zod';

export const SeveritySchema = z.enum(['critical', 'high', 'medium', 'low', 'info']);
export type Severity = z.infer<typeof SeveritySchema>;

export const CategorySchema = z.enum([
  'smart-contract',
  'defi',
  'token',
  'nft',
  'upgrade',
  'gas',
  'cryptography',
]);
export type Category = z.infer<typeof CategorySchema>;

export const PatternSchema = z.object({
  name: z.string(),
  bytecode: z.array(z.string()).optional(),
  solidity: z.string().optional(),
  check: z.string().optional(),
  before: z.string().optional(),
  functions: z.array(z.string()).optional(),
});
export type Pattern = z.infer<typeof PatternSchema>;

export const DetectionSchema = z.object({
  patterns: z.array(PatternSchema),
});
export type Detection = z.infer<typeof DetectionSchema>;

export const HardhatConfigSchema = z.object({
  test_file: z.string(),
  test_function: z.string(),
  auto_generate: z.boolean().default(true),
});
export type HardhatConfig = z.infer<typeof HardhatConfigSchema>;

export const RiskCalculationSchema = z.object({
  base_score: z.number().min(0).max(100),
  modifiers: z.record(z.number()).optional(),
});
export type RiskCalculation = z.infer<typeof RiskCalculationSchema>;

export const RemediationSchema = z.object({
  priority: z.number().min(1).max(5),
  fixes: z.array(z.string()),
  code_example: z.string().optional(),
});
export type Remediation = z.infer<typeof RemediationSchema>;

export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  severity: SeveritySchema,
  category: CategorySchema,
  tags: z.array(z.string()).optional(),
  description: z.string(),
  hardhat: HardhatConfigSchema.optional(),
  detection: DetectionSchema,
  risk_calculation: RiskCalculationSchema,
  remediation: RemediationSchema,
  references: z.array(z.string()).optional(),
  examples: z
    .object({
      vulnerable_contracts: z.array(z.string()).optional(),
      test_vectors: z
        .array(
          z.object({
            contract: z.string(),
            expected: z.enum(['PASS', 'FAIL']),
          })
        )
        .optional(),
    })
    .optional(),
  custom_logic: z.string().optional(),
});

export type Template = z.infer<typeof TemplateSchema>;

export interface ScanResult {
  template: Template;
  vulnerable: boolean;
  riskScore: number;
  findings: Finding[];
  remediation?: string[];
}

export interface Finding {
  severity: Severity;
  message: string;
  location?: {
    file: string;
    line?: number;
    column?: number;
  };
  pattern?: string;
}

export interface SecurityReport {
  contractAddress?: string;
  contractName?: string;
  timestamp: number;
  overallRiskScore: number;
  totalScans: number;
  results: ScanResult[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}
