import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

interface RatingSwipeProps {
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  initialRating?: number;
  showSliderBackground?: boolean;
}

const StarIcon = ({ fill = 'none', color = '#D1D5DB', size = 24 }: { fill?: string, color?: string, size?: number }) => (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Text 
          style={{ 
            fontSize: size, 
            lineHeight: size, 
            color: fill !== 'none' ? fill : color,
            includeFontPadding: false,
            textAlignVertical: 'center',
          }}
        >
          ★
        </Text>
    </View>
);

export const RatingSwipe: React.FC<RatingSwipeProps> = ({
  onRatingChange,
  maxRating = 5,
  initialRating = 0,
  showSliderBackground = true,
}) => {
  const containerWidth = 280;
  const starSize = 32;
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
      // Clicking always rounds UP to the next full star
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
                {/* Background Layer: Empty Stars */}
                <View style={styles.starRow}>
                {Array.from({ length: maxRating }).map((_, i) => (
                    <View key={i} style={[styles.starSlot, { width: slotWidth }]}>
                        <StarIcon size={starSize} color="#E5E7EB" />
                    </View>
                ))}
                </View>

                {/* Optional Slider Track Background */}
                {showSliderBackground && (
                    <View style={[styles.sliderTrack, { width: containerWidth }]}>
                        <Animated.View 
                            style={[
                                styles.sliderFill, 
                                animatedFillStyle,
                                { backgroundColor: '#FFB800', opacity: 0.1 }
                            ]} 
                        />
                    </View>
                )}

                {/* Foreground Layer: Gold Stars with clipping fill */}
                <Animated.View style={[styles.fillOverlay, animatedFillStyle]}>
                    <View style={[styles.starRow, { width: containerWidth }]} pointerEvents="none">
                        {Array.from({ length: maxRating }).map((_, i) => (
                            <View key={i} style={[styles.starSlot, { width: slotWidth }]}>
                                <StarIcon size={starSize} fill="#FFB800" />
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
    backgroundColor: 'transparent',
  },
  starRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: '100%',
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
    top: 12,
    bottom: 12,
    // backgroundColor: '#F3F4F6',
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
