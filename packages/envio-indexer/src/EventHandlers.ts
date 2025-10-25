import { N3SecurityOracle, VulnerabilityEvent, SecurityScan, SecurityMetric } from "generated";

// Handler for VulnerabilityDetected event
N3SecurityOracle.VulnerabilityDetected.handler(async ({ event, context }) => {
  const vulnerabilityEntity: VulnerabilityEvent = {
    id: `${event.block.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    vulnerabilityType: event.params.vulnType,
    severity: mapSeverity(Number(event.params.severity)),
    detectedAt: BigInt(event.block.timestamp),
    blockNumber: BigInt(event.block.number),
    txHash: event.block.hash, // Using block hash as transaction hash not available
  };

  context.VulnerabilityEvent.set(vulnerabilityEntity);

  // Update metrics
  await updateMetrics(event.params.contractAddress, Number(event.params.severity), context);
});

// Handler for SecurityScanCompleted event
N3SecurityOracle.SecurityScanCompleted.handler(async ({ event, context }) => {
  const scanEntity: SecurityScan = {
    id: `${event.block.hash}-${event.logIndex}`,
    contractAddress: event.params.contractAddress,
    riskScore: Number(event.params.riskScore),
    timestamp: event.params.timestamp,
    txHash: event.block.hash,
  };

  context.SecurityScan.set(scanEntity);

  // Update total scans count
  const currentMetric = await context.SecurityMetric.get(event.params.contractAddress);
  if (currentMetric) {
    context.SecurityMetric.set({
      ...currentMetric,
      totalScans: currentMetric.totalScans + 1,
    });
  }
});

// Handler for ContractDeployed event
N3SecurityOracle.ContractDeployed.handler(async ({ event, context }) => {
  const contractAddress = event.params.contractAddress;
  const existingMetric = await context.SecurityMetric.get(contractAddress);
  
  if (!existingMetric) {
    const metricEntity: SecurityMetric = {
      id: contractAddress,
      totalScans: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
    };
    context.SecurityMetric.set(metricEntity);
  }
});

// Helper: Update metrics based on vulnerability severity
async function updateMetrics(
  contractAddress: string,
  severity: number,
  context: { SecurityMetric: any }
) {
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

  context.SecurityMetric.set(metric);
}

// Helper: Map severity number to string
function mapSeverity(severity: number): string {
  switch (severity) {
    case 4: return "CRITICAL";
    case 3: return "HIGH";
    case 2: return "MEDIUM";
    case 1: return "LOW";
    default: return "LOW";
  }
}
