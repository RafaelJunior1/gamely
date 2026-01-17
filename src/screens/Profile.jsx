import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { auth } from '../services/firebase';

const db = getFirestore();

const POSTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i.toString(),
  image: ``,
}));

const GAME_AVATARS = [
  require('https://preview.redd.it/trying-to-come-up-with-a-new-avatar-for-my-various-social-v0-8fs49e6e1lsb1.jpg?width=519&format=pjpg&auto=webp&s=220d8e08781d7078c64e3ffc25382a18a87d5c98'),
  require('https://img.freepik.com/free-photo/cute-cat-with-computer_23-2150932174.jpg?semt=ais_hybrid&w=740&q=80'),
  require('https://img.freepik.com/free-vector/gradient-galaxy-background_52683-140335.jpg?semt=ais_hybrid&w=740&q=80'),
];

export default function Profile() {
  const { colors } = useContext(ThemeContext);
  const user = auth.currentUser;

  const [profile, setProfile] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
        setBio(snap.data().bio || '');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function saveBio() {
    try {
      await updateDoc(doc(db, 'users', user.uid), { bio });
      setProfile(prev => ({ ...prev, bio }));
      setEditVisible(false);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  }

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      updateAvatar(result.assets[0].uri);
    }
  }

  async function updateAvatar(uri) {
    await updateDoc(doc(db, 'users', user.uid), { avatar: uri });
    setProfile(prev => ({ ...prev, avatar: uri }));
  }

  if (!profile) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <TouchableOpacity onPress={() => setEditVisible(true)}>
          <Image
            source={
              profile.avatar
                ? { uri: profile.avatar }
                : require('../../assets/avatars/default.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={[styles.nickname, { color: colors.textPrimary }]}>
          @{profile.nickname}
        </Text>

        <Text style={[styles.bio, { color: colors.textSecondary }]}>
          {profile.bio || 'Adicione uma biografia gamer 🎮'}
        </Text>

        <View style={styles.stats}>
          <Stat label="Posts" value={POSTS.length} />
          <Stat label="Seguidores" value={profile.followers || 0} />
          <Stat label="Seguindo" value={profile.following || 0} />
        </View>

        <TouchableOpacity
          style={[styles.editBtn, { borderColor: colors.buttonBg }]}
          onPress={() => setEditVisible(true)}
        >
          <Text style={{ color: colors.buttonBg }}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={POSTS}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      />

      <Modal visible={editVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Editar Perfil
            </Text>

            <TextInput
              placeholder="Biografia"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.textPrimary }]}
              value={bio}
              onChangeText={setBio}
              multiline
            />

            <Text style={{ color: colors.textSecondary, marginTop: 10 }}>
              Escolher avatar gamer
            </Text>

            <View style={styles.avatarRow}>
              {GAME_AVATARS.map((a, i) => (
                <TouchableOpacity key={i} onPress={() => updateAvatar(Image.resolveAssetSource(a).uri)}>
                  <Image source={a} style={styles.smallAvatar} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={pickFromGallery} style={styles.galleryBtn}>
              <Text style={{ color: '#fff' }}>Escolher da galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={saveBio} style={styles.saveBtn}>
              <Text style={{ color: '#fff' }}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEditVisible(false)}>
              <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  profileInfo: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#7C4DFF',
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  bio: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 15,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 13,
    color: '#aaa',
  },
  editBtn: {
    marginTop: 15,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  postImage: {
    width: '33.33%',
    height: 120,
  },
  modal: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
  },
  avatarRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  smallAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  galleryBtn: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: '#7C4DFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
});
