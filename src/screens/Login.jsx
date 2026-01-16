import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { auth } from '../services/firebase';

export default function Login({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Informe email e senha');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('App');
    } catch (error) {
      Alert.alert('Erro', 'Email ou senha inválidos');
    }
  }

  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigation.replace('App');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* LOGO */}
      <Text style={[styles.logo, { color: colors.buttonBg }]}>GAMELY</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Entre e continue sua jornada gamer
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />


      <View style={[styles.passwordContainer, { backgroundColor: colors.cardBg }]}>
        <TextInput
          style={[styles.passwordInput, { color: colors.textPrimary }]}
          placeholder="Senha"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: colors.buttonBg }]}
        onPress={handleLogin}
      >
        <Text style={[styles.loginText, { color: colors.buttonText }]}>
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.googleBtn, { borderColor: colors.textSecondary }]}
        onPress={handleGoogleLogin}
      >
        <Ionicons name="logo-google" size={20} color={colors.textSecondary} />
        <Text style={[styles.googleText, { color: colors.textSecondary }]}>
          Entrar com Google
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: colors.textSecondary }}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: colors.buttonBg, marginLeft: 5 }}>
            Criar conta
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
  },
  logo: {
    fontFamily: 'Panama',
    fontSize: 42,
    letterSpacing: 2,
    marginBottom: 6,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  loginBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#7C4DFF',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    marginTop: 15,
  },
  googleText: {
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
