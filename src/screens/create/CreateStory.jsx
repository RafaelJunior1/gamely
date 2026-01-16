// src/screens/CreateStory.jsx
import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, Video, View } from 'react-native';
import MusicLibrary from '../../components/MusicLibrary';
import { ThemeContext } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function CreateStory() {
  const { colors } = useContext(ThemeContext);
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [selectedMusic, setSelectedMusic] = useState(null);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) setMedia(result.assets ? result.assets[0] : result);
  };

  const handlePost = () => {
    if (!media) return alert('Escolha ao menos uma mídia!');
    const postData = { type: 'Story', media, caption, music: selectedMusic, createdAt: new Date() };
    console.log('Story enviado:', postData);
    alert('Story enviado! (mock)');
    setMedia(null); setCaption(''); setSelectedMusic(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Mídia */}
      <TouchableOpacity style={styles.mediaArea} onPress={pickMedia}>
        {media ? (
          media.type?.startsWith('video') ? (
            <Video source={{ uri: media.uri }} style={styles.mediaArea} resizeMode="cover" useNativeControls isLooping />
          ) : (
            <Image source={{ uri: media.uri }} style={styles.mediaArea} />
          )
        ) : (
          <Text style={{ color: colors.textSecondary }}>Toque para adicionar foto ou vídeo</Text>
        )}
      </TouchableOpacity>

      <MusicLibrary query="" selectedMusic={selectedMusic} onSelect={setSelectedMusic} />

      {/* Inputs */}
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <TextInput placeholder="Texto no Story" placeholderTextColor={colors.textSecondary} value={caption} onChangeText={setCaption} style={[styles.input, { color: colors.textPrimary, borderColor: colors.textSecondary }]} />
      </View>

      <TouchableOpacity style={[styles.postBtn, { backgroundColor: colors.buttonBg }]} onPress={handlePost}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>POSTAR STORY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mediaArea: { width, height: height * 0.6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  input: { borderWidth: 1, borderRadius: 12, padding: 10, marginVertical: 5 },
  postBtn: { margin: 20, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 50 },
});
