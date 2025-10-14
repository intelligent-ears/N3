interface PromptArgs {
  [key: string]: string | undefined;
}

export const securityPrompts: Record<string, (args: PromptArgs) => string> = {
  'comprehensive-security-audit': (args) => `
# Comprehensive Security Audit

Analyze the smart contract at address **${args.contract_address}** for security vulnerabilities:

## 1. Reentrancy Analysis
- Check all external calls in withdraw/claim/transfer functions
- Verify state changes occur before external calls
- Identify missing reentrancy guards
- Look for cross-function and cross-contract reentrancy

## 2. Access Control
- List all onlyOwner or restricted functions
- Check for proper role-based access control
- Identify functions that should be restricted but aren't
- Verify ownership transfer mechanisms

## 3. Token Approvals & Transfers
- Find all unlimited token approvals (approve(MAX_UINT256))
- Check for approval race conditions
- Identify dangerous approval patterns
- Verify transfer validation logic

## 4. Economic Attacks
- Check for flash loan vulnerabilities
- Analyze price oracle usage and manipulation risks
- Identify MEV opportunities and front-running risks
- Check for liquidity pool exploits

## 5. Upgrade Patterns
- Check if contract is upgradeable (proxy pattern)
- Verify upgrade authorization controls
- Check for storage collisions in upgrades
- Identify unprotected initializers

## 6. Historical Pattern Analysis
- Analyze past 1000 transactions
- Identify suspicious patterns or anomalies
- Flag unusual activity or attack attempts
- Check for repeated failed transactions

## 7. Gas & DoS Vulnerabilities
- Identify unbounded loops
- Check for block gas limit DoS
- Verify external call gas limits

## Output Format
Provide:
1. Overall risk score (0-100)
2. List of vulnerabilities by severity
3. Prioritized remediation recommendations
4. Code examples for fixes
5. Comparison to similar audited contracts
`,

  'real-time-monitoring': (args) => `
# Real-Time Threat Detection

Monitor address **${args.contract_address}** and alert on:

## 1. Suspicious Transactions
- Large withdrawals (>$100k USD equivalent)
- Unusual function calls not seen in normal operation
- Failed transactions (potential attack attempts)
- Transactions from known malicious addresses

## 2. Price & Liquidity Anomalies
- Price deviations >5% from oracle feeds
- Liquidity changes >20% in short timeframe
- Sandwich attack patterns detected
- Flash loan usage detected

## 3. Ownership & Access Changes
- Owner/admin transfers
- New role assignments or permission grants
- Proxy implementation upgrades
- Critical parameter changes

## 4. Token Movement Patterns
- Large approvals granted (>$50k)
- Token drains or unusual outflows
- Unusual transfer patterns
- Concentration of tokens to few addresses

## Alert Format
For each detection, provide:
- [SEVERITY] Event Type
- Detailed description
- Transaction hash
- Recommended action
- Risk assessment

Monitor continuously and alert in real-time.
`,

  'vulnerability-deep-dive': (args) => `
# Vulnerability Deep Dive: ${args.vulnerability_type?.toUpperCase()}

Analyze contract **${args.contract_address}** specifically for **${args.vulnerability_type}** vulnerabilities:

## Analysis Checklist

### If Reentrancy:
1. Map all external calls (CALL, DELEGATECALL, STATICCALL)
2. Check state changes before/after each external call
3. Identify missing ReentrancyGuard modifiers
4. Check for cross-function reentrancy
5. Analyze callback patterns
6. Test attack scenarios

### If Access Control:
1. List all privileged functions
2. Check modifier implementation
3. Verify role hierarchy
4. Test unauthorized access
5. Check for missing modifiers
6. Analyze ownership transfer logic

### If Oracle Manipulation:
1. Identify all price feed sources
2. Check for single point of failure
3. Verify price validation logic
3. Test TWAP implementation
4. Check for flash loan price manipulation
5. Analyze circuit breakers

### If Flash Loan:
1. Identify borrow/lend functions
2. Check for same-block protection
3. Verify fee calculations
4. Test flash loan attack vectors
5. Check collateralization requirements

### If Overflow/Underflow:
1. Check Solidity version
2. Verify SafeMath usage
3. Test boundary conditions
4. Check unchecked blocks
5. Analyze arithmetic operations

## Output
Provide:
1. Detailed vulnerability assessment
2. Proof of concept (if exploitable)
3. Impact analysis
4. Specific remediation steps
5. Code patches
`,

  'comparative-security': (args) => `
# Comparative Security Analysis

Compare the security posture of:
- **Contract A**: ${args.contract_a}
- **Contract B**: ${args.contract_b}

## Analysis Framework

### 1. Security Scores
Generate individual security scores (0-100) for each contract based on:
- Vulnerability count and severity
- Code quality metrics
- Best practices adherence
- Audit history

### 2. Vulnerability Comparison
Create side-by-side comparison:
| Vulnerability Type | Contract A | Contract B |
|-------------------|-----------|-----------|
| Reentrancy | Status | Status |
| Access Control | Status | Status |
| Oracle Issues | Status | Status |
| Flash Loan Risks | Status | Status |

### 3. Unique Vulnerabilities
List vulnerabilities unique to each contract

### 4. Architecture Comparison
- Upgrade mechanisms
- Access control patterns
- External dependencies
- Gas efficiency

### 5. Historical Analysis
- Deployment age
- Transaction volume
- Incident history
- Community trust signals

### 6. Recommendations
Provide specific recommendations for:
- Which contract is more secure
- What each can learn from the other
- Priority fixes for each
- Overall risk assessment

Present findings in a clear comparison table with actionable insights.
`,

  'exploit-detection': (args) => `
# Exploit Pattern Detection

Analyze recent transactions for contract **${args.contract_address}** (last ${args.tx_count || 100} transactions):

## Detection Patterns

### 1. Reentrancy Exploits
- Multiple calls to same function in single transaction
- Unexpected state changes
- Recursive call patterns

### 2. Flash Loan Attacks
- Large borrows and repays in same block
- Price manipulation sequences
- Liquidation cascades

### 3. Front-Running / MEV
- Similar transactions in same block
- Sandwich patterns
- Transaction reordering evidence

### 4. Access Control Exploits
- Unauthorized function calls
- Privilege escalation attempts
- Ownership takeover attempts

### 5. Oracle Manipulation
- Price updates correlated with large trades
- Unusual oracle call patterns
- Price deviation exploitation

### 6. Unusual Patterns
- Failed transaction clusters
- Gas price anomalies
- Timing-based attacks
- Cross-contract call sequences

## Output Format

For each detected exploit pattern:
1. Pattern Type: [Name]
2. Transaction Hash: [Hash]
3. Confidence Level: [High/Medium/Low]
4. Description: [What happened]
5. Impact: [Financial/Security]
6. Evidence: [Proof points]
7. Recommendation: [Action to take]

Flag any active exploitation attempts immediately.
`,
};
