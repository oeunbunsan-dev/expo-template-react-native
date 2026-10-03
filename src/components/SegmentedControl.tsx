import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../context/ThemeContext';
import { ThemedText } from './ThemedText';

export interface SegmentOption<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string>({
  options,
  selectedId,
  onSelect,
  style,
}: SegmentedControlProps<T>) {
  const { colors, borderRadius } = useAppTheme();

  const handleSelect = (id: T) => {
    if (id !== selectedId) {
      try {
        Haptics.selectionAsync().catch(() => {});
      } catch {}
      onSelect(id);
    }
  };

  const containerRadius = Math.min(borderRadius + 4, 999);
  const itemRadius = Math.min(borderRadius, 999);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: colors.cardSecondary,
          borderRadius: containerRadius,
          padding: 4,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <Pressable
            key={option.id}
            onPress={() => handleSelect(option.id)}
            style={({ pressed }) => [
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderRadius: itemRadius,
                backgroundColor: isSelected ? colors.primary : 'transparent',
                opacity: pressed && !isSelected ? 0.7 : 1,
                gap: 6,
              },
            ]}
          >
            {option.icon}
            <ThemedText
              variant="sm"
              weight={isSelected ? '600' : '400'}
              style={{
                color: isSelected ? colors.onPrimary : colors.textSecondary,
                textAlign: 'center',
              }}
              numberOfLines={1}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
