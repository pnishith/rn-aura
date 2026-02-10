import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Pressable, Text, type ViewStyle } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  /** Visibility toggle */
  visible: boolean;
  /** Callback triggered when the sheet should close */
  onClose: () => void;
  /** Title shown at the top of the sheet */
  title?: string;
  /** Content to render inside the sheet */
  children?: React.ReactNode;
  /** Snap points as percentage of screen height. Defaults to [0.5] */
  snapPoints?: number[];
  /** Custom style for the sheet container */
  style?: ViewStyle;
}

/**
 * A production-grade Bottom Sheet with smooth gesture-driven interactions,
 * backdrop support, and ultra-snappy spring physics.
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({ 
  visible, 
  onClose, 
  children, 
  style,
  title,
  snapPoints = [0.5],
}) => {
  const [shouldRender, setShouldRender] = useState(visible);
  
  // Animation shared values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const activeSnapPoint = useSharedValue(SCREEN_HEIGHT);

  // Cast snapPoints to numbers to prevent TypeError
  const snaps = useMemo(() => {
    const points = snapPoints.length > 0 ? snapPoints : [0.5];
    return points
        .map(p => SCREEN_HEIGHT * (1 - Number(p)))
        .sort((a, b) => a - b);
  }, [snapPoints]);

  const closeSheet = useCallback(() => {
    // Fast exit timing
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, () => {
      runOnJS(setShouldRender)(false);
      runOnJS(onClose)();
    });
  }, [onClose, translateY]);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      const targetSnap = snaps[0] ?? SCREEN_HEIGHT * 0.5;
      // High-stiffness entrance
      translateY.value = withSpring(targetSnap, { 
        damping: 20, 
        stiffness: 250, 
        mass: 0.5 
      });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, () => {
        runOnJS(setShouldRender)(false);
      });
    }
  }, [visible, snaps, translateY]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
        activeSnapPoint.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = activeSnapPoint.value + e.translationY;
      // High-precision resistance
      if (translateY.value < snaps[0]!) {
          translateY.value = snaps[0]! + (e.translationY * 0.15);
      }
    })
    .onEnd((e) => {
      const currentPos = translateY.value;
      const velocity = e.velocityY;

      // Aggressive close on flick
      if (velocity > 400) {
        runOnJS(closeSheet)();
        return;
      }

      // Snap to nearest point with low mass for speed
      if (snaps.length > 0) {
          const nearestPoint = snaps.reduce((prev, curr) => 
            Math.abs(curr - currentPos) < Math.abs(prev - currentPos) ? curr : prev
          );

          if (currentPos > SCREEN_HEIGHT * 0.8) {
            runOnJS(closeSheet)();
          } else {
            translateY.value = withSpring(nearestPoint, { 
                damping: 20, 
                stiffness: 250, 
                mass: 0.5 
            });
          }
      } else {
          runOnJS(closeSheet)();
      }
    });

  const rSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const rBackdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [SCREEN_HEIGHT, snaps[0] || SCREEN_HEIGHT / 2],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  if (!shouldRender) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, rBackdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, style, rSheetStyle]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          
          {title && (
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{title}</Text>
            </View>
          )}

          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 101,
  },
  handleContainer: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 2.5,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  }
});
