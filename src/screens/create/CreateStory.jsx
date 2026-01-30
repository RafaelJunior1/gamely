import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { db, storage } from '../../services/firebase';

const { width, height } = Dimensions.get('window');
const DEFAULT_TEXT_COLOR = '#fff';
const DEFAULT_TEXT_SIZE = 28;

export default function StoryCreate({ navigation, route }) {
  const { uri, mediaType } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;

  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [editing, setEditing] = useState(false);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const [draggingIndex, setDraggingIndex] = useState(null);
  const [positions, setPositions] = useState([]);
  const [scales, setScales] = useState([]);

  useEffect(() => {
    if (editing) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [editing]);

  const confirmExit = () => {
    Alert.alert(
      'Descartar story?',
      'Tem certeza que deseja sair? O story será perdido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const uploadMedia = async () => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `stories/${Date.now()}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  const publishStory = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const downloadURL = await uploadMedia();
      await addDoc(collection(db, 'stories'), {
        mediaUrl: downloadURL,
        mediaType,
        texts: texts.map((t, i) => ({
          text: t.text,
          position: positions[i] || { x: width / 2 - 50, y: height / 3 },
          color: t.color || DEFAULT_TEXT_COLOR,
          size: scales[i] || DEFAULT_TEXT_SIZE,
        })),
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: user?.uid || 'unknown',
        username: user?.displayName || 'Anon',
        profilePic: user?.photoURL || null,
        likes: [],
        views: [],
        directMessages: [],
      });
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e) {
      Alert.alert('Erro', 'Falha ao publicar o story');
      console.error(e);
    }
    setLoading(false);
  };

  const addText = () => {
    if (!currentText.trim()) return;
    setTexts([...texts, { text: currentText, color: textColor }]);
    setPositions([...positions, { x: width / 2 - 50, y: height / 3 }]);
    setScales([...scales, DEFAULT_TEXT_SIZE]);
    setCurrentText('');
    setEditing(false);
  };

  const removeText = index => {
    setTexts(texts.filter((_, i) => i !== index));
    setPositions(positions.filter((_, i) => i !== index));
    setScales(scales.filter((_, i) => i !== index));
  };

  const createPanResponder = index =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setDraggingIndex(index),
      onPanResponderMove: (_, gestureState) => {
        setPositions(prev => {
          const newPos = [...prev];
          newPos[index] = { x: gestureState.moveX - 50, y: gestureState.moveY - 50 };
          return newPos;
        });
      },
      onPanResponderRelease: () => setDraggingIndex(null),
    });

  const handlePinch = (event, index) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const scale = event.nativeEvent.scale;
      setScales(prev => {
        const newScales = [...prev];
        newScales[index] = DEFAULT_TEXT_SIZE * scale;
        return newScales;
      });
    }
  };

  return (
    <View style={styles.container}>
      {mediaType === 'video' ? (
        <Video source={{ uri }} style={styles.media} resizeMode="cover" shouldPlay isLooping />
      ) : (
        <Image source={{ uri }} style={styles.media} />
      )}

      <View style={styles.topBar}>
        <TouchableOpacity onPress={confirmExit}>
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditing(true)}>
          <Ionicons name="text" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {texts.map((t, i) => {
        const pan = createPanResponder(i);
        return (
          <PinchGestureHandler key={i} onGestureEvent={e => handlePinch(e, i)}>
            <View {...pan.panHandlers} style={{ position: 'absolute', left: positions[i]?.x, top: positions[i]?.y }}>
              <Text style={{ color: t.color, fontSize: scales[i] || DEFAULT_TEXT_SIZE, fontWeight: '600' }}>{t.text}</Text>
              <TouchableOpacity style={styles.removeTextButton} onPress={() => removeText(i)}>
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </PinchGestureHandler>
        );
      })}

      {editing && (
        <View style={styles.textEditor}>
          <TextInput
            ref={inputRef}
            value={currentText}
            onChangeText={setCurrentText}
            placeholder="Digite algo..."
            placeholderTextColor="#bbb"
            style={styles.textInput}
            multiline
          />
          <View style={styles.colorPicker}>
            {['#fff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'].map(color => (
              <TouchableOpacity key={color} onPress={() => setTextColor(color)} style={[styles.colorCircle, { backgroundColor: color }]} />
            ))}
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={addText}>
            <Text style={styles.doneText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.publishButton, loading && { opacity: 0.6 }]} onPress={publishStory} disabled={loading}>
          <Text style={styles.publishText}>{loading ? 'Publicando...' : 'Publicar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  media: { width, height },
  topBar: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 20 },
  bottomBar: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  publishButton: { backgroundColor: '#7C4DFF', paddingHorizontal: 36, paddingVertical: 14, borderRadius: 30 },
  publishText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  textEditor: { position: 'absolute', top: height / 3, width: '100%', paddingHorizontal: 30, alignItems: 'center' },
  textInput: { color: '#fff', fontSize: 28, fontWeight: '600', textAlign: 'center' },
  doneButton: { marginTop: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20 },
  doneText: { color: '#fff', fontSize: 14 },
  removeTextButton: { position: 'absolute', top: -12, right: -12 },
  colorPicker: { flexDirection: 'row', marginTop: 10, justifyContent: 'center' },
  colorCircle: { width: 28, height: 28, borderRadius: 14, marginHorizontal: 4, borderWidth: 1, borderColor: '#fff' },
});
