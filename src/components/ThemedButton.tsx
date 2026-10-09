import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { ThemedText } from './ThemedText';

export interface ThemedButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  ...rest
}) => {
  const { colors, borderRadius } = useAppTheme();

  const handlePress = (e: any) => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    onPress?.(e);
  };

  // Dimensions
  let height = 48;
  let paddingHorizontal = 20;
  let textVariant: 'caption' | 'sm' | 'body' | 'title' = 'body';

  if (size === 'sm') {
    height = 36;
    paddingHorizontal = 12;
    textVariant = 'sm';
  } else if (size === 'lg') {
    height = 54;
    paddingHorizontal = 24;
    textVariant = 'title';
  }

  // Variant styling
  let backgroundColor = colors.primary;
  let borderColor = colors.primary;
  let borderWidth = 0;
  let textColor = colors.onPrimary;

  switch (variant) {
    case 'primary':
      backgroundColor = colors.primary;
      textColor = colors.onPrimary;
      break;
    case 'secondary':
      backgroundColor = colors.primaryContainer;
      textColor = colors.primary;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      borderColor = colors.primary;
      borderWidth = 1.5;
      textColor = colors.primary;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = colors.primary;
      break;
  }

  const effectiveRadius = Math.min(borderRadius, 999);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          height,
          paddingHorizontal,
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius: effectiveRadius,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          shadowColor: variant === 'primary' ? colors.primary : 'transparent',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: variant === 'primary' ? 0.25 : 0,
          shadowRadius: 6,
          elevation: variant === 'primary' ? 3 : 0,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon}
          <ThemedText
            variant={textVariant}
            weight="600"
            style={[{ color: textColor }, textStyle]}
          >
            {title}
          </ThemedText>
          {iconRight}
        </View>
      )}
    </Pressable>
  );
};
