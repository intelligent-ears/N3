"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateSchema = exports.RemediationSchema = exports.RiskCalculationSchema = exports.HardhatConfigSchema = exports.DetectionSchema = exports.PatternSchema = exports.CategorySchema = exports.SeveritySchema = void 0;
const zod_1 = require("zod");
exports.SeveritySchema = zod_1.z.enum(['critical', 'high', 'medium', 'low', 'info']);
exports.CategorySchema = zod_1.z.enum([
    'smart-contract',
    'defi',
    'token',
    'nft',
    'upgrade',
    'gas',
    'cryptography',
]);
exports.PatternSchema = zod_1.z.object({
    name: zod_1.z.string(),
    bytecode: zod_1.z.array(zod_1.z.string()).optional(),
    solidity: zod_1.z.string().optional(),
    check: zod_1.z.string().optional(),
    before: zod_1.z.string().optional(),
    functions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.DetectionSchema = zod_1.z.object({
    patterns: zod_1.z.array(exports.PatternSchema),
});
exports.HardhatConfigSchema = zod_1.z.object({
    test_file: zod_1.z.string(),
    test_function: zod_1.z.string(),
    auto_generate: zod_1.z.boolean().default(true),
});
exports.RiskCalculationSchema = zod_1.z.object({
    base_score: zod_1.z.number().min(0).max(100),
    // modifiers is a record of string keys to numeric modifier values
    modifiers: zod_1.z.record(zod_1.z.string(), zod_1.z.number()).optional(),
});
exports.RemediationSchema = zod_1.z.object({
    priority: zod_1.z.number().min(1).max(5),
    fixes: zod_1.z.array(zod_1.z.string()),
    code_example: zod_1.z.string().optional(),
});
exports.TemplateSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    severity: exports.SeveritySchema,
    category: exports.CategorySchema,
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    description: zod_1.z.string(),
    hardhat: exports.HardhatConfigSchema.optional(),
    detection: exports.DetectionSchema,
    risk_calculation: exports.RiskCalculationSchema,
    remediation: exports.RemediationSchema,
    references: zod_1.z.array(zod_1.z.string()).optional(),
    examples: zod_1.z
        .object({
        vulnerable_contracts: zod_1.z.array(zod_1.z.string()).optional(),
        test_vectors: zod_1.z
            .array(zod_1.z.object({
            contract: zod_1.z.string(),
            expected: zod_1.z.enum(['PASS', 'FAIL']),
        }))
            .optional(),
    })
        .optional(),
    custom_logic: zod_1.z.string().optional(),
});
