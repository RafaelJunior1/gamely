import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const FILTER_ITEM_WIDTH = 90;
const TYPE_ITEM_WIDTH = 100;
const MAX_RECORD_DURATION = 15000;

const FILTERS = [
  { id: 'normal', icon: require('../../../assets/filters/normal.png') },
  { id: 'sepia', icon: require('../../../assets/filters/sepia.png') },
  { id: 'vintage', icon: require('../../../assets/filters/vintage.png') },
  { id: 'mono', icon: require('../../../assets/filters/mono.png') },
  { id: 'chrome', icon: require('../../../assets/filters/chrome.png') },
];

const TYPES = ['Post', 'Reel', 'Story'];
const START_TYPE_INDEX = 1;

export default function CreateCamera() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [cameraType, setCameraType] = useState('back');
  const [zoom, setZoom] = useState(0);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(START_TYPE_INDEX);
  const [isRecording, setIsRecording] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const filterFlatListRef = useRef(null);
  const typeFlatListRef = useRef(null);

  useEffect(() => {
    if (!permission) requestPermission();
    setTimeout(() => {
      typeFlatListRef.current?.scrollToIndex({ index: START_TYPE_INDEX, animated: false });
    }, 50);
  }, []);

  const goToCreate = (uri, mediaType) => {
    const type = TYPES[selectedTypeIndex];
    if (type === 'Post') navigation.navigate('Post', { uri, mediaType });
    if (type === 'Reel') navigation.navigate('Reel', { uri, mediaType });
    if (type === 'Story') navigation.navigate('Story', { uri, mediaType });
  };

  const takePhoto = async () => {
    if (!cameraRef.current || isRecording) return;
    const photo = await cameraRef.current.takePictureAsync();
    goToCreate(photo.uri, 'photo');
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;

    setIsRecording(true);
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: MAX_RECORD_DURATION,
      useNativeDriver: false,
    }).start();

    const video = await cameraRef.current.recordAsync();
    if (video) goToCreate(video.uri, 'video');

    setIsRecording(false);
    progress.setValue(0);
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      progress.setValue(0);
    }
  };

  const handleFilterPressIn = () => startRecording();
  const handleFilterPressOut = () => stopRecording();

  const toggleCamera = () => setCameraType(prev => (prev === 'back' ? 'front' : 'back'));

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.canceled) {
      goToCreate(result.assets[0].uri, 'gallery');
    }
  };

  const renderFilter = ({ item, index }) => {
    const active = index === selectedFilterIndex;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={takePhoto}
        onPressIn={handleFilterPressIn}
        onPressOut={handleFilterPressOut}
        style={[
          styles.filterItem,
          { opacity: active ? 1 : 0.4, transform: [{ scale: active ? 1.2 : 0.95 }] },
        ]}
      >
        <Image source={item.icon} style={styles.filterIcon} />
        {active && isRecording && (
          <>
            <View style={styles.recordCenterSquare} />
            <Animated.View
              style={[
                styles.recordCircle,
                {
                  transform: [
                    {
                      scale: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />
          </>
        )}
      </TouchableOpacity>
    );
  };

  const renderType = ({ item, index }) => {
    const active = index === selectedTypeIndex;
    return (
      <View
        style={[
          styles.typeItem,
          { opacity: active ? 1 : 0.4, transform: [{ scale: active ? 1.2 : 0.9 }] },
        ]}
      >
        <Text style={styles.typeText}>{item}</Text>
      </View>
    );
  };

  const handlePinch = event => {
    let newZoom = zoom + (event.nativeEvent.scale - 1) * 0.2;
    if (newZoom < 0) newZoom = 0;
    if (newZoom > 1) newZoom = 1;
    setZoom(newZoom);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler onGestureEvent={handlePinch}>
        <View style={styles.container}>
          {permission?.granted && (
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={cameraType} zoom={zoom} />
          )}

          <View style={styles.bottomButtons}>
            <TouchableOpacity onPress={toggleCamera}>
              <Ionicons name="camera-reverse-outline" size={36} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={openGallery}>
              <Ionicons name="image-outline" size={36} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.filtersContainer}>
            <FlatList
              ref={filterFlatListRef}
              data={FILTERS}
              horizontal
              snapToInterval={FILTER_ITEM_WIDTH}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: (width - FILTER_ITEM_WIDTH) / 2,
                paddingVertical: 30,
                alignItems: 'center',
              }}
              onMomentumScrollEnd={e =>
                setSelectedFilterIndex(Math.round(e.nativeEvent.contentOffset.x / FILTER_ITEM_WIDTH))
              }
              renderItem={renderFilter}
              keyExtractor={item => item.id}
            />
          </View>

          <View style={styles.typeContainer}>
            <FlatList
              ref={typeFlatListRef}
              data={TYPES}
              horizontal
              snapToInterval={TYPE_ITEM_WIDTH}
              decelerationRate="fast"
              initialScrollIndex={START_TYPE_INDEX}
              getItemLayout={(_, index) => ({
                length: TYPE_ITEM_WIDTH,
                offset: TYPE_ITEM_WIDTH * index,
                index,
              })}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: (width - TYPE_ITEM_WIDTH) / 2 }}
              onMomentumScrollEnd={e =>
                setSelectedTypeIndex(Math.round(e.nativeEvent.contentOffset.x / TYPE_ITEM_WIDTH))
              }
              renderItem={renderType}
              keyExtractor={(_, i) => i.toString()}
            />
          </View>
        </View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  bottomButtons: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    zIndex: 5,
  },

  filtersContainer: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
  },

  filterItem: {
    width: FILTER_ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },

  recordCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#7C4DFF', // círculo roxo ao redor
  },

  recordCenterSquare: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'red', // quadrado vermelho no centro
    borderRadius: 6,
  },

  typeContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
  },

  typeItem: {
    width: TYPE_ITEM_WIDTH,
    alignItems: 'center',
  },

  typeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
