import React from 'react';
import { View } from 'react-native';
import type { ViewStyle, ViewProps } from 'react-native';

export interface BoxProps extends ViewProps {
  p?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  px?: number;
  py?: number;
  m?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  mx?: number;
  my?: number;
  bg?: string;
  center?: boolean;
  row?: boolean;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: ViewStyle['flexWrap'];
  gap?: number;
  width?: number | string;
  height?: number | string;
  flex?: number;
  children?: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({
  p, pt, pb, pl, pr, px, py,
  m, mt, mb, ml, mr, mx, my,
  bg,
  center,
  row,
  align,
  justify,
  wrap,
  gap,
  width,
  height,
  flex,
  style,
  children,
  ...props
}) => {
  const boxStyle: ViewStyle = {
    padding: p,
    paddingTop: pt ?? py,
    paddingBottom: pb ?? py,
    paddingLeft: pl ?? px,
    paddingRight: pr ?? px,
    margin: m,
    marginTop: mt ?? my,
    marginBottom: mb ?? my,
    marginLeft: ml ?? mx,
    marginRight: mr ?? mx,
    backgroundColor: bg,
    ...(center && { alignItems: 'center', justifyContent: 'center' }),
    ...(row && { flexDirection: 'row' }),
    ...(align && { alignItems: align }),
    ...(justify && { justifyContent: justify }),
    ...(wrap && { flexWrap: wrap }),
    ...(gap && { gap }),
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(flex !== undefined && { flex }),
  };

  return (
    <View style={[boxStyle, style]} {...props}>
      {children}
    </View>
  );
};
