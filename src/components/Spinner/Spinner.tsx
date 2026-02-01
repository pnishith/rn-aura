import React, { useEffect } from 'react';
import { StyleSheet, type ViewProps } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

export interface SpinnerProps extends ViewProps {
  size?: number;
  color?: string;
  duration?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = '#007AFF',
  duration = 1000,
  style,
  ...props
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: duration,
        easing: Easing.linear,
      }),
      -1
    );
    return () => {
      cancelAnimation(rotation);
    };
  }, [duration, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 8,
          borderColor: color,
          borderTopColor: 'transparent',
        },
        animatedStyle,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
