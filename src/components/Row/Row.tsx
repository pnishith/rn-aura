import React from 'react';
import { View } from 'react-native';
import type { ViewStyle, ViewProps } from 'react-native';

export interface RowProps extends ViewProps {
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: ViewStyle['flexWrap'];
  children?: React.ReactNode;
}

export const Row: React.FC<RowProps> = ({
  gap,
  align = 'center',
  justify,
  wrap,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: align },
        gap !== undefined && { gap },
        justify !== undefined && { justifyContent: justify },
        wrap !== undefined && { flexWrap: wrap },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
