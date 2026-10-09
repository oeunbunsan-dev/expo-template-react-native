import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface StoreData {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
}

interface StoreProps {
  storeObj: StoreData;
  onPressStore?: (store: StoreData) => void;
}

const Store: React.FC<StoreProps> = ({ storeObj, onPressStore }) => {
  if (!storeObj) return null;

  const { name, logo, description } = storeObj;

  // Generate an initial fallback letter if there's no logo image
  const initial = name ? name.charAt(0).toUpperCase() : 'S';

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        {/* Store Logo / Avatar */}
        {logo ? (
          <Image source={{ uri: logo }} style={styles.logo} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>{initial}</Text>
          </View>
        )}

        {/* Store Details */}
        <View style={styles.metaContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.storeName} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Official</Text>
            </View>
          </View>

          <Text style={styles.storeSubtitle}>Verified Merchant</Text>
        </View>

        {/* View Store Action Button */}
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={() => onPressStore?.(storeObj)}
        >
          <Text style={styles.actionBtnText}>Visit</Text>
        </TouchableOpacity>
      </View>

      {/* Description Snippet */}
      {description ? (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    // Elevation for Android
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  placeholderLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  metaContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    maxWidth: '70%',
  },
  verifiedBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  storeSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  description: {
    marginTop: 10,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
});

export default Store;
