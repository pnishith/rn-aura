import React from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  Heading,
  Text,
  ZoomableView,
  ImageComparer,
  SmartImage,
  Spinner,
  AvatarStack,
  Row,
} from 'rn-aura';

export default function MediaScreen() {
  return (
    <Box flex={1} bg="#FFFFFF">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        <Heading level={2} mb={20}>Media Components</Heading>

        <Box mb={30}>
          <Heading level={5} mb={10}>Smart Image (with fade-in)</Heading>
          <SmartImage
            source={{ uri: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800' }}
            style={{ width: '100%', height: 200, borderRadius: 12 }}
            placeholderColor="#E0E0E0"
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Spinner</Heading>
          <Row gap={20}>
            <Spinner size={30} color="#4F46E5" />
            <Spinner size={40} color="#10B981" duration={2000} />
            <Spinner size={20} color="#EF4444" />
          </Row>
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Zoomable View (Pinch/Pan)</Heading>
          <Box height={200} bg="#F3F4F6" borderRadius={12} overflow="hidden">
            <ZoomableView>
              <SmartImage
                source={{ uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800' }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </ZoomableView>
          </Box>
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Image Comparer</Heading>
          <ImageComparer
            leftImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
            rightImage="https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800"
            height={200}
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Avatar Stack</Heading>
          <AvatarStack
            avatars={[
              'https://i.pravatar.cc/100?img=1',
              'https://i.pravatar.cc/100?img=2',
              'https://i.pravatar.cc/100?img=3',
              'https://i.pravatar.cc/100?img=4',
            ]}
            max={3}
            size={40}
          />
        </Box>

      </ScrollView>
    </Box>
  );
}
