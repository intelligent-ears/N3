/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  N3SecurityOracle,
  SecurityScan,
  VulnerabilityEvent,
  SecurityMetric,
  ContractDeployment,
} from "../generated";

// Track vulnerability detection events
N3SecurityOracle.VulnerabilityDetected.handler(async ({ event, context }: any) => {
  const vulnEvent = await context.VulnerabilityEvent.create({
    id: `${event.transaction.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    vulnerabilityType: event.params.vulnType,
    severity: mapSeverity(event.params.severity),
    detectedAt: event.block.timestamp,
    blockNumber: event.block.number,
    txHash: event.transaction.hash,
    exploited: false,
    remediationStatus: "OPEN",
  });

  // Update security metrics
  await updateSecurityMetrics(
    event.params.contractAddress,
    context,
    event.block.timestamp
  );
});

// Track security scan completions
N3SecurityOracle.SecurityScanCompleted.handler(async ({ event, context }: any) => {
  const scan = await context.SecurityScan.create({
    id: `${event.transaction.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    chainId: 1, // Ethereum mainnet
    scanTimestamp: event.params.timestamp,
    templateId: "comprehensive",
    severity: getRiskSeverity(event.params.riskScore),
    status: event.params.riskScore >= 70 ? "PASS" : "FAIL",
    riskScore: event.params.riskScore,
    details: JSON.stringify({ score: event.params.riskScore }),
    txHash: event.transaction.hash,
  });

  // Update metrics
  await updateSecurityMetrics(
    event.params.contractAddress,
    context,
    event.params.timestamp
  );
});

// Track contract deployments
N3SecurityOracle.ContractDeployed.handler(async ({ event, context }: any) => {
  const deployment = await context.ContractDeployment.create({
    id: event.params.contractAddress,
    contractAddress: event.params.contractAddress,
    deployer: event.params.deployer,
    deployedAt: event.params.timestamp,
    blockNumber: event.block.number,
    txHash: event.transaction.hash,
  });

  // Initialize security metrics
  await context.SecurityMetric.create({
    id: event.params.contractAddress,
    contractAddress: event.params.contractAddress,
    totalScans: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0,
    averageRiskScore: 0,
    lastScanTimestamp: event.params.timestamp,
    firstScanTimestamp: event.params.timestamp,
  });
});

// Helper: Update security metrics
async function updateSecurityMetrics(
  contractAddress: string,
  context: any,
  timestamp: bigint
) {
  const existingMetric = await context.SecurityMetric.get(contractAddress);

  if (existingMetric) {
    await context.SecurityMetric.set({
      ...existingMetric,
      totalScans: existingMetric.totalScans + 1,
      lastScanTimestamp: timestamp,
    });
  } else {
    await context.SecurityMetric.create({
      id: contractAddress,
      contractAddress,
      totalScans: 1,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0,
      averageRiskScore: 0,
      lastScanTimestamp: timestamp,
      firstScanTimestamp: timestamp,
    });
  }
}

// Helper: Map severity number to enum
function mapSeverity(severity: number): string {
  switch (severity) {
    case 4:
      return "CRITICAL";
    case 3:
      return "HIGH";
    case 2:
      return "MEDIUM";
    case 1:
      return "LOW";
    default:
      return "INFO";
  }
}

// Helper: Get risk severity from score
function getRiskSeverity(score: bigint): string {
  const scoreNum = Number(score);
  if (scoreNum < 40) return "CRITICAL";
  if (scoreNum < 70) return "HIGH";
  if (scoreNum < 90) return "MEDIUM";
  return "LOW";
}
