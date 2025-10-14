# Contributing to N3

Thank you for your interest in contributing to N3! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- 🐛 **Report bugs** - Help us improve by reporting issues
- 💡 **Suggest features** - Share ideas for new functionality
- 📝 **Write templates** - Create security templates for the community
- 🔧 **Fix issues** - Submit pull requests for bug fixes
- 📚 **Improve docs** - Help make our documentation better
- 🧪 **Write tests** - Increase test coverage

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/intelligent-ears/N3.git
cd n3
```

### 2. Set Up Development Environment

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📝 Writing Security Templates

Security templates are the heart of N3. Here's how to create one:

### Template Structure

```yaml
id: template-id-001
name: Template Name
severity: critical|high|medium|low|info
category: smart-contract|defi|token|nft|upgrade|gas|cryptography
tags: [tag1, tag2, tag3]

description: |
  Detailed description of the vulnerability or security check.
  Explain what it detects and why it matters.

hardhat:
  test_file: test/security/YourTest.t.sol
  test_function: test_YourSecurityCheck
  auto_generate: true

detection:
  patterns:
    - name: pattern_name
      solidity: |
        Regular expression or Solidity pattern
      check: optional_check_function
      functions: [function1, function2]

risk_calculation:
  base_score: 0-100
  modifiers:
    has_protection: -50
    uses_library: -30

remediation:
  priority: 1-5
  fixes:
    - Fix description 1
    - Fix description 2
  code_example: |
    // Secure implementation example
    function secure() external { ... }

references:
  - https://reference-url-1
  - https://reference-url-2

examples:
  vulnerable_contracts:
    - Contract Name (Year)
```

### Template Guidelines

1. **Be Specific**: Clearly describe what the template detects
2. **Provide Context**: Explain why this vulnerability matters
3. **Include Examples**: Show vulnerable and secure code
4. **Add References**: Link to authoritative sources
5. **Test Thoroughly**: Ensure pattern matching works correctly

### Submitting a Template

1. Create your template in `packages/core/templates/[category]/`
2. Add tests in `packages/core/test/templates/`
3. Update template index if needed
4. Submit PR with description

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/core && pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Writing Tests

```typescript
// packages/core/test/engine.test.ts
import { describe, it, expect } from 'vitest';
import { SecurityEngine } from '../src/engine';

describe('SecurityEngine', () => {
  it('should detect reentrancy vulnerability', async () => {
    const engine = new SecurityEngine();
    await engine.initialize({
      templatesDir: './templates',
      severities: ['critical'],
    });

    const vulnerableCode = `
      function withdraw() external {
        payable(msg.sender).transfer(amount);
        balance[msg.sender] = 0;
      }
    `;

    const report = await engine.scan(vulnerableCode);
    
    expect(report.summary.critical).toBeGreaterThan(0);
    expect(report.overallRiskScore).toBeLessThan(50);
  });
});
```

## 📋 Code Style

We use ESLint and Prettier for code formatting:

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Fix linting issues
pnpm lint --fix
```

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types when possible
- Use Zod for runtime validation
- Document public APIs with JSDoc

## 🔄 Pull Request Process

### 1. Before Submitting

- [ ] Tests pass (`pnpm test`)
- [ ] Code is formatted (`pnpm format`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention

### 2. Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(core): add oracle manipulation detection template

fix(hardhat-plugin): resolve scan task crash on large contracts

docs(readme): update installation instructions
```

### 3. Submit PR

1. Push your branch to your fork
2. Open a PR against `main` branch
3. Fill out the PR template
4. Link related issues
5. Wait for review

### 4. Review Process

- Maintainers will review your PR
- Address feedback if requested
- Once approved, PR will be merged
- Your contribution will be in the next release!

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for contributor NFTs (coming soon)

## 📚 Resources

- [Project Structure](./docs/STRUCTURE.md)
- [API Documentation](./docs/api/README.md)
- [Template Guide](./docs/templates/writing-templates.md)
- [Security Best Practices](./docs/security/best-practices.md)

## 🤝 Community

- **Discord**: [discord.gg/n3security](https://discord.gg/n3security)
- **Twitter**: [@n3security](https://twitter.com/n3security)
- **GitHub Discussions**: [Discussions](https://github.com/your-org/n3/discussions)

## ❓ Questions?

- Check [FAQ](./docs/FAQ.md)
- Ask in [Discord](https://discord.gg/n3security)
- Open a [Discussion](https://github.com/your-org/n3/discussions)
- Email: contributors@n3.dev

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to N3! Together we're making Web3 more secure. 🛡️
