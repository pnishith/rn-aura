import React, { useState } from 'react';
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
  activeColor = '#007AFF',
  inactiveColor = '#9E9E9E',
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    focusAnim.value = withTiming(isFocused || value ? 1 : 0, { duration: 200 });
  }, [isFocused, value]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const rLabelStyle = useAnimatedStyle(() => {
    const translateY = interpolate(focusAnim.value, [0, 1], [18, -10]);
    const scale = interpolate(focusAnim.value, [0, 1], [1, 0.85]);
    const color = interpolateColor(focusAnim.value, [0, 1], [inactiveColor, activeColor]);
    
    return {
      transform: [
        { translateY },
        { translateX: -((1 - scale) * 10) }, // Approximate adjustment for origin
        { scale }
      ],
      color: error ? '#FF3B30' : color,
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value, 
      [0, 1], 
      [inactiveColor, activeColor]
    );
    
    return {
      borderColor: error ? '#FF3B30' : borderColor,
      borderWidth: isFocused ? 2 : 1,
    };
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Animated.View style={[styles.container, rContainerStyle]}>
        <Animated.Text style={[styles.label, labelStyle, rLabelStyle]}>
          {label}
        </Animated.Text>
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  label: {
    position: 'absolute',
    left: 12,
    top: 0,
    fontSize: 16,
    zIndex: 1,
    backgroundColor: 'transparent', // Or white if overlapping border, but here it's inside
  },
  input: {
    fontSize: 16,
    color: '#000',
    marginTop: 8, // Space for label
    height: 40,
    padding: 0,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  }
});
