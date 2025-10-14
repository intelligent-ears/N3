#!/bin/bash

# N3 Security Scanner - Demo Script
# This script demonstrates the N3 security scanning capabilities

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print banner
echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███╗   ██╗██████╗                                      ║
║   ████╗  ██║╚════██╗                                     ║
║   ██╔██╗ ██║ █████╔╝                                     ║
║   ██║╚██╗██║ ╚═══██╗                                     ║
║   ██║ ╚████║██████╔╝                                     ║
║   ╚═╝  ╚═══╝╚═════╝                                      ║
║                                                           ║
║   N3 - Nuclei for Web3                                   ║
║   Template-Based Security Scanner                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${CYAN}🚀 N3 Security Scanner - Live Demo${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Show project structure
echo -e "${BLUE}📂 Step 1: Project Structure${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "N3 consists of multiple packages:"
echo ""
tree -L 2 packages 2>/dev/null || ls -la packages/
echo ""

read -p "Press Enter to continue..."
echo ""

# Step 2: Show templates
echo -e "${BLUE}📋 Step 2: Security Templates${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Currently loaded templates:"
echo ""
find packages/core/templates -name "*.yaml" -type f | while read file; do
    id=$(grep "^id:" "$file" | cut -d':' -f2 | xargs)
    name=$(grep "^name:" "$file" | cut -d':' -f2- | xargs)
    severity=$(grep "^severity:" "$file" | cut -d':' -f2 | xargs)
    
    case $severity in
        critical)
            color=$RED
            ;;
        high)
            color=$YELLOW
            ;;
        medium)
            color=$BLUE
            ;;
        *)
            color=$NC
            ;;
    esac
    
    echo -e "  ${color}●${NC} ${id}: ${name} (${severity})"
done
echo ""

read -p "Press Enter to continue..."
echo ""

# Step 3: Show vulnerable contract
echo -e "${BLUE}🔍 Step 3: Vulnerable Contract${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "VulnerableBank.sol - Intentionally vulnerable contract:"
echo ""
cat examples/vulnerable-contracts/VulnerableBank.sol | head -n 40
echo "... (truncated)"
echo ""

read -p "Press Enter to run scan..."
echo ""

# Step 4: Run the scan
echo -e "${BLUE}🔬 Step 4: Running Security Scan${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run the test scan
node test-scan.js

echo ""
echo -e "${GREEN}✅ Scan Complete!${NC}"
echo ""

# Step 5: Show secure contract comparison
echo -e "${BLUE}🛡️ Step 5: Secure Contract Comparison${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "SecureBank.sol - Properly secured version:"
echo ""
cat examples/vulnerable-contracts/SecureBank.sol | head -n 45
echo "... (truncated)"
echo ""
echo -e "${GREEN}Key security improvements:${NC}"
echo "  ✓ Uses ReentrancyGuard modifier"
echo "  ✓ Implements Ownable for access control"
echo "  ✓ Follows Checks-Effects-Interactions pattern"
echo "  ✓ Uses Solidity 0.8+ for overflow protection"
echo ""

read -p "Press Enter to continue..."
echo ""

# Step 6: Show usage examples
echo -e "${BLUE}💡 Step 6: Usage Examples${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${CYAN}A) Hardhat Plugin:${NC}"
echo ""
echo "  # Add to hardhat.config.js"
echo "  require('@n3/hardhat-plugin');"
echo ""
echo "  # Run scan"
echo "  npx hardhat n3:scan"
echo ""
echo -e "${CYAN}B) Node.js API:${NC}"
echo ""
echo "  const { SecurityEngine } = require('@n3/core');"
echo "  const engine = new SecurityEngine();"
echo "  await engine.initialize({ templatesDir: './templates' });"
echo "  const report = await engine.scan(contractCode);"
echo ""
echo -e "${CYAN}C) CI/CD Integration:${NC}"
echo ""
echo "  - name: Security Scan"
echo "    run: npx hardhat n3:scan --fail-on-critical"
echo ""

read -p "Press Enter to continue..."
echo ""

# Step 7: Summary
echo -e "${BLUE}📊 Step 7: Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ What N3 Provides:${NC}"
echo ""
echo "  🔍 Template-based vulnerability detection"
echo "  📊 Risk scoring algorithm"
echo "  🛠️  Hardhat integration"
echo "  🤖 AI-powered analysis (MCP)"
echo "  📈 Historical tracking (Envio)"
echo "  🎯 5+ security templates active"
echo ""
echo -e "${YELLOW}⏳ Coming Soon:${NC}"
echo ""
echo "  ⏳ Dashboard UI"
echo "  ⏳ Standalone CLI"
echo "  ⏳ More templates (20+)"
echo "  ⏳ Auto-fix capabilities"
echo ""
echo -e "${PURPLE}🏆 Built for ETHOnline 2025${NC}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Demo Complete! 🎉${NC}"
echo ""
echo "Next steps:"
echo "  1. Read QUICKSTART.md for usage guide"
echo "  2. Check STATUS.md for project status"
echo "  3. See ARCHITECTURE.md for technical details"
echo ""
echo "Happy Scanning! 🛡️"
echo ""
