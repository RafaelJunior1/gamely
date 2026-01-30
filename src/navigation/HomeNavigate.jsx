import { createDrawerNavigator } from '@react-navigation/drawer';
import { useContext } from 'react';
import DrawerContent from '../components/DrawerContent';
import { ThemeContext } from '../context/ThemeContext';
import Home from '../screens/Home/Home';

const Drawer = createDrawerNavigator();

export default function HomeNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.cardBg, width: 250 },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeScreen" component={Home} />
    </Drawer.Navigator>
  );
}
