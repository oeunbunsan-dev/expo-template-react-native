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
import { useAuth } from '../src/context/AuthContext';
import { UserRole } from '../src/types/ecommerce';
import { ThemedText } from '../src/components/ThemedText';
import { ThemedButton } from '../src/components/ThemedButton';
import { ThemedHeader } from '../src/components/ThemedHeader';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, borderRadius, t } = useAppTheme();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [storeName, setStoreName] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim()) return;
    await register({
      name,
      email,
      phone: phone || '+855 12 345 678',
      role,
      storeName: role === 'vendor' ? storeName || `${name}'s Store` : undefined,
    });
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedHeader
        title={t('authRegisterTitle')}
        subtitle={t('authRegisterSubtitle')}
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
          gap: 14,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Role Selector */}
        <View style={{ gap: 6 }}>
          <ThemedText variant="sm" weight="600">
            Account Type
          </ThemedText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['customer', 'vendor', 'admin'] as UserRole[]).map((r) => {
              const isSelected = role === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: Math.min(borderRadius, 10),
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderWidth: 1.5,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                    alignItems: 'center',
                  }}
                >
                  <ThemedText
                    variant="caption"
                    weight="700"
                    style={{ color: isSelected ? colors.onPrimary : colors.text }}
                  >
                    {r.toUpperCase()}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Inputs */}
        <View style={{ gap: 4 }}>
          <ThemedText variant="sm" weight="600">
            {t('fullName')}
          </ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Kosal Meng"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              padding: 14,
              borderRadius: Math.min(borderRadius, 12),
              borderWidth: 1.5,
              borderColor: colors.cardBorder,
            }}
          />
        </View>

        <View style={{ gap: 4 }}>
          <ThemedText variant="sm" weight="600">
            {t('emailAddress')}
          </ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="kosal@example.com"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              padding: 14,
              borderRadius: Math.min(borderRadius, 12),
              borderWidth: 1.5,
              borderColor: colors.cardBorder,
            }}
          />
        </View>

        <View style={{ gap: 4 }}>
          <ThemedText variant="sm" weight="600">
            {t('phoneNumberLabel')}
          </ThemedText>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+855 12 888 777"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              padding: 14,
              borderRadius: Math.min(borderRadius, 12),
              borderWidth: 1.5,
              borderColor: colors.cardBorder,
            }}
          />
        </View>

        {role === 'vendor' && (
          <View style={{ gap: 4 }}>
            <ThemedText variant="sm" weight="600">
              {t('storeNameLabel')}
            </ThemedText>
            <TextInput
              value={storeName}
              onChangeText={setStoreName}
              placeholder="e.g. Battambang Heritage Store"
              placeholderTextColor={colors.textMuted}
              style={{
                backgroundColor: colors.card,
                color: colors.text,
                padding: 14,
                borderRadius: Math.min(borderRadius, 12),
                borderWidth: 1.5,
                borderColor: colors.cardBorder,
              }}
            />
          </View>
        )}

        <ThemedButton
          title={t('signUpAction')}
          variant="primary"
          size="lg"
          onPress={handleRegister}
          style={{ marginTop: 8 }}
        />

        <ThemedButton
          title={t('signInAction')}
          variant="ghost"
          size="md"
          onPress={() => router.back()}
        />
      </ScrollView>
    </View>
  );
}
