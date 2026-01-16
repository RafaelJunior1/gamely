import { useContext, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const MOCK_POSTS = Array.from({ length: 18 }).map((_, i) => ({
  id: i.toString(),
  image: `https://picsum.photos/500/500?random=${i}`,
}));

const MOCK_ACCOUNTS = [
  { id: '1', name: 'Gamer123' },
  { id: '2', name: 'EpicPlayer' },
];

const MOCK_REELS = [
  { id: '1', title: 'Valorant Trickshots', tags: ['Valorant', 'game'] },
];

const MOCK_AUDIO = [
  { id: '1', title: 'Epic Game Music' },
  { id: '2', title: 'Chill Gaming Beat' },
];

const GAME_SUGGESTIONS = ['Fortnite', 'GTA RP', 'Minecraft', 'Valorant', 'Free Fire', 'Call of Duty'];

const TABS = ['Para você', 'Contas', 'Reels', 'Áudio'];

export default function Explore() {
  const { colors } = useContext(ThemeContext);

  const [search, setSearch] = useState('');
  const [results, setResults] = useState({
    posts: [],
    accounts: [],
    reels: [],
    audio: [],
  });
  const [activeTab, setActiveTab] = useState('Para você');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const query = search.trim().toLowerCase();
    setHasSearched(true);

    const filteredPosts = MOCK_POSTS.filter(
      p => p.id.includes(query) // Para o mock de imagens, apenas pelo id
    );

    const filteredAccounts = MOCK_ACCOUNTS.filter(a =>
      a.name.toLowerCase().includes(query)
    );

    const filteredReels = MOCK_REELS.filter(
      r =>
        r.title.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
    );

    const filteredAudio = MOCK_AUDIO.filter(a =>
      a.title.toLowerCase().includes(query)
    );

    setResults({
      posts: filteredPosts,
      accounts: filteredAccounts,
      reels: filteredReels,
      audio: filteredAudio,
    });
  };

  const hasAnyResult =
    results.posts.length ||
    results.accounts.length ||
    results.reels.length ||
    results.audio.length;

  const getDataByTab = () => {
    if (!hasSearched) return [];

    if (!hasAnyResult) {
      // Nenhum resultado
      return GAME_SUGGESTIONS.map(s => ({ id: s, title: s }));
    }

    switch (activeTab) {
      case 'Para você':
        return [
          ...results.posts,
          ...results.reels,
          ...results.accounts,
          ...results.audio,
        ];
      case 'Contas':
        return results.accounts;
      case 'Reels':
        return results.reels;
      case 'Áudio':
        return results.audio;
      default:
        return [];
    }
  };

  const renderItem = ({ item }) => {
    if (item.image) {
      // Posts
      return (
        <Image
          source={{ uri: item.image }}
          style={{ width: width / 3 - 4, height: width / 3 - 4, margin: 2 }}
        />
      );
    }

    return (
      <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#555' }}>
        <Text style={{ color: colors.text, fontSize: 16 }}>{item.title || item.name}</Text>
      </View>
    );
  };

  const numColumns = activeTab === 'Para você' && hasAnyResult && results.posts.length ? 3 : 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Pesquisar"
          placeholderTextColor={colors.text + '99'}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={{ color: '#fff' }}>Ir</Text>
        </TouchableOpacity>
      </View>

      {hasSearched && (
        <View style={styles.tabContainer}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabItem,
                {
                  borderBottomColor:
                    activeTab === tab ? colors.tabBarActive : 'transparent',
                },
              ]}
            >
              <Text style={{ color: activeTab === tab ? colors.tabBarActive : colors.text }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={getDataByTab()}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        numColumns={numColumns}
        ListEmptyComponent={
          hasSearched && !hasAnyResult ? (
            <View style={{ padding: 20 }}>
              <Text style={{ color: colors.text, fontSize: 16, marginBottom: 10 }}>
                Nenhum resultado encontrado para "{search}"
              </Text>
              <Text style={{ color: colors.text, fontSize: 14 }}>Sugestões de pesquisa:</Text>
              {GAME_SUGGESTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => {
                    setSearch(s);
                    handleSearch();
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 14, marginLeft: 10 }}>
                    • {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  tabItem: {
    marginRight: 20,
    paddingVertical: 6,
    borderBottomWidth: 2,
  },
});
