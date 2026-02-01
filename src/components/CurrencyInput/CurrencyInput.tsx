import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
} from 'react-native';

import Animated, { useAnimatedStyle, withTiming, interpolateColor, useSharedValue } from 'react-native-reanimated';

interface CurrencyInputProps extends TextInputProps {
  value: string;
  onChangeValue?: (value: string) => void;
  currencySymbol?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChangeValue,
  onChangeText,
  currencySymbol = '$',
  activeColor = '#007AFF',
  inactiveColor = '#E5E5EA',
  style,
  ...props
}) => {
  const [, setIsFocused] = useState(false); // Removed unused isFocused read
  const focusProgress = useSharedValue(0);

  const formatCurrency = (val: string) => {
    const number = val.replace(/[^0-9]/g, '');
    if (!number) return '';
    const amount = parseInt(number, 10) / 100;
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, '');
    if (onChangeValue) onChangeValue(raw);
    if (onChangeText) onChangeText(raw);
  };

  const onFocus = () => {
    setIsFocused(true);
    focusProgress.value = withTiming(1);
  };

  const onBlur = () => {
    setIsFocused(false);
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
      flexDirection: 'row',
      alignItems: 'center',
    };
  });

  const displayValue = value ? formatCurrency(value) : '';

  return (
    <Animated.View style={[animatedContainerStyle, style]}>
      <Text style={styles.symbol}>{currencySymbol}</Text>
      <TextInput
        {...props}
        value={displayValue}
        onChangeText={handleChange}
        keyboardType="numeric"
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.input}
        placeholder="0.00"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    marginLeft: 8,
  },
  symbol: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
});
