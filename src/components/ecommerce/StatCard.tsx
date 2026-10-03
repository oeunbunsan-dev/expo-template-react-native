import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { ThemedCard } from '../ThemedCard';
import { ThemedText } from '../ThemedText';

export interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  trend?: string;
  isPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  trend,
  isPositive = true,
}) => {
  const { colors, borderRadius } = useAppTheme();
  const effectiveIconColor = iconColor || colors.primary;

  return (
    <ThemedCard padding="md" style={{ flex: 1, minWidth: 150 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: Math.min(borderRadius, 12),
            backgroundColor: colors.primaryContainer,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={20} color={effectiveIconColor} />
        </View>

        {trend && (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 6,
              backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            }}
          >
            <ThemedText
              variant="caption"
              weight="700"
              style={{ color: isPositive ? colors.success : colors.error }}
            >
              {trend}
            </ThemedText>
          </View>
        )}
      </View>

      <ThemedText variant="headline" weight="700" style={{ marginBottom: 4 }}>
        {value}
      </ThemedText>

      <ThemedText variant="caption" color="secondary" numberOfLines={1}>
        {title}
      </ThemedText>
    </ThemedCard>
  );
};
