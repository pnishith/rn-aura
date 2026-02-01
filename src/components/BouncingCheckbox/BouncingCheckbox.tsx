import React, { useEffect } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence
} from 'react-native-reanimated';

export interface BouncingCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export const BouncingCheckbox: React.FC<BouncingCheckboxProps> = ({
  checked,
  onChange,
  color = '#000',
  size = 24,
  style,
}) => {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    if (checked) {
      checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      scale.value = withSequence(
        withSpring(0.8, { damping: 15, stiffness: 400 }),
        withSpring(1, { damping: 8, stiffness: 300 })
      );
    } else {
      checkScale.value = withSpring(0);
    }
  }, [checked]);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderColor: checked ? color : '#C0C0C0',
      backgroundColor: checked ? color : 'transparent',
    };
  });

  const rCheckStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
      opacity: checkScale.value,
    };
  });

  return (
    <Pressable onPress={() => onChange(!checked)} hitSlop={8}>
      <Animated.View 
        style={[
          styles.container, 
          { width: size, height: size, borderRadius: size / 4 }, 
          style, 
          rContainerStyle
        ]}
      >
        <Animated.View style={[styles.checkmark, rCheckStyle]}>
          {/* Simple CSS Checkmark */}
          <Animated.View style={styles.checkShort} />
          <Animated.View style={styles.checkLong} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: '100%',
    height: '100%',
    position: 'relative',
    left: 1, // Visual adjustment
    top: -1,
  },
  checkShort: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#FFF',
    left: 6,
    top: 10,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1,
  },
  checkLong: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#FFF',
    left: 14,
    top: 5,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  }
});
