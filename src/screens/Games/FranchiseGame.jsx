import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

export default function FranchiseGame({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const { gameId } = route.params;

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    async function fetchGame() {
      try {
        const ref = doc(db, 'game_sequences', gameId);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setGame(snapshot.data());
        }
      } catch (err) {
        console.error('Erro ao buscar jogo da franquia:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [gameId]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.textPrimary} />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>
          Jogo não encontrado
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-outline"
          size={28}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={{ uri: game.image }} style={styles.coverImage} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {game.title}
          </Text>
          <Text style={[styles.year, { color: colors.textSecondary }]}>
            Ano de lançamento: {game.releaseYear}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.description,
          { color: colors.textPrimary, marginHorizontal: 16 },
        ]}
      >
        {game.description}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    margin: 16,
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  coverImage: {
    width: 170,
    height: 190,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  year: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 25,
    marginTop: 12,
    marginBottom: 30,
  },
});
