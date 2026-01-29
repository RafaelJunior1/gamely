import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

export default function GameDetails({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const { game } = route.params;

  const renderSequence = ({ item }) => (
    <TouchableOpacity
      style={[styles.sequenceItem, { backgroundColor: colors.cardBg }]}
      onPress={() => navigation.navigate('FranchiseGame', { gameId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.sequenceImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.sequenceTitle, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.sequenceYear, { color: colors.textSecondary }]}>{item.releaseYear}</Text>
        <Text
          style={[styles.sequenceDesc, { color: colors.textPrimary }]}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={22} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={28} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={{ uri: game.image }} style={styles.coverImage} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{game.title}</Text>
          <Text style={[styles.developer, { color: colors.textSecondary }]}>
            Desenvolvedor: {game.developer}
          </Text>
          <Text style={[styles.publisher, { color: colors.textSecondary }]}>
            Publicador: {game.publisher}
          </Text>
          <Text style={[styles.genres, { color: colors.textSecondary }]}>
            Gêneros: {game.genres.join(', ')}
          </Text>
          <Text style={[styles.year, { color: colors.textSecondary }]}>Ano: {game.releaseYear}</Text>
          <Text style={[styles.rating, { color: colors.textSecondary }]}>Rating: {game.rating}</Text>
          <Text style={[styles.multiplayer, { color: colors.textSecondary }]}>
            Multiplayer: {game.multiplayer ? 'Sim' : 'Não'}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textPrimary, marginHorizontal: 16, marginTop: 12 }]}>
        {game.description}
      </Text>

      {game.sequence && game.sequence.length > 0 && (
        <View style={styles.sequencesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Sequências / Jogos da Franquia
          </Text>
          <FlatList
            data={game.sequence}
            keyExtractor={(item) => item.id}
            renderItem={renderSequence}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,},
  backBtn: { margin: 16, marginTop: 50 },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  coverImage: {
    width: 170,
    height: 190,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  developer: { fontSize: 13, marginBottom: 2 },
  publisher: { fontSize: 13, marginBottom: 2 },
  genres: { fontSize: 13, marginBottom: 2 },
  year: { fontSize: 13, marginBottom: 2 },
  rating: { fontSize: 13, marginBottom: 2 },
  multiplayer: { fontSize: 13, marginBottom: 4 },
  description: { fontSize: 16, lineHeight: 25 },
  sequencesContainer: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  sequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  sequenceImage: { width: 80, height: 80, borderRadius: 10 },
  sequenceTitle: { fontSize: 16, fontWeight: '700' },
  sequenceYear: { fontSize: 12, marginTop: 2 },
  sequenceDesc: { fontSize: 12, marginTop: 2 },
});
