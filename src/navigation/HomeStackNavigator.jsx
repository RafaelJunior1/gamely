import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FranchiseGame from '../screens/Games/FranchiseGame';
import Games from '../screens/Games/Games';
import GameDetails from '../screens/Games/GamesDetails';
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
      <Stack.Screen name="Games" component={Games} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen
        name="FranchiseGame"
        component={FranchiseGame}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
