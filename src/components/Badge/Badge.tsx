import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withSpring
} from 'react-native-reanimated';

export interface BadgeProps {
  count?: number;
  label?: string;
  color?: string;
  textColor?: string;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  maxCount?: number;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  label,
  color = '#FF3B30',
  textColor = '#FFF',
  size = 20,
  style,
  textStyle,
  maxCount = 99,
}) => {
  const scale = useSharedValue(1);
  const displayValue = count !== undefined 
    ? (count > maxCount ? `${maxCount}+` : count.toString())
    : label;

  useEffect(() => {
    // Pulse animation on change
    scale.value = withSequence(
      withSpring(1.2, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
  }, [count, label]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  if (count === 0 && !label) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: color,
          minWidth: size,
          height: size,
          borderRadius: size / 2,
          paddingHorizontal: size / 4
        }, 
        style, 
        rStyle
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.6, color: textColor }, textStyle]}>
        {displayValue}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.2,
    // shadowRadius: 1,
    // elevation: 2,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
