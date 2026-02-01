import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  Heading,
  Text,
  Marquee,
  Skeleton,
  ProgressCircle,
  ProgressBar,
  PulseDot,
  StepTracker,
  Row,
} from 'rn-aura';

export default function VisualsScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setProgress(p => (p >= 1 ? 0 : p + 0.1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box flex={1} bg="#FFFFFF">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        <Heading level={2} mb={20}>Visual Components</Heading>

        <Box mb={30}>
          <Heading level={5} mb={10}>Marquee</Heading>
          <Box bg="#F3F4F6" p={10} borderRadius={8} overflow="hidden">
            <Marquee text="Breaking News: React Native Aura is the best UI kit for your next project! " speed={50} />
          </Box>
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Progress</Heading>
          <Row justify="space-around" mb={20}>
             <ProgressCircle progress={0.75} size={80} color="#4F46E5" showText />
             <ProgressCircle progress={progress} size={80} color="#10B981" />
          </Row>
          <Text mb={5}>Linear Progress</Text>
          <ProgressBar progress={0.5} color="#EF4444" height={10} />
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Skeletons</Heading>
          <Row gap={15} align="center">
            <Skeleton width={60} height={60} style={{borderRadius: 30}} />
            <Box>
                <Skeleton width={150} height={20} style={{marginBottom: 8, borderRadius: 4}} />
                <Skeleton width={100} height={15} style={{borderRadius: 4}} />
            </Box>
          </Row>
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Pulse Dot</Heading>
          <Row gap={20} mb={20}>
             <Box center>
                <PulseDot size={20} color="#3B82F6" />
                <Text size={12} color="#6B7280" mt={10}>Online</Text>
             </Box>
             <Box center>
                <PulseDot size={20} color="#EF4444" />
                <Text size={12} color="#6B7280" mt={10}>Live</Text>
             </Box>
          </Row>
        </Box>

        <Box mb={30}>
           <Heading level={5} mb={10}>Step Tracker</Heading>
           <StepTracker 
              steps={['Cart', 'Address', 'Payment', 'Confirm']} 
              currentStep={1} 
              activeColor="#4F46E5"
           />
        </Box>

      </ScrollView>
    </Box>
  );
}
