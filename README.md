# NutriWell.ai 🥗🤖

> **Smart AI-powered nutrition assistant platform**

NutriWell.ai is a modern, responsive web application that provides personalized nutrition guidance powered by artificial intelligence. Built with Next.js, TypeScript, and internationalization support.

## ✨ Features

- 🧮 **Smart Nutrition Calculations** - BMR, TDEE, and personalized calorie targets
- 🤖 **AI-Powered Chat** - Interactive nutritional guidance and meal planning
- 🌍 **Multi-language Support** - English and Italian localization
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- ⚡ **Performance Optimized** - Fast loading and smooth animations
- 🔒 **Type-Safe** - Built with TypeScript for reliability
- ♿ **Accessible** - WCAG 2.1 compliant design

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v8.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tommyiaq/nutrivell.ai.git
   cd nutrivell.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
nutrivell.ai/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Site footer
│   │   └── LanguageSwitcher.tsx
│   ├── pages/               # Next.js pages
│   │   ├── _app.tsx         # App wrapper
│   │   ├── _document.tsx    # HTML document
│   │   ├── index.tsx        # Homepage
│   │   ├── chat.tsx         # AI chat interface
│   │   ├── pricing.tsx      # Pricing plans
│   │   ├── signin.tsx       # Sign in page
│   │   └── signup.tsx       # Sign up page
│   ├── styles/              # CSS styles
│   │   └── globals.css      # Global styles
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Core type definitions
│   └── utils/               # Utility functions
│       └── nutrition.ts     # Nutrition calculations
├── messages/                # Internationalization
│   ├── en.json             # English translations
│   └── it.json             # Italian translations
├── public/                  # Static assets
│   ├── images/             # Image assets
│   └── favicon.ico         # Site icon
├── middleware.ts           # Next.js middleware
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Check TypeScript types
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Code Quality

This project maintains high code quality through:

- **ESLint** - Code linting and best practices
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Strict mode** - Enhanced error checking

### Git Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

## 🌐 Internationalization

The app supports multiple languages through Next.js i18n:

- **English** (`en`) - Default language
- **Italian** (`it`) - Secondary language

### Adding New Languages

1. Create new translation file in `messages/[locale].json`
2. Update `next.config.js` to include new locale
3. Add language option to `LanguageSwitcher` component

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: CSS3 with CSS Variables
- **Internationalization**: next-intl
- **Development**: ESLint, Prettier
- **Deployment**: Vercel/GitHub Pages ready

### Key Design Decisions

- **Type Safety**: Full TypeScript implementation for reliability
- **Performance**: Optimized bundle size and lazy loading
- **Accessibility**: ARIA labels and semantic HTML
- **Responsive**: Mobile-first design approach
- **Maintainability**: Clear component structure and documentation

## 📊 Nutrition Calculations

The app uses scientifically-backed formulas:

- **BMR**: Mifflin-St Jeor Equation
- **TDEE**: BMR × Activity Level Multiplier
- **Macro Distribution**: 30% protein, 40% carbs, 30% fat
- **Calorie Adjustment**: ±20% for weight goals

## 🎨 Design System

### Color Palette

```css
--nv-primary: #0A4435     /* Primary green */
--nv-secondary: #2D6A4F   /* Secondary green */
--nv-accent: #52B788      /* Accent green */
--nv-bg: #EFF9F0          /* Background */
--nv-text: #222           /* Text color */
```

### Typography

- **Primary**: Segoe UI, Inter, Arial
- **Responsive**: Fluid typography scales
- **Accessibility**: High contrast ratios

## 🚀 Deployment

### GitHub Pages

1. Update `next.config.js` with your repository name
2. Run `npm run build && npm run export`
3. Deploy the `out/` folder to GitHub Pages

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push
3. Enjoy instant global CDN and optimizations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create your feature branch
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Make your changes
6. Run tests: `npm run lint && npm run type-check`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/tommyiaq/nutrivell.ai/issues)
- **Documentation**: [Wiki](https://github.com/tommyiaq/nutrivell.ai/wiki)
- **Email**: support@nutriwell.ai

## 🌟 Acknowledgments

- Next.js team for the amazing framework
- Contributors and beta testers
- Nutrition science community for guidance

---

**Made with ❤️ by the NutriWell Team**
```
npm run build
npm run export
```
This will generate the static files in the `out` directory.

### Deploy to GitHub Pages
# nutrivell.ai
1. **Create a New Repository**:
   Create a new repository on GitHub.

   ```
   git add out
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix out origin gh-pages
   ```

### Access Your Application

Your application should now be accessible at:
```
https://<username>.github.io/my-nextjs-app
``` 

## License

This project is licensed under the MIT License.