import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { db } from '../services/firebase';

export default function Explore({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!searchText) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const postsRef = collection(db, 'posts');
        const reelsRef = collection(db, 'reels');

        const usersQuery = query(usersRef, where('nickname', '>=', searchText));
        const usersSnap = await getDocs(usersQuery);
        const usersData = usersSnap.docs
          .map(doc => ({ id: doc.id, type: 'user', ...doc.data() }))
          .filter(u => u.id !== user.uid);

        const postsQuery = query(postsRef, where('game', '>=', searchText));
        const postsSnap = await getDocs(postsQuery);
        const postsData = postsSnap.docs.map(doc => ({
          id: doc.id,
          type: 'post',
          ...doc.data(),
        }));

        const reelsQuery = query(reelsRef, where('game', '>=', searchText));
        const reelsSnap = await getDocs(reelsQuery);
        const reelsData = reelsSnap.docs.map(doc => ({
          id: doc.id,
          type: 'reel',
          ...doc.data(),
        }));

        setResults([...usersData, ...postsData, ...reelsData]);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [searchText]);

  const filteredResults = results.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'users') return item.type === 'user';
    if (activeTab === 'posts') return item.type === 'post';
    if (activeTab === 'reels') return item.type === 'reel';
    return true;
  });

  const renderItem = ({ item }) => {
    if (item.type === 'user') {
      return (
        <TouchableOpacity
          style={[styles.itemContainer, { backgroundColor: colors.cardBg }]}
          onPress={() =>
            navigation.navigate('UserProfile', { userId: item.id })
          }
        >
          <Image
            source={
              item.avatar
                ? { uri: item.avatar }
                : require('../../assets/avatars/default.png')
            }
            style={styles.userAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
              {item.nickname}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              {item.fullName}
            </Text>
          </View>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Seguir</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    if (item.type === 'post') {
      return (
        <TouchableOpacity
          style={[styles.itemContainer, { backgroundColor: colors.cardBg }]}
          onPress={() =>
            navigation.navigate('PostDetail', { postId: item.id })
          }
        >
          <View>
            <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
              {item.title}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              Jogo: {item.game}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.type === 'reel') {
      return (
        <TouchableOpacity
          style={[styles.itemContainer, { backgroundColor: colors.cardBg }]}
          onPress={() =>
            navigation.navigate('ReelDetail', { reelId: item.id })
          }
        >
          <View>
            <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
              {item.title}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              Jogo: {item.game}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBg }]}>
        <Ionicons
          name="search-outline"
          size={22}
          color={colors.textSecondary}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Buscar usuários, posts ou jogos..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.tabs}>
        {['all', 'users', 'posts', 'reels'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  activeTab === tab ? colors.buttonBg : colors.cardBg,
              },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={{
                color: activeTab === tab ? '#fff' : colors.textPrimary,
                fontWeight: '700',
              }}
            >
              {tab === 'all'
                ? 'Tudo'
                : tab === 'users'
                ? 'Usuários'
                : tab === 'posts'
                ? 'Posts'
                : 'Reels'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.buttonBg}
          style={{ marginTop: 20 }}
        />
      )}

      {!loading && filteredResults.length === 0 && searchText.length > 0 && (
        <Text
          style={{
            color: colors.textSecondary,
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          Nenhum resultado encontrado
        </Text>
      )}

      <FlatList
        data={filteredResults}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    margin: 16,
    marginTop: 60,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,

  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  followBtn: {
    backgroundColor: '#7C4DFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
