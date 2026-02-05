import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolateColor
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
  color = '#4F46E5', // Indigo-600
  size = 26,
  style,
}) => {
  const bounce = useSharedValue(1);
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    // Smooth transition for color and checkmark scaling
    progress.value = withSpring(checked ? 1 : 0, { 
        damping: 20, 
        stiffness: 200,
        mass: 0.5 
    });
    
    // Tuck-and-pop impact animation
    if (checked) {
       bounce.value = 0.8;
       bounce.value = withSpring(1, { 
           damping: 12, 
           stiffness: 300,
           mass: 0.8
       });
    }
  }, [checked]);

  const rContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', color]
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#D1D5DB', color]
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: bounce.value }],
    };
  });

  const rCheckStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        { scale: progress.value },
        { rotate: '-45deg' },
        { translateY: (1 - progress.value) * -2 }
      ],
    };
  });

  return (
    <Pressable onPress={() => onChange(!checked)} hitSlop={10}>
      <Animated.View 
        style={[
          styles.container, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 3.5, 
          }, 
          style, 
          rContainerStyle
        ]}
      >
        <Animated.View 
          style={[
            styles.checkIcon, 
            { 
                width: size * 0.5, 
                height: size * 0.28,
                borderLeftWidth: size * 0.1,
                borderBottomWidth: size * 0.1,
            }, 
            rCheckStyle
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkIcon: {
      borderColor: '#FFF',
      marginTop: -2, // Optical centering adjustment
      marginLeft: 1,
  }
});
