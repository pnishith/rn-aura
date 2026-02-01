import React, { useEffect } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming
} from 'react-native-reanimated';

export interface StepTrackerProps {
  steps: string[];
  currentStep: number; // 0-indexed
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
}

const StepLine = ({ 
  active, 
  color, 
  inactiveColor 
}: { 
  active: boolean; 
  color: string; 
  inactiveColor: string 
}) => {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 400 });
  }, [active]);

  const rStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
      backgroundColor: color,
    };
  });

  return (
    <View style={styles.lineWrapper}>
      <View style={[styles.lineBase, { backgroundColor: inactiveColor }]} />
      <Animated.View style={[styles.lineFill, rStyle]} />
    </View>
  );
};

export const StepTracker: React.FC<StepTrackerProps> = ({
  steps,
  currentStep,
  activeColor = '#007AFF',
  inactiveColor = '#E0E0E0',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <View style={styles.stepWrapper}>
             <View style={styles.dotWrapper}>
               <Animated.View 
                 style={[
                   styles.dot, 
                   { 
                     backgroundColor: index <= currentStep ? activeColor : inactiveColor,
                     transform: [{ scale: index === currentStep ? 1.2 : 1 }] // Simplified scale, could be animated too
                   }
                 ]} 
               />
             </View>
             <Text 
               numberOfLines={1}
               style={[
                 styles.label, 
                 { 
                   color: index <= currentStep ? activeColor : '#999',
                   fontWeight: index === currentStep ? 'bold' : 'normal'
                 }
               ]}
             >
               {step}
             </Text>
          </View>
          {index < steps.length - 1 && (
            <StepLine 
              active={index < currentStep} 
              color={activeColor} 
              inactiveColor={inactiveColor} 
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepWrapper: {
    alignItems: 'center',
    zIndex: 1,
    width: 60, // Fixed width for alignment
  },
  dotWrapper: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  lineWrapper: {
    flex: 1,
    height: 2,
    marginTop: 11, // Align center of dot (12/2 + padding)
    position: 'relative',
  },
  lineBase: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  lineFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
  },
});
