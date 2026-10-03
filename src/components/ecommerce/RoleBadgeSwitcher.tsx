import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { useEcommerce } from '../../context/EcommerceContext';
import { ThemedText } from '../ThemedText';
import { UserRole } from '../../types/ecommerce';

export const RoleBadgeSwitcher: React.FC = () => {
  const { colors, borderRadius, t } = useAppTheme();
  const { role, setRole } = useEcommerce();

  const rolesConfig: { id: UserRole; labelKey: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    {
      id: 'customer',
      labelKey: 'roleCustomer',
      icon: 'cart-outline',
      color: colors.primary,
    },
    {
      id: 'vendor',
      labelKey: 'roleVendor',
      icon: 'storefront-outline',
      color: '#F59E0B',
    },
    {
      id: 'admin',
      labelKey: 'roleAdmin',
      icon: 'shield-checkmark-outline',
      color: '#8B5CF6',
    },
  ];

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: Math.min(borderRadius + 4, 18),
        padding: 6,
        borderWidth: 1.5,
        borderColor: colors.cardBorder,
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {rolesConfig.map((item) => {
          const isSelected = role === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setRole(item.id)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  borderRadius: Math.min(borderRadius, 14),
                  backgroundColor: isSelected ? item.color : 'transparent',
                  opacity: pressed && !isSelected ? 0.75 : 1,
                  gap: 6,
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={isSelected ? '#FFFFFF' : colors.textSecondary}
              />
              <ThemedText
                variant="sm"
                weight={isSelected ? '700' : '500'}
                style={{
                  color: isSelected ? '#FFFFFF' : colors.textSecondary,
                }}
                numberOfLines={1}
              >
                {t(item.labelKey as any)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
