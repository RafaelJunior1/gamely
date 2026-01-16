import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MusicLibrary from '../../components/MusicLibrary';
import { ThemeContext } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function CreatePost() {
  const { colors } = useContext(ThemeContext);
  const [type, setType] = useState('Post');
  const [media, setMedia] = useState([]);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedMusic, setSelectedMusic] = useState(null);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets) setMedia(result.assets);
      else setMedia([result]);
    }
  };

  const handlePost = () => {
    if (!media.length) return alert('Escolha ao menos uma mídia!');
    const postData = { type, media, caption, hashtags, music: selectedMusic, createdAt: new Date() };
    console.log('Post enviado:', postData);
    alert('Post enviado! (mock)');
    setMedia([]); setCaption(''); setHashtags(''); setSelectedMusic(null);
  };

  const renderMediaItem = ({ item }) => {
    if (item.type?.startsWith('video')) {
      return <Video source={{ uri: item.uri }} style={{ width: width - 40, height: 300, borderRadius: 12, marginRight: 10 }} resizeMode="cover" useNativeControls isLooping />;
    }
    return <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, borderRadius: 12, marginRight: 10 }} />;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tipo de publicação */}
      <View style={styles.typeSelector}>
        {['Post','Reel','Story'].map(t => (
          <TouchableOpacity key={t} onPress={() => setType(t)} style={[styles.typeBtn, type === t && { backgroundColor: colors.buttonBg }]}>
            <Text style={{ color: type === t ? '#fff' : colors.textPrimary, fontWeight: '600' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botões de mídia */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        <TouchableOpacity style={[styles.pickBtn, { backgroundColor: colors.buttonBg }]} onPress={pickMedia}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Escolher da Galeria</Text>
        </TouchableOpacity>
      </View>

      {/* Preview mídia */}
      {media.length > 0 && <FlatList data={media} horizontal keyExtractor={(item,i)=>i.toString()} renderItem={renderMediaItem} style={{ marginVertical: 10, paddingLeft: 20 }} />}

      {/* Inputs */}
      <View style={{ paddingHorizontal: 20 }}>
        <TextInput placeholder="Legenda" placeholderTextColor={colors.textSecondary} value={caption} onChangeText={setCaption} multiline style={[styles.input, { color: colors.textPrimary, borderColor: colors.textSecondary }]} />
        <TextInput placeholder="#hashtags" placeholderTextColor={colors.textSecondary} value={hashtags} onChangeText={setHashtags} style={[styles.input, { color: colors.textPrimary, borderColor: colors.textSecondary }]} />
      </View>

      {/* Biblioteca de músicas */}
      <MusicLibrary query="" selectedMusic={selectedMusic} onSelect={setSelectedMusic} />

      {/* Botão postar */}
      <TouchableOpacity style={[styles.postBtn, { backgroundColor: colors.buttonBg }]} onPress={handlePost}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>POSTAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  typeBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 25, borderWidth: 1 },
  pickBtn: { padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 20 },
  input: { borderWidth: 1, borderRadius: 12, padding: 10, marginVertical: 5 },
  postBtn: { margin: 20, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 50 },
});
