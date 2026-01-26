import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateCamera from '../screens/Create/CreateCamera';
import CreateContent from '../screens/Create/CreateContent';
import CreatePost from '../screens/Create/CreatePost';
import CreateReel from '../screens/Create/CreateReel';
import CreateStory from '../screens/Create/CreateStory';

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
