import { Animated, useEffect, useRef } from 'react-native';

export default function PulseView({ children }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}
