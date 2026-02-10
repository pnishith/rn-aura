import React, { useRef, useState, useEffect } from 'react';
import {
  Pressable,
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
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

export interface SearchFieldProps extends TextInputProps {
  /** Callback triggered when the cancel button is pressed */
  onCancel?: () => void;
  /** Custom style for the outer container */
  containerStyle?: ViewStyle;
  /** Custom style for the text input itself */
  inputStyle?: TextStyle;
  /** Text to show in the cancel button. Defaults to "Cancel" */
  cancelLabel?: string;
  /** Color for icons and the cancel button text. Defaults to "#4F46E5" */
  tintColor?: string;
}

/**
 * A production-grade Search Field with smooth, non-fluctuating animations.
 * Features an expanding cancel button and an integrated search icon.
 */
export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  onCancel,
  containerStyle,
  inputStyle,
  cancelLabel = "Cancel",
  tintColor = "#4F46E5",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  // High-performance shared values for layout transitions
  const cancelWidth = useSharedValue(0);
  const cancelOpacity = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      // Smooth linear-to-ease transition for width to prevent fluctuation
      cancelWidth.value = withTiming(75, { 
        duration: 250, 
        easing: Easing.bezier(0.33, 1, 0.68, 1) 
      });
      cancelOpacity.value = withTiming(1, { duration: 200 });
    } else {
      cancelWidth.value = withTiming(0, { 
        duration: 200, 
        easing: Easing.inOut(Easing.quad) 
      });
      cancelOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [isFocused, cancelWidth, cancelOpacity]);

  const handleCancel = () => {
    (inputRef.current as any)?.blur();
    if (onChangeText) onChangeText('');
    if (onCancel) onCancel();
  };

  const rCancelStyle = useAnimatedStyle(() => {
    return {
      width: cancelWidth.value,
      opacity: cancelOpacity.value,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Search Input Container */}
      <View style={styles.inputWrapper}>
        <Icon 
          name="search-outline" 
          size={18} 
          color="#9CA3AF" 
          style={styles.searchIcon} 
        />
        <TextInput
          ref={inputRef as any}
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          clearButtonMode="while-editing"
          {...props}
        />
      </View>

      {/* Animated Cancel Button */}
      <Animated.View style={[styles.cancelContainer, rCancelStyle]}>
        <Pressable 
          onPress={handleCancel} 
          style={styles.cancelButton} 
          hitSlop={12}
        >
          <Text style={[styles.cancelText, { color: tintColor }]} numberOfLines={1}>
            {cancelLabel}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  inputWrapper: {
    flex: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    padding: 0,
    color: '#111827',
  },
  cancelContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  cancelButton: {
    paddingLeft: 12,
    paddingRight: 4,
    minWidth: 70,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
