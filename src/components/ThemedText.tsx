import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { resolveFontFamilyAndWeight } from '../constants/typography';
import { FontWeightOption } from '../types/theme';

export type TextVariant = 'hero' | 'headline' | 'subtitle' | 'title' | 'body' | 'sm' | 'caption';
export type TextColor = 'default' | 'secondary' | 'muted' | 'primary' | 'onPrimary' | 'accent' | 'error' | 'success';

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: FontWeightOption;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children?: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color = 'default',
  weight,
  align,
  style,
  children,
  ...rest
}) => {
  const { colors, fontSize, fontFamily, fontWeight: defaultWeight } = useAppTheme();

  // Resolve font size
  let size = fontSize.body;
  let lineHeight = Math.round(fontSize.body * 1.4);

  switch (variant) {
    case 'hero':
      size = fontSize.hero;
      lineHeight = Math.round(fontSize.hero * 1.25);
      break;
    case 'headline':
      size = fontSize.headline;
      lineHeight = Math.round(fontSize.headline * 1.3);
      break;
    case 'subtitle':
      size = fontSize.subtitle;
      lineHeight = Math.round(fontSize.subtitle * 1.35);
      break;
    case 'title':
      size = fontSize.title;
      lineHeight = Math.round(fontSize.title * 1.35);
      break;
    case 'body':
      size = fontSize.body;
      lineHeight = Math.round(fontSize.body * 1.45);
      break;
    case 'sm':
      size = fontSize.sm;
      lineHeight = Math.round(fontSize.sm * 1.4);
      break;
    case 'caption':
      size = fontSize.caption;
      lineHeight = Math.round(fontSize.caption * 1.4);
      break;
  }

  // Resolve color
  let textColor = colors.text;
  switch (color) {
    case 'secondary':
      textColor = colors.textSecondary;
      break;
    case 'muted':
      textColor = colors.textMuted;
      break;
    case 'primary':
      textColor = colors.primary;
      break;
    case 'onPrimary':
      textColor = colors.onPrimary;
      break;
    case 'accent':
      textColor = colors.accent;
      break;
    case 'error':
      textColor = colors.error;
      break;
    case 'success':
      textColor = colors.success;
      break;
  }

  // Determine effective weight: headings default to bolder weights unless specified
  const effectiveWeight: FontWeightOption =
    weight ??
    (variant === 'hero' || variant === 'headline'
      ? '700'
      : variant === 'subtitle' || variant === 'title'
      ? '600'
      : defaultWeight);

  const fontConfig = resolveFontFamilyAndWeight(fontFamily, effectiveWeight);

  const combinedStyle: TextStyle = {
    color: textColor,
    fontSize: size,
    lineHeight,
    fontFamily: fontConfig.fontFamily,
    fontWeight: fontConfig.fontWeight,
    textAlign: align,
  };

  return (
    <Text style={[combinedStyle, style]} {...rest}>
      {children}
    </Text>
  );
};
