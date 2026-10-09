import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// --- TypeScript Definitions ---
export interface AdminMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalVendors: number;
  totalProducts: number;
  pendingVendors: number;
}

export interface CustomerSummary {
  firstName: string;
  lastName: string;
  email: string;
}

export interface StoreSummary {
  name: string;
}

export interface ShippingAddress {
  city: string;
  phone: string;
  street: string;
  country: string;
  lastName: string;
  firstName: string;
  postalCode: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  status: 'CONFIRMED' | 'DELIVERED' | 'PENDING' | 'CANCELLED' | string;
  subtotal: string;
  discountTotal: string;
  shippingTotal: string;
  taxTotal: string;
  totalAmount: string;
  shippingAddress: ShippingAddress;
  billingAddress?: any;
  notes?: string | null;
  couponId?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: CustomerSummary;
  store: StoreSummary;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  recentOrders: RecentOrder[];
}

interface AdminDashboardProps {
  adminDashboardObj: AdminDashboardData;
  onPressOrder?: (order: RecentOrder) => void;
  onPressViewAllOrders?: () => void;
  onPressCustomer?: () => void;
  onPressProduct?: () => void;
  onPressActiveVendor?: () => void;
  onPressInactiveVendor?: () => void;
}

// Helpers
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatCurrency = (val: number | string) => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getStatusBadgeStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case 'DELIVERED':
      return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
    case 'CONFIRMED':
      return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
    case 'PENDING':
      return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
    case 'CANCELLED':
      return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
    default:
      return { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' };
  }
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminDashboardObj,
  onPressOrder,
  onPressViewAllOrders,
  onPressCustomer,
  onPressProduct,
  onPressActiveVendor,
  onPressInactiveVendor
}) => {

  if (!adminDashboardObj) return null;

  const { metrics, recentOrders } = adminDashboardObj;

  return (
    <View style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Overview</Text>
          <Text style={styles.headerSubtitle}>Monitor store metrics & order activity</Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Revenue */}
          <View style={[styles.metricCard, styles.highlightCard]}>
            <Text style={styles.highlightCardLabel}>TOTAL REVENUE</Text>
            <Text style={styles.highlightCardValue}>
              {formatCurrency(metrics.totalRevenue)}
            </Text>
          </View>

          {/* Total Orders */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Orders</Text>
            <Text style={styles.metricValue}>{metrics.totalOrders}</Text>
          </View>

          {/* Customers */}
            <TouchableOpacity onPress={onPressCustomer} style={styles.metricCard}>
              <Text style={styles.metricLabel}>Customers</Text>
              <Text style={styles.metricValue}>{metrics.totalCustomers}</Text>
            </TouchableOpacity>

          {/* Products */}
          <TouchableOpacity onPress={onPressProduct} style={styles.metricCard}>
            <Text style={styles.metricLabel}>Products</Text>
            <Text style={styles.metricValue}>{metrics.totalProducts}</Text>
          </TouchableOpacity>

          {/* Vendors */}
          <TouchableOpacity onPress={onPressActiveVendor} style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active Vendors</Text>
            <Text style={styles.metricValue}>{metrics.totalVendors}</Text>
          </TouchableOpacity>

          {/* Pending Vendors */}
          <TouchableOpacity onPress={onPressInactiveVendor} style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pending Approval</Text>
            <View style={styles.pendingRow}>
              <Text
                style={[
                  styles.metricValue,
                  metrics.pendingVendors > 0 && styles.pendingValueAlert,
                ]}
              >
                {metrics.pendingVendors}
              </Text>
              {metrics.pendingVendors > 0 && (
                <View style={styles.pendingDot} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Orders Section */}
        <View style={styles.ordersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {onPressViewAllOrders && (
              <TouchableOpacity onPress={onPressViewAllOrders}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentOrders?.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent orders recorded.</Text>
            </View>
          ) : (
            recentOrders.map((order) => {
              const statusStyle = getStatusBadgeStyle(order.status);

              return (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderCard}
                  activeOpacity={0.75}
                  onPress={() => onPressOrder?.(order)}
                >
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                      <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: statusStyle.bg,
                          borderColor: statusStyle.border,
                        },
                      ]}
                    >
                      <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.orderBody}>
                    <View style={styles.customerRow}>
                      <Text style={styles.customerName}>
                        👤 {order.customer.firstName} {order.customer.lastName}
                      </Text>
                      <Text style={styles.orderTotal}>
                        {formatCurrency(order.totalAmount)}
                      </Text>
                    </View>

                    <View style={styles.metaRow}>
                      <Text style={styles.storeName}>Store: {order.store.name}</Text>
                      <Text style={styles.cityText}>📍 {order.shippingAddress.city}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 26,
  },
  metricCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  highlightCard: {
    width: '100%',
    backgroundColor: '#111827',
    borderColor: '#1F2937',
  },
  highlightCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  highlightCardValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginTop: 6,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingValueAlert: {
    color: '#D97706',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    marginTop: 6,
  },
  ordersSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  orderBody: {
    gap: 6,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 12,
    color: '#6B7280',
  },
  cityText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default AdminDashboard;
