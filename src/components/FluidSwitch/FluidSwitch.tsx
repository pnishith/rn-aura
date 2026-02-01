import React, { useEffect } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  interpolateColor,
  useDerivedValue
} from 'react-native-reanimated';

export interface FluidSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  iconOn?: React.ReactNode;
  iconOff?: React.ReactNode;
  style?: ViewStyle;
}

const WIDTH = 56;
const HEIGHT = 32;
const PADDING = 4;
const THUMB_SIZE = HEIGHT - PADDING * 2;

export const FluidSwitch: React.FC<FluidSwitchProps> = ({
  value,
  onValueChange,
  activeColor = '#000',
  inactiveColor = '#E0E0E0',
  thumbColor = '#FFF',
  iconOn,
  iconOff,
  style,
}) => {
  const progress = useSharedValue(value ? 1 : 0);
  
  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 120,
      overshootClamping: false,
    });
  }, [value]);

  const rContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor]
    );
    return { backgroundColor };
  });

  const rThumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [0, WIDTH - THUMB_SIZE - PADDING * 2]
    );
    
    // Elastic effect: widen the thumb when moving
    const widthScale = interpolate(
      Math.abs(progress.value - 0.5), // 0 at edges, 0.5 at center
      [0, 0.5],
      [1, 1.2] 
    );
    // Inverse logic: 0.5 diff means edge (0 or 1), 0 diff means center (0.5)
    // Actually: value goes 0 -> 1. 
    // center is 0.5. |0.5-0.5| = 0. |0-0.5| = 0.5. |1-0.5| = 0.5.
    // So edges are 0.5, center is 0.
    
    // I want center to be wider.
    const elasticWidth = interpolate(
      progress.value,
      [0, 0.5, 1],
      [THUMB_SIZE, THUMB_SIZE * 1.25, THUMB_SIZE]
    );

    return {
      transform: [{ translateX }],
      width: elasticWidth,
    };
  });

  const handlePress = () => {
    onValueChange(!value);
  };

  return (
    <Pressable onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.container, style, rContainerStyle]}>
        <Animated.View style={[styles.thumb, { backgroundColor: thumbColor }, rThumbStyle]}>
          {/* Optional: Icons can be placed here or in background */}
        </Animated.View>
        {/* Icons could be absolutely positioned if needed, but for 'Simple' keep it clean */}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    padding: PADDING,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
    elevation: 2,
  },
});
