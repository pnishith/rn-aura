import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming
} from 'react-native-reanimated';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  activeColor?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  layout?: 'row' | 'column';
}

const RadioButton = ({ 
  selected, 
  onPress, 
  label, 
  activeColor, 
  disabled,
  labelStyle
}: { 
  selected: boolean; 
  onPress: () => void; 
  label: string; 
  activeColor: string;
  disabled?: boolean;
  labelStyle?: TextStyle;
}) => {
  const innerScale = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    innerScale.value = withSpring(selected ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 200,
    });
  }, [selected]);

  const rInnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: innerScale.value }],
      backgroundColor: activeColor,
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(selected ? activeColor : '#C0C0C0'),
      opacity: withTiming(disabled ? 0.5 : 1),
    };
  });

  return (
    <Pressable 
      onPress={onPress} 
      disabled={disabled} 
      style={styles.itemContainer}
      hitSlop={8}
    >
      <Animated.View style={[styles.radioCircle, rContainerStyle]}>
        <Animated.View style={[styles.radioInner, rInnerStyle]} />
      </Animated.View>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  activeColor = '#007AFF',
  style,
  labelStyle,
  layout = 'column',
}) => {
  return (
    <View style={[styles.group, style, { flexDirection: layout }]}>
      {options.map((option) => (
        <View key={option.value} style={[
          styles.wrapper, 
          layout === 'row' && styles.wrapperRow 
        ]}>
          <RadioButton
            label={option.label}
            selected={value === option.value}
            onPress={() => onChange(option.value)}
            activeColor={activeColor}
            disabled={option.disabled}
            labelStyle={labelStyle}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    // 
  },
  wrapper: {
    marginVertical: 6,
  },
  wrapperRow: {
    marginRight: 16,
    marginVertical: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});
