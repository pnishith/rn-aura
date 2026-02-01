import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, LayoutChangeEvent } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming
} from 'react-native-reanimated';

export interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  activeColor?: string;
  backgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  style?: ViewStyle;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onChange,
  activeColor = '#FFF',
  backgroundColor = '#F0F0F0',
  textColor = '#666',
  activeTextColor = '#000',
  style,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);
  
  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const segmentWidth = containerWidth / options.length;

  React.useEffect(() => {
    if (segmentWidth > 0) {
      translateX.value = withSpring(selectedIndex * segmentWidth, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [selectedIndex, segmentWidth]);

  const rIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: segmentWidth,
      transform: [{ translateX: translateX.value }],
      backgroundColor: activeColor,
    };
  });

  return (
    <View 
      style={[styles.container, { backgroundColor }, style]} 
      onLayout={handleLayout}
    >
      {segmentWidth > 0 && (
        <Animated.View style={[styles.indicator, rIndicatorStyle]} />
      )}
      <View style={styles.contentContainer}>
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <Pressable
              key={option}
              style={styles.option}
              onPress={() => onChange(index)}
            >
              <Text 
                style={[
                  styles.text, 
                  { 
                    color: isSelected ? activeTextColor : textColor,
                    fontWeight: isSelected ? '600' : '400' 
                  }
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 14,
  },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 0,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    marginHorizontal: 0, // Adjustment logic might be needed for padding
  },
});
