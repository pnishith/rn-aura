import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming
} from 'react-native-reanimated';

export interface TabItem {
  key: string;
  title: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
  tabStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeKey,
  onChange,
  activeColor = '#007AFF',
  inactiveColor = '#999',
  style,
  tabStyle,
  labelStyle,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = tabs.findIndex(t => t.key === activeKey);
  
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const tabWidth = containerWidth / tabs.length;

  React.useEffect(() => {
    if (tabWidth > 0 && activeIndex >= 0) {
      indicatorX.value = withSpring(activeIndex * tabWidth, {
        damping: 15,
        stiffness: 100,
      });
      indicatorWidth.value = withTiming(tabWidth, { duration: 200 });
    }
  }, [activeIndex, tabWidth]);

  const rIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorX.value }],
      backgroundColor: activeColor,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabsContainer} onLayout={handleLayout}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, tabStyle]}
              onPress={() => onChange(tab.key)}
            >
              <Text 
                style={[
                  styles.label, 
                  labelStyle,
                  { 
                    color: isActive ? activeColor : inactiveColor,
                    fontWeight: isActive ? '600' : '400' 
                  }
                ]}
              >
                {tab.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.indicatorContainer}>
        {containerWidth > 0 && (
          <Animated.View style={[styles.indicator, rIndicatorStyle]} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
  },
  indicatorContainer: {
    height: 2,
    backgroundColor: '#E0E0E0',
    width: '100%',
    position: 'relative',
  },
  indicator: {
    height: 2,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});
