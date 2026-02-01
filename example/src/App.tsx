import { StyleSheet, View, Text, SafeAreaView, Alert } from 'react-native';
import { OtpInput, SwipeButton } from 'rn-aura';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function App() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter Code</Text>
          <Text style={styles.subtitle}>
            We sent a verification code to your phone.
          </Text>
          
          <View style={styles.inputContainer}>
            <OtpInput 
              length={4} 
              value={otp} 
              onChange={(val) => {
                setOtp(val);
                if (error) setError(false);
              }}
              error={error}
              autoFocus
            />
          </View>

          <View style={styles.spacer} />

          <SwipeButton 
            width="90%"
            onComplete={() => Alert.alert('Success', 'Order Confirmed!')}
            title="Slide to Confirm"
            activeColor="#4F46E5" // Indigo-600
            thumbIcon={<Ionicons name="arrow-forward" size={24} color="#4F46E5" />}
          />

          <View style={styles.spacer} />

          <Text 
            style={styles.link}
            onPress={() => setError(true)}
          >
            Simulate Error (Tap Me)
          </Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Gray-50
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  spacer: {
    height: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827', // Gray-900
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280', // Gray-500
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 32,
  },
  link: {
    color: '#3B82F6', // Blue-500
    fontWeight: '600',
    marginBottom: 24,
  },
  debug: {
    fontFamily: 'monospace',
    color: '#9CA3AF',
  }
});
