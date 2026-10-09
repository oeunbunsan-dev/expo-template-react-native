import { inventoryService } from '@/src/apis/services/inventory';
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

export default function VendorOrdersTab() {
  const { colors } = useAppTheme();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'INVENTORY'>('ORDERS');
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('RESTOCK');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [orderRes, invRes, alertRes] = await Promise.allSettled([
        orderService.getOrders(),
        inventoryService.getInventory(),
        inventoryService.getInventoryAlerts(),
      ]);

      if (orderRes.status === 'fulfilled') {
        const d = orderRes.value?.data || orderRes.value || [];
        setOrders(Array.isArray(d) ? d : []);
      }
      if (invRes.status === 'fulfilled') {
        const d = invRes.value?.data || invRes.value || [];
        setInventory(Array.isArray(d) ? d : []);
      }
      if (alertRes.status === 'fulfilled') {
        const d = alertRes.value?.data || alertRes.value || [];
        setAlerts(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.warn('Vendor orders/inventory fetch error:', err);
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

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      setIsSubmitting(true);
      await orderService.updateOrderStatus(orderId, status);
      Alert.alert('Status Updated', `Order #${orderId.slice(0, 8)} status set to ${status}`);
      await fetchData();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => prev ? { ...prev, status } : null);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update order status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Inventory Adjustment
  const handleAdjustInventory = async () => {
    if (!selectedInventoryItem || !adjustQty || isNaN(Number(adjustQty))) {
      Alert.alert('Validation Error', 'Please enter a valid numeric quantity.');
      return;
    }

    try {
      setIsSubmitting(true);
      await inventoryService.adjustInventory({
        productId: selectedInventoryItem.productId || selectedInventoryItem.id,
        variantId: selectedInventoryItem.variantId,
        quantity: parseInt(adjustQty, 10),
        reason: adjustReason,
      });

      Alert.alert('Success', 'Stock adjusted successfully.');
      setAdjustModalVisible(false);
      setAdjustQty('');
      await fetchData();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to adjust stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      const num = (o.orderNumber || o.id || '').toLowerCase();
      const cust = `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.toLowerCase();
      const matchesSearch = num.includes(q) || cust.includes(q);
      const matchesStatus = orderStatusFilter === 'ALL' || (o.status || '').toUpperCase() === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, orderStatusFilter]);

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((inv) => {
      const q = searchQuery.toLowerCase();
      const sku = (inv.sku || '').toLowerCase();
      const name = (inv.product?.name || inv.warehouseName || '').toLowerCase();
      return sku.includes(q) || name.includes(q);
    });
  }, [inventory, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Orders & Stock Operations</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Manage fulfillment queues, dispatch shipments, and track inventory thresholds
        </Text>

        {/* Tab switch */}
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
              Fulfillment Orders ({orders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('INVENTORY')}
            style={[
              styles.tabBtn,
              activeTab === 'INVENTORY' && { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="cube-outline"
              size={16}
              color={activeTab === 'INVENTORY' ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'INVENTORY' ? '#FFFFFF' : colors.text },
              ]}
            >
              Stock & Alerts ({inventory.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Filter Header */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            placeholder={activeTab === 'ORDERS' ? 'Search order # or customer...' : 'Search SKU or warehouse...'}
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <TouchableOpacity
                key={st}
                onPress={() => setOrderStatusFilter(st)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: orderStatusFilter === st ? colors.primary : colors.card,
                    borderColor: orderStatusFilter === st ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: orderStatusFilter === st ? '#FFF' : colors.text }}>
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Main Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 8, color: colors.textMuted }}>Loading operational data...</Text>
        </View>
      ) : activeTab === 'ORDERS' ? (
        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
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
                <View
                  key={order.id}
                  style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={[styles.orderNum, { color: colors.text }]}>
                        {order.orderNumber || `ORD-${order.id.slice(0, 8)}`}
                      </Text>
                      <Text style={[styles.orderSub, { color: colors.textMuted }]}>
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                      <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{order.status}</Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={[styles.metaText, { color: colors.text }]}>
                      Customer: {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest'}
                    </Text>
                    {order.shippingAddress && (
                      <Text style={[styles.metaTextSub, { color: colors.textMuted }]}>
                        Ship to: {order.shippingAddress.street}, {order.shippingAddress.city}
                      </Text>
                    )}
                    <View style={styles.priceRow}>
                      <Text style={[styles.totalLabel, { color: colors.textMuted }]}>Order Value</Text>
                      <Text style={[styles.totalAmount, { color: colors.primary }]}>
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Row */}
                  <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
                    <TouchableOpacity
                      onPress={() => setSelectedOrder(order)}
                      style={[styles.actionBtnOutline, { borderColor: colors.border }]}
                    >
                      <Ionicons name="document-text-outline" size={14} color={colors.text} />
                      <Text style={[styles.actionBtnOutlineText, { color: colors.text }]}>Details</Text>
                    </TouchableOpacity>

                    {order.status === 'PENDING' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                        style={[styles.actionBtnSolid, { backgroundColor: '#2563EB' }]}
                      >
                        <Text style={styles.actionBtnSolidText}>Confirm</Text>
                      </TouchableOpacity>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                        style={[styles.actionBtnSolid, { backgroundColor: '#7C3AED' }]}
                      >
                        <Text style={styles.actionBtnSolidText}>Ship</Text>
                      </TouchableOpacity>
                    )}

                    {order.status === 'SHIPPED' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                        style={[styles.actionBtnSolid, { backgroundColor: '#10B981' }]}
                      >
                        <Text style={styles.actionBtnSolidText}>Deliver</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      ) : (
        /* INVENTORY TAB */
        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          {/* Low Stock Banner */}
          {alerts.length > 0 && (
            <View style={styles.alertBanner}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertBannerTitle}>Low Stock Warning ({alerts.length} Items)</Text>
                <Text style={styles.alertBannerSub}>
                  Certain items are below threshold. Reorder or adjust quantities to prevent stockouts.
                </Text>
              </View>
            </View>
          )}

          {filteredInventory.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.text }]}>No inventory records</Text>
            </View>
          ) : (
            filteredInventory.map((item) => {
              const isLow = item.quantity <= (item.minStockAlert || 5);

              return (
                <View
                  key={item.id}
                  style={[styles.invCard, { backgroundColor: colors.surface, borderColor: isLow ? '#FCA5A5' : colors.border }]}
                >
                  <View style={styles.invHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.invSku, { color: colors.text }]}>
                        {item.sku || 'SKU-STANDARD'}
                      </Text>
                      <Text style={[styles.invWarehouse, { color: colors.textMuted }]}>
                        Warehouse: {item.warehouseName || 'Central Stock'}
                      </Text>
                    </View>
                    <View style={[styles.qtyBadge, { backgroundColor: isLow ? '#FEF2F2' : '#ECFDF5' }]}>
                      <Text style={[styles.qtyBadgeText, { color: isLow ? '#EF4444' : '#059669' }]}>
                        {item.quantity} In Stock
                      </Text>
                    </View>
                  </View>

                  <View style={styles.invMetaRow}>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>
                      Reserved: {item.reservedQuantity || 0}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>
                      Min Alert: {item.minStockAlert || 5}
                    </Text>
                  </View>

                  <View style={[styles.invFooter, { borderTopColor: colors.border }]}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedInventoryItem(item);
                        setAdjustQty('');
                        setAdjustModalVisible(true);
                      }}
                      style={[styles.adjustBtn, { backgroundColor: colors.primary }]}
                    >
                      <Ionicons name="git-pull-request-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.adjustBtnText}>Adjust Stock</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* ADJUST INVENTORY MODAL */}
      <Modal visible={adjustModalVisible} transparent animationType="slide" onRequestClose={() => setAdjustModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Stock Adjustment</Text>
              <TouchableOpacity onPress={() => setAdjustModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16, gap: 12 }}>
              <Text style={{ fontSize: 13, color: colors.textMuted }}>
                SKU: {selectedInventoryItem?.sku} ({selectedInventoryItem?.warehouseName || 'Central Warehouse'})
              </Text>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Adjustment Quantity (+ or -)</Text>
                <TextInput
                  value={adjustQty}
                  onChangeText={setAdjustQty}
                  placeholder="e.g. 50 or -5"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Reason</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                  {['RESTOCK', 'DAMAGE', 'RETURN', 'COUNT_ADJUSTMENT'].map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setAdjustReason(r)}
                      style={[
                        styles.reasonPill,
                        {
                          backgroundColor: adjustReason === r ? colors.primary : colors.card,
                          borderColor: adjustReason === r ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: adjustReason === r ? '#FFF' : colors.text }}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity
                disabled={isSubmitting}
                onPress={handleAdjustInventory}
                style={[styles.btnSubmit, { backgroundColor: colors.primary }]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.btnSubmitText}>Confirm Stock Adjustment</Text>
                )}
              </TouchableOpacity>
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
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Customer & Shipping</Text>
                <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={{ fontWeight: '600', color: colors.text }}>
                    {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{selectedOrder.customer?.email}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{selectedOrder.customer?.phone}</Text>
                  <Text style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>
                    Address: {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}
                  </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: 12 }]}>Summary</Text>
                <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={styles.rowBetween}>
                    <Text style={{ color: colors.textMuted }}>Subtotal:</Text>
                    <Text style={{ color: colors.text }}>${Number(selectedOrder.subtotal || 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={{ color: colors.textMuted }}>Shipping:</Text>
                    <Text style={{ color: colors.text }}>${Number(selectedOrder.shippingTotal || 0).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.rowBetween, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 4, marginTop: 4 }]}>
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
  tabText: { fontSize: 12, fontWeight: '600' },
  searchBox: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, gap: 8 },
  searchInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 40, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, borderWidth: 1 },
  scrollList: { padding: 16, paddingBottom: 80, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { paddingVertical: 50, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  orderCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNum: { fontSize: 15, fontWeight: '700' },
  orderSub: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  cardBody: { gap: 3 },
  metaText: { fontSize: 13, fontWeight: '500' },
  metaTextSub: { fontSize: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  totalLabel: { fontSize: 12 },
  totalAmount: { fontSize: 16, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, borderTopWidth: 1, paddingTop: 10 },
  actionBtnOutline: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, gap: 4 },
  actionBtnOutlineText: { fontSize: 12, fontWeight: '600' },
  actionBtnSolid: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  actionBtnSolidText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  alertBanner: { flexDirection: 'row', backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 12, gap: 10, alignItems: 'center' },
  alertBannerTitle: { fontSize: 14, fontWeight: '700', color: '#B91C1C' },
  alertBannerSub: { fontSize: 11, color: '#DC2626', marginTop: 2 },
  invCard: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8 },
  invHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  invSku: { fontSize: 15, fontWeight: '700' },
  invWarehouse: { fontSize: 12, marginTop: 2 },
  qtyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  qtyBadgeText: { fontSize: 12, fontWeight: '700' },
  invMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  invFooter: { borderTopWidth: 1, paddingTop: 8, alignItems: 'flex-end' },
  adjustBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, gap: 4 },
  adjustBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', paddingBottom: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  formGroup: { gap: 6 },
  formLabel: { fontSize: 12, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 42, fontSize: 14 },
  reasonPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  btnSubmit: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, marginTop: 6 },
  btnSubmitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  infoBox: { padding: 12, borderRadius: 10, borderWidth: 1, gap: 3 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
});
