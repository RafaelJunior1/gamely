import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PostItem({ item }) {
  const scale = useRef(new Animated.Value(0)).current;
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(prev => !prev);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => scale.setValue(0));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.user}>{item.user?.nickname || 'Usuário'}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={handleLike}>
        <Image source={{ uri: item.mediaUrl }} style={styles.image} />
        {liked && (
          <Animated.View style={[styles.heart, { transform: [{ scale }] }]}>
            <Ionicons name="heart" size={80} color="#fff" />
          </Animated.View>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? '#e91e63' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="chatbubble-outline" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.likes}>{item.likes?.length || 0} curtidas</Text>
        {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, backgroundColor: '#fff' },
  header: { padding: 10 },
  user: { fontWeight: '700' },
  image: { width: '100%', height: 350 },
  footer: { padding: 10 },
  likes: { fontWeight: '700', marginTop: 4 },
  caption: { marginTop: 2 },
  heart: { position: 'absolute', top: '40%', left: '40%' },
});
