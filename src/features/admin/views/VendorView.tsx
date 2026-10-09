import { adminService } from '@/src/apis/services/admin';
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
import Vendor, { VendorObject } from '../components/Vendor';

export default function VendorView() {
  const { colors } = useAppTheme();

  const [vendors, setVendors] = useState<VendorObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED'>('ALL');
  const [selectedVendor, setSelectedVendor] = useState<VendorObject | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    try {
      const res = await adminService.getVendors();
      const data = Array.isArray(res) ? res : res?.data || [];
      setVendors(data);
    } catch (error: any) {
      console.warn('Error fetching vendors:', error);
      Alert.alert('Error', error?.message || 'Failed to fetch vendor list');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendors();
  };

  const handleUpdateStatus = async (vendor: VendorObject, newStatus: 'APPROVED' | 'SUSPENDED' | 'REJECTED') => {
    try {
      setUpdatingId(vendor.id);
      await adminService.updateVendorStatus(vendor.id, newStatus);
      Alert.alert('Success', `Vendor "${vendor.companyName}" marked as ${newStatus}`);
      await fetchVendors();
      if (selectedVendor?.id === vendor.id) {
        setSelectedVendor((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error: any) {
      Alert.alert('Action Failed', error?.message || 'Could not update vendor status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        (v.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.user?.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.user?.lastName || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'ALL' || (v.status || '').toUpperCase() === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchQuery, selectedStatus]);

  const counts = useMemo(() => {
    const pending = vendors.filter((v) => (v.status || '').toUpperCase() === 'PENDING').length;
    const approved = vendors.filter((v) => (v.status || '').toUpperCase() === 'APPROVED').length;
    const suspended = vendors.filter((v) => (v.status || '').toUpperCase() === 'SUSPENDED' || (v.status || '').toUpperCase() === 'REJECTED').length;
    return { all: vendors.length, pending, approved, suspended };
  }, [vendors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Merchant Governance</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Review vendor KYC, approve new storefronts & manage compliance
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search by company, owner or email..."
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

        {/* Filter Badges */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['ALL', 'PENDING', 'APPROVED', 'SUSPENDED'] as const).map((status) => {
            const isSelected = selectedStatus === status;
            const badgeCount =
              status === 'ALL'
                ? counts.all
                : status === 'PENDING'
                ? counts.pending
                : status === 'APPROVED'
                ? counts.approved
                : counts.suspended;

            return (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {status} ({badgeCount})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading vendors...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          {filteredVendors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No vendors found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                {searchQuery || selectedStatus !== 'ALL'
                  ? 'Try adjusting your search criteria or status filter.'
                  : 'No merchants currently registered in the database.'}
              </Text>
            </View>
          ) : (
            filteredVendors.map((vendor) => (
              <View key={vendor.id} style={styles.cardContainer}>
                <Vendor
                  vendorObj={vendor}
                  onVendorCardClick={(v) => {
                    setSelectedVendor(v);
                    setDetailModalVisible(true);
                  }}
                  onPressDetails={(v) => {
                    setSelectedVendor(v);
                    setDetailModalVisible(true);
                  }}
                  onApprove={(v) => handleUpdateStatus(v, 'APPROVED')}
                  onReject={(v) => handleUpdateStatus(v, 'REJECTED')}
                />

                {/* Quick Action Bar under card */}
                <View style={[styles.actionRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  {vendor.status !== 'APPROVED' && (
                    <TouchableOpacity
                      disabled={updatingId === vendor.id}
                      onPress={() => handleUpdateStatus(vendor, 'APPROVED')}
                      style={[styles.btnAction, { backgroundColor: '#10B981' }]}
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.btnActionText}>Approve</Text>
                    </TouchableOpacity>
                  )}

                  {vendor.status !== 'SUSPENDED' && (
                    <TouchableOpacity
                      disabled={updatingId === vendor.id}
                      onPress={() => handleUpdateStatus(vendor, 'SUSPENDED')}
                      style={[styles.btnAction, { backgroundColor: '#EF4444' }]}
                    >
                      <Ionicons name="pause-circle-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.btnActionText}>Suspend</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedVendor(vendor);
                      setDetailModalVisible(true);
                    }}
                    style={[styles.btnActionOutline, { borderColor: colors.border }]}
                  >
                    <Ionicons name="eye-outline" size={16} color={colors.text} />
                    <Text style={[styles.btnActionOutlineText, { color: colors.text }]}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Vendor Details Modal */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedVendor?.companyName || 'Vendor Details'}
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
                  KYC & Store Information
                </Text>
              </View>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedVendor && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.infoGroup}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Company Name</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{selectedVendor.companyName}</Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Business / Tax ID</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {selectedVendor.taxId || selectedVendor.businessNumber || 'N/A'}
                  </Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Commission Rate</Text>
                  <Text style={[styles.infoValue, { color: colors.primary, fontWeight: '700' }]}>
                    {selectedVendor.commissionRate ? `${selectedVendor.commissionRate}%` : 'Standard Platform Rate'}
                  </Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Status</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      {
                        color:
                          selectedVendor.status === 'APPROVED'
                            ? '#10B981'
                            : selectedVendor.status === 'PENDING'
                            ? '#F59E0B'
                            : '#EF4444',
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {selectedVendor.status}
                  </Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Contact Person</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {selectedVendor.user?.firstName} {selectedVendor.user?.lastName}
                  </Text>
                  <Text style={[styles.infoSubValue, { color: colors.textMuted }]}>
                    {selectedVendor.user?.email}
                  </Text>
                  {selectedVendor.user?.phone && (
                    <Text style={[styles.infoSubValue, { color: colors.textMuted }]}>
                      {selectedVendor.user.phone}
                    </Text>
                  )}
                </View>

                {selectedVendor.stores && selectedVendor.stores.length > 0 && (
                  <View style={styles.infoGroup}>
                    <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Connected Stores</Text>
                    {selectedVendor.stores.map((st, i) => (
                      <View key={i} style={[styles.storePill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Ionicons name="storefront-outline" size={16} color={colors.primary} />
                        <Text style={[styles.storePillText, { color: colors.text }]}>{st.name}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Status Toggle in Modal */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={() => {
                      handleUpdateStatus(selectedVendor, 'APPROVED');
                    }}
                    style={[styles.modalActionBtn, { backgroundColor: '#10B981' }]}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.modalActionBtnText}>Approve Vendor</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      handleUpdateStatus(selectedVendor, 'SUSPENDED');
                    }}
                    style={[styles.modalActionBtn, { backgroundColor: '#EF4444' }]}
                  >
                    <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.modalActionBtnText}>Suspend Account</Text>
                  </TouchableOpacity>
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
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
    gap: 16,
  },
  cardContainer: {
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderTopWidth: 0,
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  btnActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  btnActionOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  btnActionOutlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modalBody: {
    padding: 16,
  },
  infoGroup: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  infoSubValue: {
    fontSize: 13,
    marginTop: 2,
  },
  storePill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
    gap: 8,
  },
  storePillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    gap: 10,
    marginTop: 16,
    paddingBottom: 20,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  modalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
