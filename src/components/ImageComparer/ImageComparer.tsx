import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
} from 'react-native-reanimated';

export interface ImageComparerProps {
  /** The image shown on the left (or "before" state) */
  leftImage: string | ImageSourcePropType;
  /** The image shown on the right (or "after" state) */
  rightImage: string | ImageSourcePropType;
  /** Initial position of the slider (0 to 1). Defaults to 0.5 */
  initialValue?: number;
  /** Height of the container. Defaults to 300 */
  height?: number;
  /** Custom style for the outer container */
  style?: ViewStyle;
  /** Label for the left side. Defaults to "Before" */
  leftLabel?: string;
  /** Label for the right side. Defaults to "After" */
  rightLabel?: string;
  /** Color of the slider handle. Defaults to "#FFF" */
  handleColor?: string;
}

/**
 * A production-grade Image Comparison slider with high-performance gestures.
 * Perfect for showing "Before & After" states.
 */
export const ImageComparer: React.FC<ImageComparerProps> = ({
  leftImage,
  rightImage,
  initialValue = 0.5,
  height = 300,
  style,
  leftLabel = "Before",
  rightLabel = "After",
  handleColor = "#FFFFFF",
}) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const position = useSharedValue(0);

  // Parse images: accept either string URIs or standard source objects
  const leftSource = typeof leftImage === 'string' ? { uri: leftImage } : leftImage;
  const rightSource = typeof rightImage === 'string' ? { uri: rightImage } : rightImage;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && layoutWidth === 0) {
        setLayoutWidth(w);
        position.value = w * initialValue;
    }
  };

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onUpdate((e) => {
      if (layoutWidth === 0) return;
      position.value = Math.max(0, Math.min(e.x, layoutWidth));
    });

  const rHandleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const rLeftImageContainerStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  const rLabelOpacity = useAnimatedStyle(() => ({
      // Hide labels when handle is too close to edges
      opacity: position.value < 40 || position.value > layoutWidth - 40 ? withTiming(0, { duration: 150 }) : withTiming(1, { duration: 150 }),
  }));

  return (
    <View style={[styles.container, { height }, style]} onLayout={onLayout}>
      {/* Right Image (Background) */}
      <Image 
        source={rightSource as ImageSourcePropType} 
        style={[StyleSheet.absoluteFill, styles.image]} 
      />
      <View style={[styles.labelContainer, styles.rightLabelPos]} pointerEvents="none">
        <Animated.View style={rLabelOpacity}>
            <Text style={styles.labelText}>{rightLabel}</Text>
        </Animated.View>
      </View>

      {/* Left Image (Foreground with clipping) */}
      <Animated.View style={[styles.leftImageContainer, rLeftImageContainerStyle]}>
        <Image
          source={leftSource as ImageSourcePropType}
          style={[styles.image, { width: layoutWidth, height }]}
        />
        <View style={styles.labelContainer} pointerEvents="none">
            <Animated.View style={rLabelOpacity}>
                <Text style={styles.labelText}>{leftLabel}</Text>
            </Animated.View>
        </View>
      </Animated.View>

      {/* Slider Gesture Area */}
      <GestureDetector gesture={panGesture}>
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* Vertical Divider Line */}
          <Animated.View style={[styles.handle, { backgroundColor: handleColor }, rHandleStyle]} />
          
          {/* Slider Knob */}
          <Animated.View style={[styles.handleKnob, { borderColor: handleColor }, rHandleStyle]}>
            <View style={styles.knobInner}>
              <Text style={styles.knobArrow}>⇠⇢</Text>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  leftImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
    borderRightWidth: 1.5,
    borderRightColor: 'rgba(255,255,255,0.5)',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
  },
  rightLabelPos: {
    left: undefined,
    right: 12,
  },
  labelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  handle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    marginLeft: -1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  handleKnob: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: 44,
    height: 44,
    marginTop: -22,
    marginLeft: -22,
    borderRadius: 22,
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  knobInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  knobArrow: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  }
});
