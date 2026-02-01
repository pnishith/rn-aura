import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

export interface HeadingProps extends TextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6; // h1 to h6
  size?: number; // Manual override
  weight?: TextStyle['fontWeight'];
  color?: string;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
  children: React.ReactNode;
}

const LEVEL_SIZES = {
  1: 32,
  2: 28,
  3: 24,
  4: 20,
  5: 18,
  6: 16,
};

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  size,
  weight = '700',
  color = '#111827', // Default dark
  align = 'left',
  style,
  children,
  ...props
}) => {
  const fontSize = size || LEVEL_SIZES[level];
  const lineHeight = fontSize * 1.25; // Good standard leading

  return (
    <Text
      style={[
        {
          fontSize,
          fontWeight: weight,
          color,
          textAlign: align,
          lineHeight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
