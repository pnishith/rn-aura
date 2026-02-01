import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { OtpInput } from 'rn-aura';
import { useState } from 'react';

export default function App() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);

  return (
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

        <Text 
          style={styles.link}
          onPress={() => setError(true)}
        >
          Simulate Error (Tap Me)
        </Text>
        
        <Text style={styles.debug}>Current Value: {otp}</Text>
      </View>
    </SafeAreaView>
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
