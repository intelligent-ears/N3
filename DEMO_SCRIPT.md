# N3 Security Scanner - Live Demo Script
**Backup Commands for 60-Second Demo Sequence**

---

## 🚀 PRE-DEMO SETUP (Do this 10 minutes before pitch!)

### Terminal 1: Start Hardhat Node
```bash
cd /home/kali/Documents/N3
npx hardhat node
```
**Expected output:** "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"
**Leave running in background**

---

### Terminal 2: Start MCP Server
```bash
cd /home/kali/Documents/N3
node mcp-blockscout-server.mjs > /tmp/mcp-blockscout.log 2>&1 &
```
**Verify it's running:**
```bash
curl -s http://localhost:3000/ | jq -r '.status'
```
**Expected output:** `running`

---

### Terminal 3: Start Hasura (Envio)
```bash
cd /home/kali/Documents/N3
docker-compose -f packages/envio-indexer/generated/docker-compose.yaml up -d
```
**Verify it's running:**
```bash
curl -s http://localhost:8080/healthz
```
**Expected output:** `OK`

---

### Browser Tabs Setup
Open 4 tabs in this order:
1. **Tab 1:** http://localhost:3000/ (MCP Health Check)
2. **Tab 2:** http://localhost:3000/api/analyze (Will POST here)
3. **Tab 3:** http://localhost:8080/console (Hasura GraphQL)
4. **Tab 4:** https://github.com/intelligent-ears/N3 (GitHub repo - backup)

---

## 📺 DEMO SEQUENCE (60 seconds)

---

## DEMO 1: HARDHAT COMPILATION (20 seconds)

### Terminal Command:
```bash
cd /home/kali/Documents/N3
npx hardhat compile
```

### What to Say While Running:
*"Watch what happens when we compile a smart contract with N3 integrated..."*

### Expected Output:
```
Compiled 1 Solidity file successfully (evm target: shanghai).

🛡️  N3 Security Scan Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contract: N3SecurityOracle
Risk Score: 92/100 ✅ LOW RISK

📊 Vulnerabilities Found: 0

✅ Security checks passed:
   • No reentrancy vulnerabilities
   • Access controls implemented
   • No integer overflow risks
   • Gas optimization patterns followed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Point Out:
- ✅ "Security scan runs **automatically during compilation**"
- ✅ "Developers see vulnerabilities **before deployment**"
- ✅ "Risk score of 92/100 - this contract is safe to deploy"

### Backup (if compile hangs):
Show pre-compiled screenshot from `/home/kali/Documents/N3/examples/`

---

## DEMO 2: BLOCKSCOUT WIDGET (20 seconds)

### Browser Action:
Navigate to: http://localhost:3000/

### What to Say:
*"Now let's see how this looks on Blockscout when users explore contracts..."*

### Terminal Command (to trigger analysis):
```bash
curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7"}' \
  | jq '{
      contractName: .blockscout.contractName,
      verified: .blockscout.verified,
      compiler: .blockscout.compiler,
      transactionCount: .transactions.total
    }'
```

### Expected Output:
```json
{
  "contractName": "TetherToken",
  "verified": true,
  "compiler": "v0.4.18+commit.9cf6e910",
  "transactionCount": 10
}
```

### Point Out:
- ✅ "This is the **USDT contract on Ethereum mainnet**"
- ✅ "N3 fetches verification data from Blockscout API"
- ✅ "Users see security scores **directly on the block explorer**"

### Show Widget Example:
Open: `/home/kali/Documents/N3/examples/blockscout-widget-demo.html` in browser
*"Imagine this widget embedded on every Blockscout contract page"*

---

## DEMO 3: ENVIO REAL-TIME MONITORING (20 seconds)

### Browser Action:
Navigate to: http://localhost:8080/console

### GraphQL Query (copy-paste ready):
```graphql
query GetCriticalVulnerabilities {
  VulnerabilityEvent(
    where: {severity: {_eq: "CRITICAL"}}
    order_by: {detectedAt: desc}
    limit: 5
  ) {
    id
    contractAddress
    vulnerabilityType
    severity
    detectedAt
    blockNumber
  }
}

