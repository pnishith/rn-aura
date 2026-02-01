import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  Heading,
  Text,
  OtpInput,
  CurrencyInput,
  CreditCardInput,
  PhoneInput,
  FloatingInput,
  SearchField,
} from 'rn-aura';

export default function InputsScreen() {
  const [otp, setOtp] = useState('');
  const [currency, setCurrency] = useState('');
  const [card, setCard] = useState('');
  const [phone, setPhone] = useState('');
  const [floating, setFloating] = useState('');
  const [search, setSearch] = useState('');

  return (
    <Box flex={1} bg="#FFFFFF">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        <Heading level={2} style={{ marginBottom: 20 }}>Smart Inputs</Heading>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>OTP Input</Heading>
          <OtpInput value={otp} onChange={setOtp} length={4} />
        </Box>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>Currency Input</Heading>
          <CurrencyInput
            value={currency}
            onChangeText={setCurrency}
            placeholder="$0.00"
            style={{ borderWidth: 1, borderColor: '#E5E7EB', padding: 10, borderRadius: 8 }}
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>Credit Card Input</Heading>
          <CreditCardInput
            value={card}
            onChangeText={setCard}
            placeholder="0000 0000 0000 0000"
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>Phone Input</Heading>
          <PhoneInput
            value={phone}
            onChangeText={setPhone}
            // defaultCountry="US"
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>Floating Input</Heading>
          <FloatingInput
            label="Email Address"
            value={floating}
            onChangeText={setFloating}
          />
        </Box>

        <Box mb={30}>
          <Heading level={5} style={{ marginBottom: 10 }}>Search Field</Heading>
          <SearchField
            value={search}
            onChangeText={setSearch}
            placeholder="Search..."
          />
        </Box>

      </ScrollView>
    </Box>
  );
}
