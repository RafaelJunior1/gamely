import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useContext, useState } from 'react';
import { Dimensions, Image, PanResponder, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function CreateStory() {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

  const media = route.params?.media?.[0];
  const [elements, setElements] = useState([]);
  const [addingText, setAddingText] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [musicPreview, setMusicPreview] = useState(null);

  if (!media) return <View style={styles.center}><Text>Erro ao carregar Story</Text></View>;

  const addElement = (type, content) => {
    const newEl = {
      id: Date.now().toString(),
      type,
      content,
      pan: { x: width / 4, y: height / 3 },
    };
    setElements([...elements, newEl]);

    if(type === 'music' && musicPreview){
      musicPreview.stopAsync();
    }
    if(type === 'music'){
      Audio.Sound.createAsync({uri: content}).then(({sound}) => { setMusicPreview(sound); sound.playAsync(); });
    }
  };

  const renderElement = (el) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        el.pan.x = gesture.moveX - 50;
        el.pan.y = gesture.moveY - 20;
        setElements([...elements]);
      },
      onPanResponderRelease: () => {},
    });

    if(el.type === 'text'){
      return (
        <View key={el.id} style={[styles.elementWrapper, {top: el.pan.y, left: el.pan.x}]} {...panResponder.panHandlers}>
          <Text style={[styles.storyText, {color: colors.textPrimary}]}>{el.content}</Text>
        </View>
      );
    }

    if(el.type === 'gif' || el.type === 'sticker'){
      return (
        <View key={el.id} style={[styles.elementWrapper, {top: el.pan.y, left: el.pan.x}]} {...panResponder.panHandlers}>
          <Text style={{fontSize:50}}>{el.content}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: media.uri }} style={styles.background} resizeMode="cover" />

      {elements.map(renderElement)}

      <View style={styles.sideMenu}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setAddingText(true)}>
          <Text style={styles.iconText}>T</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={() => addElement('gif','🎉')}>
          <Text style={styles.iconText}>GIF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={() => addElement('sticker','❤️')}>
          <Text style={styles.iconText}>ST</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={() => addElement('music','https://p.scdn.co/mp3-preview/...')}>
          <Text style={styles.iconText}>🎵</Text>
        </TouchableOpacity>
      </View>

      {addingText && (
        <TextInput
          autoFocus
          value={textInput}
          onChangeText={setTextInput}
          placeholder="Digite seu texto"
          placeholderTextColor={colors.textSecondary}
          style={[styles.inputText, { color: colors.textPrimary, borderColor: colors.textSecondary }]}
          onSubmitEditing={() => {
            addElement('text', textInput);
            setTextInput('');
            setAddingText(false);
          }}
        />
      )}

      <TouchableOpacity style={[styles.postButton,{backgroundColor: colors.buttonBg}]} onPress={() => {
        console.log('Story publicado:', { media, elements });
        navigation.goBack();
      }}>
        <Text style={styles.postText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { width, height, position: 'absolute' },
  sideMenu: { position: 'absolute', right: 10, top: 60, alignItems:'center' },
  iconBtn: { marginBottom: 18, backgroundColor: 'rgba(0,0,0,0.4)', width:42,height:42,borderRadius:21,alignItems:'center',justifyContent:'center' },
  iconText: { color:'#fff', fontSize:18 },
  postButton: { position:'absolute', bottom:40, alignSelf:'center', paddingHorizontal:28, paddingVertical:12, borderRadius:24 },
  postText: { color:'#fff', fontWeight:'700', fontSize:16 },
  center: { flex:1,alignItems:'center',justifyContent:'center' },
  elementWrapper: { position:'absolute' },
  storyText: { fontSize:28, fontWeight:'700', textAlign:'center' },
  inputText: { position:'absolute', bottom:100, left:20, right:20, borderWidth:1, borderRadius:12, padding:10, fontSize:18, backgroundColor:'rgba(0,0,0,0.4)' }
});
