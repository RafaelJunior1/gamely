import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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

export default function Register({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Panama': require('../../assets/fonts/Panama Personal Use Only.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFont();
  }, []);

  if (!fontsLoaded) return null; // splash/loading até a fonte carregar

  async function handleRegister() {
    if (!fullName || !nickname || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Sucesso', `Conta criada para ${nickname}!`);
      navigation.replace('App'); // redireciona para AppNavigator
    } catch (error) {
      Alert.alert('Erro', error.message);
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
        Entre no universo gamer e compartilhe seus momentos
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
        placeholder="Nome completo"
        placeholderTextColor={colors.textSecondary}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
        placeholder="Nickname gamer"
        placeholderTextColor={colors.textSecondary}
        value={nickname}
        onChangeText={setNickname}
      />

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

      <View style={[styles.passwordContainer, { backgroundColor: colors.cardBg }]}>
        <TextInput
          style={[styles.passwordInput, { color: colors.textPrimary }]}
          placeholder="Confirmar senha"
          placeholderTextColor={colors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
        style={[styles.registerBtn, { backgroundColor: colors.buttonBg }]}
        onPress={handleRegister}
      >
        <Text style={[styles.registerText, { color: colors.buttonText }]}>Criar Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.googleBtn, { borderColor: colors.textSecondary }]}
        onPress={handleGoogleLogin}
      >
        <Ionicons name="logo-google" size={20} color={colors.textSecondary} />
        <Text style={[styles.googleText, { color: colors.textSecondary }]}>
          Continuar com Google
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: colors.textSecondary }}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: colors.buttonBg, marginLeft: 5 }}>Entrar</Text>
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
    paddingTop: 60,
  },
  logo: {
    fontFamily: 'Panama',
    fontSize: 42,
    color: '#7C4DFF',
    marginBottom: 6,
    letterSpacing: 2,
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
  passwordInput: { flex: 1, fontSize: 16 },
  registerBtn: {
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
  registerText: { fontSize: 16, fontWeight: '600', color: '#ffff'},
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
  googleText: { marginLeft: 8, fontSize: 16 },
  footer: { flexDirection: 'row', marginTop: 20 },
});
