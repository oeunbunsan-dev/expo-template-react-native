import React, { useState } from 'react';
import {
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { SEED_PRESETS, isValidHex, normalizeHex, getContrastTextColor } from '../constants/colors';
import { ThemedText } from './ThemedText';

export const ColorSeedPicker: React.FC = () => {
  const { colorSeed, setColorSeed, colors, borderRadius, language } = useAppTheme();
  const [customHex, setCustomHex] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleSelectSeed = (hex: string) => {
    setColorSeed(hex);
    setInputError(false);
  };

  const handleCustomApply = () => {
    if (isValidHex(customHex)) {
      setColorSeed(normalizeHex(customHex));
      setCustomHex('');
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const activeSeedNormalized = normalizeHex(colorSeed);

  return (
    <View style={{ gap: 16 }}>
      {/* Preset Swatches Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
        {SEED_PRESETS.map((preset) => {
          const isSelected = activeSeedNormalized === normalizeHex(preset.hex);
          const textColor = getContrastTextColor(preset.hex);
          const name = language === 'km' ? preset.nameKm : preset.nameEn;

          return (
            <Pressable
              key={preset.id}
              onPress={() => handleSelectSeed(preset.hex)}
              style={({ pressed }) => [
                {
                  width: '18%',
                  aspectRatio: 1,
                  borderRadius: Math.min(borderRadius + 4, 18),
                  backgroundColor: preset.hex,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: isSelected ? 3 : 1,
                  borderColor: isSelected ? colors.text : 'rgba(0,0,0,0.1)',
                  shadowColor: preset.hex,
                  shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                  shadowOpacity: isSelected ? 0.45 : 0.2,
                  shadowRadius: isSelected ? 6 : 3,
                  elevation: isSelected ? 4 : 2,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.94 : isSelected ? 1.05 : 1 }],
                },
              ]}
              accessibilityLabel={name}
            >
              {isSelected && (
                <Ionicons name="checkmark-sharp" size={20} color={textColor} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Selected Color Info & Custom Hex Input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.cardSecondary,
          borderRadius: Math.min(borderRadius, 14),
          padding: 8,
          borderWidth: 1,
          borderColor: inputError ? colors.error : colors.cardBorder,
          gap: 10,
        }}
      >
        {/* Active Seed Preview Chip */}
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: Math.min(borderRadius, 10),
            backgroundColor: colorSeed,
            borderWidth: 1.5,
            borderColor: colors.cardBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="color-palette" size={18} color={getContrastTextColor(colorSeed)} />
        </View>

        {/* Text Input */}
        <TextInput
          value={customHex}
          onChangeText={(text) => {
            setCustomHex(text);
            setInputError(false);
          }}
          placeholder={colorSeed}
          placeholderTextColor={colors.textMuted}
          maxLength={7}
          autoCapitalize="characters"
          style={{
            flex: 1,
            color: colors.text,
            fontSize: 15,
            paddingVertical: 4,
            fontWeight: '600',
          }}
        />

        {/* Apply Button */}
        <Pressable
          onPress={handleCustomApply}
          disabled={!customHex.trim()}
          style={({ pressed }) => [
            {
              backgroundColor: customHex.trim() ? colors.primary : 'transparent',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: Math.min(borderRadius, 10),
              opacity: !customHex.trim() ? 0.4 : pressed ? 0.8 : 1,
            },
          ]}
        >
          <ThemedText
            variant="sm"
            weight="600"
            style={{
              color: customHex.trim() ? colors.onPrimary : colors.textMuted,
            }}
          >
            {language === 'km' ? 'អនុវត្ត' : 'Apply'}
          </ThemedText>
        </Pressable>
      </View>

      {inputError && (
        <ThemedText variant="caption" color="error" style={{ marginLeft: 4 }}>
          {language === 'km' ? 'សូមបញ្ចូលកូដពណ៌ Hex ត្រឹមត្រូវ (ឧ. #3B82F6)' : 'Please enter a valid Hex color (e.g. #3B82F6)'}
        </ThemedText>
      )}
    </View>
  );
};
