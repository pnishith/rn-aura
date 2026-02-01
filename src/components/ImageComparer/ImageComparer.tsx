import React, { useState } from 'react';
import { StyleSheet, View, Image, ImageSourcePropType, LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ImageComparerProps {
  beforeImage: ImageSourcePropType;
  afterImage: ImageSourcePropType;
  initialValue?: number; // 0 to 1
  height?: number;
  width?: number | '100%';
}

export const ImageComparer: React.FC<ImageComparerProps> = ({
  beforeImage,
  afterImage,
  initialValue = 0.5,
  height = 200,
  width = '100%',
}) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const position = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (layoutWidth === 0) return;
      position.value = Math.max(0, Math.min(e.x, layoutWidth));
    });

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }],
    };
  });

  const animatedBeforeImageStyle = useAnimatedStyle(() => {
    return {
      width: position.value,
    };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setLayoutWidth(w);
    position.value = w * initialValue;
  };

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { height, width }]} onLayout={onLayout}>
        <Image source={afterImage} style={[StyleSheet.absoluteFill, styles.image]} />
        <Animated.View style={[styles.beforeContainer, animatedBeforeImageStyle]}>
          <Image
            source={beforeImage}
            style={[styles.image, { width: layoutWidth, height }]}
          />
        </Animated.View>
        <Animated.View style={[styles.handle, { height }, animatedHandleStyle]} />
        <Animated.View style={[styles.handleKnob, animatedHandleStyle, { top: height / 2 - 15 }]} />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E5EA',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  beforeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
    borderRightWidth: 1,
    borderRightColor: '#FFF',
  },
  handle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 2,
    backgroundColor: 'white',
    marginLeft: -1,
  },
  handleKnob: {
    position: 'absolute',
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    marginLeft: -15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
