import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface SmartButtonProps {
  label?: string;
  title?: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'outlined' | 'ghost';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  hapticEnabled?: boolean;
}

export const SmartButton: React.FC<SmartButtonProps> = ({
  label,
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  labelStyle,
  // hapticEnabled = true,
}) => {
  const buttonLabel = label || title || 'Button';
  const scale = useSharedValue(1);
  // const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.95, { 
      damping: 50, 
      stiffness: 600, 
    });
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    scale.value = withSpring(1, { 
      damping: 50, 
      stiffness: 600, 
    });
  };

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = variant === 'primary' ? '#000' : 
                          variant === 'secondary' ? '#F0F0F0' : 
                          variant === 'outline' || variant === 'outlined' ? 'transparent' : 'transparent';
    
    return {
      transform: [{ scale: scale.value }],
      opacity: withTiming(disabled ? 0.6 : 1),
      backgroundColor: style?.backgroundColor || backgroundColor,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(loading ? 0 : 1),
    };
  });

  const getTextColor = () => {
    if (variant === 'primary') return '#FFF';
    return '#000';
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.container,
        (variant === 'outline' || variant === 'outlined') && styles.outline,
        style,
        rStyle,
      ]}
    >
      <Animated.View style={[styles.content]}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={getTextColor()} />
          </View>
        )}
        <Animated.Text style={[
          styles.label, 
          { color: getTextColor() }, 
          labelStyle,
          rTextStyle
        ]}>
          {buttonLabel}
        </Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 56,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
