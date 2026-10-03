import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { UserRole } from '../../types/ecommerce';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { ThemedCard } from '../ThemedCard';

export interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const { colors, borderRadius, language, t } = useAppTheme();
  const { user, isAuthenticated, login, loginAsPreset, register, logout } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [storeName, setStoreName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleManualLogin = async () => {
    if (!email.trim()) return;
    await login({ email, password });
    onClose();
  };

  const handleQuickDemo = async (role: UserRole) => {
    await loginAsPreset(role);
    onClose();
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim()) return;
    await register({
      name,
      email,
      phone: phone || '+855 12 000 000',
      role: selectedRole,
      storeName: selectedRole === 'vendor' ? storeName || `${name}'s Store` : undefined,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' }}>
        <View
          style={{
            maxHeight: '90%',
            backgroundColor: colors.surface,
            borderTopLeftRadius: Math.min(borderRadius + 8, 28),
            borderTopRightRadius: Math.min(borderRadius + 8, 28),
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderSubtle,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: colors.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <View>
                <ThemedText variant="headline" weight="700">
                  {isAuthenticated ? t('profileHeader') : tab === 'login' ? t('authLoginTitle') : t('authRegisterTitle')}
                </ThemedText>
                <ThemedText variant="caption" color="secondary">
                  {isAuthenticated ? `${user?.name} (${user?.role.toUpperCase()})` : t('authLoginSubtitle')}
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.cardSecondary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
            {isAuthenticated && user ? (
              /* Already Signed In: Profile Card & Switcher */
              <View style={{ gap: 14 }}>
                <ThemedCard padding="md" style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: user.avatarColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <ThemedText variant="headline" weight="700" style={{ color: '#FFFFFF' }}>
                        {user.avatarInitial}
                      </ThemedText>
                    </View>

                    <View style={{ flex: 1, gap: 2 }}>
                      <ThemedText variant="title" weight="700">
                        {language === 'km' && user.nameKm ? user.nameKm : user.name}
                      </ThemedText>
                      <ThemedText variant="caption" color="secondary">
                        {user.email}
                      </ThemedText>
                      <ThemedText variant="caption" color="muted">
                        📞 {user.phone} {user.storeName ? `• 🏪 ${user.storeName}` : ''}
                      </ThemedText>
                    </View>

                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: user.avatarColor,
                      }}
                    >
                      <ThemedText variant="caption" weight="700" style={{ color: '#FFFFFF' }}>
                        {user.role.toUpperCase()}
                      </ThemedText>
                    </View>
                  </View>
                </ThemedCard>

                {/* 1-Tap Switch Persona Section */}
                <View style={{ gap: 8, marginTop: 4 }}>
                  <ThemedText variant="title" weight="700">
                    {t('quickDemoLogins')}
                  </ThemedText>

                  {(['customer', 'vendor', 'admin'] as UserRole[]).map((r) => {
                    const preset = DEMO_USERS[r];
                    const isCurrent = user.role === r;
                    const descKey =
                      r === 'customer'
                        ? 'demoCustomerDesc'
                        : r === 'vendor'
                        ? 'demoVendorDesc'
                        : 'demoAdminDesc';

                    return (
                      <ThemedCard
                        key={r}
                        selected={isCurrent}
                        onPress={() => handleQuickDemo(r)}
                        padding="sm"
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 17,
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
                                size={18}
                                color="#FFFFFF"
                              />
                            </View>
                            <View>
                              <ThemedText variant="body" weight="700">
                                {preset.name} ({r.toUpperCase()})
                              </ThemedText>
                              <ThemedText variant="caption" color="secondary">
                                {t(descKey as any)}
                              </ThemedText>
                            </View>
                          </View>

                          {isCurrent && (
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                          )}
                        </View>
                      </ThemedCard>
                    );
                  })}
                </View>

                {/* Logout Button */}
                <ThemedButton
                  title={t('signOutAction')}
                  variant="outline"
                  icon={<Ionicons name="log-out-outline" size={18} color={colors.error} />}
                  onPress={logout}
                  style={{ borderColor: colors.error, marginTop: 8 }}
                  textStyle={{ color: colors.error }}
                />
              </View>
            ) : (
              /* Signed Out: Login or Register */
              <View style={{ gap: 14 }}>
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
                        padding="sm"
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
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
                                size={18}
                                color="#FFFFFF"
                              />
                            </View>
                            <View>
                              <ThemedText variant="body" weight="700">
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

                {/* Tab Switcher */}
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: colors.cardSecondary,
                    borderRadius: Math.min(borderRadius, 12),
                    padding: 4,
                    marginTop: 6,
                  }}
                >
                  <Pressable
                    onPress={() => setTab('login')}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      alignItems: 'center',
                      borderRadius: Math.min(borderRadius, 10),
                      backgroundColor: tab === 'login' ? colors.primary : 'transparent',
                    }}
                  >
                    <ThemedText
                      variant="sm"
                      weight="700"
                      style={{ color: tab === 'login' ? colors.onPrimary : colors.textSecondary }}
                    >
                      {t('signInAction')}
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={() => setTab('register')}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      alignItems: 'center',
                      borderRadius: Math.min(borderRadius, 10),
                      backgroundColor: tab === 'register' ? colors.primary : 'transparent',
                    }}
                  >
                    <ThemedText
                      variant="sm"
                      weight="700"
                      style={{ color: tab === 'register' ? colors.onPrimary : colors.textSecondary }}
                    >
                      {t('signUpAction')}
                    </ThemedText>
                  </Pressable>
                </View>

                {tab === 'login' ? (
                  /* Login Fields */
                  <View style={{ gap: 12 }}>
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
                          backgroundColor: colors.cardSecondary,
                          color: colors.text,
                          padding: 12,
                          borderRadius: Math.min(borderRadius, 12),
                          borderWidth: 1,
                          borderColor: colors.cardBorder,
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
                          backgroundColor: colors.cardSecondary,
                          borderRadius: Math.min(borderRadius, 12),
                          borderWidth: 1,
                          borderColor: colors.cardBorder,
                          paddingHorizontal: 12,
                        }}
                      >
                        <TextInput
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                          style={{
                            flex: 1,
                            color: colors.text,
                            paddingVertical: 12,
                          }}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                          <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={18}
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
                  </View>
                ) : (
                  /* Register Fields */
                  <View style={{ gap: 12 }}>
                    <View style={{ gap: 4 }}>
                      <ThemedText variant="sm" weight="600">
                        {t('fullName')}
                      </ThemedText>
                      <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Dara Meng"
                        placeholderTextColor={colors.textMuted}
                        style={{
                          backgroundColor: colors.cardSecondary,
                          color: colors.text,
                          padding: 12,
                          borderRadius: Math.min(borderRadius, 12),
                          borderWidth: 1,
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
                        placeholder="dara@example.com"
                        placeholderTextColor={colors.textMuted}
                        style={{
                          backgroundColor: colors.cardSecondary,
                          color: colors.text,
                          padding: 12,
                          borderRadius: Math.min(borderRadius, 12),
                          borderWidth: 1,
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
                        placeholder="+855 12 345 678"
                        placeholderTextColor={colors.textMuted}
                        style={{
                          backgroundColor: colors.cardSecondary,
                          color: colors.text,
                          padding: 12,
                          borderRadius: Math.min(borderRadius, 12),
                          borderWidth: 1,
                          borderColor: colors.cardBorder,
                        }}
                      />
                    </View>

                    {/* Role Picker */}
                    <View style={{ gap: 6 }}>
                      <ThemedText variant="sm" weight="600">
                        Register As
                      </ThemedText>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {(['customer', 'vendor', 'admin'] as UserRole[]).map((r) => {
                          const isSel = selectedRole === r;
                          return (
                            <Pressable
                              key={r}
                              onPress={() => setSelectedRole(r)}
                              style={{
                                flex: 1,
                                paddingVertical: 8,
                                borderRadius: 8,
                                backgroundColor: isSel ? colors.primary : colors.cardSecondary,
                                alignItems: 'center',
                              }}
                            >
                              <ThemedText
                                variant="caption"
                                weight="700"
                                style={{ color: isSel ? colors.onPrimary : colors.text }}
                              >
                                {r.toUpperCase()}
                              </ThemedText>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    {selectedRole === 'vendor' && (
                      <View style={{ gap: 4 }}>
                        <ThemedText variant="sm" weight="600">
                          {t('storeNameLabel')}
                        </ThemedText>
                        <TextInput
                          value={storeName}
                          onChangeText={setStoreName}
                          placeholder="e.g. Phnom Penh Artisan Workshop"
                          placeholderTextColor={colors.textMuted}
                          style={{
                            backgroundColor: colors.cardSecondary,
                            color: colors.text,
                            padding: 12,
                            borderRadius: Math.min(borderRadius, 12),
                            borderWidth: 1,
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
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
