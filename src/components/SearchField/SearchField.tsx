import React, { useRef, useState } from 'react';
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
  withSpring, 
  withTiming,
} from 'react-native-reanimated';

export interface SearchFieldProps extends TextInputProps {
  onCancel?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  cancelLabel?: string;
  tintColor?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  onCancel,
  containerStyle,
  inputStyle,
  cancelLabel = "Cancel",
  tintColor = "#007AFF",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const cancelWidth = useSharedValue(0);
  const cancelOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (isFocused) {
      cancelWidth.value = withSpring(70, { damping: 15, stiffness: 150 });
      cancelOpacity.value = withTiming(1, { duration: 200 });
    } else {
      cancelWidth.value = withSpring(0, { damping: 15, stiffness: 150 });
      cancelOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isFocused]);

  const handleCancel = () => {
    (inputRef.current as any)?.blur();
    onChangeText?.('');
    onCancel?.();
  };

  const rCancelStyle = useAnimatedStyle(() => {
    return {
      width: cancelWidth.value,
      opacity: cancelOpacity.value,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          ref={inputRef as any}
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search"
          placeholderTextColor="#999"
          clearButtonMode="while-editing"
          {...props}
        />
      </View>
      <Animated.View style={[styles.cancelContainer, rCancelStyle]}>
        <Pressable onPress={handleCancel} style={styles.cancelButton} hitSlop={8}>
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
    overflow: 'hidden',
  },
  inputWrapper: {
    flex: 1,
    height: 36,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    padding: 0,
    color: '#000',
  },
  cancelContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    paddingHorizontal: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
  },
});
