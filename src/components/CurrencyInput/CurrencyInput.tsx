import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  type TextInputProps,
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor, 
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

export interface CurrencyItem {
  symbol: string | React.ReactNode;
  locale?: string; // Optional locale for formatting (e.g., 'en-US', 'en-IN')
}

export interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string; // The numeric string value (e.g. "1234.56")
  onChangeValue?: (value: string) => void;
  currencies?: CurrencyItem[];
  onCurrencyChange?: (currency: CurrencyItem, index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
}

const DEFAULT_CURRENCIES: CurrencyItem[] = [
  { symbol: '$', locale: 'en-US' },
  { symbol: '₹', locale: 'en-IN' },
];

/**
 * A production-grade Currency Input component with explicit decimal support,
 * thousands separation, and a flexible currency/icon switcher.
 */
export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChangeValue,
  currencies = DEFAULT_CURRENCIES,
  onCurrencyChange,
  activeColor = '#4F46E5',
  inactiveColor = '#9CA3AF',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const focusProgress = useSharedValue(0);
  const symbolScale = useSharedValue(1);

  const currentCurrency = currencies[currentIndex] || DEFAULT_CURRENCIES[0];

  // Sync focus animation
  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, focusProgress]);

  const toggleCurrency = () => {
    symbolScale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
    
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrentIndex(nextIndex);
    if (onCurrencyChange) {
        onCurrencyChange(currencies[nextIndex] as CurrencyItem, nextIndex);
    }
  };

  /**
   * Formats a raw numeric string with thousands separators based on active locale.
   */
  const formatDisplayValue = useCallback((val: string) => {
    if (!val) return '';
    
    const parts = val.split('.');
    const integerPart = parts[0] || '';
    const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';

    let formattedInteger = '';
    if (integerPart) {
        // Use provided locale or fallback to system default
        const formatter = new Intl.NumberFormat(currentCurrency?.locale || 'en-US');
        formattedInteger = formatter.format(parseInt(integerPart, 10));
    }

    return `${formattedInteger}${decimalPart}`;
  }, [currentCurrency]);

  const handleChangeText = (text: string) => {
    // Remove formatting characters before processing
    let clean = text.replace(/,/g, '').replace(/[^0-9.]/g, '');
    
    // Safety check: No leading decimal point
    if (clean.startsWith('.')) return;

    // Ensure only one decimal point
    const parts = clean.split('.');
    if (parts.length > 2) return;

    // Restrict to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;

    // Update parent state with raw numeric string
    if (onChangeValue) onChangeValue(clean);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        [inactiveColor, activeColor]
      ),
      borderWidth: isFocused ? 2 : 1.5,
    };
  });

  const animatedSymbolStyle = useAnimatedStyle(() => ({
    transform: [{ scale: symbolScale.value }],
  }));

  const displayValue = formatDisplayValue(value);

  return (
    <Animated.View style={[styles.container, animatedContainerStyle, style]}>
      <Pressable onPress={toggleCurrency} hitSlop={15}>
        <Animated.View style={[styles.symbolContainer, animatedSymbolStyle]}>
          {typeof currentCurrency?.symbol === 'string' ? (
            <Text style={[styles.symbol, { color: isFocused ? activeColor : '#6B7280' }]}>
                {currentCurrency.symbol}
            </Text>
          ) : (
            currentCurrency?.symbol
          )}
        </Animated.View>
      </Pressable>
      
      <TextInput
        {...props}
        value={displayValue}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        placeholder="0.00"
        placeholderTextColor="#9CA3AF"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  symbolContainer: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 20,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#111827',
    marginLeft: 12,
    fontWeight: '600',
    padding: 0,
  },
});
