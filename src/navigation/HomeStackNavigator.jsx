import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Messages from '../screens/Messages';
import Notifications from '../screens/Notifications';
import HomeNavigator from './HomeNavigate';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDrawer" component={HomeNavigator} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
}
