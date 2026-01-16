import { useContext, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function Intro({ navigation }) {
  const { colors } = useContext(ThemeContext);
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../../assets/logo/Gamely.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
});
