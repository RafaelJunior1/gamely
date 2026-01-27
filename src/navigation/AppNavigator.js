import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

import Shorts from '../screens/Shorts';
import Create from './CreateNavigator';
import ExploreStack from './ExploreStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.tabBarBg, borderTopColor: colors.tabBarBorder }],
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home-outline" size={26} color={focused ? colors.tabBarActive : colors.tabBarInactive} />
          ),
        }}
      />

      <Tab.Screen
        name="Shorts"
        component={Shorts}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="play-circle-outline" size={26} color={focused ? colors.tabBarActive : colors.tabBarInactive} />
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: () => (
            <View style={[styles.plusButton, { backgroundColor: colors.tabBarActive, shadowColor: colors.tabBarActive }]}>
              <Ionicons name="add" size={34} color="#FFF" />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="search-outline" size={26} color={focused ? colors.tabBarActive : colors.tabBarInactive} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person-outline" size={26} color={focused ? colors.tabBarActive : colors.tabBarInactive} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    borderTopWidth: 1,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
});
