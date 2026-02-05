import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  ZoomIn,
  type SharedValue,
} from 'react-native-reanimated';

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  secure?: boolean;
  autoFocus?: boolean;
  style?: ViewStyle;
  boxStyle?: ViewStyle;
  activeBoxStyle?: ViewStyle;
  errorBoxStyle?: ViewStyle;
  textStyle?: TextStyle;
  cursorColor?: string;
  placeholder?: string;
}

interface OtpBoxProps {
  index: number;
  char?: string;
  isFocused: boolean;
  isCurrent: boolean;
  error: boolean;
  secure: boolean;
  cursorColor: string;
  boxStyle?: ViewStyle;
  activeBoxStyle?: ViewStyle;
  errorBoxStyle?: ViewStyle;
  textStyle?: TextStyle;
  cursorOpacity: SharedValue<number>;
}

const OtpBox: React.FC<OtpBoxProps> = ({
  index,
  char,
  isFocused,
  isCurrent,
  error,
  secure,
  cursorColor,
  boxStyle,
  activeBoxStyle,
  errorBoxStyle,
  textStyle,
  cursorOpacity,
}) => {
  const isActive = isFocused && isCurrent;
  const isFilled = !!char;

  const scale = useSharedValue(1);

  useEffect(() => {
    if (isActive || isFilled) {
      scale.value = withSpring(1.05, { damping: 50, stiffness: 400 }); // Snappier spring
    } else {
      scale.value = withSpring(1, { damping: 50, stiffness: 400 });
    }
  }, [isActive, isFilled]);

  const animatedBoxStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderColor: withTiming(!!error
        ? '#EF4444'
        : isActive
          ? cursorColor
          : isFilled
            ? '#9CA3AF'
            : '#E5E7EB', { duration: 50 }), // Snappy border color transition
      borderWidth: (isActive || !!error) ? 2 : 1,
    };
  });

  const cursorAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isActive ? cursorOpacity.value : 0,
    };
  });

  return (
    <Animated.View
      entering={ZoomIn.delay(index * 50).springify()}
      style={[styles.box, boxStyle, animatedBoxStyle, !!error && errorBoxStyle, isActive && activeBoxStyle]}
    >
      {isFilled ? (
        <Animated.Text style={[styles.text, textStyle]}>
          {secure ? '•' : char}
        </Animated.Text>
      ) : (
        isActive && (
          <Animated.View
            style={[
              styles.cursor,
              { backgroundColor: cursorColor },
              cursorAnimatedStyle,
            ]}
          />
        )
      )}
    </Animated.View>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  value,
  onChange,
  error = false,
  secure = false,
  autoFocus = false,
  style,
  boxStyle,
  activeBoxStyle,
  errorBoxStyle,
  textStyle,
  cursorColor = '#3B82F6', // Default blue
}) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Animation Values  
  const shake = useSharedValue(0);
  const cursorOpacity = useSharedValue(0);

  // Trigger shake on error
  useEffect(() => {
    if (error) {
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withRepeat(withTiming(10, { duration: 100 }), 3, true),
        withTiming(0, { duration: 50 })
      );
    }
  }, [error, shake]);

  // Cursor blink loop
  useEffect(() => {
    if (isFocused) {
      cursorOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      cursorOpacity.value = 0;
    }
  }, [isFocused, cursorOpacity]);

  const handlePress = () => {
    (inputRef.current as any)?.focus?.();
  };

  const handleChangeText = (text: string) => {
    if (text.length > length) return;
    onChange(text);
  };

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }],
    };
  });

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, style, shakeStyle]}
    >
      {/* Hidden Native Input */}
      <TextInput
        ref={inputRef as any}
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={length}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        style={styles.hiddenInput}
        caretHidden
      />

      {/* Visual Boxes */}
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => (
          <OtpBox
            key={i}
            index={i}
            char={value[i]}
            isFocused={isFocused}
            isCurrent={i === value.length}
            error={!!error}
            secure={secure}
            cursorColor={cursorColor}
            boxStyle={boxStyle}
            activeBoxStyle={activeBoxStyle}
            errorBoxStyle={errorBoxStyle}
            textStyle={textStyle}
            cursorOpacity={cursorOpacity}
          />
        ))}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12, // React Native 0.71+ support
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // Shadow for premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  cursor: {
    width: 2,
    height: 24,
    borderRadius: 1,
  },
});
