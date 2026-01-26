import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { db } from '../services/firebase';

export default function UserProfile({ route }) {
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { userId } = route.params;

  const [profile, setProfile] = useState(null);
  const [following, setFollowing] = useState(false);
  const [posts, setPosts] = useState([]);

  const followersAnim = useRef(new Animated.Value(0)).current;
  const followingAnim = useRef(new Animated.Value(0)).current;
  const postsAnim = useRef(new Animated.Value(0)).current;

  const loadProfile = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setFollowing(data.followers?.includes(user.uid));

        animateNumber(followersAnim, data.followers?.length || 0);
        animateNumber(followingAnim, data.following?.length || 0);
      }

      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('authorId', '==', userId));
      const snapPosts = await getDocs(q);
      const userPosts = snapPosts.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(userPosts);

      animateNumber(postsAnim, userPosts.length);
    } catch (error) {
      console.error('UserProfile load error:', error.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const animateNumber = (animatedValue, toValue) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const handleFollow = async () => {
    if (!profile) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    try {
      const userRef = doc(db, 'users', user.uid);
      const profileRef = doc(db, 'users', userId);

      if (following) {
        await updateDoc(profileRef, { followers: arrayRemove(user.uid) });
        await updateDoc(userRef, { following: arrayRemove(userId) });

        animateNumber(followersAnim, (profile.followers?.length || 1) - 1);
        animateNumber(followingAnim, (profile.following?.length || 1) - 1);
      } else {
        await updateDoc(profileRef, { followers: arrayUnion(user.uid) });
        await updateDoc(userRef, { following: arrayUnion(userId) });

        animateNumber(followersAnim, (profile.followers?.length || 0) + 1);
        animateNumber(followingAnim, (profile.following?.length || 0) + 1);
      }

      setFollowing(!following);
      loadProfile();
    } catch (error) {
      console.error('Follow error:', error.message);
    }
  };

  if (!profile) return null;

  const formatNumber = (num) => {
    if (num < 1000) return num;
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    return (num / 1000000).toFixed(1) + 'M';
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Image
        source={profile.banner ? { uri: profile.banner } : require('../../assets/banners/default.png')}
        style={styles.banner}
      />

      <View style={styles.header}>
        <Image
          source={profile.avatar ? { uri: profile.avatar } : require('../../assets/avatars/default.png')}
          style={styles.avatar}
        />

        <TouchableOpacity
          style={[styles.followBtn, { backgroundColor: following ? '#aaa' : colors.buttonBg }]}
          onPress={handleFollow}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            {following ? 'Seguindo' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{profile.fullName}</Text>
        <Text style={[styles.nick, { color: colors.textSecondary }]}>@{profile.nickname}</Text>
        <Text style={[styles.bio, { color: colors.textPrimary }]}>{profile.bio || 'Nenhuma biografia adicionada'}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Animated.Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {followersAnim.__getValue().toFixed(0)}
          </Animated.Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seguidores</Text>
        </View>

        <View style={styles.statItem}>
          <Animated.Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {followingAnim.__getValue().toFixed(0)}
          </Animated.Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seguindo</Text>
        </View>

        <View style={styles.statItem}>
          <Animated.Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {postsAnim.__getValue().toFixed(0)}
          </Animated.Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
        </View>
      </View>

      <View style={styles.posts}>
        {posts.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 10 }}>
            Nenhum post ainda
          </Text>
        ) : (
          posts.map(post => (
            <View key={post.id} style={[styles.postItem, { backgroundColor: colors.cardBg }]}>
              <Text style={{ color: colors.textPrimary }}>{post.content || post.title}</Text>
              <Text style={{ color: colors.textSecondary }}>Jogo: {post.game}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: { width: '100%', height: 160 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: -50, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  followBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  info: { padding: 20 },
  name: { fontSize: 22, fontWeight: '700' },
  nick: { fontSize: 15, marginBottom: 10 },
  bio: { fontSize: 15, lineHeight: 20 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 13 },
  posts: { paddingHorizontal: 20, marginBottom: 50 },
  postItem: { padding: 14, borderRadius: 12, marginBottom: 10 },
});
