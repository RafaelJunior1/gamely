// src/components/MusicLibrary.jsx
import { Audio } from 'expo-av';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { fetchDistroKidMusic } from '../services/musicServices'; // API real

export default function MusicLibrary({ query = '', selectedMusic, onSelect }) {
  const { colors } = useContext(ThemeContext);
  const [musicList, setMusicList] = useState([]);
  const [previewAudio, setPreviewAudio] = useState(null);

  useEffect(() => {
    async function loadMusic() {
      const results = await fetchDistroKidMusic(query);
      setMusicList(results);
    }
    loadMusic();
  }, [query]);

  useEffect(() => {
    return () => {
      if (previewAudio) previewAudio.unloadAsync();
    };
  }, [previewAudio]);

  const handleSelect = async (music) => {
    if (previewAudio) await previewAudio.unloadAsync();

    if (music?.preview) {
      const { sound } = await Audio.Sound.createAsync({ uri: music.preview });
      setPreviewAudio(sound);
      await sound.playAsync();
    }

    onSelect && onSelect(music);
  };

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
      <Text style={{ color: colors.textPrimary, marginBottom: 5, fontWeight: '600' }}>
        Biblioteca de Músicas
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {musicList.map((music) => {
          const isSelected = selectedMusic?.id === music.id;
          return (
            <TouchableOpacity
              key={music.id}
              onPress={() => handleSelect(music)}
              style={{
                padding: 10,
                borderRadius: 12,
                marginRight: 10,
                backgroundColor: isSelected ? colors.buttonBg : colors.cardBg,
                minWidth: 120,
              }}
            >
              <Text style={{ color: isSelected ? '#fff' : colors.textPrimary, fontWeight: '600' }}>
                {music.name}
              </Text>
              <Text style={{ color: isSelected ? '#fff' : colors.textSecondary, fontSize: 12 }}>
                {music.artist}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
