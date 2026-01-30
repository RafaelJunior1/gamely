import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { db } from '../../services/firebase';

const { width } = Dimensions.get('window');

export default function CreatePost({ navigation }) {
  const { user, loading } = useAuth();
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  if (loading) return null;
  if (!user) return null;

  const confirmExit = () => {
    Alert.alert(
      'Descartar post?',
      'Tem certeza que deseja sair? As imagens serão perdidas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) return;
    setSelectedImages(result.assets.map(a => a.uri));
  };

  const uploadAllImages = async () => {
    const urls = [];
    for (let uri of selectedImages) {
      const url = await uploadImageToCloudinary(uri, 'posts');
      if (url) urls.push(url);
    }
    return urls;
  };

  const publishPost = async () => {
    if (!selectedImages.length) {
      Alert.alert('Selecione pelo menos uma imagem.');
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadAllImages();

      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        images: urls,
        caption,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });

      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      console.log('Erro ao publicar post:', error);
      Alert.alert('Erro', 'Não foi possível publicar o post.');
    } finally {
      setUploading(false);
    }
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.previewImage} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={confirmExit}>
          <Ionicons name="close" size={32} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Novo Post</Text>
        <View style={{ width: 32 }} /> 
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity style={styles.pickImagesButton} onPress={pickImages}>
          <Text style={styles.pickImagesText}>Selecionar Imagens</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <FlatList
            data={selectedImages}
            horizontal
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderImage}
            style={styles.imagesContainer}
          />
        )}

        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Escreva uma legenda..."
          placeholderTextColor="#888"
          style={styles.captionInput}
          multiline
        />

        <TouchableOpacity
          style={[styles.publishButton, uploading && { opacity: 0.6 }]}
          onPress={publishPost}
          disabled={uploading}
        >
          <Text style={styles.publishText}>
            {uploading ? 'Publicando...' : 'Publicar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  topBarTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  pickImagesButton: {
    backgroundColor: '#7C4DFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  pickImagesText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  imagesContainer: { marginBottom: 20 },
  previewImage: {
    width: width / 3,
    height: width / 3,
    marginRight: 10,
    borderRadius: 10,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 30,
    textAlignVertical: 'top',
  },
  publishButton: {
    backgroundColor: '#7C4DFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  publishText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
