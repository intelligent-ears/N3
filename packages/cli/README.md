# @n3/cli - Command Line Interface

N3 CLI is a Nuclei-inspired command-line security scanner for smart contracts.

## Quick Start

```bash
# Install globally
npm install -g @n3/cli

# Scan a contract
n3 MyToken.sol

# Scan with debug mode
n3 -d MyToken.sol

# Scan directory
n3 contracts/
```

## Features

- 🚀 **Fast scanning** - Analyze contracts in milliseconds
- 🎯 **Template-based** - Use YAML templates to define vulnerability patterns
- 🐛 **Debug mode** - Verbose logging with `-d` or `--debug` flag
- 📊 **Multiple outputs** - JSON, Markdown, HTML, or terminal
- 🎨 **Colored output** - Easy-to-read terminal formatting
- ⚙️ **Configurable** - Filter by severity, category, or specific templates
- 🔧 **CI/CD ready** - Fail builds on critical issues

## Installation

### From npm
```bash
npm install -g @n3/cli
```

### From source
```bash
git clone <repo-url>
cd n3/packages/cli
npm install
npm run build
npm link
```

## Basic Usage

### Scan Commands

```bash
# Scan single file
n3 contracts/MyToken.sol

# Scan directory
n3 contracts/

# With debug output
n3 -d contracts/MyToken.sol

# Filter by severity
n3 -s critical,high contracts/

# Use specific templates
n3 -t reentrancy-001,access-001 contracts/MyToken.sol
```

### Output Formats

```bash
# JSON output
n3 contracts/ -o report.json

# Markdown report
n3 contracts/ -o report.md

# HTML report
n3 contracts/ -o report.html
```

### CI/CD Integration

```bash
# Fail on critical issues
n3 contracts/ --fail-on-critical
```

## Command Reference

### Main Command
```
n3 [target] [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-t, --templates <templates>` | Templates to use (comma-separated) | all |
| `-s, --severity <severity>` | Filter by severity | `critical,high,medium` |
| `-c, --category <category>` | Filter by category | all |
| `-o, --output <file>` | Output file path | stdout |
| `-f, --format <format>` | Output format | `terminal` |
| `-d, --debug` | Enable debug mode | `false` |
| `-v, --verbose` | Enable verbose output | `false` |
| `--fail-on-critical` | Exit with error on critical | `false` |
| `--no-color` | Disable colored output | `false` |
| `--template-dir <dir>` | Custom template directory | default |
| `--list-templates` | List available templates | - |
| `--validate` | Validate templates only | - |
| `--stats` | Show scan statistics | `false` |

### Subcommands

```bash
# List templates
n3 templates

# List with verbose info
n3 templates -v

# Filter templates
n3 templates --severity critical

# Validate custom templates
n3 validate ./my-templates

# Update templates (coming soon)
n3 update
```

## Examples

### Example 1: Quick Scan
```bash
n3 MyToken.sol
```

### Example 2: Debug Mode
```bash
n3 -d VulnerableContract.sol
```

Output:
```
[DEBUG] Debug mode enabled
[DEBUG] Options: { ... }
[DEBUG] Loading templates from: /path/to/templates
[DEBUG] Found single Solidity file: VulnerableContract.sol
[DEBUG] File size: 2742 bytes
[DEBUG] Starting scan...
[DEBUG] Scan completed in 2ms
[DEBUG] Risk score: 87.35
```

### Example 3: CI/CD Usage
```bash
# In your CI pipeline
n3 contracts/ --fail-on-critical -o security-report.json
```

### Example 4: Custom Templates
```bash
n3 --template-dir ./my-templates contracts/
```

### Example 5: Specific Severity
```bash
# Only critical issues
n3 -s critical contracts/

# Critical and high
n3 -s critical,high contracts/
```

## Output Examples

### Terminal Output
```
╔═══════════════════════════════════════════════════════════╗
║   N3 - Nuclei for Web3                                   ║
║   Template-Based Security Scanner v0.1.0                 ║
╚═══════════════════════════════════════════════════════════╝

✔ Templates loaded
[*] Found 1 contract(s) to scan
✖ VulnerableBank.sol: Found 7 issue(s)

════════════════════════════════════════════════════════════
  SCAN RESULTS
════════════════════════════════════════════════════════════

📄 VulnerableBank.sol
   Risk Score: 87.35/10
   Duration: 2ms

  🔴 [CRITICAL] Price Oracle Manipulation (oracle-001)
     Category: defi
     Risk Score: 90.00/10
     Findings: 1
       1. Unknown: Check failed: no_time_weighted_average

════════════════════════════════════════════════════════════
  SUMMARY
════════════════════════════════════════════════════════════

┌─────────────┬───────┐
│ Severity    │ Count │
├─────────────┼───────┤
│ 🔴 Critical │ 2     │
│ 🟠 High     │ 2     │
│ 🟡 Medium   │ 0     │
│ 🟢 Low      │ 0     │
│ ℹ️  Info    │ 0     │
└─────────────┴───────┘

[✗] Found 4 total issue(s) including 2 CRITICAL
```

## Template System

Templates are YAML files that define vulnerability patterns:

```yaml
id: my-check-001
name: My Security Check
severity: high
category: smart-contract

detection:
  patterns:
    - name: vulnerable_pattern
      solidity: |
        myUnsafeFunction\(\)

risk_calculation:
  base_score: 80
  modifiers:
    has_guard: -60

remediation:
  priority: 1
  fixes:
    - Add proper validation
    - Use safe patterns
```

## Configuration

### Environment Variables

```bash
# Custom template directory
export N3_TEMPLATE_DIR=/path/to/templates

# Disable colors
export NO_COLOR=1
```

## Exit Codes

- `0` - Success (no issues or non-critical issues)
- `1` - Failure (critical issues with --fail-on-critical, or scan error)

## Comparison with Nuclei

N3 CLI is inspired by Nuclei's interface:

| Feature | Nuclei | N3 |
|---------|--------|-----|
| Template-based | ✅ | ✅ |
| YAML templates | ✅ | ✅ |
| Debug mode (`-d`) | ✅ | ✅ |
| Template selection (`-t`) | ✅ | ✅ |
| Severity filter (`-s`) | ✅ | ✅ |
| Output formats | ✅ | ✅ |
| Colored output | ✅ | ✅ |
| CI/CD friendly | ✅ | ✅ |
| Target | Web URLs | Smart Contracts |

## Development

```bash
# Clone repository
git clone <repo-url>
cd n3/packages/cli

# Install dependencies
npm install

# Build
npm run build

# Link globally
npm link

# Test
n3 ../../examples/vulnerable-contracts/VulnerableBank.sol
```

## Documentation

- 📖 [CLI Guide](./CLI_GUIDE.md) - Complete usage guide
- 🏗️ [Architecture](../../ARCHITECTURE.md) - System architecture
- 🚀 [Quickstart](../../QUICKSTART.md) - Getting started

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

MIT License
