import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function Header({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        Panama: require('../../assets/fonts/Panama Personal Use Only.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFont();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.tabBarBorder,
        },
      ]}
    >
      {/* MENU */}
      <TouchableOpacity
        style={styles.iconLeft}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu-outline" size={28} color="#00E5FF" />
      </TouchableOpacity>


      {/* LOGO */}
      <Text style={[styles.logo, { color: colors.textPrimary }]}>
        GAMELY
      </Text>

      {/* ICONES DIREITA */}
      <View style={{ flexDirection: 'row' }}>
        {/* NOTIFICAÇÕES */}
        <TouchableOpacity
          style={styles.iconRight}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons
            name="notifications-outline"
            size={26}
            color="#FF4081"
          />
        </TouchableOpacity>

        {/* MENSAGENS */}
        <TouchableOpacity
          style={styles.iconRight}
          onPress={() => navigation.navigate('Messages')}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#8800ff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Panama',
    letterSpacing: 2,
    marginLeft: 30,
    lineHeight: 50,
  },
  iconLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  iconRight: {
    width: 40,
    alignItems: 'flex-end',
    marginLeft: 2,
  },
});

