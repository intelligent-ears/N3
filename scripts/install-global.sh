#!/bin/bash

# N3 Global Installation Script
# This script makes the n3 command available globally

set -e

echo "🛡️  N3 - Making the n3 command available globally"
echo "================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Method 1: Create symlink in ~/bin
echo -e "${YELLOW}Method 1: Creating symlink in ~/bin${NC}"
mkdir -p ~/bin
N3_PATH=$(pwd)
ln -sf "$N3_PATH/bin/n3" ~/bin/n3

# Add to PATH if not already there
if [[ ":$PATH:" != *":$HOME/bin:"* ]]; then
    echo 'export PATH="$PATH:$HOME/bin"' >> ~/.bashrc
    echo 'export PATH="$PATH:$HOME/bin"' >> ~/.zshrc
    echo -e "${GREEN}✅ Added ~/bin to PATH in .bashrc and .zshrc${NC}"
    echo -e "${YELLOW}Please run 'source ~/.bashrc' or 'source ~/.zshrc' to update your current session${NC}"
else
    echo -e "${GREEN}✅ ~/bin is already in PATH${NC}"
fi

echo ""
echo -e "${GREEN}✅ n3 command is now available globally via symlink${NC}"
echo -e "${YELLOW}You can now run 'n3 --help' from any directory${NC}"
echo ""
echo "Alternative method (requires sudo):"
echo "cd packages/cli && sudo npm link"
echo ""