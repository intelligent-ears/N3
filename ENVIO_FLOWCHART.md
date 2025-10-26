# Envio Integration Flow Chart

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ENVIO INTEGRATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: DEVELOPER DEPLOYS SMART CONTRACT                                 │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Deploy MyContract.sol  │
                    │  to Ethereum Mainnet    │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │ Contract Address:       │
                    │ 0xabcd...1234           │
                    └─────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: N3 SECURITY SCANNER RUNS                                         │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   N3 scans contract     │
                    │   for vulnerabilities   │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Scan Results:         │
                    │   • 2 CRITICAL issues   │
                    │   • 3 HIGH issues       │
                    │   • Risk: 45/100        │
                    └─────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: EMIT EVENTS TO BLOCKCHAIN (On-Chain Oracle Contract)             │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
        ┌───────────────────────────────────────────────────┐
        │     N3SecurityOracle Smart Contract               │
        │     (Deployed on Ethereum)                        │
        └───────────────────────────────────────────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
    ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
    │ VulnerabilityDe- │ │ SecurityScan-    │ │ ContractDe-      │
    │ tected Event     │ │ Completed Event  │ │ ployed Event     │
    ├──────────────────┤ ├──────────────────┤ ├──────────────────┤
    │ • Contract: 0x.. │ │ • Contract: 0x.. │ │ • Contract: 0x.. │
    │ • Type: oracle-1 │ │ • Risk: 45/100   │ │ • Deployer: 0x.. │
    │ • Severity: 4    │ │ • Status: FAIL   │ │ • Time: 172...   │
    │ • Time: 172...   │ │ • Time: 172...   │ └──────────────────┘
    └──────────────────┘ └──────────────────┘
                                  │
                                  │ Events emitted on-chain
                                  │
                                  ▼


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: ENVIO INDEXER LISTENS TO BLOCKCHAIN                              │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Envio Indexer         │
                    │   (Running Process)     │
                    ├─────────────────────────┤
                    │ • Connected to RPC      │
                    │ • Listening from        │
                    │   block 18000000        │
                    └─────────────────────────┘
                                  │
                                  │ Detects new events
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │ Event Handler Triggered │
                    │ src/handlers/           │
                    │ security-events.ts      │
                    └─────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 5: PROCESS EVENTS WITH CUSTOM HANDLERS                              │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
        ┌─────────────────────────────────────────────┐
        │ VulnerabilityDetected.handler()             │
        ├─────────────────────────────────────────────┤
        │ 1. Extract event data                       │
        │ 2. Map severity (4 → CRITICAL)              │
        │ 3. Create VulnerabilityEvent entity         │
        │ 4. Update SecurityMetric counters           │
        └─────────────────────────────────────────────┘
                                  │
                                  ▼
        ┌─────────────────────────────────────────────┐
        │ SecurityScanCompleted.handler()             │
        ├─────────────────────────────────────────────┤
        │ 1. Extract scan results                     │
        │ 2. Determine status (PASS/FAIL)             │
        │ 3. Create SecurityScan entity               │
        │ 4. Update aggregate metrics                 │
        └─────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 6: STORE DATA IN POSTGRESQL                                         │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
            ┌───────────────────────────────────────┐
            │     PostgreSQL Database               │
            │     (Port 5433)                       │
            └───────────────────────────────────────┘
                                  │
        ┌───────────────┬─────────┴─────────┬───────────────┐
        │               │                   │               │
        ▼               ▼                   ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ security_    │ │ vulnerability│ │ security_    │ │ contract_    │
