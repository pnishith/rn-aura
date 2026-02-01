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
  withSpring
} from 'react-native-reanimated';

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  expanded = false,
  onPress,
  style,
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const height = useSharedValue(0);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (expanded) {
      height.value = withSpring(contentHeight, {
        damping: 15,
        stiffness: 100,
      });
      rotation.value = withTiming(180, { duration: 250 });
    } else {
      height.value = withTiming(0, { duration: 250 });
      rotation.value = withTiming(0, { duration: 250 });
    }
  }, [expanded, contentHeight]);

  const rStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: height.value === 0 ? 0 : 1,
    };
  });

  const rIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={onPress} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Animated.Text style={[styles.icon, rIconStyle]}>▼</Animated.Text>
      </Pressable>
      <Animated.View style={[styles.contentWrapper, rStyle]}>
        <View
          style={styles.contentInner}
          onLayout={(e) => {
            setContentHeight(e.nativeEvent.layout.height);
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    fontSize: 12,
    color: '#666',
  },
  contentWrapper: {
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
  },
  contentInner: {
    padding: 16,
    position: 'absolute',
    width: '100%',
    top: 0,
  },
});
