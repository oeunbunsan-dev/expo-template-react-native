import { adminService } from '@/src/apis/services/admin';
import { analyticsService } from '@/src/apis/services/analytic';
import { useAppTheme } from '@/src/context/ThemeContext';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminDashboardView() {
  const { colors } = useAppTheme();
  const [adminDashboard, setAdminDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [dashRes] = await Promise.allSettled([
        adminService.getDashboardData(),
        analyticsService.getAdminAnalytics().catch(() => null),
      ]);

      if (dashRes.status === 'fulfilled') {
        const data = dashRes.value?.data || dashRes.value;
        setAdminDashboard(data);
      }
    } catch (err) {
      console.warn('Admin dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.textMuted }}>Loading platform analytics...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          {adminDashboard && (
            <AdminDashboard
              adminDashboardObj={adminDashboard}
              onPressActiveVendor={() => router.push('/(admin)/(tabs)/vendor' as any)}
              onPressInactiveVendor={() => router.push('/(admin)/(tabs)/vendor' as any)}
              onPressViewAllOrders={() => router.push('/(admin)/(tabs)/orders' as any)}
              onPressCustomer={() => router.push('/(admin)/(tabs)/orders' as any)}
              onPressProduct={() => router.push('/(admin)/(tabs)/category' as any)}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 70,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
