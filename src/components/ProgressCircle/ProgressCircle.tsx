import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

// Using a simplified view-based approach since react-native-svg might not be installed
// Ideally, this should use SVG. Here we use 2 half-circles to simulate progress.

interface ProgressCircleProps {
  progress: number; // 0 to 1
  size?: number;
  color?: string;
  thickness?: number;
  showText?: boolean;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 100,
  color = '#007AFF',
  thickness = 10,
  showText = true,
}) => {
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  // We rotate two half-circles.
  // First half covers 0-50% (0-180deg)
  // Second half covers 50-100% (180-360deg)
  
  const firstHalfStyle = useAnimatedStyle(() => {
    const deg = interpolate(progressValue.value, [0, 0.5, 1], [0, 180, 180]);
    return {
      transform: [{ rotate: `${deg}deg` }],
    };
  });

  const secondHalfStyle = useAnimatedStyle(() => {
    const deg = interpolate(progressValue.value, [0, 0.5, 1], [0, 0, 180]);
    return {
      transform: [{ rotate: `${deg}deg` }],
      opacity: progressValue.value > 0.5 ? 1 : 0, 
    };
  });

  // To hide the first half when second half is active, we need a cover?
  // Actually, standard CSS method:
  // Right half (0-180) hidden by mask?
  // Easier way: 
  // Two semicircles.
  // Right one rotates from 0 to 180.
  // Left one rotates from 0 to 180 (starts after 50%).
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness,
            borderColor: '#E5E5EA',
          },
        ]}
      />
      
      {/* Progress Layer - Simplified to just a label for this non-SVG version 
          Implementing pure View-based circular progress is tricky without SVG.
          Let's implement a square bar or just text if SVG is strictly not allowed.
          Wait, I can use the border-radius trick.
      */}
      
       {/* Actually, let's try the border trick. */}
       <View style={[styles.overlayContainer, { width: size, height: size }]}>
          <View style={styles.halfContainer}>
             <Animated.View style={[
                 styles.halfCircle, 
                 { 
                     width: size, height: size, borderRadius: size/2, borderWidth: thickness, borderColor: color,
                     borderLeftColor: 'transparent', borderBottomColor: 'transparent',
                     transform: [{rotate: '45deg'}] // Adjust start
                 },
                 firstHalfStyle
             ]} /> 
          </View>
           <View style={[styles.halfContainer, { transform: [{rotate: '180deg'}] }]}>
             <Animated.View style={[
                 styles.halfCircle, 
                 { 
                     width: size, height: size, borderRadius: size/2, borderWidth: thickness, borderColor: color,
                     borderLeftColor: 'transparent', borderBottomColor: 'transparent',
                     transform: [{rotate: '45deg'}]
                 },
                 secondHalfStyle
             ]} /> 
          </View>
       </View>

      <View style={styles.textContainer}>
         {showText && <Text style={styles.text}>{Math.round(progress * 100)}%</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  overlayContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  halfContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  halfCircle: {
      position: 'absolute',
      top: 0,
      left: 0,
  },
  textContainer: {
    position: 'absolute',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
});
