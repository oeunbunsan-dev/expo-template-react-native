import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../src/context/ThemeContext';
import { useAuth, DEMO_USERS } from '../src/context/AuthContext';
import { UserRole } from '../src/types/ecommerce';
import { ThemedText } from '../src/components/ThemedText';
import { ThemedButton } from '../src/components/ThemedButton';
import { ThemedCard } from '../src/components/ThemedCard';
import { ThemedHeader } from '../src/components/ThemedHeader';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, borderRadius, t } = useAppTheme();
  const { login, loginAsPreset } = useAuth();

  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);

  const handleManualLogin = async () => {
    if (!email.trim()) return;
    await login({ email, password });
    router.back();
  };

  const handleQuickDemo = async (role: UserRole) => {
    await loginAsPreset(role);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedHeader
        title={t('authLoginTitle')}
        subtitle={t('authLoginSubtitle')}
        rightAction={
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.cardSecondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={20} color={colors.text} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 60,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1-Tap Quick Demo Cards */}
        <View style={{ gap: 8 }}>
          <ThemedText variant="title" weight="700">
            {t('quickDemoLogins')}
          </ThemedText>

          {(['customer', 'vendor', 'admin'] as UserRole[]).map((r) => {
            const preset = DEMO_USERS[r];
            const descKey =
              r === 'customer'
                ? 'demoCustomerDesc'
                : r === 'vendor'
                ? 'demoVendorDesc'
                : 'demoAdminDesc';

            return (
              <ThemedCard
                key={r}
                onPress={() => handleQuickDemo(r)}
                padding="md"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: preset.avatarColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={
                          r === 'customer'
                            ? 'cart'
                            : r === 'vendor'
                            ? 'storefront'
                            : 'shield-checkmark'
                        }
                        size={20}
                        color="#FFFFFF"
                      />
                    </View>
                    <View>
                      <ThemedText variant="title" weight="700">
                        {preset.name} ({r.toUpperCase()})
                      </ThemedText>
                      <ThemedText variant="caption" color="secondary">
                        {t(descKey as any)}
                      </ThemedText>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={colors.primary} />
                </View>
              </ThemedCard>
            );
          })}
        </View>

        {/* Divider */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginVertical: 4,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: colors.borderSubtle }} />
          <ThemedText variant="caption" color="muted">
            OR SIGN IN MANUALLY
          </ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.borderSubtle }} />
        </View>

        {/* Form Inputs */}
        <View style={{ gap: 14 }}>
          <View style={{ gap: 4 }}>
            <ThemedText variant="sm" weight="600">
              {t('emailAddress')}
            </ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: colors.card,
                color: colors.text,
                padding: 14,
                borderRadius: Math.min(borderRadius, 12),
                borderWidth: 1.5,
                borderColor: colors.cardBorder,
                fontSize: 16,
              }}
            />
          </View>

          <View style={{ gap: 4 }}>
            <ThemedText variant="sm" weight="600">
              {t('password')}
            </ThemedText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.card,
                borderRadius: Math.min(borderRadius, 12),
                borderWidth: 1.5,
                borderColor: colors.cardBorder,
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  color: colors.text,
                  paddingVertical: 14,
                  fontSize: 16,
                }}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <ThemedButton
            title={t('signInAction')}
            variant="primary"
            size="lg"
            onPress={handleManualLogin}
            style={{ marginTop: 8 }}
          />

          <ThemedButton
            title={t('signUpAction')}
            variant="outline"
            size="md"
            onPress={() => router.push('/register' as any)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
