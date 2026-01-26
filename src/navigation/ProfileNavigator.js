import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../screens/Profile/EditProfile';
import Profile from '../screens/Profile/Profile';
import FeedbackScreen from '../screens/Settings/FeedbackScreen';
import HelpScreen from '../screens/Settings/HelpScreen';
import PrivacyScreen from '../screens/Settings/PrivacyScreen';
import Settings from '../screens/Settings/Settings';
import UserProfile from '../screens/UserProfile';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false}}/>
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
}
