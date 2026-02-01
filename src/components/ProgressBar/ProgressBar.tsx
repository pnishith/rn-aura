import React, { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming
} from 'react-native-reanimated';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#007AFF',
  trackColor = '#E0E0E0',
  height = 8,
  borderRadius = 4,
  style,
}) => {
  const widthAnim = useSharedValue(0);

  useEffect(() => {
    widthAnim.value = withTiming(Math.max(0, Math.min(1, progress)), {
      duration: 500,
    });
  }, [progress]);

  const rBarStyle = useAnimatedStyle(() => {
    return {
      width: `${widthAnim.value * 100}%`,
    };
  });

  return (
    <View 
      style={[
        styles.track, 
        { height, borderRadius, backgroundColor: trackColor }, 
        style
      ]}
    >
      <Animated.View 
        style={[
          styles.bar, 
          { backgroundColor: color, borderRadius }, 
          rBarStyle
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
});
