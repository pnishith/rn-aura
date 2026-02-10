import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export interface ZoomableViewProps extends ViewProps {
  children: React.ReactNode;
  maxScale?: number;
  minScale?: number;
  /** Style for the inner animated content container */
  contentContainerStyle?: ViewStyle;
}

/**
 * A highly optimized pinch-to-zoom container.
 * Automatically fills the parent container and handles layout transitions.
 */
export const ZoomableView: React.FC<ZoomableViewProps> = ({
  children,
  maxScale = 3,
  minScale = 1,
  style,
  contentContainerStyle,
  ...props
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < minScale) {
        scale.value = withSpring(minScale);
        savedScale.value = minScale;
      } else if (scale.value > maxScale) {
        scale.value = withSpring(maxScale);
        savedScale.value = maxScale;
      } else {
        savedScale.value = scale.value;
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={[styles.container, style]} {...props}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={[styles.content, contentContainerStyle, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure it fills the parent container (e.g. the 200px Box)
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
