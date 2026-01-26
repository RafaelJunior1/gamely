import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

export default function FeedbackScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert('Erro', 'Escreva uma mensagem antes de enviar.');
      return;
    }

    Alert.alert(
      'Obrigado!',
      'Seu feedback foi enviado com sucesso. Isso nos ajuda muito a melhorar o app 🙂'
    );

    setMessage('');
    setType('suggestion');
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
          Enviar Feedback
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* INTRO */}
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Tem alguma ideia, sugestão ou encontrou um problema?
        Conta pra gente! Seu feedback é essencial para melhorar a Gamely.
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Tipo de feedback
        </Text>

        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'suggestion' && {
                backgroundColor: colors.cardBg,
              },
            ]}
            onPress={() => setType('suggestion')}
          >
            <Ionicons
              name="bulb-outline"
              size={20}
              color={colors.textPrimary}
            />
            <Text style={[styles.typeText, { color: colors.textPrimary }]}>
              Sugestão
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'bug' && {
                backgroundColor: colors.cardBg,
              },
            ]}
            onPress={() => setType('bug')}
          >
            <Ionicons
              name="bug-outline"
              size={20}
              color={colors.textPrimary}
            />
            <Text style={[styles.typeText, { color: colors.textPrimary }]}>
              Bug
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'other' && {
                backgroundColor: colors.cardBg,
              },
            ]}
            onPress={() => setType('other')}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={colors.textPrimary}
            />
            <Text style={[styles.typeText, { color: colors.textPrimary }]}>
              Outro
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MENSAGEM */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Mensagem
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.cardBg,
              color: colors.textPrimary,
            },
          ]}
          placeholder="Descreva sua sugestão ou problema..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={6}
          value={message}
          onChangeText={setMessage}
        />
      </View>

      {/* BOTÃO ENVIAR */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}
      >
        <Ionicons name="send-outline" size={20} color="#fff" />
        <Text style={styles.submitText}>Enviar feedback</Text>
      </TouchableOpacity>
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

  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 30,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
  },

  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderRadius: 10,
  },

  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },

  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
  },

  submitButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
