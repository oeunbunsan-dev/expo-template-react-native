import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { useAppTheme } from '../context/ThemeContext';

export interface SettingsSectionProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  icon,
  title,
  description,
  children,
  style,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={[{ gap: 12, marginBottom: 24 }, style]}>
      {/* Header */}
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon && (
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: colors.primaryContainer,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </View>
          )}
          <ThemedText variant="title" weight="700">
            {title}
          </ThemedText>
        </View>

        {description && (
          <ThemedText variant="sm" color="secondary">
            {description}
          </ThemedText>
        )}
      </View>

      {/* Content */}
      {children}
    </View>
  );
};
