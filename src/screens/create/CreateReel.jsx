// src/screens/CreateReel.jsx
import { Audio, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function CreateReel() {
  const { colors } = useContext(ThemeContext);

  const [clips, setClips] = useState([]); // vídeos
  const [caption, setCaption] = useState('');
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [previewAudio, setPreviewAudio] = useState(null);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) setClips(result.assets || [result]);
  };

  const searchMusic = (query) => {
    const mockResults = [
      { id: '1', name: 'Epic Gamer', artist: 'DJ Shadow', preview: 'https://p.scdn.co/mp3-preview/...' },
      { id: '2', name: 'Battle Theme', artist: 'EpicSound', preview: 'https://p.scdn.co/mp3-preview/...' },
    ];
    return mockResults.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
  };

  const selectMusic = async (music) => {
    setSelectedMusic(music);
    if (previewAudio) await previewAudio.unloadAsync();
    const { sound } = await Audio.Sound.createAsync({ uri: music.preview });
    setPreviewAudio(sound);
    await sound.playAsync();
  };

  const handlePost = () => {
    if (clips.length === 0) return alert('Escolha ao menos um clipe!');
    const reelData = { type: 'reel', clips, caption, music: selectedMusic, createdAt: new Date() };
    console.log('Reel enviado:', reelData);
    alert('Reel enviado! (mock)');
    setClips([]);
    setCaption('');
    setSelectedMusic(null);
    if (previewAudio) previewAudio.stopAsync();
  };

  const renderClip = ({ item }) => (
    <Video
      source={{ uri: item.uri }}
      style={{ width: width - 40, height: 300, borderRadius: 12, marginRight: 10 }}
      resizeMode="cover"
      useNativeControls
      isLooping
    />
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={[styles.pickBtn, { backgroundColor: colors.buttonBg }]} onPress={pickVideo}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Escolher Vídeo(s)</Text>
      </TouchableOpacity>

      {clips.length > 0 && (
        <FlatList
          data={clips}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderClip}
          style={{ marginVertical: 10, paddingLeft: 20 }}
        />
      )}

      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <Text style={{ color: colors.textPrimary, marginBottom: 5 }}>Música (Spotify)</Text>
        <ScrollView horizontal>
          {searchMusic('Epic').map(music => (
            <TouchableOpacity key={music.id} onPress={() => selectMusic(music)} style={{ marginRight: 10 }}>
              <View style={{ backgroundColor: colors.cardBg, padding: 10, borderRadius: 10 }}>
                <Text style={{ color: colors.textPrimary }}>{music.name}</Text>
                <Text style={{ color: colors.textSecondary }}>{music.artist}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={[styles.postBtn, { backgroundColor: colors.buttonBg }]} onPress={handlePost}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>POSTAR REEL</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pickBtn: { marginHorizontal: 20, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  postBtn: { margin: 20, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 50 },
});
