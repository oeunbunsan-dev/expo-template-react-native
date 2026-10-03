import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ThemedText } from './ThemedText';
import { AuthModal } from './auth/AuthModal';

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
  const { user, isAuthenticated } = useAuth();
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

            {/* Auth / Profile Avatar Button */}
            <Pressable
              onPress={() => setAuthVisible(true)}
              style={({ pressed }) => [
                {
                  width: 36,
                  height: 36,
                  borderRadius: Math.min(borderRadius, 18),
                  backgroundColor: isAuthenticated && user ? user.avatarColor : colors.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: colors.cardBorder,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              accessibilityLabel="Open user authentication profile"
            >
              {isAuthenticated && user ? (
                <ThemedText variant="sm" weight="700" style={{ color: '#FFFFFF' }}>
                  {user.avatarInitial}
                </ThemedText>
              ) : (
                <Ionicons name="person-outline" size={18} color={colors.primary} />
              )}
            </Pressable>

            {rightAction}
          </View>
        </View>
      </View>

      {/* Embedded Auth Sheet */}
      <AuthModal visible={authVisible} onClose={() => setAuthVisible(false)} />
    </>
  );
};
