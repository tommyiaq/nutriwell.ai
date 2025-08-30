# Contributing to NutriWell.ai

Thank you for your interest in contributing to NutriWell.ai! We welcome contributions from the community and are excited to see what you'll bring to this project.

## 🤝 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/tommyiaq/nutrivell.ai.git
   cd nutrivell.ai
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

## 📝 Contribution Guidelines

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug Reports** - Help us identify and fix issues
- **💡 Feature Requests** - Suggest new functionality
- **📖 Documentation** - Improve our docs and comments
- **🔧 Code Contributions** - Submit bug fixes and features
- **🎨 Design Improvements** - Enhance UI/UX
- **🌐 Translations** - Add or improve language support

### Before Contributing

1. **Check existing issues** to avoid duplicates
2. **Open an issue** to discuss major changes
3. **Follow our coding standards** (see below)
4. **Test your changes** thoroughly

## 🔧 Development Guidelines

### Code Style

We use automated tools to maintain code quality:

- **ESLint** - Linting and code standards
- **Prettier** - Code formatting
- **TypeScript** - Type safety

Run these commands before submitting:
```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
npm run type-check    # Check TypeScript types
```

### Commit Messages

Use conventional commits for clear history:

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Maintenance tasks

Examples:
feat(chat): add nutrition calculator
fix(header): resolve mobile menu bug
docs(readme): update installation guide
```

### Code Standards

#### TypeScript
- Use strict TypeScript settings
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

#### React Components
- Use functional components with hooks
- Implement proper prop types/interfaces
- Add JSDoc comments for complex components
- Follow the single responsibility principle

#### CSS
- Use CSS variables for theming
- Follow BEM-like naming convention (`nv-component-element`)
- Write mobile-first responsive styles
- Avoid inline styles

#### Testing
- Write unit tests for utility functions
- Test components with user interactions
- Include edge cases and error scenarios
- Maintain good test coverage

## 📋 Pull Request Process

### Creating a Pull Request

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our guidelines

3. **Test thoroughly**:
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

### Pull Request Template

Please include:

- **Description** of changes made
- **Motivation** for the changes
- **Screenshots** for UI changes
- **Testing** steps performed
- **Related issues** (if any)

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing** by the community
4. **Approval** and merge by maintainers

## 🐛 Bug Reports

### Before Reporting

- Check if the bug already exists in issues
- Try to reproduce on the latest version
- Test on different browsers/devices if applicable

### Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96, Firefox 95]
- Version: [e.g., 1.0.0]

## Screenshots
If applicable, add screenshots
```

## 💡 Feature Requests

### Before Requesting

- Check if the feature already exists or is planned
- Consider if it fits the project's scope
- Think about potential implementation challenges

### Feature Request Template

```markdown
## Feature Description
Brief description of the feature

## Problem/Motivation
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other context or screenshots
```

## 🌐 Internationalization

### Adding New Languages

1. **Create translation file**: `messages/[locale].json`
2. **Copy from existing**: Use `en.json` as template
3. **Translate all keys**: Maintain the same structure
4. **Update configuration**: Add locale to `next.config.js`
5. **Test thoroughly**: Check UI layout and functionality

### Translation Guidelines

- **Maintain context**: Understand the UI context
- **Keep consistency**: Use consistent terminology
- **Consider length**: Some languages are longer/shorter
- **Test layout**: Ensure UI doesn't break with translations

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** - Contributors section
- **Release notes** - Feature/fix attributions
- **Social media** - Feature announcements
- **Hall of fame** - Top contributors page

## 📞 Getting Help

If you need help or have questions:

- **GitHub Issues** - For bugs and features
- **GitHub Discussions** - For general questions
- **Discord** - Real-time community chat
- **Email** - developers@nutriwell.ai

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to NutriWell.ai! 🙏**
