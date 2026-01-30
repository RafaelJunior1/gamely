import * as ImagePicker from 'expo-image-picker';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { db } from '../../services/firebase';

export default function EditProfile({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { profile, refresh } = route.params;

  const [avatar, setAvatar] = useState(profile.avatar);
  const [banner, setBanner] = useState(profile.banner);
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);
  const [selectedGames, setSelectedGames] = useState(profile.games || []);
  const [search, setSearch] = useState('');
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      const titlesSet = new Set();
      const gameSnap = await getDocs(collection(db, 'games'));
      gameSnap.forEach(doc => {
        const data = doc.data();
        if (data?.title) titlesSet.add(data.title);
        if (Array.isArray(data.sequence)) {
          data.sequence.forEach(seq => {
            if (seq?.title) titlesSet.add(seq.title);
          });
        }
      });
      setAllGames(Array.from(titlesSet));
    };
    loadGames();
  }, []);

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 1,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    type === 'avatar' ? setAvatar(uri) : setBanner(uri);
  };

  const toggleGame = (game) => {
    setSelectedGames((prev) =>
      prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game]
    );
    setSearch('');
    setFilteredGames([]);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setFilteredGames([]);
      return;
    }
    const filtered = allGames
      .filter(title => title.toLowerCase().includes(text.toLowerCase()) && !selectedGames.includes(title));
    setFilteredGames(filtered);
  };

  const handleSave = async () => {
    if (!nickname) {
      Alert.alert('Erro', 'Nickname não pode ficar vazio');
      return;
    }

    let avatarUrl = avatar;
    let bannerUrl = banner;

    if (avatar && !avatar.startsWith('http')) {
      const uploadedAvatar = await uploadImageToCloudinary(avatar, 'avatars');
      if (uploadedAvatar) avatarUrl = uploadedAvatar;
    }

    if (banner && !banner.startsWith('http')) {
      const uploadedBanner = await uploadImageToCloudinary(banner, 'banners');
      if (uploadedBanner) bannerUrl = uploadedBanner;
    }

    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      avatar: avatarUrl || null,
      banner: bannerUrl || null,
      nickname,
      bio,
      games: selectedGames,
    });

    if (refresh) refresh();
    navigation.goBack();
  };

  const handleCancel = () => {
    Alert.alert('Cancelar edição', 'Tem certeza que quer cancelar?', [
      { text: 'Não' },
      { text: 'Sim', onPress: () => navigation.goBack() },
    ]);
  };

  const avatarSource = avatar ? { uri: avatar } : require('../../../assets/avatars/default.png');
  const bannerSource = banner ? { uri: banner } : require('../../../assets/banners/default.png');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={bannerSource} style={styles.banner} />
      <TouchableOpacity style={styles.changeBanner} onPress={() => pickImage('banner')}>
        <Text style={{ color: '#fff' }}>Alterar Banner</Text>
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => pickImage('avatar')}>
          <Image source={avatarSource} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Nickname</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
          value={nickname}
          onChangeText={setNickname}
        />

        <Text style={[styles.label, { color: colors.textPrimary }]}>Biografia</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, height: 80 }]}
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <Text style={[styles.label, { color: colors.textPrimary }]}>Jogos Favoritos</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
          placeholder="Pesquise jogos..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={handleSearch}
        />

        {filteredGames.length > 0 && (
          <View style={[styles.searchResults, { backgroundColor: colors.cardBg }]}>
            {filteredGames.map((title) => (
              <TouchableOpacity key={title} onPress={() => toggleGame(title)} style={styles.resultItem}>
                <Text style={{ color: colors.textPrimary }}>{title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedGames.length > 0 && (
          <View style={styles.selectedGames}>
            {selectedGames.map((game) => (
              <View key={game} style={[styles.selectedItem, { backgroundColor: colors.buttonBg }]}>
                <Text style={{ color: '#fff' }}>{game}</Text>
                <TouchableOpacity onPress={() => toggleGame(game)}>
                  <Text style={{ color: '#fff', marginLeft: 6 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.buttonBg }]} onPress={handleSave}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.textSecondary }]} onPress={handleCancel}>
          <Text style={{ color: colors.textSecondary, fontWeight: '700' }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: { width: '100%', height: 180 },
  changeBanner: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#00000088',
    padding: 6,
    borderRadius: 6,
  },
  avatarContainer: { alignItems: 'center', marginTop: -40, marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  form: { paddingHorizontal: 20 },
  label: { marginTop: 15, marginBottom: 6, fontWeight: '700' },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16 },
  searchResults: { marginTop: 5, borderRadius: 8, maxHeight: 510 },
  resultItem: { paddingVertical: 8, paddingHorizontal: 10 },
  selectedGames: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  saveBtn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  cancelBtn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, borderWidth: 1 },
});
