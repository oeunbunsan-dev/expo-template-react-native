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
import { useEcommerce } from '../../context/EcommerceContext';
import { ProductCategory } from '../../types/ecommerce';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';

export interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ visible, onClose }) => {
  const { colors, borderRadius, t } = useAppTheme();
  const { addProduct, activeVendorId } = useEcommerce();

  const [titleEn, setTitleEn] = useState('');
  const [titleKm, setTitleKm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descKm, setDescKm] = useState('');
  const [price, setPrice] = useState('25.00');
  const [stock, setStock] = useState('20');
  const [category, setCategory] = useState<ProductCategory>('artisan');

  const categories: { id: ProductCategory; labelKey: string }[] = [
    { id: 'artisan', labelKey: 'categoryArtisan' },
    { id: 'food', labelKey: 'categoryFood' },
    { id: 'fashion', labelKey: 'categoryFashion' },
    { id: 'electronics', labelKey: 'categoryElectronics' },
    { id: 'home', labelKey: 'categoryHome' },
  ];

  const handleSave = () => {
    if (!titleEn.trim()) return;

    addProduct({
      titleEn: titleEn.trim(),
      titleKm: titleKm.trim() || titleEn.trim(),
      descEn: descEn.trim() || 'Premium Cambodian marketplace item.',
      descKm: descKm.trim() || 'ទំនិញគុណភាពខ្ពស់ពីផ្សារឌីជីថលកម្ពុជា។',
      price: parseFloat(price) || 10.0,
      category,
      vendorId: activeVendorId,
      vendorName: 'Angkor Heritage Crafts',
      stock: parseInt(stock, 10) || 10,
      iconName: category === 'food' ? 'cafe' : category === 'electronics' ? 'hardware-chip' : 'gift',
      accentBg: '#FEF3C7',
      badge: 'New Arrival',
    });

    setTitleEn('');
    setTitleKm('');
    setDescEn('');
    setDescKm('');
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
            padding: 20,
            gap: 16,
          }}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
              <ThemedText variant="headline" weight="700">
                {t('addNewProductTitle')}
              </ThemedText>
            </View>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ gap: 12 }}>
            {/* Title EN */}
            <View style={{ gap: 4 }}>
              <ThemedText variant="sm" weight="600">
                {t('productTitleEnInput')}
              </ThemedText>
              <TextInput
                value={titleEn}
                onChangeText={setTitleEn}
                placeholder="e.g. Royal Angkor Jasmine Rice 5kg"
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

            {/* Title KM */}
            <View style={{ gap: 4 }}>
              <ThemedText variant="sm" weight="600">
                {t('productTitleKmInput')}
              </ThemedText>
              <TextInput
                value={titleKm}
                onChangeText={setTitleKm}
                placeholder="ឧ. អង្ករផ្កាម្លិះរាជវាំងអង្គរ ៥គីឡូក្រាម"
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

            {/* Category */}
            <View style={{ gap: 6 }}>
              <ThemedText variant="sm" weight="600">
                {t('productCategoryInput')}
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: Math.min(borderRadius, 10),
                        backgroundColor: isSelected ? colors.primary : colors.cardSecondary,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                      }}
                    >
                      <ThemedText
                        variant="caption"
                        weight="600"
                        style={{ color: isSelected ? colors.onPrimary : colors.text }}
                      >
                        {t(cat.labelKey as any)}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Price and Stock row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText variant="sm" weight="600">
                  {t('productPriceInput')}
                </ThemedText>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
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

              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText variant="sm" weight="600">
                  {t('productStockInput')}
                </ThemedText>
                <TextInput
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
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
            </View>

            {/* Description EN */}
            <View style={{ gap: 4 }}>
              <ThemedText variant="sm" weight="600">
                {t('productDescEnInput')}
              </ThemedText>
              <TextInput
                value={descEn}
                onChangeText={setDescEn}
                multiline
                numberOfLines={3}
                placeholder="Product description and specifications..."
                placeholderTextColor={colors.textMuted}
                style={{
                  backgroundColor: colors.cardSecondary,
                  color: colors.text,
                  padding: 12,
                  borderRadius: Math.min(borderRadius, 12),
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  minHeight: 60,
                }}
              />
            </View>

            {/* Save Button */}
            <ThemedButton
              title={t('saveProductBtn')}
              variant="primary"
              size="lg"
              onPress={handleSave}
              style={{ marginTop: 8 }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
