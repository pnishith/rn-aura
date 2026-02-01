import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';

interface ActionItem {
  icon: React.ReactNode; // or name if using vector icons, using node for flexibility
  label?: string;
  onPress: () => void;
}

interface FloatMenuProps {
  triggerIcon: React.ReactNode;
  actions: ActionItem[];
  color?: string;
  style?: ViewStyle;
}

interface ActionButtonProps {
  action: ActionItem;
  index: number;
  totalActions: number;
  openProgress: SharedValue<number>;
  color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  index,
  totalActions,
  openProgress,
  color,
}) => {
  const animatedActionStyle = useAnimatedStyle(() => {
    return {
      opacity: openProgress.value,
      transform: [
        {
          translateY: interpolate(
            openProgress.value,
            [0, 1],
            [0, -10 * (totalActions - index) - 50]
          ),
        },
        { scale: openProgress.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.actionButtonContainer, animatedActionStyle]}>
      {action.label && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{action.label}</Text>
        </View>
      )}
      <TouchableOpacity
        style={[styles.smallButton, { backgroundColor: color }]}
        onPress={action.onPress}
      >
        {action.icon}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const FloatMenu: React.FC<FloatMenuProps> = ({
  triggerIcon,
  actions,
  color = '#007AFF',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openProgress = useSharedValue(0);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    openProgress.value = withSpring(nextState ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  };

  const animatedTriggerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(openProgress.value, [0, 1], [0, 45])}deg`,
        },
      ],
    };
  });

  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      <View style={styles.actionsContainer} pointerEvents="box-none">
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            action={{
                ...action,
                onPress: () => {
                    action.onPress();
                    toggleMenu();
                }
            }}
            index={index}
            totalActions={actions.length}
            openProgress={openProgress}
            color={color}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.triggerButton, { backgroundColor: color }]}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Animated.View style={animatedTriggerStyle}>
          {triggerIcon || <Text style={{ fontSize: 24, color: 'white' }}>+</Text>}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
    zIndex: 9999, // Ensure it floats above everything
  },
  triggerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    marginBottom: 0,
    zIndex: 5,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'flex-end',
    width: 200, 
    paddingRight: 8, // slight offset to align with center of trigger
  },
  smallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginLeft: 10,
  },
  labelContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    elevation: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});
