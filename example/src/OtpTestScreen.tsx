import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView,
  Alert,
  Image
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
  Spinner,
  BottomSheet,
  FloatMenu,
  ImageComparer,
  SmartImage,
  ZoomableView,
  HapticTab
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

  // States for inputs
  const [radioVal, setRadioVal] = useState('Option 1');
  const [searchVal, setSearchVal] = useState('');
  const [cardVal, setCardVal] = useState('');
  
  // Phone Input State
  const [phoneVal, setPhoneVal] = useState('');
  const [country, setCountry] = useState({ code: '+1', flag: '🇺🇸' });

  // BottomSheet State
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [sheetMode, setSheetMode] = useState<'standard' | 'snap'>('standard');

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

  const toggleCountry = () => {
    if (country.code === '+1') {
        setCountry({ code: '+91', flag: '🇮🇳' });
    } else {
        setCountry({ code: '+1', flag: '🇺🇸' });
    }
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

            {/* 2. Advanced Form Inputs */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>2. Advanced Form Inputs</Heading>
                <Box mb={20}>
                    <Text weight="600" style={{ marginBottom: 8 }}>Credit Card Input</Text>
                    <CreditCardInput value={cardVal} onChangeText={setCardVal} placeholder="0000 0000 0000 0000" />
                </Box>
                <Box mb={20}>
                    <Text weight="600" style={{ marginBottom: 8 }}>Production Phone Input (Tap Flag)</Text>
                    <PhoneInput 
                        value={phoneVal} 
                        onChangePhone={setPhoneVal} 
                        placeholder="555-0123" 
                        countryCode={country.code}
                        onCountryPress={toggleCountry}
                        flagComponent={<Text style={{fontSize: 18}}>{country.flag}</Text>}
                    />
                </Box>
                <Box>
                    <Text weight="600" style={{ marginBottom: 8 }}>Search Field</Text>
                    <SearchField value={searchVal} onChangeText={setSearchVal} placeholder="Search anything..." />
                </Box>
            </Box>

            {/* 3. Media & Visuals */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>3. Media & Zoom</Heading>
                <Box mb={20} style={{ borderRadius: 16, overflow: 'hidden', height: 200 }}>
                    <ImageComparer 
                        leftImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
                        rightImage="https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800"
                        height={200}
                    />
                </Box>
                <Box mb={20} bg="#F3F4F6" style={{ borderRadius: 16, overflow: 'hidden', height: 200 }}>
                    <ZoomableView>
                        <SmartImage 
                            source={{ uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800' }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    </ZoomableView>
                </Box>
                <Row gap={15} justify="center">
                    <HapticTab label="Tab 1" selected onPress={() => {}} />
                    <HapticTab label="Tab 2" onPress={() => {}} />
                </Row>
            </Box>

            {/* 4. Overlay & Menus */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>4. Overlays & Menus</Heading>
                <SmartButton 
                    title="Open Standard Sheet (50%)" 
                    onPress={() => { setSheetMode('standard'); setIsSheetVisible(true); }} 
                    style={{ marginBottom: 12 }}
                />
                <SmartButton 
                    title="Open Snap Sheet (40%, 90%)" 
                    variant="outlined"
                    onPress={() => { setSheetMode('snap'); setIsSheetVisible(true); }} 
                    style={{ marginBottom: 20 }}
                />
            </Box>

            {/* 5. Modern Selection */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>5. Modern Selection</Heading>
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

            {/* 6. Loading States */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>6. Loading & Spinners</Heading>
                <Row gap={30} align="center" justify="center">
                    <Spinner size={30} color="#4F46E5" />
                    <Spinner size={40} color="#10B981" />
                    <Spinner size={20} color="#EF4444" />
                </Row>
            </Box>

            {/* 7. Floating Input */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>7. Floating Input</Heading>
              <FloatingInput label="Email Address" value={email} onChangeText={setEmail} placeholder="Enter your email" />
            </Box>

            {/* 8. Currency Input */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>8. Currency Input (Multi-Symbol)</Heading>
                <CurrencyInput 
                    value={amount} onChangeValue={setAmount} placeholder="0.00"
                    currencies={[{ symbol: '$', locale: 'en-US' }, { symbol: '₹', locale: 'en-IN' }]}
                />
            </Box>

            {/* 9. Progress & Indicators */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>9. Progress & Indicators</Heading>
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

            {/* 10. Social & Avatars */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>10. Social & Avatars</Heading>
                <Row justify="space-between" align="center">
                    <AvatarStack 
                        avatars={[
                            'https://i.pravatar.cc/100?u=1',
                            'https://i.pravatar.cc/100?u=2',
                            'https://i.pravatar.cc/100?u=3',
                            'https://i.pravatar.cc/100?u=4',
                        ]}
                        size={40}
                        limit={3}
                    />
                    <Text size={14} color="#4B5563" weight="600">+12 others active</Text>
                </Row>
            </Box>

            {/* 11. Visual Feedback */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>11. Visual Feedback</Heading>
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

            {/* 12. Layout & Navigation */}
            <Box mb={40} width="100%">
                <Heading level={5} style={{ marginBottom: 15 }}>12. Tabs & Dynamic Content</Heading>
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
                        </Box>
                    </AccordionItem>
                    <Box mt={15}><StepTracker steps={['Start', 'Build', 'Launch']} currentStep={1} activeColor="#4F46E5" /></Box>
                </Box>
            </Box>

            {/* 13. Interaction Row */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>13. Switches & Checkboxes</Heading>
              <Row justify="space-between" style={{ marginBottom: 15, padding: 10, backgroundColor: '#F9FAFB', borderRadius: 12 }}><Text weight="600">Fluid Switch</Text><FluidSwitch value={switchVal} onValueChange={setSwitchVal} /></Row>
              <Row justify="space-between" style={{ padding: 10, backgroundColor: '#F9FAFB', borderRadius: 12 }}><Text weight="600">Bouncing Checkbox</Text><BouncingCheckbox checked={checked} onChange={setChecked} /></Row>
            </Box>

            {/* 14. Rating Swipe */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>14. Rating Swipe</Heading>
              <RatingSwipe onRatingChange={(r) => setRating(r)} initialRating={rating} showSliderBackground />
            </Box>

            {/* 15. Buttons */}
            <Box mb={40} width="100%">
              <Heading level={5} style={{ marginBottom: 15 }}>15. Premium Buttons</Heading>
              <Column gap={15}>
                <SmartButton title="Smart Button (Confetti)" onPress={triggerConfetti} />
                <SwipeButton title="Slide to Confirm" onComplete={() => Alert.alert('Swipe Complete!')} />
              </Column>
            </Box>

          </ScrollView>
        </KeyboardAvoidingView>

        <BottomSheet 
            visible={isSheetVisible} 
            onClose={() => setIsSheetVisible(false)}
            title={sheetMode === 'standard' ? "Standard Sheet" : "Multi-Snap Sheet"}
            snapPoints={sheetMode === 'standard' ? [0.5] : [0.4, 0.9]}
        >
            <Box p={20}>
                <Text color="#4B5563" style={{ marginBottom: 20 }}>
                    {sheetMode === 'standard' 
                        ? "This sheet opens to a fixed 50% height." 
                        : "Try swiping this sheet up to expand to 90% or down to snap at 40%."}
                </Text>
                <SmartButton title="Close Sheet" onPress={() => setIsSheetVisible(false)} />
            </Box>
        </BottomSheet>

        <FloatMenu 
            triggerIcon={<Icon name="add" size={30} color="#FFF" />}
            actions={[
                { icon: <Icon name="camera" size={20} color="#FFF" />, label: 'Camera', onPress: () => Alert.alert('Camera opened') },
                { icon: <Icon name="image" size={20} color="#FFF" />, label: 'Gallery', onPress: () => Alert.alert('Gallery opened') },
            ]}
        />

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  scrollContent: { padding: 24, alignItems: 'center' },
});
