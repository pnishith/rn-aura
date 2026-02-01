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
        <Heading level={2} style={{ marginBottom: 20 }}>Layout Components</Heading>

        <Box mb={30} p={16} bg="#F9FAFB" style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
          <Heading level={5} style={{ marginBottom: 10 }}>Box, Row, Column Primitives</Heading>
          <Column gap={10}>
            <Row gap={10} justify="space-between" bg="#E0E7FF" style={{ borderRadius: 6, padding: 10 }}>
              <Box bg="#4F46E5" width={30} height={30} style={{ borderRadius: 15 }} center>
                <Text color="white" size={12}>1</Text>
              </Box>
              <Text>Row (Space Between)</Text>
              <Box bg="#4F46E5" width={30} height={30} style={{ borderRadius: 15 }} center>
                <Text color="white" size={12}>2</Text>
              </Box>
            </Row>
            <Box bg="#ECFDF5" p={10} style={{ borderRadius: 6 }}>
              <Text align="center" color="#047857">Box with Padding & Center</Text>
            </Box>
          </Column>
        </Box>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>Accordion</Heading>
          <AccordionItem title="What is RN Aura?">
            <Text style={{ padding: 10 }} color="#6B7280">
              RN Aura is a premium UI kit for React Native developers.
            </Text>
          </AccordionItem>
          <AccordionItem title="How to use?">
            <Text style={{ padding: 10 }} color="#6B7280">
              Import components and use them directly in your React Native app.
            </Text>
          </AccordionItem>
        </Box>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>Tabs</Heading>
          <Tabs
            tabs={[
              { key: 0, title: 'Account' },
              { key: 1, title: 'Settings' },
              { key: 2, title: 'Profile' }
            ]}
            activeKey={tab}
            onChange={setTab}
          />
          <Box p={20} bg="#F3F4F6" mt={10} style={{ borderRadius: 8 }} center>
            <Text>Active Tab Index: {tab}</Text>
          </Box>
        </Box>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>Badges</Heading>
          <Row gap={15}>
            <Badge count={5} color="#EF4444" />
            <Badge count={100} maxCount={99} color="#3B82F6" />
            <Box>
              <Text>Inbox</Text>
              <Box style={{ position: 'absolute', top: -5, right: -10 }}>
                <Badge count={3} size={16} />
              </Box>
            </Box>
          </Row>
        </Box>

      </ScrollView>
    </Box>
  );
}
