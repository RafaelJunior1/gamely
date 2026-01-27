import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Explore from '../screens/Explore';
import UserProfile from '../screens/UserProfile';

const Stack = createNativeStackNavigator();

export default function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explore" component={Explore} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
}
