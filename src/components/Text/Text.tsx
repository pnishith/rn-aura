import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

export interface TextProps extends RNTextProps {
  variant?: 'body' | 'caption' | 'label' | 'link';
  size?: number;
  weight?: TextStyle['fontWeight'];
  color?: string;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
  children: React.ReactNode;
}

const VARIANTS = {
  body: { fontSize: 16, color: '#374151', lineHeight: 24 },
  caption: { fontSize: 12, color: '#6B7280', lineHeight: 16 },
  label: { fontSize: 14, color: '#374151', fontWeight: '500' as const },
  link: { fontSize: 16, color: '#3B82F6', textDecorationLine: 'underline' as const },
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size,
  weight,
  color,
  align,
  style,
  children,
  ...props
}) => {
  const baseStyle = VARIANTS[variant];

  return (
    <RNText
      style={[
        baseStyle,
        size && { fontSize: size, lineHeight: size * 1.5 },
        weight && { fontWeight: weight },
        color && { color },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
