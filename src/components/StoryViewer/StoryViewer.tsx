import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ImageSourcePropType,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface StoryItem {
  id: string;
  image: ImageSourcePropType;
  duration?: number;
}

interface StoryViewerProps {
  stories: StoryItem[];
  onComplete?: () => void;
}

const ProgressBar: React.FC<{
  index: number;
  currentIndex: number;
  duration: number;
  onFinish: () => void;
}> = ({ index, currentIndex, duration, onFinish }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (index === currentIndex) {
      progress.value = 0;
      progress.value = withTiming(1, { duration, easing: Easing.linear }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      });
    } else if (index < currentIndex) {
      progress.value = 1;
    } else {
      progress.value = 0;
    }
    return () => cancelAnimation(progress);
  }, [currentIndex, index]);

  const style = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.progressBackground}>
      <Animated.View style={[styles.progressFill, style]} />
    </View>
  );
};

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePress = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const currentStory = stories?.[currentIndex];

  if (!currentStory) return null;

  return (
    <View style={styles.container}>
      <Image source={currentStory.image} style={styles.image} resizeMode="cover" />
      
      <View style={styles.progressContainer}>
        {stories.map((story, index) => (
          <ProgressBar
            key={story.id}
            index={index}
            currentIndex={currentIndex}
            duration={story.duration || 5000}
            onFinish={handleNext}
          />
        ))}
      </View>

      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.touchLayer} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    height: 3,
  },
  progressBackground: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
  },
  touchLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});
