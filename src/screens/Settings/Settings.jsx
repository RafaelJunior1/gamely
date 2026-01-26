import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { auth } from '../../services/firebase';

export default function Settings({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colors, themeMode, setThemeMode } = useContext(ThemeContext);

  const [notifPosts, setNotifPosts] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifStories, setNotifStories] = useState(true);
  const [notifGames, setNotifGames] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Terminar sessão',
      'Tens a certeza que queres sair da conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Definições
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* CONTA */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Conta
        </Text>

        <View style={styles.row}>
          <Ionicons name="person-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            {user?.email}
          </Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ff4d4f" />
          <Text style={[styles.rowText, { color: '#ff4d4f' }]}>
            Terminar sessão
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate('Privacy') || Alert.alert('Privacidade', 'Abrir Privacidade')
          }
        >
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Privacidade e Segurança
          </Text>
        </TouchableOpacity>
      </View>

      {/* APARÊNCIA */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Aparência
        </Text>

        <View style={styles.row}>
          <Ionicons name="contrast-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Automático
          </Text>
          <Switch
            value={themeMode === 'auto'}
            onValueChange={() => handleThemeChange('auto')}
          />
        </View>

        <View style={styles.row}>
          <Ionicons name="sunny-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Claro
          </Text>
          <Switch
            value={themeMode === 'light'}
            onValueChange={() => handleThemeChange('light')}
          />
        </View>

        <View style={styles.row}>
          <Ionicons name="moon" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Escuro
          </Text>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={() => handleThemeChange('dark')}
          />
        </View>
      </View>

      {/* NOTIFICAÇÕES */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Notificações
        </Text>

        <View style={styles.row}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Novos posts
          </Text>
          <Switch value={notifPosts} onValueChange={setNotifPosts} />
        </View>

        <View style={styles.row}>
          <Ionicons name="chatbubble-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Mensagens
          </Text>
          <Switch value={notifMessages} onValueChange={setNotifMessages} />
        </View>

        <View style={styles.row}>
          <Ionicons name="images-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Stories
          </Text>
          <Switch value={notifStories} onValueChange={setNotifStories} />
        </View>

        <View style={styles.row}>
          <Ionicons name="game-controller-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Atualizações de jogos
          </Text>
          <Switch value={notifGames} onValueChange={setNotifGames} />
        </View>
      </View>

      {/* AJUDA E FEEDBACK */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Ajuda & Feedback
        </Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate('Help') || Alert.alert('Ajuda', 'Abrir FAQ')
          }
        >
          <Ionicons name="help-circle-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Ajuda / FAQ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate('Feedback') || Alert.alert('Feedback', 'Enviar Feedback')
          }
        >
          <Ionicons name="chatbubbles-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Enviar Feedback
          </Text>
        </TouchableOpacity>
      </View>

      {/* SOBRE */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Sobre
        </Text>

        <View style={styles.row}>
          <Ionicons name="game-controller-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Gamely • v1.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  rowText: {
    fontSize: 16,
    flex: 1,
  },
});
