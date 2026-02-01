import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';


export interface RowProps extends ViewProps {
  gap?: number;
  bg?: string;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: ViewStyle['flexWrap'];
  children?: React.ReactNode;
}

export const Row: React.FC<RowProps> = ({
  gap,
  bg,
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
        bg !== undefined && { backgroundColor: bg },
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
