# Development Guide

This guide will help you set up the development environment for Migration Database.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (latest version recommended)
- Git
- A code editor (VS Code recommended)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/migration-database.git
   cd migration-database
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Run the development server**
   ```bash
   bun run dev
   ```

## 🏗️ Project Structure

```
migration-database/
├── .github/                 # GitHub workflows and templates
│   ├── workflows/
│   │   └── ci.yml          # CI/CD pipeline
│   └── ISSUE_TEMPLATE/     # Issue and PR templates
├── exemples/               # Example configuration files
│   ├── 01.yaml
│   ├── 02.yaml
│   └── complete-example.yaml
├── src/                    # Source code (if you restructure)
├── index.ts               # Main entry point
├── types.ts               # TypeScript type definitions
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── bun.lock              # Bun lockfile
├── checkpoint.json        # Runtime checkpoint file
├── README.md             # Main documentation
├── CONTRIBUTING.md       # Contribution guidelines
├── CODE_OF_CONDUCT.md    # Code of conduct
├── CHANGELOG.md          # Version history
├── LICENSE               # MIT License
└── .gitignore           # Git ignore rules
```

## 🛠️ Development Commands

### Basic Commands

```bash
# Install dependencies
bun install

# Run the main script
bun start <config-file.yaml>

# Run with examples
bun run start:01
bun run start:02

# Development mode (watch for changes)
bun run dev

# Type checking
bun run tsc --noEmit

# Build for production
bun run compile
```

### Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test tests/specific-test.test.ts
```

### Building

```bash
# Build for current platform
bun run compile

# Build for Windows (from Linux/macOS)
bun run compile-windows

# Build for Linux (from any platform)
bun run compile-linux
```

## 🔧 Development Workflow

### 1. Feature Development

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Add tests if applicable
4. Run tests and type checking:
   ```bash
   bun test
   bun run tsc --noEmit
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. Push and create a Pull Request

### 2. Bug Fixes

1. Create a new branch from `main`:
   ```bash
   git checkout -b fix/issue-description
   ```

2. Fix the issue
3. Add tests to prevent regression
4. Test thoroughly
5. Commit and create PR

## 📝 Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Follow the existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### File Organization

- Keep related functionality together
- Use descriptive file names
- Follow the existing project structure
- Group related types in `types.ts`

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 🧪 Testing

### Writing Tests

Create test files with the `.test.ts` extension:

```typescript
import { describe, it, expect } from "bun:test";

describe("Migration Database", () => {
  it("should process migration correctly", () => {
    // Your test here
    expect(true).toBe(true);
  });
});
```

### Test Structure

- Unit tests for individual functions
- Integration tests for database operations
- Configuration validation tests
- Error handling tests

## 🐛 Debugging

### Debug Mode

Run with debug logging:

```bash
DEBUG=migration-database bun start config.yaml
```

### Common Issues

1. **Database Connection Issues**
   - Check database credentials
   - Ensure database is running
   - Verify network connectivity

2. **Type Conversion Errors**
   - Check data types in source database
   - Verify conversion configuration
   - Test with sample data

3. **Checkpoint Issues**
   - Delete `checkpoint.json` to start fresh
   - Check file permissions
   - Verify JSON format

## 📦 Building and Distribution

### Local Build

```bash
# Build for current platform
bun run compile

# Test the binary
./dbm --help
```

### Cross-Platform Builds

```bash
# Build for Windows (from Linux/macOS)
bun run compile-windows

# Build for Linux (from any platform)
bun run compile-linux
```

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Build binaries for all platforms
5. Create GitHub release with binaries

## 🔍 Code Review Process

### Before Submitting PR

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Type checking passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Commit messages are clear

### Review Checklist

- [ ] Code is readable and well-commented
- [ ] Logic is correct and efficient
- [ ] Error handling is appropriate
- [ ] Tests cover new functionality
- [ ] Documentation is updated

## 🚀 Performance Considerations

### Large Dataset Migration

- Use checkpointing for resumable migrations
- Consider batch processing for very large datasets
- Monitor memory usage
- Test with production-like data volumes

### Database Optimization

- Ensure proper indexing on source database
- Use appropriate connection pooling
- Consider read replicas for source data
- Monitor query performance

## 📚 Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## 🤝 Getting Help

- Check existing [Issues](https://github.com/your-username/migration-database/issues)
- Join [Discussions](https://github.com/your-username/migration-database/discussions)
- Create a new issue for bugs or feature requests

---

Happy coding! 🎉
