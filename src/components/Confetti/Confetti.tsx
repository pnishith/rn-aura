import React, { useEffect, useState, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withRepeat,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ParticleProps {
  startX: number;
  startY: number;
  color: string;
  delay: number;
  burstKey: number; // Used to force re-render for new bursts
}

const Particle: React.FC<ParticleProps> = ({ startX, startY, color, delay, burstKey }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  // Reset values when a new burst starts
  useEffect(() => {
    translateY.value = 0;
    translateX.value = 0;
    opacity.value = 1;
    rotateX.value = 0;
    rotateY.value = 0;
    rotateZ.value = 0;

    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 100, { 
        duration: 2500 + Math.random() * 1500, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      })
    );

    translateX.value = withDelay(
      delay,
      withTiming((Math.random() - 0.5) * 300, { 
        duration: 3000,
        easing: Easing.out(Easing.quad)
      })
    );

    rotateX.value = withDelay(delay, withRepeat(withTiming(360, { duration: 800 + Math.random() * 1000 }), -1));
    rotateY.value = withDelay(delay, withRepeat(withTiming(360, { duration: 1000 + Math.random() * 1000 }), -1));
    rotateZ.value = withDelay(delay, withRepeat(withTiming(360, { duration: 1200 + Math.random() * 1000 }), -1));

    opacity.value = withDelay(
      delay + 2000,
      withTiming(0, { duration: 1000 })
    );
  }, [delay, burstKey, rotateX, rotateY, rotateZ, translateX, translateY, opacity]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
        { rotateZ: `${rotateZ.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        { 
          left: startX, 
          top: startY, 
          backgroundColor: color,
          width: 8,
          height: 10,
        },
        style,
      ]}
    />
  );
};

interface ConfettiProps {
  active?: boolean;
  count?: number;
  onAnimationEnd?: () => void;
}

const COLORS = [
  '#FF3B30',
  '#34C759',
  '#007AFF',
  '#FFCC00',
  '#AF52DE',
  '#FF9500',
  '#5AC8FA',
];

export const Confetti: React.FC<ConfettiProps> = ({ 
  active = false, 
  count = 60,
  onAnimationEnd 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setBurstKey(prev => prev + 1);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onAnimationEnd) onAnimationEnd();
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [active, onAnimationEnd]);

  const particles = useMemo(() => {
    if (!isVisible) return [];
    // Generate new coordinates whenever burstKey changes
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      startX: Math.random() * SCREEN_WIDTH,
      startY: -50,
      color: COLORS[i % COLORS.length] as string,
      delay: Math.random() * 1500,
      burstKey: burstKey,
    }));
  }, [isVisible, count, burstKey]);

  if (!isVisible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={`${p.burstKey}-${p.id}`} {...p} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  particle: {
    position: 'absolute',
    borderRadius: 2,
  },
});
