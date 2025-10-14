#!/bin/bash

# N3 Bootstrap Script
# Sets up the development environment

set -e

echo "🛡️  N3 - Nuclei for Web3"
echo "========================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📋 Checking prerequisites..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. You have: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✅ pnpm version: $(pnpm -v)${NC}"

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🏗️  Building packages..."
pnpm build

echo ""
echo "🧪 Running tests..."
pnpm test

echo ""
echo -e "${GREEN}✅ N3 setup complete!${NC}"
echo ""
echo "📚 Next steps:"
echo "  1. Read the quickstart guide: ./docs/getting-started/quickstart.md"
echo "  2. Try scanning example contracts: cd examples/vulnerable-contracts && npx hardhat n3:scan"
echo "  3. Create your first template: ./docs/templates/writing-templates.md"
echo ""
echo "🚀 Happy hacking!"
