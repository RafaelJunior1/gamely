import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

export default function Games() {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    async function fetchGames() {
      try {
        const snapshot = await getDocs(collection(db, 'games'));
        const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGames(gamesData);
      } catch (err) {
        console.error('Erro ao buscar jogos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const renderGame = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBg }]}
      onPress={() => navigation.navigate('GameDetails', { game: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.genres, { color: colors.textSecondary }]}>
          {item.genres?.join(', ')}
        </Text>
        <Text style={[styles.details, { color: colors.textSecondary }]}>
          Desenvolvedor: {item.developer}
        </Text>
        <Text style={[styles.details, { color: colors.textSecondary }]}>
          Ano: {item.releaseYear} | Nota: {item.rating}
        </Text>
        <View style={styles.multiplayer}>
          {item.multiplayer ? (
            <Ionicons name="people" size={16} color={colors.textSecondary} />
          ) : (
            <Ionicons name="person" size={16} color={colors.textSecondary} />
          )}
          <Text style={[styles.details, { color: colors.textSecondary, marginLeft: 4 }]}>
            {item.multiplayer ? 'Multiplayer' : 'Singleplayer'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.textPrimary} />
        <Text style={{ color: colors.textPrimary, marginTop: 10 }}>Carregando jogos...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Jogos</Text>
      </View>

      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4,
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 50,
  },
  card: {
    flexDirection: 'row',
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 130,
    height: 140,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700' },
  genres: { fontSize: 13, marginTop: 4 },
  details: { fontSize: 12, marginTop: 2 },
  multiplayer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
});
