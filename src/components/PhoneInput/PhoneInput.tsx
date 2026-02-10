import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor, 
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

export interface PhoneInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangePhone?: (phone: string) => void;
  countryCode?: string;
  onCountryPress?: () => void;
  activeColor?: string;
  inactiveColor?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  countryStyle?: ViewStyle;
  countryTextStyle?: TextStyle;
  showFlag?: boolean;
  flagComponent?: React.ReactNode;
}

/**
 * A production-grade, highly customizable Phone Input component.
 * Features an interactive country section, smooth focus animations, and flexible styling.
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangePhone,
  onChangeText,
  countryCode = '+1',
  onCountryPress,
  activeColor = '#4F46E5',
  inactiveColor = '#E5E7EB',
  containerStyle,
  inputStyle,
  countryStyle,
  countryTextStyle,
  showFlag = true,
  flagComponent,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);
  const scale = useSharedValue(1);

  // Sync focus animations
  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, focusProgress]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    scale.value = withSpring(1.01);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    scale.value = withSpring(1);
    if (props.onBlur) props.onBlur(e);
  };

  const handleChangeText = (text: string) => {
    // Basic numeric filtering for phone numbers
    const clean = text.replace(/[^0-9-() ]/g, '');
    if (onChangePhone) onChangePhone(clean);
    if (onChangeText) onChangeText(clean);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [inactiveColor, activeColor]
    );
    return {
      borderColor,
      transform: [{ scale: scale.value }],
      shadowOpacity: withTiming(isFocused ? 0.05 : 0),
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle, containerStyle]}>
      {/* Country Selector Section */}
      <Pressable 
        onPress={onCountryPress}
        style={({ pressed }) => [
          styles.countryContainer,
          countryStyle,
          pressed && { opacity: 0.7 }
        ]}
      >
        <Row gap={6}>
            {showFlag && (
                <View style={styles.flagPlaceholder}>
                    {flagComponent || <Text style={{fontSize: 18}}>🇺🇸</Text>}
                </View>
            )}
            <Text style={[styles.countryCode, countryTextStyle]}>
                {countryCode}
            </Text>
            <Icon name="chevron-down" size={14} color="#6B7280" />
        </Row>
      </Pressable>

      <View style={styles.divider} />

      {/* Main Input Field */}
      <TextInput
        {...props}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="phone-pad"
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[styles.input, inputStyle]}
        placeholderTextColor="#9CA3AF"
      />
    </Animated.View>
  );
};

// Internal Row component for layout
const Row: React.FC<{ children: React.ReactNode, gap?: number }> = ({ children, gap }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
        {children}
    </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFF',
    // Subtle shadow for focus state
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  countryContainer: {
    paddingHorizontal: 14,
    height: 52,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  flagPlaceholder: {
    width: 26,
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingHorizontal: 14,
    height: 52,
    fontWeight: '500',
  },
});
