import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { ThemedText } from './ThemedText';

export interface ThemedHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const ThemedHeader: React.FC<ThemedHeaderProps> = ({
  title,
  subtitle,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, language, setLanguage, mode, setMode, isDark, borderRadius } = useAppTheme();
  const [authVisible, setAuthVisible] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'km' : 'en');
  };

  const toggleMode = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  return (
    <>
      <View
        style={{
          paddingTop: Math.max(insets.top, 14),
          paddingHorizontal: 20,
          paddingBottom: 14,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderSubtle,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <ThemedText variant="headline" weight="700">
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText variant="caption" color="secondary" style={{ marginTop: 2 }}>
                {subtitle}
              </ThemedText>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* Quick Language Toggle Pill */}
            <Pressable
              onPress={toggleLanguage}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: Math.min(borderRadius, 12),
                  backgroundColor: colors.cardSecondary,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
              accessibilityLabel="Switch language"
            >
              <ThemedText variant="caption" weight="600" color="primary">
                {language === 'en' ? '🇬🇧 EN' : '🇰🇭 ខ្មែរ'}
              </ThemedText>
            </Pressable>

            {/* Quick Theme Mode Toggle Icon */}
            <Pressable
              onPress={toggleMode}
              style={({ pressed }) => [
                {
                  width: 36,
                  height: 36,
                  borderRadius: Math.min(borderRadius, 12),
                  backgroundColor: colors.cardSecondary,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
              accessibilityLabel="Toggle theme mode"
            >
              <Ionicons
                name={
                  mode === 'system'
                    ? 'contrast-outline'
                    : isDark
                    ? 'moon-outline'
                    : 'sunny-outline'
                }
                size={18}
                color={colors.primary}
              />
            </Pressable>



            {rightAction}
          </View>
        </View>
      </View>

    </>
  );
};
