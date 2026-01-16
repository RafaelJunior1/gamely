import { createContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto');

  const mode = themeMode === 'auto' ? systemScheme : themeMode;

  const colors = mode === 'dark'
    ? {
        background: '#0F0F1A',
        cardBg: '#1e1e2f',
        textPrimary: '#fff',
        textSecondary: '#aaa',
        buttonBg: '#7C4DFF',
        tabBarBg: '#0F0F1A',
        tabBarBorder: '#222',
        tabBarActive: '#7C4DFF',
        tabBarInactive: '#aaa',
      }
    : {
        background: '#f2f2f2',
        cardBg: '#fff',
        textPrimary: '#111',
        textSecondary: '#555',
        buttonBg: '#7C4DFF',
        tabBarBg: '#fff',
        tabBarBorder: '#ddd',
        tabBarActive: '#5e23ff',
        tabBarInactive: '#555',
      };

    

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
