# Contributing to Migration Database

Thank you for your interest in contributing to Migration Database! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. Check if the issue already exists in the [Issues](https://github.com/your-username/migration-database/issues) page
2. If not, create a new issue with:
   - Clear and descriptive title
   - Detailed description of the problem
   - Steps to reproduce (if applicable)
   - Expected vs actual behavior
   - Environment information (OS, Bun version, etc.)
   - Configuration file (with sensitive data removed)

### Suggesting Enhancements

1. Check if the enhancement is already suggested
2. Create a new issue with the "enhancement" label
3. Provide:
   - Clear description of the proposed feature
   - Use cases and benefits
   - Possible implementation approach (if you have ideas)

### Code Contributions

1. Fork the repository
2. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Add tests if applicable
5. Ensure code follows the project's style guidelines
6. Commit your changes with a clear message
7. Push to your fork
8. Create a Pull Request

## 📝 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### File Organization

- Keep related functionality together
- Use descriptive file names
- Follow the existing project structure

### Git Commit Messages

Use clear and descriptive commit messages:

```
feat: add support for MongoDB adapter
fix: resolve checkpoint file corruption issue
docs: update configuration examples
refactor: improve error handling in migration process
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

### Writing Tests

- Write tests for new features
- Ensure existing tests still pass
- Test edge cases and error conditions
- Use descriptive test names

## 📋 Pull Request Process

1. **Fork and Branch**: Fork the repository and create a feature branch
2. **Code Quality**: Ensure your code follows the style guidelines
3. **Tests**: Add or update tests as needed
4. **Documentation**: Update documentation if necessary
5. **Commit**: Use clear commit messages
6. **Pull Request**: Create a PR with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (if UI changes)
   - Testing instructions

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**:
   - Operating System
   - Bun version
   - Node.js version (if applicable)

2. **Configuration**:
   - Your YAML configuration (with sensitive data removed)
   - Database versions (source and target)

3. **Error Details**:
   - Complete error message
   - Stack trace
   - Steps to reproduce

4. **Additional Context**:
   - Expected behavior
   - Actual behavior
   - Any workarounds you've found

## 🚀 Feature Requests

When suggesting features:

1. **Problem**: Clearly describe the problem you're trying to solve
2. **Solution**: Describe your proposed solution
3. **Alternatives**: Mention any alternatives you've considered
4. **Additional Context**: Any other relevant information

## 📚 Documentation

- Update README.md for user-facing changes
- Update code comments for complex logic
- Add examples for new features
- Keep the documentation up-to-date

## 🏷️ Labels

We use labels to categorize issues and PRs:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 📞 Getting Help

- Check existing [Issues](https://github.com/your-username/migration-database/issues)
- Check [Discussions](https://github.com/your-username/migration-database/discussions)
- Create a new issue if you can't find what you're looking for

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Migration Database! 🎉
