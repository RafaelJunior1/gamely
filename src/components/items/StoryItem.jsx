import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StoryItem({ item }) {
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
      <TouchableOpacity activeOpacity={0.9} onPress={handleLike}>
        <Image source={{ uri: item.mediaUrl }} style={styles.image} />
        {liked && (
          <Animated.View style={[styles.heart, { transform: [{ scale }] }]}>
            <Ionicons name="heart" size={80} color="#fff" />
          </Animated.View>
        )}
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.user}>{item.user?.nickname || 'Usuário'}</Text>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? '#e91e63' : '#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, position: 'relative' },
  image: { width: 150, height: 250, borderRadius: 12 },
  footer: { position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', alignItems: 'center' },
  user: { color: '#fff', fontWeight: '700', marginRight: 10 },
  heart: { position: 'absolute', top: '40%', left: '40%' },
});
