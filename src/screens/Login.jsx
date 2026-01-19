import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
import { auth, db } from '../services/firebase';

export default function Login({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({ Panama: require('../../assets/fonts/Panama Personal Use Only.ttf') });
      setFontsLoaded(true);
    }
    loadFont();
  }, []);

  if (!fontsLoaded) return null;

  async function handleLogin() {
    if (!identifier || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      let emailToUse = identifier;

      if (!identifier.includes('@')) {
        const q = query(collection(db, 'users'), where('nickname', '==', identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert('Erro', 'Usuário não encontrado');
          return;
        }

        emailToUse = querySnapshot.docs[0].data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);

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
      <Text style={[styles.logo, { color: colors.buttonBg, fontFamily: 'Panama' }]}>GAMELY</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Bem-vindo de volta! Faça login para continuar
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
        placeholder="Email ou Nickname"
        placeholderTextColor={colors.textSecondary}
        value={identifier}
        onChangeText={setIdentifier}
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
        <Text style={[styles.loginText, { color: colors.buttonText }]}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: colors.textSecondary }}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: colors.buttonBg, marginLeft: 5 }}>Registrar</Text>
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
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 2,
    lineHeight: 50,
    fontFamily: 'Panama',
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
  loginText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  footer: { flexDirection: 'row', marginTop: 20 },
});
