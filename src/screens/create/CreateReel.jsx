import { Ionicons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { uploadImageToCloudinary } from '../../services/cloudinary'
import { db } from '../../services/firebase'

const { width, height } = Dimensions.get('window')

export default function CreateReel({ navigation, route }) {
  const { user } = useAuth()
  const cameraVideo = route.params?.uri || null

  const videoRef = useRef(null)

  const [videoUri, setVideoUri] = useState(cameraVideo)
  const [caption, setCaption] = useState('')
  const [gameName, setGameName] = useState('')
  const [loading, setLoading] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (!videoUri) pickFromGallery()
  }, [])

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri)
    } else {
      navigation.goBack()
    }
  }

  const publishReel = async () => {
    if (!videoUri || !gameName.trim()) {
      Alert.alert('Erro', 'Informe o nome do jogo')
      return
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não logado')
      return
    }

    setLoading(true)

    try {
      const videoUrl = await uploadImageToCloudinary(videoUri, 'reels')

      await addDoc(collection(db, 'reels'), {
        videoUrl,
        caption,
        game: gameName,
        likes: [],
        commentsCount: 0,
        views: 0,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || '',
        userAvatar: user.photoURL || '',
      })

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    } catch (e) {
      console.log(e)
      Alert.alert('Erro', 'Falha ao publicar reel')
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      {videoUri && (
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              setDuration(status.durationMillis || 0)
              setPosition(status.positionMillis || 0)
            }
          }}
        />
      )}

      <TouchableOpacity style={styles.close} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.timeline}>
        <Slider
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={(value) => {
            videoRef.current?.setPositionAsync(value)
          }}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="rgba(255,255,255,0.3)"
          thumbTintColor="#fff"
        />
      </View>

      <View style={styles.form}>

        <TouchableOpacity
          style={[styles.publish, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={publishReel}
        >
          <Text style={styles.publishText}>
            {loading ? 'Publicando...' : 'Publicar Reel'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  video: {
    width: '100%',
    height: '100%',

  },

  close: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },

  timeline: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
    paddingHorizontal: 20,
  },

  form: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 20,
  },

  input: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  publish: {
    backgroundColor: '#7C4DFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },

  publishText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
