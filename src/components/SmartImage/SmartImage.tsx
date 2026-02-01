import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import type {
  ImageProps,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface SmartImageProps extends ImageProps {
  placeholderColor?: string;
  transitionDuration?: number;
  containerStyle?: ViewStyle;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  source,
  style,
  placeholderColor = '#E1E9EE',
  transitionDuration = 300,
  containerStyle,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const opacity = useSharedValue(0);

  const handleLoad = (e: any) => {
    setLoaded(true);
    opacity.value = withTiming(1, { duration: transitionDuration });
    if (props.onLoad) props.onLoad(e);
  };

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, containerStyle, style]}>
      <View
        style={[
          styles.placeholder,
          { backgroundColor: placeholderColor },
          StyleSheet.absoluteFillObject,
        ]}
      />
      <Animated.Image
        source={source}
        style={[StyleSheet.absoluteFillObject, style as ImageStyle, imageAnimatedStyle]}
        onLoad={handleLoad}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    width: '100%',
    height: '100%',
  },
});
