import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ThemedText } from '../ThemedText';
import { ThemedCard } from '../ThemedCard';
import { ThemedButton } from '../ThemedButton';
import { AuthModal } from './AuthModal';

export const UserProfileCard: React.FC = () => {
  const { colors, language, t } = useAppTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <ThemedCard padding="md" style={{ gap: 14 }}>
        {isAuthenticated && user ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: user.avatarColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ThemedText variant="headline" weight="700" style={{ color: '#FFFFFF' }}>
                  {user.avatarInitial}
                </ThemedText>
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <ThemedText variant="title" weight="700">
                    {language === 'km' && user.nameKm ? user.nameKm : user.name}
                  </ThemedText>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                </View>
                <ThemedText variant="caption" color="secondary">
                  {user.email}
                </ThemedText>
                <ThemedText variant="caption" color="muted">
                  📞 {user.phone} • {t('memberSince')} {user.joinedDate}
                </ThemedText>
              </View>

              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  backgroundColor: user.avatarColor,
                }}
              >
                <ThemedText variant="caption" weight="700" style={{ color: '#FFFFFF', fontSize: 10 }}>
                  {user.role.toUpperCase()}
                </ThemedText>
              </View>
            </View>

            {user.storeName && (
              <View
                style={{
                  backgroundColor: colors.cardSecondary,
                  padding: 8,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Ionicons name="storefront" size={16} color={colors.primary} />
                <ThemedText variant="sm" weight="600">
                  {user.storeName}
                </ThemedText>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 10, paddingTop: 4 }}>
              <ThemedButton
                title="Switch Persona"
                variant="secondary"
                size="sm"
                icon={<Ionicons name="swap-horizontal" size={16} color={colors.primary} />}
                onPress={() => setModalVisible(true)}
                style={{ flex: 1 }}
              />
              <ThemedButton
                title={t('signOutAction')}
                variant="outline"
                size="sm"
                onPress={logout}
                style={{ flex: 1, borderColor: colors.error }}
                textStyle={{ color: colors.error }}
              />
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', gap: 10, paddingVertical: 8 }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: colors.primaryContainer,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person-outline" size={26} color={colors.primary} />
            </View>
            <ThemedText variant="title" weight="700">
              {t('guestUser')}
            </ThemedText>
            <ThemedText variant="caption" color="secondary" style={{ textAlign: 'center' }}>
              {t('loginToContinue')}
            </ThemedText>
            <ThemedButton
              title={t('signInAction')}
              variant="primary"
              size="md"
              icon={<Ionicons name="log-in-outline" size={18} color={colors.onPrimary} />}
              onPress={() => setModalVisible(true)}
              style={{ width: '100%', marginTop: 4 }}
            />
          </View>
        )}
      </ThemedCard>

      <AuthModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
};
