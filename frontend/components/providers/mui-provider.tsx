'use client';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { muiTheme } from '@/lib/mui-theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
