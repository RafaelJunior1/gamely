import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../screens/EditProfile';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}
