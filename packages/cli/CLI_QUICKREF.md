# N3 CLI - Quick Reference

## Installation
```bash
cd packages/cli && npm link
```

## Basic Commands

```bash
# Scan single file
n3 MyToken.sol

# Scan with debug
n3 -d MyToken.sol

# Scan directory
n3 contracts/

# Show help
n3 --help

# Show version
n3 --version
```

## Template Selection

```bash
# Specific templates
n3 -t reentrancy-001,access-001 MyToken.sol

# List all templates
n3 --list-templates
n3 templates
```

## Filtering

```bash
# By severity
n3 -s critical,high contracts/

# By category  
n3 -c defi contracts/

# Combined
n3 -s critical -c defi contracts/
```

## Output Formats

```bash
# JSON
n3 contracts/ -o report.json

# Markdown
n3 contracts/ -o report.md

# HTML
n3 contracts/ -o report.html
```

## Debug & Verbose

```bash
# Debug mode (detailed logging)
n3 -d MyToken.sol

# Verbose mode
n3 -v MyToken.sol

# No colors
n3 --no-color MyToken.sol
```

## CI/CD

```bash
# Fail on critical issues
n3 contracts/ --fail-on-critical

# With JSON output
n3 contracts/ --fail-on-critical -o report.json

# Show statistics
n3 contracts/ --stats
```

## Template Management

```bash
# List templates
n3 templates

# List with details
n3 templates -v

# Filter by severity
n3 templates --severity critical

# Filter by category
n3 templates --category defi

# Validate custom templates
n3 validate ./my-templates

# Use custom template directory
n3 --template-dir ./my-templates contracts/
```

## Common Patterns

### Development
```bash
n3 -d -v contracts/
```

### Pre-commit
```bash
n3 contracts/ --fail-on-critical
```

### Full Audit
```bash
n3 contracts/ -o full-audit.html --stats
```

### Quick Check
```bash
n3 -s critical contracts/
```

### DeFi Specific
```bash
n3 -c defi contracts/
```

## Flags Reference

| Short | Long | Description |
|-------|------|-------------|
| `-t` | `--templates` | Select specific templates |
| `-s` | `--severity` | Filter by severity |
| `-c` | `--category` | Filter by category |
| `-o` | `--output` | Output file path |
| `-f` | `--format` | Output format |
| `-d` | `--debug` | Enable debug mode |
| `-v` | `--verbose` | Enable verbose |
| | `--fail-on-critical` | Exit 1 on critical |
| | `--no-color` | Disable colors |
| | `--stats` | Show statistics |
| `-V` | `--version` | Show version |
| `-h` | `--help` | Show help |

## Exit Codes

- `0` - Success
- `1` - Critical issues (with --fail-on-critical) or error

## Examples

### Example 1: Quick Scan
```bash
$ n3 MyToken.sol
✔ MyToken.sol: No issues found
```

### Example 2: Debug Output
```bash
$ n3 -d MyToken.sol
[DEBUG] Loading templates...
[DEBUG] File size: 1234 bytes
[DEBUG] Scan completed in 3ms
```

### Example 3: CI Pipeline
```bash
$ n3 contracts/ --fail-on-critical -o report.json
[✗] Found 2 CRITICAL issues
$ echo $?
1
```

### Example 4: Generate Report
```bash
$ n3 contracts/ -o security-audit.html
[✓] Results saved to security-audit.html
$ open security-audit.html
```

## Environment Variables

```bash
# Custom template directory
export N3_TEMPLATE_DIR=/path/to/templates

# Disable colors
export NO_COLOR=1
```

## Tips

1. **Use debug mode** for troubleshooting: `n3 -d`
2. **Combine filters** for focused scans: `n3 -s critical -c defi`
3. **Generate reports** for documentation: `n3 -o report.html`
4. **Use --fail-on-critical** in CI/CD pipelines
5. **Test templates** before using: `n3 validate ./templates`

## More Info

- 📖 Full Guide: `packages/cli/CLI_GUIDE.md`
- 📚 Package README: `packages/cli/README.md`
- 🏗️ Architecture: `ARCHITECTURE.md`
