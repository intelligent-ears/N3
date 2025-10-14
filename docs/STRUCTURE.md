# N3 Project Structure

```
n3/
├── packages/                           # Monorepo packages
│   ├── core/                          # @n3/core - Core security engine
│   │   ├── src/
│   │   │   ├── index.ts              # Main exports
│   │   │   ├── types.ts              # TypeScript types and schemas
│   │   │   ├── parser.ts             # YAML template parser
│   │   │   ├── engine.ts             # Security scanning engine
│   │   │   └── risk-calculator.ts    # Risk scoring algorithm
│   │   ├── templates/                # Built-in security templates
│   │   │   ├── smart-contract/
│   │   │   │   ├── reentrancy-001.yaml
│   │   │   │   ├── access-001.yaml
│   │   │   │   └── math-001.yaml
│   │   │   └── defi/
│   │   │       ├── flash-loan-001.yaml
│   │   │       └── oracle-001.yaml
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── hardhat-plugin/                # @n3/hardhat-plugin
│   │   ├── src/
│   │   │   ├── index.ts              # Plugin entry point
│   │   │   ├── types.ts              # Hardhat config types
│   │   │   └── tasks/                # Hardhat tasks
│   │   │       ├── scan.ts           # n3:scan task
│   │   │       ├── test.ts           # n3:test task
│   │   │       ├── audit.ts          # n3:audit task
│   │   │       ├── monitor.ts        # n3:monitor task
│   │   │       ├── fix.ts            # n3:fix task
│   │   │       └── coverage.ts       # n3:coverage task
│   │   └── package.json
│   │
│   ├── mcp-server/                    # @n3/mcp-server - Blockscout MCP
│   │   ├── src/
│   │   │   ├── index.ts              # MCP server implementation
│   │   │   ├── prompts/
│   │   │   │   └── index.ts          # 5+ security analysis prompts
│   │   │   └── tools/
│   │   │       └── index.ts          # Blockscout API integration
│   │   └── package.json
│   │
│   ├── envio-indexer/                 # Envio HyperIndex
│   │   ├── config.yaml               # Indexer configuration
│   │   ├── schema.graphql            # GraphQL schema
│   │   ├── src/handlers/
│   │   │   └── security-events.ts    # Event handlers
│   │   └── package.json
│   │
│   ├── blockscout-widget/             # @n3/blockscout-widget
│   │   ├── src/
│   │   │   ├── components/           # React components
│   │   │   ├── hooks/                # Custom hooks
│   │   │   └── index.tsx
│   │   └── package.json
│   │
│   ├── dashboard/                     # @n3/dashboard - Next.js app
│   │   ├── src/
│   │   │   ├── app/                  # Next.js 14 app router
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   ├── cli/                          # @n3/cli - Standalone CLI
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── commands/
│   │   └── package.json
│   │
│   └── contracts/                    # Smart contracts
│       ├── src/
│       │   ├── SecurityOracle.sol
│       │   └── VulnerabilityRegistry.sol
│       ├── test/
│       ├── scripts/
│       └── hardhat.config.ts
│
├── examples/                          # Example projects
│   ├── vulnerable-contracts/
│   │   ├── VulnerableBank.sol        # Example vulnerable contract
│   │   └── SecureBank.sol            # Secure version
│   ├── basic-usage/
│   ├── defi-protocol/
│   └── ci-cd-integration/
│
├── docs/                             # Documentation
│   ├── getting-started/
│   │   ├── installation.md
│   │   └── quickstart.md
│   ├── templates/
│   │   ├── README.md
│   │   └── writing-templates.md
│   ├── api/
│   │   └── README.md
│   └── integrations/
│       ├── hardhat.md
│       ├── blockscout.md
│       ├── envio.md
│       └── hedera.md
│
├── scripts/
│   ├── bootstrap.sh                  # Setup script
│   ├── build-all.sh
│   └── test-all.sh
│
├── .github/
│   └── workflows/
│       └── security-scan.yml         # CI/CD workflow
│
├── package.json                      # Root package.json
├── pnpm-workspace.yaml              # pnpm workspace config
├── turbo.json                        # Turborepo config
├── tsconfig.json                     # Root TypeScript config
├── README.md                         # Main README
└── LICENSE                           # MIT License
```

## Key Files Explained

### Core Package (`@n3/core`)

**Purpose:** Template-based security scanning engine

**Key Files:**
- `types.ts` - Zod schemas for template validation
- `parser.ts` - YAML template parser
- `engine.ts` - Main scanning logic
- `risk-calculator.ts` - Risk scoring algorithm
- `templates/` - Built-in security templates

### Hardhat Plugin (`@n3/hardhat-plugin`)

**Purpose:** Hardhat 3 integration for development-time scanning

**Key Tasks:**
- `n3:scan` - Scan contracts for vulnerabilities
- `n3:test` - Run generated security tests
- `n3:audit` - Comprehensive audit with simulation
- `n3:monitor` - Real-time contract monitoring
- `n3:fix` - Auto-fix common issues
- `n3:coverage` - Security coverage report

### MCP Server (`@n3/mcp-server`)

**Purpose:** Blockscout MCP integration for AI-powered analysis

**Features:**
- 5+ comprehensive security prompts
- Blockscout API integration
- Contract analysis tools
- Transaction pattern detection

### Envio Indexer

**Purpose:** Historical vulnerability tracking and analytics

**Components:**
- GraphQL schema for security data
- Event handlers for vulnerability tracking
- Security metrics aggregation

## Getting Started

1. **Clone and Setup:**
   ```bash
   git clone https://github.com/your-org/n3.git
   cd n3
   ./scripts/bootstrap.sh
   ```

2. **Build Packages:**
   ```bash
   pnpm build
   ```

3. **Run Tests:**
   ```bash
   pnpm test
   ```

4. **Use in Your Project:**
   ```bash
   npm install --save-dev @n3/hardhat-plugin
   ```

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Development Phase                   │
│  ┌────────────────────────────────────┐    │
│  │   Hardhat Plugin                   │    │
│  │   • Pre-deployment scanning        │    │
│  │   • Auto-generated tests           │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Template Engine (Core)              │
│  ┌────────────────────────────────────┐    │
│  │   YAML-Based Templates             │    │
│  │   • Pattern matching               │    │
│  │   • Risk scoring                   │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Data & Analysis Layer               │
│  ┌────────────────────────────────────┐    │
│  │   • Blockscout MCP (AI analysis)   │    │
│  │   • Envio (historical data)        │    │
│  │   • Pyth/Chainlink (oracle data)   │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Output & Monitoring                 │
│  • CLI Reports                              │
│  • Dashboard Analytics                      │
│  • Blockscout Widget                        │
│  • Real-time Alerts                         │
└─────────────────────────────────────────────┘
```

## Technology Stack

- **Language:** TypeScript 5.0+
- **Build:** Turborepo + tsup
- **Package Manager:** pnpm
- **Smart Contracts:** Solidity 0.8.20+
- **Framework:** Hardhat 3
- **Frontend:** Next.js 14 + React
- **Styling:** TailwindCSS + shadcn/ui
- **Data:** Envio HyperIndex + GraphQL
- **AI:** Blockscout MCP
- **Testing:** Vitest + Hardhat Tests

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

## License

MIT - See [LICENSE](../LICENSE)
