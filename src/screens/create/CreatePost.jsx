import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useContext, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { db } from '../../services/firebase';

export default function CreatePost({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { uri } = route.params;

  const [images, setImages] = useState(uri ? [uri] : []);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = text => {
    setSearch(text);
    if (!text) {
      setFilteredGames([]);
      return;
    }
    const filtered = allGames.filter(g =>
      g.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredGames(filtered);
  };

  const selectGame = game => {
    setSelectedGame(game);
    setSearch('');
    setFilteredGames([]);
  };

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addImage = url => {
    setImages(prev => [...prev, url]);
  };

  const publishPost = async () => {
    if (loading) return;
    if (images.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos uma imagem');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'post'), {
        userId: user.uid,
        images: images,
        text: text || null,
        game: selectedGame || null,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
      });

      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e) {
      console.log('Erro ao publicar post:', e);
      Alert.alert('Erro', 'Falha ao publicar o post');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={images}
        horizontal
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(index)}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TextInput
        style={[styles.textInput, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
        placeholder="Escreva algo..."
        placeholderTextColor={colors.textSecondary}
        value={text}
        onChangeText={setText}
        multiline
      />

      <TextInput
        style={[styles.textInput, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
        placeholder="Pesquise um jogo..."
        value={search}
        onChangeText={handleSearch}
      />
      {filteredGames.length > 0 && (
        <View style={[styles.searchResults, { backgroundColor: colors.cardBg }]}>
          {filteredGames.map(game => (
            <TouchableOpacity key={game} onPress={() => selectGame(game)} style={styles.resultItem}>
              <Text style={{ color: colors.textPrimary }}>{game}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {selectedGame && (
        <View style={[styles.selectedGame, { backgroundColor: colors.buttonBg }]}>
          <Text style={{ color: '#fff' }}>{selectedGame}</Text>
          <TouchableOpacity onPress={() => setSelectedGame(null)}>
            <Text style={{ color: '#fff', marginLeft: 6 }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.publishBtn, { backgroundColor: colors.buttonBg }]}
        onPress={publishPost}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>{loading ? 'Publicando...' : 'Publicar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30 },
  imageWrapper: { marginRight: 10 },
  image: { width: 100, height: 120, borderRadius: 12, lineHeight: 90 },
  removeBtn: { position: 'absolute', top: -8, right: -8 },
  textInput: { borderRadius: 12, padding: 12, fontSize: 16, marginVertical: 10 },
  searchResults: { maxHeight: 900, borderRadius: 12 },
  resultItem: { padding: 10 },
  selectedGame: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 8,
  },
  publishBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
});