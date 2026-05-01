import { MD3DarkTheme } from 'react-native-paper';

export const materialTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF', // M3 Primary (Light Purple)
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    secondaryContainer: '#4A4458',
    onSecondaryContainer: '#E8DEF8',
    tertiary: '#EFB8C8',
    onTertiary: '#492532',
    tertiaryContainer: '#633B48',
    onTertiaryContainer: '#FFD8E4',
    background: '#1C1B1F', // Deep Obsidian
    surface: '#2B2930', // Elevated Surface
    surfaceVariant: '#49454F',
    outline: '#938F99',
  },
  roundness: 24, // Material 3 generous rounding
};
