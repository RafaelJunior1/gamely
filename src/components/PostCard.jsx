import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function PostCard({ post }) {
  if (!post) return null;

  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={40} color="#7C4DFF" />
        <View>
          <Text style={styles.user}>{post.user}</Text>
          <Text style={styles.game}>{post.game}</Text>
        </View>
      </View>

      <View style={styles.mediaContainer}>
        {post.image ? (
          <Image source={{ uri: post.image }} style={styles.media} />
        ) : (
          <Text style={{ color: '#777' }}>Sem mídia</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={26} color="#FF4081" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={26} color="#00E5FF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={26} color="#7C4DFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.desc}>{post.description}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A2E',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#7C4DFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  user: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  game: {
    color: '#00E5FF',
    fontSize: 12,
  },
  mediaContainer: {
    height: 200,
    backgroundColor: '#0F0F1A',
    borderRadius: 12,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  desc: {
    color: '#CCC',
  },
});
