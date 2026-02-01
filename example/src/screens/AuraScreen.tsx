import React from 'react';
import { View, Text as RNText } from 'react-native';
import { useAura, Box, Heading, Text, SmartButton, Row } from 'rn-aura';

export default function AuraScreen() {
  const { showAura } = useAura();

  return (
    <Box flex={1} bg="#FFFFFF" p={20} center>
      <Heading level={2} mb={30}>Dynamic Island</Heading>
      
      <Box gap={20} width="100%">
        <SmartButton 
            title="Show Compact" 
            onPress={() => showAura('compact', <RNText style={{color: 'white', fontWeight: 'bold'}}>Notification</RNText>)} 
        />
        
        <SmartButton 
            title="Show Expanded" 
            variant="outlined"
            onPress={() => showAura('expanded', 
                <Box p={10}>
                    <Heading color="white">Now Playing</Heading>
                    <Text color="#D1D5DB" size={12}>Artist - Song Name</Text>
                </Box>
            )} 
        />
        
        <SmartButton 
            title="Show Minimal" 
            onPress={() => showAura('minimal', <RNText style={{color:'white'}}>✓</RNText>)} 
        />
      </Box>

      <Text size={12} color="#9CA3AF" mt={40} align="center">
        Tap the island to interact.
      </Text>
    </Box>
  );
}
