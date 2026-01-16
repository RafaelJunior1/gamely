import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ShortCard = ({ item, isActive, containerHeight }) => {
  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {/* Vídeo */}
      <Video
        source={{ uri: item.uri }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={isActive}
        isLooping
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Usuário e Follow */}
        <View style={styles.userInfo}>
          <Image source={{ uri: item.profile }} style={styles.avatar} />
          <Text style={styles.username}>{item.user}</Text>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>

        {/* Descrição do vídeo */}
        <Text style={styles.description}>{item.description}</Text>

        {/* Botões laterais */}
        <View style={styles.sideButtons}>
          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="heart-outline" size={28} color="#FF4081" />
            <Text style={styles.sideBtnText}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="chatbubble-outline" size={28} color="#00E5FF" />
            <Text style={styles.sideBtnText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="arrow-redo-outline" size={28} color="#fff" />
            <Text style={styles.sideBtnText}>{item.reposts}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn}>
            <MaterialIcons name="audiotrack" size={28} color="#FFEA00" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#0F0F1A',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 60, // espaço para menu inferior
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#fff',
  },
  username: {
    color: '#fff',
    fontFamily: 'ROboto',
    fontSize: 16,
    marginLeft: 8,
  },
  followBtn: {
    marginLeft: 10,
    backgroundColor: '#FF4081',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  followText: {
    color: '#fff',
    fontFamily: 'Panama',
    fontSize: 12,
  },
  description: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 14,
    marginBottom: 8,
  },
  sideButtons: {
    position: 'absolute',
    right: 10,
    bottom: 60,
    alignItems: 'center',
  },
  sideBtn: {
    marginBottom: 18,
    alignItems: 'center',
  },
  sideBtnText: {
    color: '#fff',
    fontFamily: 'Panama',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 20,
  },
});

export default ShortCard;
