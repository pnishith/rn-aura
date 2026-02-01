import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Types ---

export type AuraMode = 'compact' | 'minimal' | 'expanded' | 'silent';

export interface AuraIslandState {
  visible: boolean;
  mode: AuraMode;
  content: ReactNode | null; // For expanded/compact content
  icon: ReactNode | null; // For minimal mode (leading icon)
}

interface AuraContextType {
  showAura: (mode: AuraMode, content?: ReactNode, icon?: ReactNode) => void;
  hideAura: () => void;
}

// --- Context ---

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export const useAura = () => {
  const context = useContext(AuraContext);
  if (!context) throw new Error('useAura must be used within an AuraProvider');
  return context;
};

// --- Constants ---

const SCREEN_WIDTH = Dimensions.get('window').width;
const ISLAND_MAX_WIDTH = SCREEN_WIDTH - 24;
const ISLAND_MIN_WIDTH = 120;
const ISLAND_HEIGHT_COMPACT = 36;
const ISLAND_HEIGHT_EXPANDED = 160; // Max expanded height (adaptive)

// --- Component ---

export const AuraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  
  // State
  const [active, setActive] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  
  // Animation Values
  const width = useSharedValue(ISLAND_MIN_WIDTH);
  const height = useSharedValue(ISLAND_HEIGHT_COMPACT);
  const borderRadius = useSharedValue(20);
  const translateY = useSharedValue(-100); // Start off-screen

  const showAura = useCallback((mode: AuraMode, newContent?: ReactNode, _newIcon?: ReactNode) => {
    setActive(true);
    setContent(newContent);
    
    const safeTop = insets.top || 0;
    
    translateY.value = withSpring(safeTop + (Platform.OS === 'android' ? 10 : 2), { 
        damping: 30, 
        stiffness: 200, 
        mass: 1 
    });

    // Snappy Physics (Fast attack, tiny overshoot for "life")
    const fluidConfig = { damping: 25, stiffness: 350, mass: 1 };

    switch (mode) {
      case 'minimal':
        width.value = withSpring(ISLAND_MIN_WIDTH, fluidConfig);
        height.value = withSpring(ISLAND_HEIGHT_COMPACT, fluidConfig);
        borderRadius.value = withSpring(18, fluidConfig);
        break;
      case 'compact':
        width.value = withSpring(200, fluidConfig);
        height.value = withSpring(ISLAND_HEIGHT_COMPACT, fluidConfig);
        borderRadius.value = withSpring(18, fluidConfig);
        break;
      case 'expanded':
        width.value = withSpring(ISLAND_MAX_WIDTH, fluidConfig);
        height.value = withSpring(ISLAND_HEIGHT_EXPANDED, fluidConfig);
        borderRadius.value = withSpring(32, fluidConfig);
        break;
      case 'silent':
        translateY.value = withTiming(-100, { duration: 250, easing: Easing.out(Easing.quad) });
        setTimeout(() => setActive(false), 250);
        break;
    }
  }, [insets.top, width, height, borderRadius, translateY]);

  const hideAura = useCallback(() => {
    showAura('silent');
  }, [showAura]);

  // Styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      borderRadius: borderRadius.value,
      transform: [
        { translateX: -width.value / 2 }, // Center horizontally
        { translateY: translateY.value }
      ],
    };
  });

    const pan = Gesture.Pan()
    .onUpdate((e) => {
        // Allow dragging up to dismiss
        if (e.translationY < 0) {
            const safeTop = insets.top || 0;
            translateY.value = withSpring(safeTop + e.translationY, { damping: 20, stiffness: 400 });
        }
    })
    .onEnd((e) => {
        const safeTop = insets.top || 0;
        if (e.translationY < -20) {
            runOnJS(hideAura)();
        } else {
            translateY.value = withSpring(safeTop + (Platform.OS === 'android' ? 10 : 2));
        }
    });

  return (
    <AuraContext.Provider value={{ showAura, hideAura }}>
      {children}
      
      {/* Floating Island Layer */}
      {active && (
        <View style={styles.overlay} pointerEvents="box-none">
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.island, animatedStyle]}>
                <View style={styles.contentContainer}>
                {typeof content === 'string' ? (
                  <Animated.Text style={{ color: 'white' }}>{content}</Animated.Text>
                ) : (
                  content
                )}
                </View>
            </Animated.View>
          </GestureDetector>
        </View>
      )}
    </AuraContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // Always on top
    alignItems: 'center', // Center X
  },
  island: {
    backgroundColor: '#000', // Deep black
    position: 'absolute',
    left: '50%', // Centering trick with translateX
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
