import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { db } from '../../services/firebase';

export default function Notifications({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('toUserId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    });

    return unsub;
  }, [user]);

  const renderItem = ({ item }) => {
    if (item.type === 'follow') {
      return (
        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: colors.cardBg },
          ]}
          onPress={() =>
            navigation.navigate('UserProfile', {
              userId: item.fromUserId,
            })
          }
        >
          <Image
            source={
              item.avatar
                ? { uri: item.avatar }
                : require('../../../assets/avatars/default.png')
            }
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary }}>
              <Text style={{ fontWeight: '700' }}>
                {item.nickname}
              </Text>{' '}
              começou a seguir você
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              agora mesmo
            </Text>
          </View>

          <Ionicons
            name="person-add-outline"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
        >
          Notificações
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={colors.textSecondary}
          />
          <Text
            style={{
              color: colors.textSecondary,
              marginTop: 10,
            }}
          >
            Nenhuma notificação ainda
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    gap: 12,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
