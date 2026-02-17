# Development Environment Setup Guide

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify installation: `npm --version` or `yarn --version`

## Windows-Specific Setup

If you're on Windows and encountered execution policy issues:

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Confirm with: `Y`

## Installing Dependencies

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```
   
   This will install:
   - Next.js 15
   - React 18
   - TypeScript
   - Tailwind CSS
   - Zustand (state management)
   - Recharts (data visualization)
   - Axios (HTTP client)
   - Framer Motion (animations)

## Running the Development Server

Start the development server with hot reloading:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Building for Production

To create a production build:
```bash
npm run build
```

To run the production build locally:
```bash
npm run start
```

## Project Structure Explanation

```
frontend/
├── app/                 # Next.js 15 app directory with file-based routing
├── components/          # Reusable React components
├── lib/                 # Utility functions, hooks, and services
├── workers/             # Web Workers for background processing
├── public/              # Static assets (images, fonts, etc.)
├── styles/              # Global styles and Tailwind configuration
└── types/               # TypeScript type definitions
```

## Development Workflow

1. **Component Development**
   - Create new components in the `components/` directory
   - Use TypeScript for type safety
   - Follow the existing component structure

2. **Page Creation**
   - Add new pages by creating directories in `app/`
   - Each directory should contain a `page.tsx` file
   - Use `use client` directive for client-side components

3. **State Management**
   - Use Zustand stores in `lib/store.ts`
   - Create new stores for different domains as needed
   - Persist important state using the `persist` middleware

4. **API Integration**
   - Extend the API client in `lib/api.ts`
   - Add new methods for backend service endpoints
   - Handle errors appropriately

5. **Styling**
   - Use Tailwind CSS classes for styling
   - Customize the theme in `tailwind.config.js`
   - Add global styles in `app/globals.css`

## Troubleshooting

### Common Issues

1. **Dependency Installation Failures**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`
   - Reinstall: `npm install`

2. **TypeScript Errors**
   - Ensure all props and state are properly typed
   - Check for missing type definitions
   - Run `npm run lint` to identify issues

3. **Build Errors**
   - Check for syntax errors
   - Verify all imports are correct
   - Ensure all dependencies are installed

### Performance Optimization

1. **Code Splitting**
   - Use dynamic imports for large components
   - Implement lazy loading for non-critical features

2. **Image Optimization**
   - Use Next.js Image component
   - Optimize image sizes and formats

3. **Bundle Analysis**
   - Run `npm run build` and check the output
   - Use tools like webpack-bundle-analyzer for detailed analysis

## Testing

While no test files were created in this implementation, the recommended testing approach includes:

1. **Unit Tests**
   - Use Jest and React Testing Library
   - Test components in isolation
   - Mock external dependencies

2. **Integration Tests**
   - Test API integrations
   - Verify state management flows

3. **End-to-End Tests**
   - Use Cypress or Playwright
   - Test critical user flows

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms
1. Build the application: `npm run build`
2. Serve the `.next` directory
3. Configure reverse proxy if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Write tests if applicable
5. Submit a pull request

## Support

For issues with the development environment:
1. Check the README.md and this guide
2. Verify all prerequisites are met
3. Consult the official documentation for each technology
4. Reach out to the development team