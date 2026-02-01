import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  FadeOut,
  ZoomIn
} from 'react-native-reanimated';

export interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: string;
  selected?: boolean;
  closable?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  color = '#4F46E5', // Default Indigo-600
  selected = false,
  closable = false,
  onPress,
  onClose,
  style,
  labelStyle,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const isFilled = variant === 'filled';
  
  // Logic for color states
  const baseBg = isFilled ? (selected ? color : '#F3F4F6') : 'transparent';
  const baseBorder = selected ? color : (isFilled ? '#F3F4F6' : color);
  const baseTextColor = isFilled ? (selected ? '#FFFFFF' : '#374151') : color;

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: withTiming(baseBg),
      borderColor: withTiming(baseBorder),
    };
  });

  return (
    <Animated.View entering={ZoomIn.duration(200)} exiting={FadeOut.duration(200)}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.touchable]}
      >
        <Animated.View style={[styles.container, style, rStyle]}>
          <Text style={[
            styles.label, 
            labelStyle,
            { color: baseTextColor, fontWeight: selected ? '600' : '400' }
          ]}>
            {label}
          </Text>
          {closable && (
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Text style={[styles.closeText, { color: baseTextColor }]}>×</Text>
            </Pressable>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    margin: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    minHeight: 32,
  },
  label: {
    fontSize: 14,
  },
  closeButton: {
    marginLeft: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: -2,
  },
});
