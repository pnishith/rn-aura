import React, { useState, useEffect } from 'react';
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
  Confetti,
  CurrencyInput,
  Marquee,
  PulseDot,
  Skeleton,
  AccordionItem,
  Tabs,
  Badge,
  AvatarStack,
  ProgressBar,
  ProgressCircle,
  SegmentedControl,
  StepTracker,
  RadioGroup,
  SearchField,
  CreditCardInput,
  PhoneInput,
  Spinner
} from 'rn-aura';
import Icon from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function OtpTestScreen() {
  // States for existing components
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [switchVal, setSwitchVal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [segmentedIdx, setSegmentedIdx] = useState(0);

  // States for 5 NEW components
  const [radioVal, setRadioVal] = useState('Option 1');
  const [searchVal, setSearchVal] = useState('');
  const [cardVal, setCardVal] = useState('');
  const [phoneVal, setPhoneVal] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setOtpError(value.length === 4 && value !== '1234');
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box p={20} bg="#F9FAFB" style={{ borderRadius: 12 }}>
            <Heading level={6} style={{ marginBottom: 10 }}>Project Overview</Heading>
            <Text size={14} color="#6B7280">
              Welcome to the Aura Overview. This project focuses on solving complex UI challenges with high-performance components.
            </Text>
          </Box>
        );
      case 1:
        return (
          <Box p={20} bg="#EFF6FF" style={{ borderRadius: 12 }}>
            <Heading level={6} style={{ marginBottom: 10, color: '#1E40AF' }}>Technical Details</Heading>
            <Column gap={10}>
                <Row gap={8}><Icon name="hardware-chip-outline" size={16} color="#3B82F6" /><Text size={13} weight="600">Fabric Enabled</Text></Row>
                <Row gap={8}><Icon name="flash-outline" size={16} color="#3B82F6" /><Text size={13} weight="600">60/120 FPS Animations</Text></Row>
                <Row gap={8}><Icon name="code-working-outline" size={16} color="#3B82F6" /><Text size={13} weight="600">Strictly Typed</Text></Row>
            </Column>
          </Box>
        );
      case 2:
        return (
          <Box p={20} bg="#F0FDF4" style={{ borderRadius: 12 }}>
            <Heading level={6} style={{ marginBottom: 10, color: '#166534' }}>User Reviews</Heading>
            <Row gap={5} style={{ marginBottom: 8 }}>
                {[1,2,3,4].map(i => <Icon key={i} name="star" size={16} color="#FBBC05" />)}
                <Icon name="star-half" size={16} color="#FBBC05" />
            </Row>
            <Text size={13} italic color="#166534">"The performance is incredible!"</Text>
          </Box>
        );
      default: return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Confetti active={showConfetti} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Box center mb={40}>
              <Heading level={2} style={{ marginBottom: 8 }}>Component Lab</Heading>
              <Text color="#6B7280" align="center">Standalone Testing Environment</Text>
            </Box>

            {/* 1. Otp Input */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>1. Otp Input (Code: 1234)</Heading>
              <OtpInput length={4} value={otp} onChange={handleOtpChange} error={otpError} autoFocus={false} />
              {otpError && <Text color="#EF4444" size={12} style={{ marginTop: 10, fontWeight: '600' }}>Invalid code. Try 1234.</Text>}
            </Box>

            {/* 2. Advanced Form Inputs (NEW) */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>2. Advanced Form Inputs</Heading>
                <Box mb={20}>
                    <Text weight="600" style={{ marginBottom: 8 }}>Credit Card Input</Text>
                    <CreditCardInput value={cardVal} onChangeText={setCardVal} placeholder="0000 0000 0000 0000" />
                </Box>
                <Box mb={20}>
                    <Text weight="600" style={{ marginBottom: 8 }}>Phone Input</Text>
                    <PhoneInput value={phoneVal} onChangeText={setPhoneVal} placeholder="555-0123" />
                </Box>
                <Box>
                    <Text weight="600" style={{ marginBottom: 8 }}>Search Field</Text>
                    <SearchField value={searchVal} onChangeText={setSearchVal} placeholder="Search anything..." />
                </Box>
            </Box>

            {/* 3. Modern Selection (NEW) */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>3. Modern Selection</Heading>
                <Box mb={20}>
                    <Text weight="600" style={{ marginBottom: 10 }}>Radio Group</Text>
                    <RadioGroup 
                        options={[{ label: 'Option 1', value: 'Option 1' }, { label: 'Option 2', value: 'Option 2' }]} 
                        value={radioVal} 
                        onChange={setRadioVal} 
                        layout="row"
                    />
                </Box>
                <Box>
                    <Text weight="600" style={{ marginBottom: 10 }}>Segmented Control</Text>
                    <SegmentedControl options={['Day', 'Week', 'Month']} selectedIndex={segmentedIdx} onChange={setSegmentedIdx} />
                </Box>
            </Box>

            {/* 4. Loading States (NEW) */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>4. Loading & Spinners</Heading>
                <Row gap={30} align="center" justify="center">
                    <Spinner size={30} color="#4F46E5" />
                    <Spinner size={40} color="#10B981" />
                    <Spinner size={20} color="#EF4444" />
                </Row>
            </Box>

            {/* 5. Floating Input */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>5. Floating Input</Heading>
              <FloatingInput label="Email Address" value={email} onChangeText={setEmail} placeholder="Enter your email" />
            </Box>

            {/* 6. Currency Input */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>6. Currency Input (Multi-Symbol)</Heading>
                <CurrencyInput 
                    value={amount} onChangeValue={setAmount} placeholder="0.00"
                    currencies={[{ symbol: '$', locale: 'en-US' }, { symbol: '₹', locale: 'en-IN' }]}
                />
            </Box>

            {/* 7. Progress & Indicators */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>7. Progress & Indicators</Heading>
                <Row gap={15} align="center" style={{ marginBottom: 20 }}>
                    <ProgressCircle progress={0.65} size={60} color="#4F46E5" />
                    <Box flex={1}>
                        <ProgressBar progress={0.8} color="#10B981" height={8} />
                        <Text size={12} color="#6B7280" style={{ marginTop: 5 }}>Storage Used: 80%</Text>
                    </Box>
                </Row>
                <Row gap={15}>
                    <Badge count={5} color="#EF4444" /><Badge count={100} maxCount={99} color="#3B82F6" /><Badge label="New" color="#F59E0B" />
                </Row>
            </Box>

            {/* 8. Visual Feedback */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>8. Visual Feedback</Heading>
                <Box bg="#F3F4F6" p={12} style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 15 }}>
                    <Marquee text="🚀 RN Aura is building the future of React Native UI kits! " speed={40} />
                </Box>
                <Row gap={15} align="center">
                    <Box center><PulseDot size={12} color="#10B981" /><Text size={10} color="#6B7280" style={{ marginTop: 5 }}>Online</Text></Box>
                    <Box center><PulseDot size={12} color="#EF4444" /><Text size={10} color="#6B7280" style={{ marginTop: 5 }}>Recording</Text></Box>
                    <Box flex={1}>
                        {isLoading ? <Skeleton width="100%" height={20} style={{ borderRadius: 4 }} /> : <Text size={14} color="#374151">Data Loaded (after 10s)</Text>}
                    </Box>
                </Row>
            </Box>

            {/* 9. Layout & Navigation */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>9. Tabs & Accordion</Heading>
                <Tabs tabs={[{ key: 0, title: 'Overview' }, { key: 1, title: 'Details' }, { key: 2, title: 'Reviews' }]} activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 15 }} />
                <Box style={{ minHeight: 120 }}>{renderTabContent()}</Box>
                <Box mt={20}>
                    <AccordionItem title="Project Mission Details">
                        <Box p={5}>
                            <Text size={14} color="#4B5563" style={{ marginBottom: 12 }}>
                                Aura is a high-performance component library built for React Native 0.83+.
                            </Text>
                            <Row gap={8} wrap="wrap" style={{ marginBottom: 12 }}>
                                <Chip label="High Performance" variant="outlined" color="#10B981" />
                                <Chip label="Fabric Ready" variant="outlined" color="#3B82F6" />
                                <Chip label="Modern Design" variant="outlined" color="#6366F1" />
                            </Row>
                            <SmartButton 
                                title="Learn More" 
                                variant="outlined" 
                                style={{ minHeight: 40, paddingVertical: 8 }} 
                                onPress={() => Alert.alert('Navigating to docs...')}
                            />
                        </Box>
                    </AccordionItem>
                    <AccordionItem title="System Requirements">
                        <Box p={5}>
                            <Column gap={10}>
                                <Row gap={10}>
                                    <Icon name="checkmark-circle" size={18} color="#10B981" />
                                    <Text size={14}>React Native 0.71+</Text>
                                </Row>
                                {/* <Row gap={10}>
                                    <Icon name="checkmark-circle" size={18} color="#10B981" />
                                    <Text size={14}>Reanimated 3.0+</Text>
                                </Row> */}
                                {/* <Row gap={10}>
                                    <Icon name="checkmark-circle" size={18} color="#10B981" />
                                    <Text size={14}>Gesture Handler 2.0+</Text>
                                </Row> */}
                            </Column>
                        </Box>
                    </AccordionItem>
                    <Box mt={15}><StepTracker steps={['Start', 'Build', 'Launch']} currentStep={1} activeColor="#4F46E5" /></Box>
                </Box>
            </Box>

            {/* 10. Interaction Row */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>10. Switches & Checkboxes</Heading>
              <Row justify="space-between" style={{ marginBottom: 15, padding: 10, backgroundColor: '#F9FAFB', borderRadius: 12 }}><Text weight="600">Fluid Switch</Text><FluidSwitch value={switchVal} onValueChange={setSwitchVal} /></Row>
              <Row justify="space-between" style={{ padding: 10, backgroundColor: '#F9FAFB', borderRadius: 12 }}><Text weight="600">Bouncing Checkbox</Text><BouncingCheckbox checked={checked} onChange={setChecked} /></Row>
            </Box>

            {/* 11. Rating Swipe */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>11. Rating Swipe</Heading>
              <RatingSwipe onRatingChange={(r) => setRating(r)} initialRating={rating} showSliderBackground />
            </Box>

            {/* 12. Buttons */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>12. Premium Buttons</Heading>
              <Column gap={15}>
                <SmartButton title="Smart Button (Confetti)" onPress={triggerConfetti} />
                <SwipeButton title="Slide to Confirm" onComplete={() => Alert.alert('Swipe Complete!')} />
              </Column>
            </Box>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  scrollContent: { padding: 24, alignItems: 'center' },
});