query GetSecurityMetrics {
  SecurityMetric(
    order_by: {criticalCount: desc}
    limit: 5
  ) {
    id
    totalScans
    criticalCount
    highCount
    mediumCount
    lowCount
  }
}

query GetRecentScans {
  SecurityScan(
    order_by: {timestamp: desc}
    limit: 5
  ) {
    id
    contractAddress
    riskScore
    timestamp
  }
}
```

### What to Say:
*"With Envio, we can query security events in real-time using GraphQL..."*

### Click "Play" Button in Hasura Console

### Expected Output:
```json
{
  "data": {
    "VulnerabilityEvent": [],
    "SecurityMetric": [],
    "SecurityScan": []
  }
}
```
*(Will be empty until contracts emit events - that's okay!)*

### Point Out:
- ✅ "This is a **live GraphQL API** powered by Envio"
- ✅ "Security researchers can build **analytics dashboards**"
- ✅ "Imagine monitoring **thousands of contracts** for attack patterns"

### Alternative (if Hasura isn't running):
Show schema file:
```bash
cat /home/kali/Documents/N3/packages/envio-indexer/schema.graphql
```
*"Here's our data model - VulnerabilityEvent, SecurityScan, SecurityMetric"*

---

## 🎥 BACKUP: VIDEO DEMO (if live demo fails)

### Location:
`/home/kali/Documents/N3/demo-video.mp4` *(create this beforehand!)*

### How to Record:
```bash
# Record terminal session
asciinema rec demo-video.json

# Run all 3 demos
npx hardhat compile
curl -X POST http://localhost:3000/api/analyze ...
# Show Hasura GraphQL

# Stop recording
exit

# Convert to MP4 (if needed)
```

### What to Say:
*"Let me show you a pre-recorded version to save time..."*

---

## 📊 SLIDES TO SHOW ALONGSIDE DEMO

### During Hardhat Demo (20s):
**Slide: "Hardhat Integration"**
- Screenshot of terminal output
- Highlighted: Risk score, vulnerability count
- Caption: "Security at Compilation Time"

### During Blockscout Demo (20s):
**Slide: "Blockscout Widget"**
- Mock contract page with N3 widget
- Security badge (CRITICAL/HIGH/MEDIUM/LOW)
- Caption: "Security-Aware Block Explorer"

### During Envio Demo (20s):
**Slide: "Envio Real-Time Monitoring"**
- GraphQL query screenshot
- Analytics dashboard mockup
- Caption: "24/7 Vulnerability Detection"

---

## 🚨 TROUBLESHOOTING (Quick fixes during pitch)

### Problem: Hardhat compile hangs
**Fix:**
```bash
pkill -9 -f "hardhat node"
npx hardhat compile --force
```
**Say:** *"Let me force a fresh compilation..."*

---

### Problem: MCP server not responding
**Fix:**
```bash
curl -s http://localhost:3000/ || echo "Restarting..."
pkill -9 -f "mcp-blockscout"
node mcp-blockscout-server.mjs &
sleep 2
curl -s http://localhost:3000/
```
**Say:** *"Network hiccup - restarting the server..."*

---

### Problem: Hasura not accessible
**Fix:**
Show the schema file instead:
```bash
cat /home/kali/Documents/N3/packages/envio-indexer/schema.graphql
```
**Say:** *"Here's our data model - in production, this would be a live GraphQL API"*

---

### Problem: Internet down (can't reach Blockscout API)
**Fix:**
Use local contract instead of USDT:
```bash
curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3"}' \
  | jq .
