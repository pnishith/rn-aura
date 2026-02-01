import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated';

export interface PulseDotProps {
  size?: number;
  color?: string;
  pulsing?: boolean;
  style?: ViewStyle;
}

const Ring = ({ size, color, delay, pulsing }: { size: number, color: string, delay: number, pulsing: boolean }) => {
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(1);

  useEffect(() => {
    if (!pulsing) {
      ringScale.value = 0;
      ringOpacity.value = 0;
      return;
    }
    
    ringScale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );
    ringOpacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );
  }, [pulsing]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(ringScale.value, [0, 1], [0.8, 2.5]) }],
      opacity: ringOpacity.value,
    };
  });

  return (
    <Animated.View 
      style={[
        styles.ring, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2, 
          backgroundColor: color,
        }, 
        rStyle
      ]} 
    />
  );
};

export const PulseDot: React.FC<PulseDotProps> = ({
  size = 12,
  color = '#4CD964',
  pulsing = true,
  style,
}) => {
  return (
    <View style={[styles.container, { width: size * 3, height: size * 3 }, style]}>
      {pulsing && <Ring size={size} color={color} delay={0} pulsing={pulsing} />}
      {pulsing && <Ring size={size} color={color} delay={500} pulsing={pulsing} />}
      <View style={[styles.dot, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    zIndex: 1,
  },
  ring: {
    position: 'absolute',
    zIndex: 0,
  },
});
