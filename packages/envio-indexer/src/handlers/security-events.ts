/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  N3SecurityOracle,
} from "generated";

// Track vulnerability detection events
N3SecurityOracle.VulnerabilityDetected.handler(async ({ event, context }: any) => {
  await context.VulnerabilityEvent.create({
    id: `${event.transaction.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    vulnerabilityType: event.params.vulnType,
    severity: mapSeverity(event.params.severity),
    detectedAt: event.block.timestamp,
    blockNumber: event.block.number,
    txHash: event.transaction.hash,
  });

  // Update metrics
  await updateMetrics(event.params.contractAddress, event.params.severity, context);
});

// Track security scan completions
N3SecurityOracle.SecurityScanCompleted.handler(async ({ event, context }: any) => {
  await context.SecurityScan.create({
    id: `${event.transaction.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    riskScore: Number(event.params.riskScore),
    scanStatus: event.params.riskScore >= 70 ? "PASS" : "FAIL",
    timestamp: event.params.timestamp,
    txHash: event.transaction.hash,
  });
});

// Track contract deployments
N3SecurityOracle.ContractDeployed.handler(async ({ event, context }: any) => {
  // Initialize metrics for new contract
  const metric = await context.SecurityMetric.get(event.params.contractAddress);
  
  if (!metric) {
    await context.SecurityMetric.create({
      id: event.params.contractAddress,
      totalScans: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
    });
  }
});

// Helper: Update metrics
async function updateMetrics(contractAddress: string, severity: number, context: any) {
  let metric = await context.SecurityMetric.get(contractAddress);
  
  if (!metric) {
    metric = {
      id: contractAddress,
      totalScans: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
    };
  }

  // Increment counters based on severity
  if (severity === 4) metric.criticalCount++;
  else if (severity === 3) metric.highCount++;
  else if (severity === 2) metric.mediumCount++;
  else if (severity === 1) metric.lowCount++;

  await context.SecurityMetric.set(metric);
}

// Helper: Map severity number to enum
function mapSeverity(severity: number): string {
  switch (severity) {
    case 4: return "CRITICAL";
    case 3: return "HIGH";
    case 2: return "MEDIUM";
    case 1: return "LOW";
    default: return "LOW";
  }
}
