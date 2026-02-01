import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// Note: Actual Haptics require expo-haptics or react-native-haptic-feedback
// Since I am only building the UI component library here, I will simulate the "visual" haptic
// The user would integrate the actual haptic call in onPress

interface HapticTabProps extends TouchableOpacityProps {
  label?: string;
  selected?: boolean;
}

export const HapticTab: React.FC<HapticTabProps> = ({
  label,
  selected = false,
  style,
  onPress,
  children,
  ...props
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: selected ? '#007AFF' : '#F2F2F7',
    };
  });

  return (
    <Animated.View style={[styles.wrapper, animatedStyle as any, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.button}
        {...props}
      >
        {children || (
          <Text style={[styles.text, { color: selected ? 'white' : '#007AFF' }]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});
