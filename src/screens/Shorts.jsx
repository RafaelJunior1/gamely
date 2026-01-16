import { useState } from 'react';
import { Dimensions, FlatList, Platform } from 'react-native';
import ShortCard from '../components/ShortCard';

const { height } = Dimensions.get('window');

const TAB_BAR_HEIGHT = 65;
const BOTTOM_PADDING = Platform.OS === 'ios' ? 34 : 0;

const VIDEO_HEIGHT = (height - BOTTOM_PADDING) * 0.968;

const shortsData = [
  {
    id: '1',
    user: 'ShadowGamer',
    avatar: 'https://i.pravatar.cc/150?img=12',
    video: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    likes: 245,
    comments: 32,
    shares: 14,
    audio: 'Cyber Beat',
    description: 'Check this insane frag!',
  },
  {
    id: '2',
    user: 'PixelQueen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    video: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    likes: 312,
    comments: 45,
    shares: 20,
    audio: 'Epic Gamer Music',
    description: 'New level unlocked!',
  },
];

export default function Shorts() {
  const [currentVisible, setCurrentVisible] = useState(0);

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVisible(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  return (
    <FlatList
      data={shortsData}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate="fast"
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={handleViewableItemsChanged}
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + BOTTOM_PADDING }}
      renderItem={({ item, index }) => (
        <ShortCard item={item} isActive={currentVisible === index} containerHeight={VIDEO_HEIGHT} />
      )}
    />
  );
}
