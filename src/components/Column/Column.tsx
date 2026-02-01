import React from 'react';
import { View } from 'react-native';
import type { ViewStyle, ViewProps } from 'react-native';

export interface ColumnProps extends ViewProps {
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  children?: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({
  gap,
  align,
  justify,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        { flexDirection: 'column' },
        gap !== undefined && { gap },
        align !== undefined && { alignItems: align },
        justify !== undefined && { justifyContent: justify },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
