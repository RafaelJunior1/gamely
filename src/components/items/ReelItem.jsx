import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReelItem({ item }) {
  const scale = useRef(new Animated.Value(0)).current;
  const [liked, setLiked] = useState(false);
  const videoRef = useRef(null);

  const handleLike = () => {
    setLiked(prev => !prev);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => scale.setValue(0));
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: item.mediaUrl }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
      />
      <TouchableOpacity style={styles.overlay} onPress={handleLike}>
        {liked && (
          <Animated.View style={[styles.heart, { transform: [{ scale }] }]}>
            <Ionicons name="heart" size={80} color="#fff" />
          </Animated.View>
        )}
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? '#e91e63' : '#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 16 }}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.likes}>{item.likes?.length || 0} curtidas</Text>
        {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 500, marginBottom: 20, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  footer: { position: 'absolute', right: 10, bottom: 20, alignItems: 'flex-end' },
  likes: { color: '#fff', fontWeight: '700', marginTop: 8 },
  caption: { color: '#fff', marginTop: 4, width: 200 },
  heart: { position: 'absolute', top: '40%', left: '40%' },
});
