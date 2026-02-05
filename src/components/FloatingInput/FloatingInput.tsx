import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  interpolateColor
} from 'react-native-reanimated';

export interface FloatingInputProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  activeColor?: string;
  inactiveColor?: string;
  error?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChangeText,
  containerStyle,
  labelStyle,
  inputStyle,
  activeColor = '#4F46E5',
  inactiveColor = '#9CA3AF',
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Use a strictly controlled shared value for the animation
  const focusAnim = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    focusAnim.value = withTiming(isFocused || !!value ? 1 : 0, { duration: 200 });
  }, [isFocused, value, focusAnim]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const rLabelStyle = useAnimatedStyle(() => {
    // 18 is the vertical center for a 56px height container
    const translateY = interpolate(focusAnim.value, [0, 1], [0, -28]);
    const scale = interpolate(focusAnim.value, [0, 1], [1, 0.85]);
    const color = interpolateColor(focusAnim.value, [0, 1], [inactiveColor, activeColor]);
    
    return {
      transform: [
        { translateY },
        { translateX: -((1 - scale) * 20) }, 
        { scale }
      ],
      color: error ? '#EF4444' : color,
      backgroundColor: focusAnim.value > 0.5 ? '#FFF' : 'transparent',
      paddingHorizontal: focusAnim.value > 0.5 ? 4 : 0,
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value, 
      [0, 1], 
      [inactiveColor, activeColor]
    );
    
    return {
      borderColor: error ? '#EF4444' : borderColor,
      borderWidth: isFocused ? 2 : 1,
    };
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Animated.View style={[styles.container, rContainerStyle]}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.Text 
              style={[
                styles.label, 
                labelStyle, 
                rLabelStyle,
                // Ensure initial state is applied before animation runs
                { position: 'absolute' } 
              ]}
            >
              {label}
            </Animated.Text>
        </View>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="transparent" 
          selectionColor={activeColor}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    position: 'relative',
  },
  label: {
    left: 12,
    top: 18,
    fontSize: 16,
    zIndex: 1,
  },
  input: {
    fontSize: 16,
    color: '#111827',
    marginTop: 4, 
    height: 48,
    padding: 0,
    textAlignVertical: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  }
});
