import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';

export interface AvatarStackProps {
  avatars: (string | ImageSourcePropType)[];
  limit?: number;
  size?: number;
  offset?: number;
  borderColor?: string;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  avatars,
  limit = 4,
  size = 40,
  offset = -12,
  borderColor = '#FFF',
}) => {
  const visibleAvatars = avatars.slice(0, limit);
  const remaining = avatars.length - limit;

  return (
    <View style={styles.container}>
      {visibleAvatars.map((source, index) => (
        <View 
          key={index} 
          style={[
            styles.avatarContainer, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              marginLeft: index === 0 ? 0 : offset,
              borderColor,
              borderWidth: 2,
              zIndex: visibleAvatars.length - index,
            }
          ]}
        >
          <Image 
            source={typeof source === 'string' ? { uri: source } : source} 
            style={styles.image} 
          />
        </View>
      ))}
      {remaining > 0 && (
        <View 
          style={[
            styles.avatarContainer, 
            styles.remainingContainer,
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              marginLeft: offset,
              borderColor,
              borderWidth: 2,
              zIndex: 0,
            }
          ]}
        >
          <Text style={[styles.remainingText, { fontSize: size * 0.35 }]}>
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  remainingContainer: {
    backgroundColor: '#F0F0F0',
  },
  remainingText: {
    color: '#666',
    fontWeight: '600',
  },
});
