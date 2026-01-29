import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { db } from '../services/firebase';

export default function DrawerContent({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      }
    }

    loadProfile();
  }, [user]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.tabBarBorder }]}>
        <Image
          source={
            profile?.avatar
              ? { uri: profile.avatar }
              : require('../../assets/avatars/default.png')
          }
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={[styles.nickname, { color: colors.textPrimary }]}>
            {profile?.nickname || 'Usuário'}
          </Text>

          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email}
          </Text>
        </View>
      </View>

      {/* MENU */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('HomeDrawer')}
        >
          <Ionicons name="home-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Games')}
        >
          <Ionicons name="game-controller-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>Ver Jogos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Explore')}
        >
          <Ionicons name="search-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>Explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>
            Notificações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Messages')}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={colors.textPrimary}
          />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>
            Mensagens
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Profile', { screen: 'Settings'})}
        >
          <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>
            Configurações
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    borderBottomWidth: 1,
    marginBottom: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },

  userInfo: {
    marginLeft: 12,
  },

  nickname: {
    fontSize: 18,
    fontWeight: '700',
  },

  email: {
    fontSize: 12,
    marginTop: 2,
  },

  menu: {
    paddingHorizontal: 10,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },

  menuText: {
    fontSize: 16,
    marginLeft: 14,
    fontWeight: '600',
  },
});
