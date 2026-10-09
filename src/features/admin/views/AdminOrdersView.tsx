import { adminService } from '@/src/apis/services/admin';
import { orderService } from '@/src/apis/services/order';
import { useAppTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CONFIRMED: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  DELIVERED: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  SHIPPED: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  PROCESSING: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  PENDING: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  CANCELLED: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
};

export default function AdminOrdersView() {
  const { colors } = useAppTheme();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'USERS'>('ORDERS');
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, usersRes] = await Promise.allSettled([
        adminService.getOrders(),
        adminService.getUsers(),
      ]);

      if (ordersRes.status === 'fulfilled') {
        const oData = ordersRes.value?.data || ordersRes.value || [];
        setOrders(Array.isArray(oData) ? oData : []);
      }
      if (usersRes.status === 'fulfilled') {
        const uData = usersRes.value?.data || usersRes.value || [];
        setUsers(Array.isArray(uData) ? uData : []);
      }
    } catch (err: any) {
      console.warn('Error fetching admin orders/users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      Alert.alert('Status Updated', `Order status changed to ${newStatus}`);
      await fetchData();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const orderNum = (o.orderNumber || o.id || '').toLowerCase();
      const custName = `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.toLowerCase();
      const storeName = (o.store?.name || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch = orderNum.includes(q) || custName.includes(q) || storeName.includes(q);
      const matchesStatus = statusFilter === 'ALL' || (o.status || '').toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q) || email.includes(q) || (u.role || '').toLowerCase().includes(q);
    });
  }, [users, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Platform Governance</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Audit orders, transactions, and user accounts
        </Text>

        {/* Tab switch: Orders vs Users */}
        <View style={[styles.tabBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('ORDERS')}
            style={[
              styles.tabBtn,
              activeTab === 'ORDERS' && { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="receipt-outline"
              size={16}
              color={activeTab === 'ORDERS' ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'ORDERS' ? '#FFFFFF' : colors.text },
              ]}
            >
              Orders ({orders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('USERS')}
            style={[
              styles.tabBtn,
              activeTab === 'USERS' && { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="people-outline"
              size={16}
              color={activeTab === 'USERS' ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'USERS' ? '#FFFFFF' : colors.text },
              ]}
            >
              Users ({users.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            placeholder={activeTab === 'ORDERS' ? 'Search order #, customer, store...' : 'Search name, email, role...'}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {activeTab === 'ORDERS' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {['ALL', 'CONFIRMED', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <TouchableOpacity
                key={st}
                onPress={() => setStatusFilter(st)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: statusFilter === st ? colors.primary : colors.card,
                    borderColor: statusFilter === st ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: statusFilter === st ? '#FFF' : colors.text }}>
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 8, color: colors.textMuted }}>Loading data...</Text>
        </View>
      ) : activeTab === 'ORDERS' ? (
        <ScrollView
          contentContainerStyle={styles.scrollList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          {filteredOrders.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.text }]}>No orders found</Text>
            </View>
          ) : (
            filteredOrders.map((order) => {
              const statusStyle = STATUS_COLORS[order.status?.toUpperCase()] || {
                bg: colors.card,
                text: colors.text,
                border: colors.border,
              };

              return (
                <TouchableOpacity
                  key={order.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedOrder(order)}
                  style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={[styles.orderNum, { color: colors.text }]}>
                        {order.orderNumber || `ORD-${order.id.slice(0, 8)}`}
                      </Text>
                      <Text style={[styles.orderStore, { color: colors.textMuted }]}>
                        Store: {order.store?.name || 'Platform Merchant'}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                      <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{order.status}</Text>
                    </View>
                  </View>

                  <View style={styles.cardMetaRow}>
                    <View>
                      <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Customer</Text>
                      <Text style={[styles.metaVal, { color: colors.text }]}>
                        {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest'}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Total Amount</Text>
                      <Text style={[styles.orderPrice, { color: colors.primary }]}>
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                    <Text style={[styles.dateText, { color: colors.textMuted }]}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                    <View style={styles.actionBtnGroup}>
                      <TouchableOpacity
                        onPress={() => setSelectedOrder(order)}
                        style={[styles.smallBtn, { borderColor: colors.border }]}
                      >
                        <Text style={[styles.smallBtnText, { color: colors.text }]}>Inspect Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      ) : (
        /* USERS LIST */
        <ScrollView
          contentContainerStyle={styles.scrollList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          {filteredUsers.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.text }]}>No users found</Text>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <View
                key={user.id}
                style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.userAvatarPlaceholder}>
                  <Text style={styles.userAvatarText}>
                    {(user.firstName || user.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user.email}</Text>
                  {user.phone && <Text style={[styles.userPhone, { color: colors.textMuted }]}>{user.phone}</Text>}
                </View>

                <View style={[styles.roleBadge, { backgroundColor: user.role === 'ADMIN' ? '#EFF6FF' : user.role === 'VENDOR' ? '#FEF3C7' : '#F3F4F6' }]}>
                  <Text style={[styles.roleBadgeText, { color: user.role === 'ADMIN' ? '#2563EB' : user.role === 'VENDOR' ? '#D97706' : '#374151' }]}>
                    {user.role}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Order Details Modal */}
      <Modal visible={Boolean(selectedOrder)} transparent animationType="slide" onRequestClose={() => setSelectedOrder(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedOrder?.orderNumber || 'Order Details'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>
                  Status: {selectedOrder?.status}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                {/* Status Switcher */}
                <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>Update Status</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
                  {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      disabled={updatingOrderId === selectedOrder.id}
                      onPress={() => handleUpdateStatus(selectedOrder.id, st)}
                      style={[
                        styles.statusPickerBtn,
                        {
                          backgroundColor: selectedOrder.status === st ? colors.primary : colors.card,
                          borderColor: selectedOrder.status === st ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: selectedOrder.status === st ? '#FFF' : colors.text }}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Customer Info */}
                <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>Customer</Text>
                <View style={[styles.infoCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.infoCardText, { color: colors.text, fontWeight: '600' }]}>
                    {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                  </Text>
                  <Text style={[styles.infoCardSub, { color: colors.textMuted }]}>{selectedOrder.customer?.email}</Text>
                  <Text style={[styles.infoCardSub, { color: colors.textMuted }]}>
                    Delivery to: {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}
                  </Text>
                </View>

                {/* Financials */}
                <Text style={[styles.sectionHeading, { color: colors.textMuted, marginTop: 14 }]}>Financials</Text>
                <View style={[styles.infoCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={styles.rowBetween}>
                    <Text style={{ color: colors.textMuted }}>Subtotal:</Text>
                    <Text style={{ color: colors.text }}>${Number(selectedOrder.subtotal || 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={{ color: colors.textMuted }}>Shipping:</Text>
                    <Text style={{ color: colors.text }}>${Number(selectedOrder.shippingTotal || 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={{ color: colors.textMuted }}>Tax:</Text>
                    <Text style={{ color: colors.text }}>${Number(selectedOrder.taxTotal || 0).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.rowBetween, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6, marginTop: 4 }]}>
                    <Text style={{ fontWeight: '700', color: colors.text }}>Total:</Text>
                    <Text style={{ fontWeight: '700', color: colors.primary, fontSize: 16 }}>
                      ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, gap: 8 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12 },
  tabBar: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3, marginTop: 6 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8, gap: 6 },
  tabText: { fontSize: 13, fontWeight: '600' },
  searchBox: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, gap: 8 },
  searchInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 40, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  filterScroll: { gap: 8, paddingVertical: 2 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18, borderWidth: 1 },
  scrollList: { padding: 16, paddingBottom: 80, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { paddingVertical: 60, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  orderCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNum: { fontSize: 15, fontWeight: '700' },
  orderStore: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { fontSize: 11 },
  metaVal: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  orderPrice: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 10 },
  dateText: { fontSize: 12 },
  actionBtnGroup: { flexDirection: 'row', gap: 6 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  smallBtnText: { fontSize: 12, fontWeight: '600' },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1 },
  userAvatarPlaceholder: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  userName: { fontSize: 14, fontWeight: '700' },
  userEmail: { fontSize: 12, marginTop: 2 },
  userPhone: { fontSize: 11, marginTop: 1 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  roleBadgeText: { fontSize: 10, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', paddingBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  sectionHeading: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  statusPickerBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  infoCard: { padding: 12, borderRadius: 10, borderWidth: 1, gap: 4 },
  infoCardText: { fontSize: 14 },
  infoCardSub: { fontSize: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
});
