import { storeService } from '@/src/apis/services/store';
import { useAppTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StoreDetails from '../components/StoreDetails';

interface StoreDetailsViewProps {
  slug: string | string[] | undefined;
}

export default function StoreDetailsView({ slug }: StoreDetailsViewProps) {
  const { colors } = useAppTheme();
  const [storeDetails, setStoreDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slugString = Array.isArray(slug) ? slug[0] : slug || '';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    storeService
      .getPublicStoreProfile(slugString)
      .then((res) => {
        if (isMounted) {
          const d = res?.data || res;
          setStoreDetails(d);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load store profile');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slugString]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {storeDetails?.name || 'Merchant Storefront'}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Body */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 8, color: colors.textMuted }}>Loading store profile...</Text>
        </View>
      ) : error || !storeDetails ? (
        <View style={styles.center}>
          <Ionicons name="storefront-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.errTitle, { color: colors.text }]}>Store Not Found</Text>
          <Text style={[styles.errSub, { color: colors.textMuted }]}>
            {error || 'The requested storefront could not be located.'}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.btnBack, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Return to Shop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <StoreDetails
            storeObject={storeDetails}
            onPressViewProducts={() => router.push('/(customer)/(tabs)')}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 16, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 8 },
  errTitle: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  errSub: { fontSize: 13, textAlign: 'center', maxWidth: 260 },
  btnBack: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});
