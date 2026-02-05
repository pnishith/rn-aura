import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
} from 'react-native-reanimated';

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean; // Optional: Controlled state
  onPress?: () => void; // Optional: Controlled callback
  style?: ViewStyle;
  initialExpanded?: boolean;
}

/**
 * A smooth, animated Accordion component.
 * Supports both controlled and uncontrolled modes.
 */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  expanded: controlledExpanded,
  onPress: controlledOnPress,
  style,
  initialExpanded = false,
}) => {
  // Uncontrolled state fallback
  const [internalExpanded, setInternalExpanded] = useState(initialExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const [contentHeight, setContentHeight] = useState(0);
  
  // Animation values
  const height = useSharedValue(0);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isExpanded && contentHeight > 0) {
      height.value = withSpring(contentHeight, {
        damping: 50,
        stiffness: 400,
      });
      rotation.value = withTiming(0, { duration: 250 });
    } else {
      height.value = withTiming(0, { duration: 250 });
      rotation.value = withTiming(0, { duration: 250 });
    }
  }, [isExpanded, contentHeight, height, rotation]);

  const handlePress = () => {
    if (controlledOnPress) {
      controlledOnPress();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: height.value > 0 ? 1 : 0,
    };
  });

  const rIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={handlePress} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={rIconStyle}>
            <Text style={styles.icon}>▼</Text>
        </Animated.View>
      </Pressable>
      
      <Animated.View style={[styles.contentWrapper, rStyle]}>
        <View
          style={styles.contentInner}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && h !== contentHeight) {
                setContentHeight(h);
            }
          }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  icon: {
    fontSize: 12,
    color: '#6B7280',
  },
  contentWrapper: {
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  contentInner: {
    padding: 16,
    // Note: absolute is removed to ensure natural layout flow during measurement
    width: '100%',
  },
});
