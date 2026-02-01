import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

interface MarqueeProps extends ViewProps {
  text: string;
  speed?: number; // pixels per second
  spacing?: number;
  textStyle?: any;
}

export const Marquee: React.FC<MarqueeProps> = ({
  text,
  speed = 50,
  spacing = 50,
  textStyle,
  style,
  ...props
}) => {
  const [textWidth, setTextWidth] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const translateX = useSharedValue(0);

  const onTextLayout = (e: LayoutChangeEvent) => {
    setTextWidth(e.nativeEvent.layout.width);
  };

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (textWidth === 0 || containerWidth === 0) return;

    const totalWidth = textWidth + spacing;
    const duration = (totalWidth / speed) * 1000;

    translateX.value = 0;
    translateX.value = withRepeat(
      withTiming(-totalWidth, {
        duration: duration,
        easing: Easing.linear,
      }),
      -1, // infinite
      false // no reverse
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, [textWidth, containerWidth, spacing, speed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={[styles.container, style]} onLayout={onContainerLayout} {...props}>
      <Animated.View style={[styles.row, animatedStyle]}>
        <Text style={[styles.text, textStyle]} onLayout={onTextLayout}>
          {text}
        </Text>
        <View style={{ width: spacing }} />
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
        <View style={{ width: spacing }} />
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
        <View style={{ width: spacing }} />
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});
