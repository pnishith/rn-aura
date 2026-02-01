import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, interpolateColor, useSharedValue } from 'react-native-reanimated';

interface PhoneInputProps extends TextInputProps {
  value: string;
  onChangeValue: (value: string) => void;
  countryCode?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeValue,
  countryCode = '+1',
  activeColor = '#007AFF',
  inactiveColor = '#E5E5EA',
  style,
  ...props
}) => {
  const focusProgress = useSharedValue(0);

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
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    };
  });

  return (
    <Animated.View style={[animatedContainerStyle, style]}>
      <View style={styles.countryContainer}>
        <Text style={styles.countryCode}>{countryCode}</Text>
      </View>
      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeValue}
        keyboardType="phone-pad"
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.input}
        placeholder="555-0123"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  countryContainer: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
