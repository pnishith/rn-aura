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
  selected?: boolean;
  closable?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  activeColor?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  closable = false,
  onPress,
  onClose,
  style,
  labelStyle,
  activeColor = '#E0E0E0',
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: withTiming(selected ? activeColor : '#F5F5F5'),
      borderColor: withTiming(selected ? activeColor : '#E0E0E0'),
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
            { color: selected ? '#000' : '#666', fontWeight: selected ? '600' : '400' }
          ]}>
            {label}
          </Text>
          {closable && (
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Text style={styles.closeText}>×</Text>
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 32,
  },
  label: {
    fontSize: 14,
    marginRight: 4,
  },
  closeButton: {
    marginLeft: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    marginTop: -2,
  },
});
