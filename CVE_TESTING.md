# CVE Scanner Testing

## Test with Profanity CVE

This demonstrates detecting the Profanity weak cryptography vulnerability (CVE-2022-40769).

### Option 1: Test with provided vulnerable host

If you have a vulnerable host to test, run:

```bash
# Test CVE scanning
n3 cve https://your-vulnerable-host.com

# With debug mode
n3 cve https://your-vulnerable-host.com -d

# Filter by severity
n3 cve https://your-vulnerable-host.com -s critical,high

# Save results
n3 cve https://your-vulnerable-host.com -o cve-report.json
```

### Option 2: Create a local test server

Create a simple test server to demonstrate CVE detection:

1. Create a test file `/tmp/test-profanity-cve/README.md`:
```markdown
# Profanity Vanity Address Generator

Using profanity --leading 0x00 to generate vanity addresses.

Based on johguse/profanity implementation.
```

2. Start a simple HTTP server:
```bash
cd /tmp/test-profanity-cve
python3 -m http.server 8080
```

3. Test CVE scanner:
```bash
n3 cve http://localhost:8080
```

### Expected Output

```
🔍 CVE SCAN RESULTS

Target: https://vulnerable-host.com
Total Checks: 3
Vulnerabilities Found: 1

1. 🟠 Profanity weak cryptography [CVE-2022-40769]
   Severity: HIGH
   Matched Path: /README.md
   Description: Detects exposure of Profanity vanity address generator scripts...
   Reference: https://github.com/johguse/profanity

📊 Summary:
   🔴 Critical: 0
   🟠 High: 1
   🟡 Medium: 0
   🔵 Low: 0
   ℹ️  Info: 0
```

## Available CVE Templates

1. **CVE-2022-40769** - Profanity weak cryptography (HIGH)
   - Detects vulnerable vanity address generators
   
2. **CVE-2023-PRIVATE-KEY** - Exposed Private Keys (CRITICAL)
   - Detects exposed Ethereum private keys
   
3. **CVE-2023-ETHERSCAN** - Exposed Etherscan API Key (MEDIUM)
   - Detects exposed API keys

## Adding Custom CVE Templates

Create new templates in `packages/core/cve-templates/`:

```yaml
id: CVE-YYYY-XXXXX

info:
  name: Vulnerability Name
  author: your-name
  severity: high
  description: Description of the vulnerability
  reference:
    - https://cve.mitre.org/...
  tags: cve,tag1,tag2

requests:
  - method: GET
    path:
      - "{{BaseURL}}/path1"
      - "{{BaseURL}}/path2"

    matchers-condition: or
    matchers:
      - type: word
        part: body
        words:
          - "keyword1"
          - "keyword2"
        condition: or

      - type: dsl
        dsl:
          - "contains(body, 'pattern')"
```

## CLI Options

```
n3 cve <target>           Scan URL for known CVEs

Options:
  --templates <dir>       CVE templates directory
  --severity <sev>        Filter by severity (critical,high,medium,low,info)
  --tags <tags>           Filter by tags (comma-separated)
  --save <file>           Save results to file
  --format <format>       Output format (json, markdown, html, terminal)
  --debug                 Enable debug mode
```

## Integration Examples

### CI/CD Pipeline

```yaml
# .github/workflows/cve-scan.yml
name: CVE Scan

on: [push, pull_request]

jobs:
  cve-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install N3
        run: |
          cd packages/cli
          npm install
          npm link
      
      - name: Scan for CVEs
        run: |
          n3 cve https://your-deployment-url.com -o cve-report.json
      
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: cve-report
          path: cve-report.json
```

### Pre-deployment Check

```bash
#!/bin/bash
# pre-deploy-check.sh

echo "Running CVE scan..."
n3 cve https://staging.example.com -s critical,high

if [ $? -ne 0 ]; then
  echo "CVE scan failed! Aborting deployment."
  exit 1
fi

echo "CVE scan passed. Proceeding with deployment..."
```
