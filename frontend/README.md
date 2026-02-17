# Mental Health App Frontend

This is the frontend for the Mental Health App, built with Next.js 15, React 18, TypeScript, and Tailwind CSS.

## Features

- Server-Side Rendering (SSR) and Static Site Generation (SSG) for fast initial loads
- Responsive dashboard with mood tracking visualizations
- Mood trend line chart using Recharts
- Progress rings for goal tracking
- Emotion word cloud visualization
- State management with Zustand
- API integration with Axios

## Prerequisites

- Node.js v16 or higher
- npm or yarn

## Setup Instructions

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser to http://localhost:3000

## Project Structure

```
frontend/
├── app/                 # Next.js 15 app directory
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   └── dashboard/       # Dashboard components
├── lib/                 # Utility functions and services
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run lint` - Runs the linter

## Dependencies

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Recharts (data visualization)
- Axios (HTTP client)
- Framer Motion (animations)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.