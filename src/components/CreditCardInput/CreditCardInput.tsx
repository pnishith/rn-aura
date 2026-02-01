import React, { useState } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, interpolateColor, useSharedValue } from 'react-native-reanimated';

interface CreditCardInputProps extends TextInputProps {
  value: string;
  onChangeValue?: (value: string) => void;
  activeColor?: string;
  inactiveColor?: string;
}

export const CreditCardInput: React.FC<CreditCardInputProps> = ({
  value,
  onChangeValue,
  onChangeText,
  activeColor = '#007AFF',
  inactiveColor = '#E5E5EA',
  style,
  ...props
}) => {
  const focusProgress = useSharedValue(0);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const handleChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, '');
    if (raw.length <= 16) {
      if (onChangeValue) onChangeValue(raw);
      if (onChangeText) onChangeText(raw);
    }
  };

  const onFocus = () => {
    focusProgress.value = withTiming(1);
  };

  const onBlur = () => {
    focusProgress.value = withTiming(0);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [inactiveColor, activeColor]
    );
    return {
      borderColor,
      borderWidth: 2,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    };
  });

  return (
    <Animated.View style={[animatedContainerStyle, style]}>
      <TextInput
        {...props}
        value={formatCardNumber(value)}
        onChangeText={handleChange}
        keyboardType="numeric"
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.input}
        placeholder="0000 0000 0000 0000"
        maxLength={19} // 16 digits + 3 spaces
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: '#000',
    letterSpacing: 2,
  },
});
