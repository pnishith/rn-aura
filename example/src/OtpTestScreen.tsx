import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView,
  Alert
} from 'react-native';
import { 
  OtpInput, 
  Heading, 
  Text, 
  Box, 
  Row,
  Column,
  SwipeButton,
  FluidSwitch,
  BouncingCheckbox,
  SmartButton,
  Chip,
  RatingSwipe,
  FloatingInput,
  Confetti
} from 'rn-aura';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function OtpTestScreen() {
  // States for various components
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [switchVal, setSwitchVal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setOtpError(value.length === 4 && value !== '1234');
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    // State is auto-reset by the component internally after 5s, 
    // but we reset it here to allow re-triggering.
    setTimeout(() => setShowConfetti(false), 100);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Confetti active={showConfetti} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Box center mb={40}>
              <Heading level={2} style={{ marginBottom: 8 }}>Component Lab</Heading>
              <Text color="#6B7280" align="center">Standalone Testing Environment</Text>
            </Box>

            {/* 1. Otp Input */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>1. Otp Input (Code: 1234)</Heading>
              <OtpInput
                length={4}
                value={otp}
                onChange={handleOtpChange}
                error={otpError}
                autoFocus={false}
              />
              {otpError && (
                <Text color="#EF4444" size={12} style={{ marginTop: 10, fontWeight: '600' }}>
                  Invalid code. Try 1234.
                </Text>
              )}
            </Box>

            {/* 2. Floating Input */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>2. Floating Input</Heading>
              <FloatingInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
              />
            </Box>

            {/* 3. Interaction Row */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>3. Switches & Checkboxes</Heading>
              <Row justify="space-between" style={{ marginBottom: 15, padding: 10, backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <Text weight="600">Fluid Switch</Text>
                <FluidSwitch value={switchVal} onValueChange={setSwitchVal} />
              </Row>
              <Row justify="space-between" style={{ padding: 10, backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <Text weight="600">Bouncing Checkbox</Text>
                <BouncingCheckbox checked={checked} onChange={setChecked} />
              </Row>
            </Box>

            {/* 4. Rating Swipe */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>4. Rating Swipe</Heading>
              <RatingSwipe 
                onRatingChange={(r) => setRating(r)} 
                initialRating={rating}
              />
              <Text size={12} color="#6B7280" style={{ marginTop: 8 }}>Current Rating: {rating}/5</Text>
            </Box>

            {/* 5. Chips */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>5. Animated Chips</Heading>
              <Row wrap="wrap" gap={10}>
                <Chip label="Default" onPress={() => {}} />
                <Chip label="Selected" selected onPress={() => {}} />
                <Chip label="Outlined" variant="outlined" color="#10B981" onPress={() => {}} />
                <Chip label="Custom Color" color="#F59E0B" selected onPress={() => {}} />
              </Row>
            </Box>

            {/* 6. Buttons */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>6. Premium Buttons</Heading>
              <Column gap={15}>
                <SmartButton 
                  title="Smart Button (Confetti)" 
                  onPress={triggerConfetti} 
                />
                <SwipeButton 
                  title="Slide to Confirm" 
                  onComplete={() => Alert.alert('Swipe Complete!')} 
                />
              </Column>
            </Box>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
});
