import React from 'react';
import { View, ViewProps, ViewStyle, Pressable } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export interface ThemedCardProps extends ViewProps {
  variant?: 'elevated' | 'surface' | 'glass' | 'outlined';
  selected?: boolean;
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  variant = 'elevated',
  selected = false,
  onPress,
  padding = 'md',
  style,
  children,
  ...rest
}) => {
  const { colors, borderRadius } = useAppTheme();

  let pad = 16;
  if (padding === 'none') pad = 0;
  if (padding === 'sm') pad = 10;
  if (padding === 'lg') pad = 22;

  let bg = colors.card;
  if (variant === 'surface') bg = colors.surface;
  if (variant === 'outlined') bg = 'transparent';

  const cardStyle: ViewStyle = {
    backgroundColor: bg,
    borderRadius: Math.min(borderRadius, 24),
    padding: pad,
    borderWidth: 1.5,
    borderColor: selected ? colors.primary : colors.cardBorder,
    shadowColor: selected ? colors.primary : '#000000',
    shadowOffset: { width: 0, height: selected ? 4 : 2 },
    shadowOpacity: selected ? 0.22 : 0.06,
    shadowRadius: selected ? 8 : 4,
    elevation: selected ? 4 : 1,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          {
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  );
};
