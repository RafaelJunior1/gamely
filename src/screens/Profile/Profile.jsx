import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useContext, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { db } from '../../services/firebase';

export default function Profile({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);

  const postsAnim = useSharedValue(0);
  const followersAnim = useSharedValue(0);
  const followingAnim = useSharedValue(0);

  const loadProfile = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data();
    setProfile(data);

    postsAnim.value = withTiming(data.posts || 0, { duration: 800, easing: Easing.out(Easing.exp) });
    followersAnim.value = withTiming(data.followers ? data.followers.length : 0, { duration: 800, easing: Easing.out(Easing.exp) });
    followingAnim.value = withTiming(data.following ? data.following.length : 0, { duration: 800, easing: Easing.out(Easing.exp) });

    if (data.followers && data.followers.length > 0) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('__name__', 'in', data.followers));
      const snapFollowers = await getDocs(q);
      setFollowersData(snapFollowers.docs.map(d => ({ id: d.id, ...d.data() })));
    } else setFollowersData([]);

    // Carregar seguindo completos
    if (data.following && data.following.length > 0) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('__name__', 'in', data.following));
      const snapFollowing = await getDocs(q);
      setFollowingData(snapFollowing.docs.map(d => ({ id: d.id, ...d.data() })));
    } else setFollowingData([]);
  };

  useFocusEffect(useCallback(() => { loadProfile(); }, [user]));

  const AnimatedText = Animated.createAnimatedComponent(Text);

  const animatedPosts = useAnimatedProps(() => ({ text: Math.floor(postsAnim.value).toString() }));
  const animatedFollowers = useAnimatedProps(() => ({ text: Math.floor(followersAnim.value).toString() }));
  const animatedFollowing = useAnimatedProps(() => ({ text: Math.floor(followingAnim.value).toString() }));

  if (!profile) return null;

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View>
        <Image
          source={profile.banner ? { uri: profile.banner } : require('../../../assets/banners/default.png')}
          style={styles.banner}
        />
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditProfile', {
              profile,
              refresh: loadProfile,
            })
          }
        >
          <Image
            source={profile.avatar ? { uri: profile.avatar } : require('../../../assets/avatars/default.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: colors.buttonBg }]}
          onPress={() =>
            navigation.navigate('EditProfile', {
              profile,
              refresh: loadProfile,
            })
          }
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{profile.fullName}</Text>
        <Text style={[styles.nick, { color: colors.textSecondary }]}>@{profile.nickname}</Text>
        <Text style={[styles.bio, { color: colors.textPrimary }]}>{profile.bio || 'Nenhuma biografia adicionada'}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <AnimatedText style={[styles.statNumber, { color: colors.textPrimary }]}>{profile.posts || 0}</AnimatedText>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <AnimatedText style={[styles.statNumber, { color: colors.textPrimary }]}>{followersData.length}</AnimatedText>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seguidores</Text>
        </View>
        <View style={styles.statItem}>
          <AnimatedText style={[styles.statNumber, { color: colors.textPrimary }]}>{followingData.length}</AnimatedText>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seguindo</Text>
        </View>
      </View>

      <View style={styles.games}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Jogos favoritos</Text>
        {profile.games && profile.games.length > 0 ? (
          <FlatList
            horizontal
            data={profile.games}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[styles.gameItem, { backgroundColor: colors.cardBg }]}>
                <Text style={{ color: colors.textPrimary }}>{item}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={{ color: colors.textSecondary }}>Nenhum jogo selecionado</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: { width: '100%', height: 160 },
  settingsBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#00000088',
    padding: 8,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -50,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editText: { color: '#fff', fontWeight: '600' },
  info: { padding: 20 },
  name: { fontSize: 22, fontWeight: '700' },
  nick: { fontSize: 15, marginBottom: 10 },
  bio: { fontSize: 15, lineHeight: 20 },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 15 },
  followLists: { paddingHorizontal: 20, marginVertical: 10 },
  followRow: { alignItems: 'center', marginRight: 12 },
  avatarSmall: { width: 50, height: 50, borderRadius: 25, marginBottom: 4 },
  games: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  gameItem: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginRight: 10 },
});
