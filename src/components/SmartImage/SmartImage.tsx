import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  type ImageProps,
  type ImageStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface SmartImageProps extends Omit<ImageProps, 'style'> {
  /** Color of the placeholder background. Defaults to '#F3F4F6' */
  placeholderColor?: string;
  /** Duration of the fade-in animation in ms. Defaults to 400 */
  transitionDuration?: number;
  /** Custom style for the outer container */
  containerStyle?: ViewStyle;
  /** Style for the image and placeholder */
  style?: ImageStyle;
  /** Whether to show a loading spinner while image is fetching. Defaults to true */
  showLoader?: boolean;
}

/**
 * A production-grade Image component with a smooth fade-in transition,
 * placeholder support, and an optional loading indicator.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  source,
  style,
  placeholderColor = '#F3F4F6',
  transitionDuration = 400,
  containerStyle,
  showLoader = true,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const opacity = useSharedValue(0);

  const handleLoad = (e: any) => {
    setLoading(false);
    opacity.value = withTiming(1, { duration: transitionDuration });
    if (props.onLoad) props.onLoad(e);
  };

  const handleError = (e: any) => {
    setLoading(false);
    if (props.onError) props.onError(e);
  };

  const rImageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, containerStyle, style]}>
      {/* Placeholder Layer */}
      <View
        style={[
          styles.placeholder,
          { backgroundColor: placeholderColor },
          StyleSheet.absoluteFillObject,
        ]}
      >
        {loading && showLoader && (
          <ActivityIndicator color="#9CA3AF" />
        )}
      </View>

      {/* Main Animated Image */}
      <Animated.Image
        {...props}
        source={source}
        onLoad={handleLoad}
        onError={handleError}
        style={[
          styles.image,
          style,
          rImageStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 1,
  }
});
