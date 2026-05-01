import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF', // M3 Primary (Light Violet)
      light: '#EADDFF',
      dark: '#381E72',
      contrastText: '#381E72',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#332D41',
      contrastText: '#332D41',
    },
    background: {
      default: '#09090B',
      paper: '#121214',
    },
    text: {
      primary: '#E6E1E5',
      secondary: '#938F99',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 900, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.02em' },
    overline: { fontWeight: 900, letterSpacing: '0.1em' },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #D0BCFF 0%, #B69DF8 100%)',
          color: '#381E72',
          '&:hover': {
            background: 'linear-gradient(135deg, #B69DF8 0%, #9F82F0 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
