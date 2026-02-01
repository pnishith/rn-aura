import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  Heading,
  Text,
  Row,
  Column,
  AccordionItem,
  Tabs,
  Badge,
} from 'rn-aura';

export default function LayoutScreen() {
  const [tab, setTab] = useState(0);

  return (
    <Box flex={1} bg="#FFFFFF">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        <Heading level={2} mb={20}>Layout Components</Heading>

        <Box mb={30} p={16} bg="#F9FAFB" borderRadius={8} style={{borderWidth: 1, borderColor: '#E5E7EB'}}>
          <Heading level={5} mb={10}>Box, Row, Column Primitives</Heading>
          <Column gap={10}>
            <Row gap={10} justify="space-between" bg="#E0E7FF" p={10} borderRadius={6}>
              <Box bg="#4F46E5" width={30} height={30} borderRadius={15} center>
                 <Text color="white" size={12}>1</Text>
              </Box>
              <Text>Row (Space Between)</Text>
              <Box bg="#4F46E5" width={30} height={30} borderRadius={15} center>
                 <Text color="white" size={12}>2</Text>
              </Box>
            </Row>
            <Box bg="#ECFDF5" p={10} borderRadius={6}>
              <Text align="center" color="#047857">Box with Padding & Center</Text>
            </Box>
          </Column>
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Accordion</Heading>
          <AccordionItem title="What is RN Aura?">
            <Typography p={10} color="#6B7280">
              RN Aura is a premium UI kit for React Native developers.
            </Typography>
          </AccordionItem>
          <AccordionItem title="How to use?">
            <Typography p={10} color="#6B7280">
              Import components and use them directly in your React Native app.
            </Typography>
          </AccordionItem>
        </Box>

        <Box mb={30}>
          <Heading level={5} mb={10}>Tabs</Heading>
          <Tabs
            tabs={['Account', 'Settings', 'Profile']}
            activeTab={tab}
            onTabChange={setTab}
          />
          <Box p={20} bg="#F3F4F6" mt={10} borderRadius={8} center>
             <Text>Active Tab Index: {tab}</Text>
          </Box>
        </Box>

         <Box mb={30}>
          <Heading level={5} mb={10}>Badges</Heading>
          <Row gap={15}>
             <Badge count={5} color="#EF4444" />
             <Badge count={100} max={99} color="#3B82F6" />
             <Box>
                <Text>Inbox</Text>
                <Box style={{position: 'absolute', top: -5, right: -10}}>
                   <Badge count={3} size={16} />
                </Box>
             </Box>
          </Row>
        </Box>

      </ScrollView>
    </Box>
  );
}
