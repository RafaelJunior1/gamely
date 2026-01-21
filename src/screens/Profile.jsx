import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { useCallback, useContext, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { db } from '../services/firebase';

export default function Profile({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) setProfile(snap.data());
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [user])
  );

  if (!profile) return null;

  const avatarSource = profile.avatar ? { uri: profile.avatar } : require('../../assets/avatars/default.png');
  const bannerSource = profile.banner ? { uri: profile.banner } : require('../../assets/banners/default.png');

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Image source={bannerSource} style={styles.banner} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { profile, refresh: loadProfile })}>
          <Image source={avatarSource} style={styles.avatar} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: colors.buttonBg }]}
          onPress={() => navigation.navigate('EditProfile', { profile, refresh: loadProfile })}
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
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{profile.posts || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{profile.followers || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seguidores</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{profile.following || 0}</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: -50, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  editBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 6 },
  editText: { color: '#fff', fontWeight: '600' },
  info: { padding: 20 },
  name: { fontSize: 22, fontWeight: '700' },
  nick: { fontSize: 15, marginBottom: 10 },
  bio: { fontSize: 15, lineHeight: 20 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 13 },
  games: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  gameItem: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginRight: 10 },
});
