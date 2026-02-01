import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
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
}

const Particle: React.FC<ParticleProps> = ({ startX, startY, color, delay }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT, { duration: 2000 + Math.random() * 1000, easing: Easing.out(Easing.quad) })
    );
    translateX.value = withDelay(
      delay,
      withTiming((Math.random() - 0.5) * 200, { duration: 2000 })
    );
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 500 }), -1)
    );
    opacity.value = withDelay(
      delay + 1500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        { left: startX, top: startY, backgroundColor: color },
        style,
      ]}
    />
  );
};

interface ConfettiProps {
  active?: boolean;
  count?: number;
}

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

export const Confetti: React.FC<ConfettiProps> = ({ active = false, count = 50 }) => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        startX: Math.random() * SCREEN_WIDTH,
        startY: -20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 500,
      }));
      setParticles(newParticles);
    } else {
        setParticles([]);
    }
  }, [active, count]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  particle: {
    width: 10,
    height: 10,
    position: 'absolute',
    borderRadius: 5,
  },
});
