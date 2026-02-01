import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { Dimensions, StyleSheet, View, type ViewStyle } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

export interface BottomSheetRef {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
}

interface BottomSheetProps {
  children?: React.ReactNode;
  snapPoints?: number[]; // percentage of screen height, e.g. [0.2, 0.5, 0.9]
  initialSnapIndex?: number;
  style?: ViewStyle;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, snapPoints = [0.25, 0.5], initialSnapIndex = 0, style }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue({ y: 0 });

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== 0;
      translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    useImperativeHandle(ref, () => ({
      scrollTo,
      isActive: () => active.value,
    }));

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        // Find nearest snap point
        // This is a simplified logic, ideally use velocity too
        // For now, let's just snap to 0 (closed) or the provided points
        // NOTE: This simple implementation needs more robust snap point math for production
        // mapping percentages to pixels
        if (translateY.value > -100) {
           scrollTo(0);
        } else {
             // Snap to first point for simplicity in this demo
             const firstSnap = snapPoints?.[0] ?? 0.25;
             scrollTo(-SCREEN_HEIGHT * firstSnap);
        }
      });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    // Initialize
    React.useEffect(() => {
        // scrollTo(-SCREEN_HEIGHT * snapPoints[initialSnapIndex]); 
        // Delaying init or manual trigger might be better, but let's leave it 0 (hidden/peeking) for now
        const snapIndex = Math.min(initialSnapIndex, (snapPoints?.length ?? 1) - 1);
        const snapPoint = snapPoints?.[snapIndex] ?? 0.25;
        translateY.value = withTiming(-SCREEN_HEIGHT * snapPoint);
    }, []);

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, style, animatedStyle]}>
          <View style={styles.line} />
          {children}
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});