```
**Say:** *"Here's our locally deployed N3SecurityOracle contract"*

---

## 📸 SCREENSHOT BACKUPS (Take these before pitch!)

### 1. Hardhat Compile Success
```bash
npx hardhat compile > /tmp/hardhat-output.txt 2>&1
cat /tmp/hardhat-output.txt
# Screenshot this
```

### 2. MCP Server Response
```bash
curl -s http://localhost:3000/ | jq . > /tmp/mcp-health.json
cat /tmp/mcp-health.json
# Screenshot this
```

### 3. Blockscout Analysis
```bash
curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7"}' \
  | jq . > /tmp/blockscout-analysis.json
cat /tmp/blockscout-analysis.json
# Screenshot this
```

### 4. Hasura GraphQL Interface
Open http://localhost:8080/console and screenshot the UI

---

## 🎬 DEMO NARRATIVE (Exact words to say)

### Hardhat (20s):
*"Let me show you how N3 integrates into the developer workflow. When I compile this smart contract with Hardhat...*

[Run compile command]

*...N3 automatically scans for vulnerabilities. See? Risk score 92 out of 100 - low risk. Zero vulnerabilities found. This happens **before** the developer deploys to the blockchain, preventing vulnerable contracts from ever going live."*

---

### Blockscout (20s):
*"Now, imagine a user exploring contracts on Blockscout. With N3 integrated...*

[Show API call or widget]

*...they instantly see security scores. This is the USDT token contract - verified, compiler version shown, transaction history. N3 adds a security layer to Blockscout, making it the first **security-aware block explorer**."*

---

### Envio (20s):
*"Finally, with Envio, we enable real-time security monitoring. Here's our GraphQL API...*

[Show Hasura or schema]

*...where security researchers can query vulnerability events, track attack patterns, and build analytics dashboards. This is the first time you can index **security events** alongside blockchain data."*

---

## ⏱️ TIMING CHECKPOINTS

- **0:00** - Start Hardhat demo
- **0:20** - Finish Hardhat, switch to Blockscout
- **0:40** - Finish Blockscout, switch to Envio
- **1:00** - Finish Envio, return to slides

**Practice until you can do this in 55 seconds!** (Leaves 5s buffer)

---

## 🎤 TRANSITIONS BETWEEN DEMOS

**Hardhat → Blockscout:**
*"That's compilation-time scanning. But what about **deployed** contracts?"*

**Blockscout → Envio:**
*"Static analysis is great, but what about **continuous monitoring**?"*

**Envio → Closing:**
*"This is the power of N3 - **one security engine, three critical touchpoints** in the Web3 developer and user journey."*

---

## ✅ PRE-DEMO FINAL CHECK (2 minutes before pitch)

Run this verification script:
```bash
#!/bin/bash

echo "🔍 N3 Demo Verification"
echo "======================="

# Check Hardhat
echo -n "Hardhat node: "
curl -s -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  && echo "✅" || echo "❌"

# Check MCP
echo -n "MCP server: "
curl -s http://localhost:3000/ > /dev/null && echo "✅" || echo "❌"

# Check Hasura
echo -n "Hasura GraphQL: "
curl -s http://localhost:8080/healthz > /dev/null && echo "✅" || echo "❌"

# Check Hardhat compile
echo -n "Hardhat compile: "
cd /home/kali/Documents/N3 && npx hardhat compile --force > /dev/null 2>&1 && echo "✅" || echo "❌"

echo "======================="
echo "Demo ready! 🚀"
```

**All checks must show ✅ before you start!**

---

## 🎯 DEMO SUCCESS CRITERIA

**You nailed the demo if:**
- ✅ All 3 platforms shown in under 60 seconds
- ✅ No errors or hanging commands
- ✅ Smooth transitions between demos
- ✅ Audience sees actual working code (not slides)
- ✅ At least one "wow" reaction during demo

---

**DEMO TIPS:**

1. **Speak while it runs** - Don't wait in silence for commands to execute
2. **Point to the screen** - Guide the audience's eyes
3. **Use "See?" and "Notice"** - Make them active observers
4. **Have fun!** - Your enthusiasm is contagious

---

**YOU'RE READY! 🎬**

*The demo is your secret weapon. Practice it until it's muscle memory, then deliver it with confidence.*
