import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

interface RatingSwipeProps {
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  initialRating?: number;
  showSliderBackground?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  size?: number;
}

const StarIcon = ({ fill = false, color = '#D1D5DB', size = 24 }: { fill?: boolean, color?: string, size?: number }) => (
    <Icon 
      name={fill ? "star" : "star-outline"} 
      size={size} 
      color={color}
      style={{ textAlign: 'center' }}
    />
);

export const RatingSwipe: React.FC<RatingSwipeProps> = ({
  onRatingChange,
  maxRating = 5,
  initialRating = 0,
  showSliderBackground = true,
  activeColor = '#FFB800',
  inactiveColor = '#E5E7EB',
  size = 30,
}) => {
  const containerWidth = 280;
  const slotWidth = containerWidth / maxRating;
  
  // Shared values for high-performance gesture handling
  const ratingSv = useSharedValue(initialRating);
  const width = useSharedValue((initialRating / maxRating) * containerWidth);
  
  // Local state for UI feedback
  const [jsRating, setJsRating] = useState(initialRating);

  // Sync with external initialRating prop changes
  useEffect(() => {
    ratingSv.value = initialRating;
    width.value = withSpring((initialRating / maxRating) * containerWidth);
    setJsRating(initialRating);
  }, [initialRating, maxRating]);

  // Unified logic to apply rating from any interaction
  const applyRating = (newRating: number, animate: boolean = true) => {
    'worklet';
    ratingSv.value = newRating;
    const targetWidth = (newRating / maxRating) * containerWidth;
    
    if (animate) {
        width.value = withSpring(targetWidth, { damping: 50, stiffness: 400 });
    } else {
        width.value = targetWidth;
    }
    
    runOnJS(setJsRating)(newRating);
    runOnJS(onRatingChange)(newRating);
  };

  // Tap gesture for clicking full stars
  const tap = Gesture.Tap()
    .onEnd((e) => {
      const x = Math.max(0, Math.min(e.x, containerWidth));
      const rawRating = (x / containerWidth) * maxRating;
      // Clicking always rounds UP to the next full star for better UX
      const fullRating = Math.ceil(rawRating); 
      applyRating(fullRating, true);
    });

  // Pan gesture for smooth 0.5 increment swiping
  const pan = Gesture.Pan()
    .minDistance(0) // Handle immediate touch
    .onStart((e) => {
        const x = Math.max(0, Math.min(e.x, containerWidth));
        const rawRating = (x / containerWidth) * maxRating;
        const roundedRating = Math.round(rawRating * 2) / 2;
        applyRating(roundedRating, true);
    })
    .onUpdate((e) => {
      const x = Math.max(0, Math.min(e.x, containerWidth));
      const rawRating = (x / containerWidth) * maxRating;
      const roundedRating = Math.round(rawRating * 2) / 2;
      
      if (ratingSv.value !== roundedRating) {
         applyRating(roundedRating, false); // No animation during active drag for low latency
      }
    })
    .onEnd(() => {
        // Final snap on release
        const targetWidth = (ratingSv.value / maxRating) * containerWidth;
        width.value = withSpring(targetWidth, { damping: 50, stiffness: 400 });
    });

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  // Combine gestures so they don't fight
  const composed = Gesture.Exclusive(pan, tap);

  return (
    <View style={styles.outerContainer}>
        <GestureDetector gesture={composed}>
            <View style={[styles.container, { width: containerWidth }]}>
                {/* Background Slider Track */}
                {showSliderBackground && (
                    <View style={[styles.sliderTrack, { width: containerWidth }]}>
                        <Animated.View 
                            style={[
                                styles.sliderFill, 
                                animatedFillStyle,
                                { backgroundColor: activeColor, opacity: 0.1 }
                            ]} 
                        />
                    </View>
                )}

                {/* Background Layer: Empty Stars */}
                <View style={styles.starRow}>
                {Array.from({ length: maxRating }).map((_, i) => (
                    <View key={i} style={[styles.starSlot, { width: slotWidth }]}>
                        <StarIcon size={size} color={inactiveColor} />
                    </View>
                ))}
                </View>

                {/* Foreground Layer: Active Stars with clipping fill */}
                <Animated.View style={[styles.fillOverlay, animatedFillStyle]}>
                    <View style={[styles.starRow, { width: containerWidth }]} pointerEvents="none">
                        {Array.from({ length: maxRating }).map((_, i) => (
                            <View key={i} style={[styles.starSlot, { width: slotWidth }]}>
                                <StarIcon size={size} fill color={activeColor} />
                            </View>
                        ))}
                    </View>
                </Animated.View>
            </View>
        </GestureDetector>
        <Text style={styles.ratingText}>{jsRating.toFixed(1)} / {maxRating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
      alignItems: 'center',
  },
  container: {
    height: 60,
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 12,
  },
  starRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: '100%',
    position: 'absolute', // Ensures perfect stacking
    top: 0,
    left: 0,
  },
  starSlot: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    height: '100%',
  },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    top: 15, // Precisely vertically centered (container 60, track 30)
    bottom: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
  },
  ratingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
});
