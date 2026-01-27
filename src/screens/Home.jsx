import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const { height } = Dimensions.get('window');

const postsData = [
  {
    id: '1',
    user: 'ShadowGamer',
    avatar: 'https://i.pravatar.cc/150?img=12',
    image: 'https://cdn.pixabay.com/photo/2016/11/29/09/16/game-1869311_960_720.jpg',
    likes: 245,
    comments: 32,
    shares: 14,
    description: 'Check this insane frag!',
    audio: 'Cyber Beat',
    game: 'Valorant',
  },
  {
    id: '2',
    user: 'PixelQueen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    image: 'https://cdn.pixabay.com/photo/2017/01/31/22/21/game-2023864_960_720.jpg',
    likes: 312,
    comments: 45,
    shares: 20,
    description: 'New level unlocked!',
    audio: 'Epic Gamer Music',
    game: 'Minecraft',
  },
];

export default function Home({ navigation }) {
  const { colors } = useContext(ThemeContext);

  // Função para animar os números
  const AnimatedNumber = ({ value, duration = 800, style }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: value,
        duration,
        useNativeDriver: false,
      }).start();
    }, [value]);

    const animatedText = animatedValue.interpolate({
      inputRange: [0, value],
      outputRange: [0, value],
      extrapolate: 'clamp',
    });

    return (
      <Animated.Text style={style}>
        {animatedValue.interpolate({
          inputRange: [0, value],
          outputRange: [0, value],
          extrapolate: 'clamp',
        }).__getValue().toFixed(0)}
      </Animated.Text>
    );
  };

  const renderPost = ({ item }) => (
    <View style={[styles.postContainer, { backgroundColor: colors.cardBg }]}>
      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={[styles.username, { color: colors.textPrimary }]}>{item.user}</Text>
          <TouchableOpacity style={[styles.followBtn, { backgroundColor: colors.buttonBg }]}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.description, { color: colors.textPrimary }]}>{item.description}</Text>

        <Text style={[styles.gameName, { color: colors.textSecondary }]}>
          🎮 {item.game}
        </Text>

        <Text style={[styles.audio, { color: colors.textSecondary }]}>
          <Ionicons name="musical-note-outline" size={16} color={colors.textSecondary} /> {item.audio}
        </Text>

        <View style={styles.sideButtons}>
          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="heart-outline" size={28} color="#FF4444" />
            <Text style={[styles.sideBtnText, { color: colors.textSecondary }]}>
              <AnimatedCount value={item.likes} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="chatbubble-outline" size={28} color={colors.textSecondary} />
            <Text style={[styles.sideBtnText, { color: colors.textSecondary }]}>
              <AnimatedCount value={item.comments} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="arrow-redo-outline" size={28} color={colors.textSecondary} />
            <Text style={[styles.sideBtnText, { color: colors.textSecondary }]}>
              <AnimatedCount value={item.shares} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn}>
            <MaterialIcons name="audiotrack" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header navigation={navigation} />

      <FlatList
        data={postsData}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const AnimatedCount = ({ value }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <Animated.Text>
      {animatedValue.interpolate({
        inputRange: [0, value],
        outputRange: [0, value],
      }).__getValue().toFixed(0)}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  postContainer: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },

  postImage: {
    width: '100%',
    height: height * 0.4,
    resizeMode: 'cover',
  },

  overlay: { padding: 12 },

  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },

  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#333' },

  username: { fontFamily: 'Roboto', fontSize: 15, marginLeft: 8, fontWeight: '600' },

  followBtn: { marginLeft: 10, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },

  followText: { color: '#fff', fontFamily: 'Panama', fontSize: 12 },

  description: { fontFamily: 'Roboto', fontSize: 14, marginBottom: 4 },

  gameName: { fontFamily: 'Roboto', fontSize: 12, marginBottom: 4, fontStyle: 'italic' },

  audio: { fontFamily: 'Roboto', fontSize: 12, marginBottom: 8 },

  sideButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 6 },

  sideBtn: { alignItems: 'center' },

  sideBtnText: { fontFamily: 'Roboto', fontSize: 12, marginTop: 2 },
});
