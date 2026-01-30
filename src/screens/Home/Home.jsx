import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { db } from '../../services/firebase';

const { height } = Dimensions.get('window');

export default function Home({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const postsSnapshot = await getDocs(query(collection(db, 'post'), orderBy('createdAt', 'desc')));
      const postsData = [];

      for (const docSnap of postsSnapshot.docs) {
        const post = { id: docSnap.id, ...docSnap.data() };

        if (post.userId) {
          const userSnap = await getDocs(query(collection(db, 'users'), where('_name_', '==', post.userId)));
          if (!userSnap.empty) {
            const userData = userSnap.docs[0].data();
            post.userName = userData.nickname || 'Anônimo';
            post.userAvatar = userData.avatar || null;
          } else {
            post.userName = 'Anônimo';
            post.userAvatar = null;
          }
        }

        postsData.push(post);
      }

      const storiesSnapshot = await getDocs(query(collection(db, 'story'), orderBy('createdAt', 'desc')));
      const storiesData = [];
      storiesSnapshot.forEach(doc => {
        storiesData.push({ id: doc.id, ...doc.data() });
      });

      setPosts(postsData);
      setStories(storiesData);
    } catch (e) {
      console.log('Erro ao buscar posts:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const AnimatedCount = ({ value }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: value,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }, [value]);

    return (
      <Animated.Text style={{ color: colors.textSecondary }}>
        {animatedValue.interpolate({
          inputRange: [0, value],
          outputRange: [0, value],
        }).__getValue().toFixed(0)}
      </Animated.Text>
    );
  };

  const renderPost = ({ item }) => (
    <View style={[styles.postContainer, { backgroundColor: colors.cardBg }]}>
      {item.images && item.images[0] && (
        <Image source={{ uri: item.images[0] }} style={styles.postImage} />
      )}

      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <Image
            source={item.userAvatar ? { uri: item.userAvatar } : require('../../../assets/avatars/default.png')}
            style={styles.avatar}
          />
          <Text style={[styles.username, { color: colors.textPrimary }]}>
            {item.userName}
          </Text>
          <TouchableOpacity style={[styles.followBtn, { backgroundColor: colors.buttonBg }]}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>

        {item.text ? (
          <Text style={[styles.description, { color: colors.textPrimary }]}>
            {item.text}
          </Text>
        ) : null}

        {item.game ? (
          <Text style={[styles.gameName, { color: colors.textSecondary }]}>
            🎮 {item.game}
          </Text>
        ) : null}

        <View style={styles.sideButtons}>
          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="heart-outline" size={28} color="#FF4444" />
            <AnimatedCount value={item.likes?.length || 0} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn} onPress={() => navigation.navigate('Comments', { postId: item.id })}>
            <Ionicons name="chatbubble-outline" size={28} color={colors.textSecondary} />
            <AnimatedCount value={item.comments?.length || 0} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="arrow-redo-outline" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStory = ({ item }) => (
    <TouchableOpacity style={styles.storyItem} onPress={() => navigation.navigate('StoryView', { story: item })}>
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <Text style={[styles.storyText, { color: colors.textPrimary }]}>{item.userName || 'Anônimo'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header navigation={navigation} />

      {posts.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: colors.textSecondary }}>Nenhuma publicação ainda</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            stories.length > 0 && (
              <FlatList
                data={stories}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={renderStory}
                showsHorizontalScrollIndicator={false}
                style={{ marginVertical: 10 }}
              />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  postContainer: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: { width: '100%', height: height * 0.4, resizeMode: 'cover' },
  overlay: { padding: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#333' },
  username: { fontFamily: 'Roboto', fontSize: 15, marginLeft: 8, fontWeight: '600' },
  followBtn: { marginLeft: 10, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  followText: { color: '#fff', fontFamily: 'Panama', fontSize: 12 },
  description: { fontFamily: 'Roboto', fontSize: 14, marginBottom: 4 },
  gameName: { fontFamily: 'Roboto', fontSize: 12, marginBottom: 4, fontStyle: 'italic' },
  sideButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 6 },
  sideBtn: { alignItems: 'center' },
  storyItem: { alignItems: 'center', marginHorizontal: 6 },
  storyImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 4 },
  storyText: { fontSize: 10, textAlign: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});