import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const faqs = [
  {
    question: 'Como mudar meu avatar?',
    answer:
      'Vá em Perfil → Editar Perfil e toque no avatar para escolher uma nova imagem da galeria.',
  },
  {
    question: 'Como adicionar jogos favoritos?',
    answer:
      'No Editar Perfil, abra a aba Jogos Favoritos, pesquise o jogo desejado e adicione à sua lista.',
  },
  {
    question: 'Como mudar meu nickname?',
    answer:
      'Acesse Perfil → Editar Perfil e altere o nickname no campo correspondente.',
  },
  {
    question: 'Como mudar o tema do aplicativo?',
    answer:
      'Em Definições → Aparência, você pode escolher entre Automático, Claro ou Escuro.',
  },
  {
    question: 'Como enviar feedback ou reportar um bug?',
    answer:
      'Vá em Definições → Feedback, descreva o problema ou sugestão e envie para nossa equipe.',
  },
  {
    question: 'Como tornar minha conta privada?',
    answer:
      'Em Definições → Privacidade, ative a opção de conta privada para controlar quem pode ver seu perfil.',
  },
  {
    question: 'Posso remover seguidores?',
    answer:
      'Sim. No perfil do seguidor, você pode remover ou bloquear usuários indesejados.',
  },
  {
    question: 'Como apagar minha conta?',
    answer:
      'Atualmente essa opção não está disponível no app. Entre em contato pelo Feedback para solicitar.',
  },
];

export default function HelpScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
          Ajuda / FAQ
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* FAQ LIST */}
      {faqs.map((item, index) => (
        <View
          key={index}
          style={[styles.faqItem, { backgroundColor: colors.cardBg }]}
        >
          <TouchableOpacity
            style={styles.faqHeader}
            onPress={() => toggleFAQ(index)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.question, { color: colors.textPrimary }]}
            >
              {item.question}
            </Text>
            <Ionicons
              name={
                openIndex === index
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
              }
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          {openIndex === index && (
            <Text
              style={[styles.answer, { color: colors.textSecondary }]}
            >
              {item.answer}
            </Text>
          )}
        </View>
      ))}

      {/* EXTRA HELP */}
      <View
        style={[
          styles.extraHelp,
          { backgroundColor: colors.cardBg },
        ]}
      >
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={colors.textPrimary}
        />
        <Text
          style={[
            styles.extraText,
            { color: colors.textSecondary },
          ]}
        >
          Não encontrou o que procurava? Vá em Definições → Feedback e fale
          diretamente com a nossa equipa.
        </Text>
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

  faqItem: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  question: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },

  answer: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },

  extraHelp: {
    marginTop: 30,
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  extraText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
