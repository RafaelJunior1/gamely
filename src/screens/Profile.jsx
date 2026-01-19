import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { db } from '../services/firebase';

export default function Profile({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfile(docSnap.data());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) return;
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, { avatar: result.assets[0].uri });
    setProfile(prev => ({ ...prev, avatar: result.assets[0].uri }));
  };

  if (loading) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickAvatar}>
          <Image
            source={
              profile.avatar && profile.avatar !== 'NULL'
                ? { uri: profile.avatar }
                : require('../../assets/avatars/default.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{profile.fullName}</Text>
          <Text style={[styles.nickname, { color: colors.textSecondary }]}>@{profile.nickname}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="create-outline" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{profile.followers}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seguidores</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{profile.following}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seguindo</Text>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <Text style={[styles.bio, { color: colors.textPrimary }]}>{profile.bio || 'Adicione uma biografia'}</Text>
      </View>

      <View style={styles.gamesContainer}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Jogos</Text>
        {profile.games.length > 0 ? (
          <FlatList
            data={profile.games}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.gameItem, { backgroundColor: colors.cardBg }]}>
                <Text style={{ color: colors.textPrimary }}>{item}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text style={{ color: colors.textSecondary }}>Nenhum jogo adicionado</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: '700' },
  nickname: { fontSize: 16 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 14 },
  bioContainer: { marginBottom: 20 },
  bio: { fontSize: 16 },
  gamesContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  gameItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
});
