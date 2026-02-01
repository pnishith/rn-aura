import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import {
  Box,
  Heading,
  Text,
  Row,
  SwipeButton,
  RatingSwipe,
  HapticTab,
  FluidSwitch,
  BouncingCheckbox,
  RadioGroup,
  SegmentedControl,
  SmartButton,
  Chip,
  Confetti,
} from 'rn-aura';

export default function InteractionScreen() {
  const [switchVal, setSwitchVal] = useState(false);
  const [check, setCheck] = useState(false);
  const [radio, setRadio] = useState('Option 1');
  const [segment, setSegment] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <Box flex={1} bg="#FFFFFF">
      {showConfetti && <Confetti />}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Heading level={2} mb={20}>Interaction</Heading>

        <Box mb={30}>
          <Typography variant="h5" mb={10}>Smart Button</Typography>
          <SmartButton
            title="Press Me"
            onPress={triggerConfetti}
            loading={false}
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Swipe Button</Heading>
          <SwipeButton
            title="Slide to Unlock"
            onComplete={() => Alert.alert('Unlocked!')}
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Switches & Checks</Heading>
          <Row justify="space-between" mb={10}>
             <Text>Fluid Switch</Text>
             <FluidSwitch value={switchVal} onValueChange={setSwitchVal} />
          </Row>
          <Row justify="space-between">
             <Text>Bouncing Checkbox</Text>
             <BouncingCheckbox checked={check} onChange={setCheck} />
          </Row>
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Segmented Control</Heading>
          <SegmentedControl
            values={['Daily', 'Weekly', 'Monthly']}
            selectedIndex={segment}
            onChange={(idx) => setSegment(idx)}
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Radio Group</Heading>
          <RadioGroup
            options={['Option 1', 'Option 2', 'Option 3']}
            selected={radio}
            onChange={setRadio}
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Rating Swipe</Heading>
          <RatingSwipe onRating={(r) => console.log(r)} />
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Chips</Heading>
          <Row wrap="wrap" gap={10}>
            <Chip label="React Native" onPress={() => {}} />
            <Chip label="TypeScript" variant="outlined" onPress={() => {}} />
            <Chip label="Design" color="#10B981" onPress={() => {}} />
          </Row>
        </Box>
        
        <Box mb={30}>
             <Heading level={5} mb={10}>Haptic Tab</Heading>
             <HapticTab onPress={() => console.log('Haptic!')}>
                <Box p={15} bg="#F3F4F6" borderRadius={8} center>
                    <Text>Tap for Haptic Feedback</Text>
                </Box>
             </HapticTab>
        </Box>

      </ScrollView>
    </Box>
  );
}
