import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function Messages({ navigation }) {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Mensagens
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.empty}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={48}
          color={colors.textSecondary}
        />
        <Text style={{ color: colors.textSecondary, marginTop: 10 }}>
          Nenhuma mensagem ainda
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
