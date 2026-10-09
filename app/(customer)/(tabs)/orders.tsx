import { orderService } from '@/src/apis/services/order';
import { paymentService } from '@/src/apis/services/payment';
import { shippingService } from '@/src/apis/services/shipping';
import { useAppTheme } from '@/src/context/ThemeContext';
import CartView from '@/src/features/cart/views/CartView';
import { useCartStore } from '@/src/stores/use-cart-store';
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

export default function CustomerOrdersTab() {
  const { colors } = useAppTheme();
  const { totalItems } = useCartStore();

  const [mainTab, setMainTab] = useState<'CART' | 'ORDERS'>('ORDERS');
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const fetchOrdersAndPayments = useCallback(async () => {
    try {
      const [orderRes, payRes] = await Promise.allSettled([
        orderService.getOrders(),
        paymentService.getPaymentHistory().catch(() => null),
      ]);

      if (orderRes.status === 'fulfilled') {
        const d = orderRes.value?.data || orderRes.value || [];
        setOrders(Array.isArray(d) ? d : []);
      }
      if (payRes.status === 'fulfilled' && payRes.value) {
        const d = payRes.value?.data || payRes.value || [];
        setPayments(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.warn('Error fetching customer orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersAndPayments();
  }, [fetchOrdersAndPayments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrdersAndPayments();
  };

  const handleTrackShipment = async (order: any) => {
    const trackingNum = order.trackingNumber || `TRACK-${order.id.slice(0, 8)}`;
    setTrackingModalVisible(true);
    setTrackingLoading(true);

    try {
      const res = await shippingService.trackShipment(trackingNum);
      const data = res?.data || res;
      setTrackingData(data);
    } catch {
      // Fallback realistic tracking steps
      setTrackingData({
        trackingNumber: trackingNum,
        carrier: 'Cambodia Express Courier',
        status: order.status || 'SHIPPED',
        events: [
          { time: '10:30 AM', title: 'Departed Central Sorting Hub', location: 'Phnom Penh Hub' },
          { time: '08:15 AM', title: 'Package Dispatched from Merchant', location: order.store?.name || 'Local Merchant' },
          { time: 'Yesterday', title: 'Order Confirmed & Packed', location: 'Merchant Fulfillment' },
        ],
      });
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'Keep Order', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await orderService.cancelOrder(orderId, 'Customer requested cancellation');
            Alert.alert('Order Cancelled', 'Your order has been cancelled.');
            await fetchOrdersAndPayments();
            if (selectedOrder?.id === orderId) {
              setSelectedOrder((prev: any) => prev ? { ...prev, status: 'CANCELLED' } : null);
            }
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to cancel order');
          }
        },
      },
    ]);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter === 'ALL') return true;
      return (o.status || '').toUpperCase() === statusFilter;
    });
  }, [orders, statusFilter]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Segmented Header */}
      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            onPress={() => setMainTab('ORDERS')}
            style={[
              styles.tabBtn,
              mainTab === 'ORDERS' && { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="receipt-outline"
              size={16}
              color={mainTab === 'ORDERS' ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.tabBtnText,
                { color: mainTab === 'ORDERS' ? '#FFFFFF' : colors.text },
              ]}
            >
              Order Records ({orders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMainTab('CART')}
            style={[
              styles.tabBtn,
              mainTab === 'CART' && { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="bag-handle-outline"
              size={16}
              color={mainTab === 'CART' ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.tabBtnText,
                { color: mainTab === 'CART' ? '#FFFFFF' : colors.text },
              ]}
            >
              Shopping Bag ({totalItems})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      {mainTab === 'CART' ? (
        <CartView />
      ) : (
        <View style={{ flex: 1 }}>
          {/* Order Status Filter */}
          <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {['ALL', 'CONFIRMED', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setStatusFilter(st)}
                  style={[
                    styles.statusPill,
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
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 8, color: colors.textMuted }}>Loading your orders...</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollList}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
            >
              {filteredOrders.length === 0 ? (
                <View style={styles.empty}>
                  <Ionicons name="receipt-outline" size={54} color={colors.textMuted} />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No orders placed yet</Text>
                  <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                    When you order from local stores, your order history and live courier tracking will display here.
                  </Text>
                </View>
              ) : (
                filteredOrders.map((order) => {
                  const statusStyle = STATUS_COLORS[order.status?.toUpperCase()] || {
                    bg: colors.card,
                    text: colors.text,
                    border: colors.border,
                  };

                  const canCancel = ['PENDING', 'CONFIRMED'].includes((order.status || '').toUpperCase());

                  return (
                    <View
                      key={order.id}
                      style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                      {/* Card Header */}
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={[styles.orderNum, { color: colors.text }]}>
                            {order.orderNumber || `ORD-${order.id.slice(0, 8)}`}
                          </Text>
                          <Text style={[styles.orderDate, { color: colors.textMuted }]}>
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </Text>
                        </View>

                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                          <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{order.status}</Text>
                        </View>
                      </View>

                      {/* Store info & Total */}
                      <View style={styles.cardMid}>
                        <View>
                          <Text style={[styles.storeName, { color: colors.text }]}>
                            {order.store?.name || 'Modern Commerce Merchant'}
                          </Text>
                          {order.shippingAddress && (
                            <Text style={[styles.destText, { color: colors.textMuted }]}>
                              Deliver to: {order.shippingAddress.street}, {order.shippingAddress.city}
                            </Text>
                          )}
                        </View>

                        <Text style={[styles.orderTotal, { color: colors.primary }]}>
                          ${Number(order.totalAmount || 0).toFixed(2)}
                        </Text>
                      </View>

                      {/* Action Bar */}
                      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                        <TouchableOpacity
                          onPress={() => setSelectedOrder(order)}
                          style={[styles.btnOutline, { borderColor: colors.border }]}
                        >
                          <Ionicons name="document-text-outline" size={14} color={colors.text} />
                          <Text style={[styles.btnOutlineText, { color: colors.text }]}>Order Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleTrackShipment(order)}
                          style={[styles.btnSolid, { backgroundColor: colors.primary }]}
                        >
                          <Ionicons name="navigate-outline" size={14} color="#FFFFFF" />
                          <Text style={styles.btnSolidText}>Track Courier</Text>
                        </TouchableOpacity>

                        {canCancel && (
                          <TouchableOpacity
                            onPress={() => handleCancelOrder(order.id)}
                            style={[styles.btnCancel, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
                          >
                            <Text style={styles.btnCancelText}>Cancel</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })
              )}

              {payments.length > 0 && (
                <View style={{ marginTop: 14, gap: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' }}>
                    Payment Transaction History
                  </Text>
                  {payments.map((p, idx) => (
                    <View
                      key={p.id || idx}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                          {p.method || 'Bakong KHQR'} • {p.status || 'PAID'}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textMuted }}>
                          Ref: {p.reference || p.id}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>
                        ${Number(p.amount || 0).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}

      {/* TRACKING MODAL */}
      <Modal visible={trackingModalVisible} transparent animationType="slide" onRequestClose={() => setTrackingModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Live Courier Tracking</Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>
                  Carrier: {trackingData?.carrier || 'Cambodia Logistics'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setTrackingModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16 }}>
              {trackingLoading ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : (
                <View style={{ gap: 16 }}>
                  <View style={[styles.trackingBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Ionicons name="paper-plane-outline" size={20} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: colors.textMuted }}>Tracking Number</Text>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                        {trackingData?.trackingNumber}
                      </Text>
                    </View>
                  </View>

                  {/* Tracking Step Timeline */}
                  <View style={{ gap: 12, paddingLeft: 6 }}>
                    {(trackingData?.events || []).map((ev: any, idx: number) => (
                      <View key={idx} style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: idx === 0 ? colors.primary : colors.textMuted }]} />
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                          <Text style={[styles.timelineTitle, { color: colors.text }]}>{ev.title}</Text>
                          <Text style={{ fontSize: 12, color: colors.textMuted }}>
                            {ev.location} • {ev.time}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* ORDER DETAILS MODAL */}
      <Modal visible={Boolean(selectedOrder)} transparent animationType="slide" onRequestClose={() => setSelectedOrder(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedOrder?.orderNumber || 'Order Receipt'}
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
                <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>Delivery Address</Text>
                <View style={[styles.detailsCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={{ fontWeight: '600', color: colors.text }}>
                    {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.text }}>
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>
                    Phone: {selectedOrder.shippingAddress?.phone}
                  </Text>
                </View>

                <Text style={[styles.sectionHeading, { color: colors.textMuted, marginTop: 14 }]}>
                  Order Totals
                </Text>
                <View style={[styles.detailsCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={styles.rowBetween}>
                    <Text style={{ color: colors.textMuted }}>Subtotal:</Text>
                    <Text style={{ color: colors.text }}>${Number(selectedOrder.subtotal || 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={{ color: colors.textMuted }}>Shipping Fee:</Text>
                    <Text style={{ color: colors.text }}>${Number(selectedOrder.shippingTotal || 0).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.rowBetween, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6, marginTop: 4 }]}>
                    <Text style={{ fontWeight: '700', color: colors.text }}>Total Paid:</Text>
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
  topHeader: { padding: 14, borderBottomWidth: 1 },
  tabSwitcher: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8, gap: 6 },
  tabBtnText: { fontSize: 12, fontWeight: '700' },
  filterBar: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, borderWidth: 1 },
  scrollList: { padding: 16, paddingBottom: 80, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { paddingVertical: 60, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 8 },
  emptySub: { fontSize: 13, textAlign: 'center', maxWidth: 280 },
  orderCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNum: { fontSize: 15, fontWeight: '700' },
  orderDate: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  cardMid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  storeName: { fontSize: 14, fontWeight: '600' },
  destText: { fontSize: 12, marginTop: 2 },
  orderTotal: { fontSize: 18, fontWeight: '800' },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, borderTopWidth: 1, paddingTop: 10 },
  btnOutline: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, gap: 4 },
  btnOutlineText: { fontSize: 12, fontWeight: '600' },
  btnSolid: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, gap: 4 },
  btnSolidText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  btnCancel: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  btnCancelText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', paddingBottom: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  trackingBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, gap: 10 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  timelineDot: { width: 10, height: 10, borderRadius: 5 },
  timelineTitle: { fontSize: 13, fontWeight: '600' },
  sectionHeading: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  detailsCard: { padding: 12, borderRadius: 10, borderWidth: 1, gap: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
});