│ scan         │ │ _event       │ │ metric       │ │ deployment   │
├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤
│ id           │ │ id           │ │ id           │ │ id           │
│ contract_    │ │ contract_    │ │ total_scans  │ │ contract_    │
│ address      │ │ address      │ │ critical_    │ │ address      │
│ risk_score   │ │ type         │ │ issues       │ │ deployer     │
│ severity     │ │ severity     │ │ high_issues  │ │ deployed_at  │
│ timestamp    │ │ detected_at  │ │ avg_risk     │ │ tx_hash      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 7: HASURA GENERATES GRAPHQL API                                     │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
            ┌───────────────────────────────────────┐
            │   Hasura GraphQL Engine               │
            │   (Port 8080)                         │
            ├───────────────────────────────────────┤
            │ • Auto-generates GraphQL schema       │
            │ • Provides queries, mutations         │
            │ • Real-time subscriptions             │
            └───────────────────────────────────────┘
                                  │
                                  ▼
                  http://localhost:8080/v1/graphql


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 8: FRONTEND QUERIES DATA                                            │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
        ┌─────────────────────────────────────────────┐
        │ GraphQL Query Example:                      │
        ├─────────────────────────────────────────────┤
        │ query GetSecurity($address: String!) {      │
        │   securityMetric(id: $address) {            │
        │     totalScans                              │
        │     criticalIssues                          │
        │     averageRiskScore                        │
        │   }                                         │
        │   vulnerabilityEvents(                      │
        │     where: {contractAddress: $address}      │
        │   ) {                                       │
        │     vulnerabilityType                       │
        │     severity                                │
        │     remediationStatus                       │
        │   }                                         │
        │ }                                           │
        └─────────────────────────────────────────────┘
                                  │
                                  ▼
        ┌─────────────────────────────────────────────┐
        │ Response:                                   │
        ├─────────────────────────────────────────────┤
        │ {                                           │
        │   "securityMetric": {                       │
        │     "totalScans": 5,                        │
        │     "criticalIssues": 2,                    │
        │     "averageRiskScore": 45                  │
        │   },                                        │
        │   "vulnerabilityEvents": [                  │
        │     {                                       │
        │       "vulnerabilityType": "oracle-001",    │
        │       "severity": "CRITICAL",               │
        │       "remediationStatus": "OPEN"           │
        │     }                                       │
        │   ]                                         │
        │ }                                           │
        └─────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 9: DISPLAY DATA TO USERS                                            │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ DApp/Wallet      │  │ Security         │  │ Blockscout       │
│ Integration      │  │ Dashboard        │  │ Widget           │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ Before tx, show: │  │ Monitor all      │  │ Display security │
│                  │  │ deployed         │  │ badge on         │
│  This contract   │  │ contracts:       │  │ contract page    │
│ has 2 CRITICAL   │  │                  │  │                  │
│ vulnerabilities  │  │ Contract 1: 92/  │  │  Risk: 45/100    │
│                  │  │ 100              │  │ 2 Critical       │
│ [View Details]   │  │ Contract 2: 45/  │  │   3 High         │
│                  │  │ 100              │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘


═══════════════════════════════════════════════════════════════════════════
                           KEY COMPONENTS
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│ 1. Smart Contract (On-Chain)                                            │
│    • N3SecurityOracle - Emits events when vulnerabilities detected      │
│    • Lives on Ethereum/Polygon/etc.                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 2. Envio Indexer (Off-Chain Process)                                    │
│    • Listens to blockchain events via RPC                               │
│    • Runs custom TypeScript handlers                                    │
│    • Transforms blockchain data                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 3. PostgreSQL (Database)                                                │
│    • Stores indexed data                                                │
│    • Provides fast queries                                              │
│    • Persistent storage                                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 4. Hasura (GraphQL API)                                                 │
│    • Auto-generates GraphQL API from database schema                    │
│    • Provides real-time subscriptions                                   │
│    • Handles authentication & permissions                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 5. Frontend Applications                                                │
│    • DApps, wallets, dashboards                                         │
│    • Query GraphQL API                                                  │
│    • Display security info to users                                     │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                        DATA FLOW SUMMARY
═══════════════════════════════════════════════════════════════════════════

Blockchain Events  →  Envio Indexer  →  PostgreSQL  →  Hasura  →  Frontend
  (On-Chain)           (Processing)      (Storage)     (API)       (Display)

═══════════════════════════════════════════════════════════════════════════
```
