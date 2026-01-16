import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function Header({ onToggleTheme }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto');

  // Carrega a fonte Panama
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Panama': require('../../assets/fonts/Panama Personal Use Only.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFont();
  }, []);

  if (!fontsLoaded) return null;

  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemScheme === 'dark');
  const bgColor = isDark ? '#0F0F1A' : '#fff';
  const textColor = isDark ? '#fff' : '#111';

  // Alterna o tema ao clicar
  const toggleTheme = () => {
    let nextMode;
    if (themeMode === 'auto') nextMode = 'dark';
    else if (themeMode === 'dark') nextMode = 'light';
    else nextMode = 'auto';
    setThemeMode(nextMode);

    if (onToggleTheme) onToggleTheme(nextMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>

      <TouchableOpacity style={styles.iconLeft}>
        <Ionicons name="menu-outline" size={28} color="#00E5FF" />
      </TouchableOpacity>

      <Text style={[styles.logo, { color: textColor }]}>GAMELY</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.iconRight}>
          <Ionicons name="notifications-outline" size={26} color="#FF4081" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconRight, {display: 'none'}]} onPress={toggleTheme} styles="display: none" >
          <Ionicons
            name={
              themeMode === 'auto'
                ? 'color-wand-outline'
                : themeMode === 'dark'
                ? 'moon-outline'
                : 'sunny-outline'
            }
            size={26}
            color={textColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#1e1e3f',
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Panama',
    alignContent: 'center',
    letterSpacing: 2,
    lineHeight: 32,
  },
  iconLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  iconRight: {
    width: 40,
    alignItems: 'flex-end',
    marginLeft: 10,
  },
});
