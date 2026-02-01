import { StyleSheet, View, Text, SafeAreaView, ScrollView, Alert, Button, Image } from 'react-native';
import { 
  OtpInput, 
  SwipeButton, 
  AuraProvider, 
  useAura,
  CurrencyInput,
  CreditCardInput,
  PhoneInput,
  ZoomableView,
  ImageComparer,
  Marquee,
  FloatMenu,
  RatingSwipe,
  Skeleton,
  Confetti,
  HapticTab,
  ProgressCircle,
  StoryViewer
} from 'rn-aura';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function HomeScreen() {
  const [otp, setOtp] = useState('');
  const [card, setCard] = useState('');
  const [currency, setCurrency] = useState('');
  const { showAura } = useAura();
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {showConfetti && <Confetti duration={3000} />}
      
      <Text style={styles.header}>Aura Kitchen Sink</Text>

      <Section title="1. Smart Inputs">
        <OtpInput 
          value={otp} 
          onChange={setOtp} 
          style={{marginBottom: 10}}
        />
        <CurrencyInput 
          value={currency}
          onChangeText={setCurrency}
          placeholder="$0.00"
          style={{marginBottom: 10}}
        />
        <CreditCardInput 
          value={card}
          onChangeText={setCard}
          placeholder="0000 0000 0000 0000"
        />
      </Section>

      <Section title="2. Dynamic Island">
        <View style={{flexDirection: 'row', gap: 10}}>
          <HapticTab onPress={() => showAura('compact', <Text style={{color:'white'}}>Uploading...</Text>)}>
            <Text>Compact</Text>
          </HapticTab>
          <HapticTab onPress={() => showAura('expanded', <Text style={{color:'white'}}>Success!</Text>)}>
            <Text>Expanded</Text>
          </HapticTab>
        </View>
      </Section>

      <Section title="3. Interaction">
        <SwipeButton 
          onComplete={() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }}
          title="Slide for Confetti"
          width="100%"
        />
        <View style={{height: 10}} />
        <RatingSwipe onRating={(r) => console.log(r)} />
      </Section>

      <Section title="4. Visuals">
        <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
           <ProgressCircle progress={0.75} size={60} color="#4F46E5" />
           <Skeleton width={150} height={20} style={{borderRadius: 4}} />
        </View>
        <View style={{height: 10}} />
        <Marquee text="React Native Aura is fast, fluid, and premium. " speed={50} />
      </Section>

      <Section title="5. Media (Pinch to Zoom)">
        <ZoomableView>
            <Image 
                source={{uri: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800'}} 
                style={{width: 300, height: 200, borderRadius: 12}} 
            />
        </ZoomableView>
      </Section>

      <Section title="6. Comparison">
         <ImageComparer 
            leftImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
            rightImage="https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800"
            height={200}
         />
      </Section>

      <View style={{height: 100}} /> 
      
      {/* Floating Menu always on top */}
      <FloatMenu actions={[
        { icon: <Ionicons name="home" size={20} color="white" />, onPress: () => console.log('Home') },
        { icon: <Ionicons name="settings" size={20} color="white" />, onPress: () => console.log('Settings') },
      ]} />
      
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuraProvider>
                <SafeAreaView style={styles.container}>
                  <HomeScreen />
                </SafeAreaView>
            </AuraProvider>
        </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  section: {
    marginBottom: 32,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#374151',
  },
});
