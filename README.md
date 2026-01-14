# LLM-Powered Mobile App Recommender Experimentation Dashboard – Frontend

This repository contains the frontend for the "LLM-Powered Mobile App Recommender Experimentation Dashboard" project. It provides a modern, responsive web interface for managing experiments, LLM configurations, and prompt templates using Next.js 16 with the App Router.

## Features
- **Experiment Management**: Create, view, and analyze LLM-powered recommendation experiments
- **LLM Configuration**: Manage multiple LLM models, configurations, and pre-configured combinations
- **Prompt Template Management**: Design and test prompt templates with feature-based ranking
- **Interactive Visualizations**: Real-time charts and heatmaps using ApexCharts
- **Modern UI/UX**: Built with Chakra UI v3 and a unified teal color palette
- **Type Safety**: Full TypeScript implementation
- **Data Fetching**: Efficient SWR-based data management with automatic revalidation
- **Responsive Design**: Mobile-first design with Tailwind CSS v4

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: Chakra UI v3
- **Styling**: Tailwind CSS v4
- **Charts**: ApexCharts / React-ApexCharts
- **Data Fetching**: SWR
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Theme**: next-themes for dark/light mode support

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm, yarn, pnpm, or bun package manager
- Backend API running at `http://127.0.0.1:8000/api/` (see [backend repository](../dashboard-experimentacio-backend))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dashboard-experimentacio-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

The application will automatically connect to the backend API at `http://127.0.0.1:8000/api/`.

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
dashboard-experimentacio-frontend/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── experiments/      # Experiment management pages
│   │   ├── llms/             # LLM management pages
│   │   ├── prompt-templates/ # Template management pages
│   │   └── help/             # Help/documentation page
│   ├── components/           # Reusable React components
│   │   ├── ui/               # Base UI components (Chakra wrappers)
│   │   ├── layout/           # Layout components (Navbar, etc.)
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── experiments/      # Experiment components
│   │   ├── llms/             # LLM management components
│   │   ├── configurations/   # Configuration components
│   │   ├── configured-models/# Configured model components
│   │   └── prompt-templates/ # Template components
│   ├── models/               # TypeScript interfaces/types
│   ├── providers/            # API and context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   └── theme/                # Chakra UI theme configuration
├── public/                   # Static assets
└── package.json              # Dependencies and scripts
```

## Key Features & Pages

### Dashboard Home (`/`)
- Quick action cards for common tasks
- Statistics overview
- Recent experiments summary
- Navigation to main sections

### Experiments (`/experiments`)
- **List View**: Browse all experiments with filtering and sorting
- **Create New**: Multi-step form to configure and execute experiments
- **Details View**: Comprehensive experiment results with:
  - Run statistics and metadata
  - Interactive heatmaps for ranking analysis
  - Mobile app recommendations comparison
  - Performance metrics and charts

### LLM Management (`/llms`)
- **Models**: Register and manage LLM providers (OpenAI, Anthropic, etc.)
- **Configurations**: Create configuration templates with parameters
- **Configured Models**: Pre-configured LLM combinations ready for experiments

### Prompt Templates (`/prompt-templates`)
- Create and manage system and user prompts
- Feature-based ranking criteria definition
- Template versioning and organization
- Preview and testing capabilities

### Help (`/help`)
- User guides
- Troubleshooting information

## Components Architecture

### Data Fetching Pattern
The application uses SWR (Stale-While-Revalidate) for efficient data management:

```typescript
// Example: useExperiments hook
const { data, error, isLoading, mutate } = useSWR<Experiment[]>(
  '/experiments/',
  api.get
);
```

Benefits:
- Automatic revalidation
- Built-in caching
- Optimistic UI updates
- Error handling

### API Client
Centralized API client (`src/providers/api.ts`) with:
- Error handling and user-friendly messages
- Automatic toast notifications
- Type-safe request/response handling
- Consistent error formatting

### UI Components
Built with Chakra UI v3:
- Consistent design system
- Accessible components
- Dark mode support
- Responsive breakpoints

## Styling & Theming

### Color Palette
The application uses a unified teal color palette:
- Primary: Teal (#008080)
- Accents: Shades from #b2d8d8 to #004c4c
- Dark mode support with automatic theme switching

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Optimized for tablets and desktop

## Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/
```

### API Connection
The default API URL is configured in `src/providers/api.ts`:
```typescript
const BASE_URL = 'http://127.0.0.1:8000/api/';
```

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error boundaries

### Component Guidelines
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper loading and error states
- Add TypeScript types for all props

### State Management
- Use SWR for server state
- React hooks for local state
- Chakra UI for theme state
- Avoid prop drilling (use context when needed)

## Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

The build process:
1. Compiles TypeScript
2. Optimizes images and fonts
3. Bundles and minifies code
4. Generates static pages where possible

## Deployment

### Vercel (Recommended)
The easiest way to deploy:

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel](https://vercel.com/new)
3. Configure environment variables
4. Deploy

### Other Platforms
The application can be deployed to any platform supporting Next.js:
- AWS Amplify
- Netlify
- Railway
- Self-hosted with Node.js

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure backend is running at `http://127.0.0.1:8000`
- Check CORS configuration in backend
- Verify network connectivity

**Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

**TypeScript Errors**
- Run `npm install` to ensure all type definitions are installed
- Check `tsconfig.json` configuration
- Clear TypeScript cache if needed

## Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Next.js App Router](https://nextjs.org/docs/app) - App Router documentation
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial

### Framework Documentation
- [Chakra UI v3](https://www.chakra-ui.com/) - Component library
- [SWR](https://swr.vercel.app/) - Data fetching
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Language documentation

## Contributing

When contributing to this repository:
1. Follow the existing code style
2. Write meaningful commit messages
3. Update documentation as needed
4. Test thoroughly before submitting
5. Ensure TypeScript compilation succeeds
6. Run linter before committing

## Related Repositories

- [Backend Repository](../dashboard-experimentacio-backend) - Django REST API backend
