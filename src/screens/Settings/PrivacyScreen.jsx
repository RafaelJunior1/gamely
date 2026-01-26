import { Ionicons } from '@expo/vector-icons';
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
import { ThemeContext } from '../../context/ThemeContext';

export default function PrivacyScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const [privateAccount, setPrivateAccount] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handleDangerAction = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
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
          Privacidade & Segurança
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* PRIVACIDADE */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Privacidade
        </Text>

        <View style={styles.row}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color={colors.textPrimary}
          />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Conta privada
          </Text>
          <Switch
            value={privateAccount}
            onValueChange={setPrivateAccount}
          />
        </View>

        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Quando ativado, apenas seguidores aprovados podem ver seu perfil.
        </Text>

        <View style={styles.row}>
          <Ionicons
            name="radio-outline"
            size={22}
            color={colors.textPrimary}
          />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Mostrar status online
          </Text>
          <Switch
            value={showOnlineStatus}
            onValueChange={setShowOnlineStatus}
          />
        </View>

        <View style={styles.row}>
          <Ionicons
            name="mail-outline"
            size={22}
            color={colors.textPrimary}
          />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Permitir mensagens
          </Text>
          <Switch
            value={allowMessages}
            onValueChange={setAllowMessages}
          />
        </View>
      </View>

      {/* SEGURANÇA */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Segurança
        </Text>

        <View style={styles.row}>
          <Ionicons
            name="key-outline"
            size={22}
            color={colors.textPrimary}
          />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Autenticação em 2 fatores
          </Text>
          <Switch
            value={twoFactorAuth}
            onValueChange={setTwoFactorAuth}
          />
        </View>

        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Adiciona uma camada extra de proteção à sua conta.
        </Text>

        <View style={styles.row}>
          <Ionicons
            name="alert-circle-outline"
            size={22}
            color={colors.textPrimary}
          />
          <Text style={[styles.rowText, { color: colors.textPrimary }]}>
            Alertas de login
          </Text>
          <Switch
            value={loginAlerts}
            onValueChange={setLoginAlerts}
          />
        </View>
      </View>

      {/* AÇÕES AVANÇADAS */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Ações avançadas
        </Text>

        <TouchableOpacity
          style={styles.dangerRow}
          onPress={() =>
            handleDangerAction(
              'Sessões ativas',
              'Aqui você poderá ver e encerrar sessões ativas no futuro.'
            )
          }
        >
          <Ionicons name="desktop-outline" size={22} color="#ff4d4f" />
          <Text style={[styles.dangerText]}>
            Gerir sessões ativas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerRow}
          onPress={() =>
            handleDangerAction(
              'Bloqueios',
              'Aqui você poderá gerir usuários bloqueados.'
            )
          }
        >
          <Ionicons name="ban-outline" size={22} color="#ff4d4f" />
          <Text style={[styles.dangerText]}>
            Contas bloqueadas
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  section: {
    marginBottom: 30,
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

  helperText: {
    fontSize: 13,
    marginLeft: 34,
    marginBottom: 10,
  },

  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },

  dangerText: {
    fontSize: 16,
    color: '#ff4d4f',
  },
});
