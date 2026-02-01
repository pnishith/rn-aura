import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

// Reanimated 4+ Worklets migration helper
const scheduleOnJS = (global as any).Worklets?.scheduleOnJS 
  ? (fn: () => void, ...args: any[]) => (global as any).Worklets.scheduleOnJS(fn)(...args)
  : runOnJS;

interface RatingSwipeProps {
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  initialRating?: number;
}

export const RatingSwipe: React.FC<RatingSwipeProps> = ({
  onRatingChange,
  maxRating = 5,
  initialRating = 0,
}) => {
  // Use a shared value for the rating to avoid JS thread dependency during gesture
  const ratingSv = useSharedValue(initialRating);
  const [jsRating, setJsRating] = useState(initialRating);
  const width = useSharedValue(0);
  const containerWidth = 300; 

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      width.value = Math.max(0, Math.min(e.x, containerWidth));
      const newRating = Math.ceil((width.value / containerWidth) * maxRating);
      
      // Update shared value immediately for UI feedback if we were to move stars to Reanimated
      if (ratingSv.value !== newRating) {
         ratingSv.value = newRating;
         scheduleOnJS(setJsRating)(newRating);
      }
    })
    .onEnd(() => {
      scheduleOnJS(onRatingChange)(ratingSv.value);
    });

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View style={[styles.container, { width: containerWidth }]}>
        <View style={styles.background}>
           {Array.from({ length: maxRating }).map((_, i) => (
             <View key={i} style={styles.starPlaceholder} />
           ))}
        </View>
        <Animated.View style={[styles.fill, animatedFillStyle]} />
        <View style={styles.overlay}>
            {/* Using JS state for rendering stars to keep it simple, but debounce ensures stability */}
            {Array.from({ length: maxRating }).map((_, i) => (
             <View key={i} style={[styles.starPlaceholder, i < jsRating ? styles.activeStar : {}]} />
           ))}
        </View>
        <Text style={styles.ratingText}>{jsRating}/{maxRating}</Text>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: '#F2F2F7',
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  background: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    position: 'absolute',
    width: '100%',
  },
  starPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1D1D6',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FFD700', // Gold
    position: 'absolute',
    left: 0,
    opacity: 0.3,
  },
  overlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    position: 'absolute',
    width: '100%',
    pointerEvents: 'none',
  },
  activeStar: {
    backgroundColor: '#FF9500',
  },
  ratingText: {
    position: 'absolute',
    right: 10,
    top: -20,
    fontWeight: 'bold',
    color: '#333',
  },
});
