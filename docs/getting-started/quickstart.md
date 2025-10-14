# Getting Started with N3

## Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher (recommended) or npm
- **Hardhat** 3.x
- Basic understanding of smart contract development

## Installation

### Option 1: Quick Start (Recommended)

Install the Hardhat plugin in your existing project:

```bash
npm install --save-dev @n3/hardhat-plugin
# or
pnpm add -D @n3/hardhat-plugin
```

### Option 2: Full Monorepo Setup (For Contributors)

Clone the repository and set up the development environment:

```bash
git clone https://github.com/your-org/n3.git
cd n3

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Configuration

### 1. Add N3 to Hardhat Config

Create or modify `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("@n3/hardhat-plugin");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  
  // N3 Security Configuration
  n3: {
    // Path to your templates directory
    templates: "./n3-templates",
    
    // Severity levels to check
    severity: ["critical", "high", "medium"],
    
    // Fail build on critical issues
    failOnCritical: true,
    
    // Report format: 'json', 'html', 'markdown', or 'console'
    reportFormat: "console",
    
    // Enable auto-fix for simple issues
    autoFix: false,
    
    // Supported chains
    chains: ["ethereum", "polygon", "hedera"]
  }
};
```

### 2. Initialize N3 Templates

N3 comes with built-in security templates, but you can also create your own:

```bash
# Copy default templates to your project
npx hardhat n3:init

# This creates:
# ./n3-templates/
#   ├── smart-contract/
#   │   ├── reentrancy-001.yaml
#   │   ├── access-001.yaml
#   │   └── math-001.yaml
#   ├── defi/
#   │   ├── flash-loan-001.yaml
#   │   └── oracle-001.yaml
#   └── custom/
#       └── (your templates)
```

## Basic Usage

### Scan Your Contracts

```bash
# Scan all contracts
npx hardhat n3:scan

# Scan specific contract
npx hardhat n3:scan --contract contracts/MyToken.sol

# CI mode (exit code 1 on issues)
npx hardhat n3:scan --ci
```

**Example Output:**
```
🔍 N3 Security Scan Results

✅ MyToken.sol: 95/100 (LOW RISK)
⚠️  DeFiProtocol.sol: 72/100 (MEDIUM RISK)
❌ VulnerableBank.sol: 35/100 (CRITICAL RISK)

📊 Security Scan Summary

Severity | Count
---------|------
CRITICAL | 1
HIGH     | 2
MEDIUM   | 3
LOW      | 1

VulnerableBank.sol:
  ❌ Reentrancy Vulnerability Detection
     Detects potential reentrancy attacks where external calls are made...
     Fixes:
       • Add nonReentrant modifier from OpenZeppelin
       • Follow Checks-Effects-Interactions pattern
```

### Run Security Tests

N3 auto-generates Solidity security tests:

```bash
# Run generated security tests
npx hardhat n3:test

# Run specific test
npx hardhat test test/security/Reentrancy.t.sol
```

### Generate Comprehensive Audit

```bash
# Full audit with simulation
npx hardhat n3:audit

# Audit on specific network
npx hardhat n3:audit --network mainnet

# Generate HTML report
npx hardhat n3:audit --format html
```

### Monitor Deployed Contract

```bash
# Monitor contract for real-time threats
npx hardhat n3:monitor --address 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# With alerts
npx hardhat n3:monitor --address 0x... --webhook https://your-alerts.com
```

## Example: Scanning a Simple Contract

### 1. Create a Contract

```solidity
// contracts/SimpleBank.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleBank {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount);
        
        // Potential reentrancy vulnerability!
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        
        balances[msg.sender] -= amount;
    }
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
}
```

### 2. Scan the Contract

```bash
npx hardhat n3:scan --contract contracts/SimpleBank.sol
```

**Result:**
```
❌ SimpleBank.sol: 40/100 (HIGH RISK)

Issues Found:
  ❌ CRITICAL: Reentrancy Vulnerability
     Line 9-11: External call made before state update
     
     Remediation:
     1. Add ReentrancyGuard modifier
     2. Update state before external call
     
     Code Fix:
     ```solidity
     function withdraw(uint256 amount) external nonReentrant {
         require(balances[msg.sender] >= amount);
         balances[msg.sender] -= amount; // State change FIRST
         (bool success, ) = msg.sender.call{value: amount}("");
         require(success);
     }
     ```
```

### 3. Fix the Issue

```solidity
// contracts/SecureBank.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureBank is ReentrancyGuard {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount);
        
        // State change BEFORE external call (Checks-Effects-Interactions)
        balances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
    }
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
}
```

### 4. Verify the Fix

```bash
npx hardhat n3:scan --contract contracts/SecureBank.sol
```

**Result:**
```
✅ SecureBank.sol: 98/100 (LOW RISK)

All critical checks passed!
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/security.yml`:

```yaml
name: N3 Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run N3 Security Scan
        run: npx hardhat n3:scan --ci
      
      - name: Upload Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: reports/n3-*.json
```

## Next Steps

- [Writing Custom Templates](./templates/writing-templates.md)
- [API Reference](../api/README.md)
- [Integration Guides](../integrations/README.md)
- [Advanced Configuration](./advanced-config.md)
- [Best Practices](./best-practices.md)

## Troubleshooting

### Issue: Templates not found

**Solution:** Ensure templates directory exists and is correctly configured:
```bash
npx hardhat n3:init
```

### Issue: Scan fails on large contracts

**Solution:** Increase Node.js memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npx hardhat n3:scan
```

### Issue: False positives

**Solution:** Customize template thresholds in your `n3-templates/` directory.

## Support

- **Documentation:** [https://docs.n3.dev](https://docs.n3.dev)
- **Discord:** [discord.gg/n3security](https://discord.gg/n3security)
- **GitHub Issues:** [github.com/your-org/n3/issues](https://github.com/your-org/n3/issues)
