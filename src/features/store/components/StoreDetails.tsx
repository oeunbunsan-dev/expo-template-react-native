import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// --- TypeScript Definitions ---
export interface Vendor {
  companyName: string;
  status: string;
}

export interface StoreCounts {
  products?: number;
  [key: string]: any;
}

export interface StoreObject {
  id: string;
  vendorId?: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string | null;
  banner?: string | null;
  status?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  vendor?: Vendor;
  _count?: StoreCounts;
}

interface StoreDetailsProps {
  storeObject: StoreObject;
  onPressViewProducts?: () => void;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({
  storeObject,
  onPressViewProducts,
}) => {
  if (!storeObject) return null;

  const { name, description, logo, banner, address, phone, email, vendor, _count, status } = storeObject;

  const handlePhoneCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmailPress = () => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const initial = name ? name.charAt(0).toUpperCase() : 'S';

  return (
    <View style={styles.container}>
      {/* Banner Section */}
      <View style={styles.bannerContainer}>
        {banner ? (
          <Image source={{ uri: banner }} style={styles.bannerImage} resizeMode="cover" />
        ) : (
          <View style={[styles.bannerImage, styles.bannerFallback]} />
        )}

        {status && (
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
      </View>

      {/* Main Profile Info */}
      <View style={styles.body}>
        {/* Overlapping Logo & Metric Pill */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrapper}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logo} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderLogo}>
                <Text style={styles.placeholderText}>{initial}</Text>
              </View>
            )}
          </View>

          {_count?.products !== undefined && (
            <TouchableOpacity
              style={styles.productCountCard}
              activeOpacity={0.7}
              onPress={onPressViewProducts}
            >
              <Text style={styles.productCountNumber}>{_count.products}</Text>
              <Text style={styles.productCountLabel}>Products</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title & Vendor Badge */}
        <View style={styles.titleSection}>
          <Text style={styles.storeName}>{name}</Text>
          {vendor?.companyName && (
            <View style={styles.vendorRow}>
              <Text style={styles.vendorCompany}>by {vendor.companyName}</Text>
              {vendor.status === 'APPROVED' && (
                <View style={styles.verifiedTag}>
                  <Text style={styles.verifiedTagText}>✓ Verified</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Description */}
        {description ? <Text style={styles.description}>{description}</Text> : null}

        {/* Metadata Details (Address, Email, Phone) */}
        <View style={styles.metaList}>
          {address ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{address}</Text>
            </View>
          ) : null}

          <View style={styles.actionContactRow}>
            {phone ? (
              <TouchableOpacity
                style={styles.contactBtn}
                activeOpacity={0.7}
                onPress={handlePhoneCall}
              >
                <Text style={styles.contactBtnIcon}>📞</Text>
                <Text style={styles.contactBtnText} numberOfLines={1}>
                  {phone}
                </Text>
              </TouchableOpacity>
            ) : null}

            {email ? (
              <TouchableOpacity
                style={styles.contactBtn}
                activeOpacity={0.7}
                onPress={handleEmailPress}
              >
                <Text style={styles.contactBtnIcon}>✉️</Text>
                <Text style={styles.contactBtnText} numberOfLines={1}>
                  Email Store
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 12,
  },
  bannerContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerFallback: {
    backgroundColor: '#1E293B',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: -38,
    marginBottom: 10,
  },
  avatarWrapper: {
    padding: 3,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
  },
  placeholderLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  productCountCard: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productCountNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  productCountLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  titleSection: {
    marginBottom: 8,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  vendorCompany: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  verifiedTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedTagText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4B5563',
    marginBottom: 14,
  },
  metaList: {
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  actionContactRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  contactBtnIcon: {
    fontSize: 13,
  },
  contactBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default StoreDetails;
