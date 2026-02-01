import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, Heading, Row } from 'rn-aura';

const CATEGORIES = [
  { name: 'Inputs', screen: 'Inputs' },
  { name: 'Media', screen: 'Media' },
  { name: 'Layout', screen: 'Layout' },
  { name: 'Interaction', screen: 'Interaction' },
  { name: 'Visuals', screen: 'Visuals' },
  { name: 'Aura Island', screen: 'Aura' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <Box flex={1} bg="#F2F2F7" p={20}>
      <Heading level={2} mb={20}>
        RN Aura Kitchen Sink
      </Heading>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Box gap={16}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              onPress={() => navigation.navigate(cat.screen)}
            >
              <Box
                bg="white"
                p={20}
                borderRadius={12}
                shadowColor="#000"
                shadowOpacity={0.05}
                shadowRadius={10}
                elevation={2}
              >
                <Row justify="space-between">
                  <Heading level={5}>{cat.name}</Heading>
                  <Text color="#8E8E93">→</Text>
                </Row>
              </Box>
            </TouchableOpacity>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
