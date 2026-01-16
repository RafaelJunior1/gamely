import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

