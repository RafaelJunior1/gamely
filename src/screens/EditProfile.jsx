import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { auth, db } from '../services/firebase';

export default function EditProfile({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFullName(data.fullName || '');
        setNickname(data.nickname || '');
        setBio(data.bio || '');
        setAvatar(data.avatar || null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!fullName || !nickname) {
      Alert.alert('Erro', 'Nome completo e nickname são obrigatórios.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        fullName,
        nickname,
        bio,
        avatar,
      });
      Alert.alert('Sucesso', 'Perfil atualizado!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  if (loading) return null;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { borderColor: colors.buttonBg }]}>
            <Ionicons name="camera-outline" size={40} color={colors.buttonBg} />
          </View>
        )}
        <Text style={{ color: colors.textSecondary, marginTop: 6 }}>Alterar Avatar</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
        placeholder="Nome completo"
        placeholderTextColor={colors.textSecondary}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary }]}
        placeholder="Nickname"
        placeholderTextColor={colors.textSecondary}
        value={nickname}
        onChangeText={setNickname}
      />

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.cardBg, color: colors.textPrimary, height: 100, textAlignVertical: 'top' },
        ]}
        placeholder="Biografia"
        placeholderTextColor={colors.textSecondary}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: colors.buttonBg }]}
        onPress={handleSave}
      >
        <Text style={{ color: colors.buttonText, fontSize: 16, fontWeight: '600' }}>
          Salvar Alterações
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  saveBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#7C4DFF',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
});
