import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Intro from '../screens/Intro';
import Login from '../screens/Login';
import Register from '../screens/Register';
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="App" component={AppNavigator} />
    </Stack.Navigator>
  );
}
