import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateCamera from '../screens/create/CreateCamera';
import CreateContent from '../screens/create/CreateContent';
import CreatePost from '../screens/create/CreatePost';
import CreateReel from '../screens/create/CreateReel';
import CreateStory from '../screens/create/CreateStory';

const Stack = createNativeStackNavigator();

export default function CreateNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CreateCamera} />

      <Stack.Screen name="Post" component={CreatePost} />
      <Stack.Screen name="Reel" component={CreateReel} />
      <Stack.Screen name="Story" component={CreateStory} />
      <Stack.Screen name="Conteudo" component={CreateContent} />
    </Stack.Navigator>
  );
}
