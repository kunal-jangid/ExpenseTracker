import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const sandyLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#8D6E63', // A warm, sandy brown
    onPrimary: '#FFFFFF',
    primaryContainer: '#D7CCC8',
    onPrimaryContainer: '#3E2723',
    secondary: '#A1887F',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#EFEBE9',
    onSecondaryContainer: '#4E342E',
    tertiary: '#BCAAA4',
    onTertiary: '#000000',
    tertiaryContainer: '#F5F5F6',
    onTertiaryContainer: '#3E2723',
    background: '#FAF8F5', // Pale beige/sand background
    onBackground: '#3E2723',
    surface: '#F5F2EC',
    onSurface: '#3E2723',
    surfaceVariant: '#E7E0D8',
    onSurfaceVariant: '#5D4037',
    outline: '#BCAAA4',
    error: '#D32F2F',
    onError: '#FFFFFF',
    elevation: {
      level0: 'transparent',
      level1: '#F5EBDF',
      level2: '#F1E4D4',
      level3: '#EDDDC8',
      level4: '#ECDAAC',
      level5: '#EAD5BC',
    },
  }
};

export const neonYellowDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#CCFF00', // Vibrant Neon Yellow
    onPrimary: '#1A1A1A',
    primaryContainer: '#334D00',
    onPrimaryContainer: '#E6FF99',
    secondary: '#99CC00',
    onSecondary: '#000000',
    secondaryContainer: '#223300',
    onSecondaryContainer: '#CCFF66',
    tertiary: '#FFFFFF',
    onTertiary: '#000000',
    background: '#0D0D0D', // Deep black/charcoal
    onBackground: '#FFFFFF',
    surface: '#1A1A1A',
    onSurface: '#E6E6E6',
    surfaceVariant: '#2A2A2A',
    onSurfaceVariant: '#B3B3B3',
    outline: '#4D4D4D',
    error: '#FF3333',
    onError: '#FFFFFF',
    elevation: {
      level0: 'transparent',
      level1: '#1F1F1F',
      level2: '#242424',
      level3: '#292929',
      level4: '#2A2A2A',
      level5: '#2E2E2E',
    },
  }
};

export const matteDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#757575', // Flat mute grey
    onPrimary: '#000000',
    primaryContainer: '#424242',
    onPrimaryContainer: '#BDBDBD',
    secondary: '#616161',
    onSecondary: '#000000',
    secondaryContainer: '#303030',
    onSecondaryContainer: '#9E9E9E',
    tertiary: '#9E9E9E',
    onTertiary: '#000000',
    background: '#121212', // Stealthy dark grey
    onBackground: '#E0E0E0',
    surface: '#1E1E1E',
    onSurface: '#E0E0E0',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#9E9E9E',
    outline: '#616161',
    error: '#CF6679',
    onError: '#000000',
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1F',
      level2: '#222223',
      level3: '#242526',
      level4: '#272728',
      level5: '#2C2D2E',
    },
  }
};

export type ThemeType = 'sandyLight' | 'neonYellowDark' | 'matteDark';

export const getTheme = (type: ThemeType) => {
  switch (type) {
    case 'sandyLight':
      return sandyLightTheme;
    case 'neonYellowDark':
      return neonYellowDarkTheme;
    case 'matteDark':
      return matteDarkTheme;
    default:
      return sandyLightTheme;
  }
};
