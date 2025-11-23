# SalesIQ

An intelligent sales assistant powered by Google's Gemini AI, built with TypeScript and Node.js. SalesIQ helps sales teams automate workflows, analyze customer interactions, and generate actionable insights through natural language processing.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **AI-Powered Sales Insights**: Leverage Google's Gemini API to generate intelligent sales recommendations
- **Real-time Interaction Analysis**: Process and analyze customer interactions on-the-fly
- **Automated Workflow Automation**: Streamline repetitive sales tasks
- **Natural Language Interface**: Communicate with your sales assistant using plain English
- **Cloud Integration**: Seamlessly integrated with Google AI Studio for easy deployment and management
- **Type-Safe Development**: Built with TypeScript for better code reliability and developer experience

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript (93.7% of codebase)
- **Frontend**: HTML/CSS (6.3%)
- **AI Engine**: Google Gemini API
- **Deployment**: Google AI Studio
- **Build Tool**: Vite (assumed based on modern Node.js project structure)
- **Package Manager**: npm

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- A **Google Gemini API Key** (obtain from [Google AI Studio](https://ai.studio))

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MohammadAli-dev/salesiq.git
   cd salesiq
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment configuration**:
   Create a `.env.local` file in the project root directory (this file should not be committed to version control)

## Configuration

### Setting Up Your Gemini API Key

1. Go to [Google AI Studio](https://ai.studio) and sign in with your Google account
2. Create a new API key in the API section
3. Add the key to your `.env.local` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

**Important**: Never commit your API key to version control. The `.env.local` file should be added to `.gitignore`.

## Running Locally

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

3. **View in AI Studio** (optional):
   The app can also be accessed directly in Google AI Studio: [https://ai.studio/apps/drive/1XvFT556A1EdczkliFhda-25djYMoC3pT](https://ai.studio/apps/drive/1XvFT556A1EdczkliFhda-25djYMoC3pT)

### Available npm Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

## Deployment

### Deploying to Google AI Studio

The project is already configured to run on Google AI Studio. To deploy or update:

1. Ensure all changes are committed to your repository
2. Link your GitHub repository to AI Studio
3. AI Studio will automatically deploy on pushes to your main branch
4. Visit the AI Studio link provided above to access your deployed app

### Alternative Deployment Options

- **Vercel**: Compatible with Node.js projects - simply connect your GitHub repository
- **Netlify**: Use netlify-cli for easy deployment
- **Docker**: Create a Dockerfile for containerized deployment

## Project Structure

```
salesiq/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── services/            # API and Gemini integration
│   ├── utils/               # Utility functions
│   └── main.ts              # Application entry point
├── public/                  # Static assets
├── .env.local               # Local environment variables (not committed)
├── .gitignore               # Git ignore configuration
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration (if applicable)
└── README.md                # This file
```

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

**Example `.env.local`**:
```
GEMINI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

## Development

### Running Tests (if applicable)

```bash
npm test
```

### Building for Production

```bash
npm run build
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Recommended for code linting (not yet configured)
- **Prettier**: Recommended for code formatting (not yet configured)

Consider adding ESLint and Prettier for better code quality:

```bash
npm install --save-dev eslint prettier typescript-eslint
```

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: Run `npm install` to ensure all dependencies are installed.

### Issue: API key errors or 401 Unauthorized

**Solution**: Verify that your `GEMINI_API_KEY` is correctly set in `.env.local` and is valid. Check that the key hasn't expired in Google AI Studio.

### Issue: Port already in use

**Solution**: The development server will automatically use an available port. If you want to specify a port:

```bash
npm run dev -- --port 3000
```

### Issue: Changes not reflecting in browser

**Solution**: Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete) and refresh the page.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Your code follows TypeScript best practices
- Changes are well-documented
- New features include appropriate tests

## Best Practices

- **API Usage**: Monitor your Gemini API usage to avoid unexpected costs
- **Error Handling**: Implement proper error handling for API calls
- **Security**: Never commit sensitive information (API keys, tokens, etc.)
- **Performance**: Optimize API calls to reduce latency
- **Documentation**: Keep documentation updated with new features

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub Issues](https://github.com/MohammadAli-dev/salesiq/issues)
- Check existing issues for solutions
- Provide detailed information about your problem

## Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)

## License

This project is open source and available under the MIT License. See LICENSE file for details.

---

**Last Updated**: November 2025

For the latest updates and features, visit the [GitHub repository](https://github.com/MohammadAli-dev/salesiq).
