import React, { useState } from 'react';
// Remove deprecated CSS arrow
// We will rely on user providing an icon or default to a simple text character if no icon library is present
// But for a premium library, we should avoid drawing shapes with View borders.

import {
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

// Note: We don't import vector icons here directly to avoid bloating the core bundle
// if the user doesn't use them. We expect the user to pass `thumbIcon`.
// However, for the default, we will use a simple chevron character > which is safe and standard.
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// Reanimated Worklet import for 4.x compliance
const { scheduleOnJS } = (global as any).Worklets || {};

export interface SwipeButtonProps {
  onComplete: () => void;
  title?: string;
  completedTitle?: string;
  height?: number;
  width?: number | string;
  borderRadius?: number;
  containerStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
  titleStyle?: TextStyle;
  activeColor?: string;
  placeholderColor?: string;
  thumbIcon?: React.ReactNode; // Can be Image, Icon, or Text
  thumbContent?: React.ReactNode; // For text/image inside thumb
  disabled?: boolean;
}

const DEFAULT_HEIGHT = 56;
const PADDING = 4;

export const SwipeButton: React.FC<SwipeButtonProps> = ({
  onComplete,
  title = 'Slide to Confirm',
  completedTitle = 'Confirmed',
  height = DEFAULT_HEIGHT,
  width = '100%',
  borderRadius = DEFAULT_HEIGHT / 2,
  containerStyle,
  thumbStyle,
  titleStyle,
  activeColor = '#10B981', // Emerald-500
  placeholderColor = '#E5E7EB', // Gray-200
  thumbIcon,
  thumbContent,
  disabled = false,
}) => {
  const [completed, setCompleted] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState(0);

  const offset = useSharedValue(0);
  const activeWidth = useSharedValue(0);

  const maxTranslate = layoutWidth - height; // Thumb moves inside container

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  const pan = Gesture.Pan()
    .enabled(!disabled && !completed)
    .onUpdate((event) => {
      // Clamp translation
      offset.value = Math.max(0, Math.min(event.translationX, maxTranslate));
      activeWidth.value = offset.value + height;
    })
    .onEnd(() => {
      if (offset.value > maxTranslate * 0.7) {
        // Snap to finish - More linear, less bouncy
        offset.value = withSpring(maxTranslate, { damping: 30, stiffness: 250, mass: 1 }, (finished) => {
          if (finished) {
            if (scheduleOnJS) {
                scheduleOnJS(handleComplete)();
            } else {
                runOnJS(handleComplete)();
            }
          }
        });
        activeWidth.value = withSpring(layoutWidth);
      } else {
        // Snap back - Quick return
        offset.value = withSpring(0, { damping: 25, stiffness: 300, mass: 0.8 });
        activeWidth.value = withSpring(height);
      }
    });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const animatedActiveBackgroundStyle = useAnimatedStyle(() => {
    return {
      width: activeWidth.value,
      backgroundColor: completed ? activeColor : activeColor, 
      opacity: interpolate(offset.value, [0, maxTranslate], [0.1, 1], Extrapolation.CLAMP),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(offset.value, [0, maxTranslate / 2], [1, 0], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(offset.value, [0, maxTranslate], [0, 20], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        { height, borderRadius, backgroundColor: placeholderColor, width },
        containerStyle,
      ]}
      onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
    >
      {/* Progress Background */}
      <Animated.View
        style={[
          styles.activeBackground,
          { borderRadius },
          animatedActiveBackgroundStyle,
        ]}
      />

      {/* Text Label */}
      <View style={styles.textContainer} pointerEvents="none">
        <Animated.Text style={[styles.title, titleStyle, animatedTextStyle]}>
          {completed ? completedTitle : title}
        </Animated.Text>
      </View>

      {/* Draggable Thumb */}
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.thumb,
            {
              height: height - PADDING * 2,
              width: height - PADDING * 2,
              borderRadius: (height - PADDING * 2) / 2,
            },
            thumbStyle,
            animatedThumbStyle,
          ]}
        >
          {thumbContent || thumbIcon || (
            <Text style={styles.defaultArrow}>›</Text>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    overflow: 'hidden',
    padding: PADDING,
  },
  activeBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280', // Gray-500
  },
  thumb: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  defaultArrow: {
    fontSize: 24,
    fontWeight: '300',
    color: '#374151',
    marginTop: -2, // Optical alignment
  },
});
