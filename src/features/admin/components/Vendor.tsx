import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface VendorUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  status: string;
}

export interface VendorStore {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
}

export interface VendorObject {
  id: string;
  userId: string;
  companyName: string;
  businessNumber: string;
  taxId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  commissionRate: string;
  approvedAt?: string | null;
  rejectedReason?: string | null;
  createdAt: string;
  updatedAt: string;
  user: VendorUser;
  stores?: VendorStore[];
}

interface VendorProps {
  vendorObj: VendorObject;
  onApprove?: (vendor: VendorObject) => void;
  onReject?: (vendor: VendorObject) => void;
  onPressDetails?: (vendor: VendorObject) => void;
  onVendorCardClick ?: (vendor: VendorObject) => void;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusBadgeStyle = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
      return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
    case 'PENDING':
      return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
    case 'REJECTED':
      return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
    default:
      return { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' };
  }
};

const Vendor: React.FC<VendorProps> = ({
  vendorObj,
  onApprove,
  onReject,
  onPressDetails,
  onVendorCardClick
}) => {
  if (!vendorObj) return null;

  const {
    companyName,
    businessNumber,
    taxId,
    status,
    commissionRate,
    createdAt,
    rejectedReason,
    user,
    stores = [],
  } = vendorObj;

  const statusStyle = getStatusBadgeStyle(status);
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A';
  const initial = companyName ? companyName.charAt(0).toUpperCase() : 'V';

  return (
    <TouchableOpacity onPress={() => onVendorCardClick?.(vendorObj)} style={styles.card}>
      {/* Header: Company & Status */}
      <View style={styles.headerRow}>
        <View style={styles.companyMeta}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.companyName} numberOfLines={1}>
              {companyName}
            </Text>
            <Text style={styles.dateText}>Applied: {formatDate(createdAt)}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Business Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Business No.</Text>
          <Text style={styles.detailValue}>{businessNumber}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Tax ID</Text>
          <Text style={styles.detailValue}>{taxId}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Commission</Text>
          <Text style={styles.detailValueHighlight}>{commissionRate}%</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Stores</Text>
          <Text style={styles.detailValue}>{stores.length} registered</Text>
        </View>
      </View>

      {/* Owner Contact Information */}
      {user && (
        <View style={styles.userSection}>
          <Text style={styles.sectionTitle}>Account Contact</Text>
          <View style={styles.userRow}>
            <Text style={styles.userName}>👤 {fullName}</Text>
            <View style={styles.contactChips}>
              <Text style={styles.chipText}>✉️ {user.email}</Text>
              {user.phone ? <Text style={styles.chipText}>📞 {user.phone}</Text> : null}
            </View>
          </View>
        </View>
      )}

      {/* Show reason if rejected */}
      {rejectedReason ? (
        <View style={styles.rejectedBox}>
          <Text style={styles.rejectedLabel}>Reason for Rejection:</Text>
          <Text style={styles.rejectedText}>{rejectedReason}</Text>
        </View>
      ) : null}

      {/* Action Footer */}
      <View style={styles.footerRow}>
        {onPressDetails && (
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => onPressDetails(vendorObj)}
          >
            <Text style={styles.detailsBtnText}>View Details</Text>
          </TouchableOpacity>
        )}

        {status === 'PENDING' && (
          <View style={styles.actionButtonGroup}>
            {onReject && (
              <TouchableOpacity
                style={[styles.btn, styles.rejectBtn]}
                onPress={() => onReject(vendorObj)}
              >
                <Text style={styles.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
            )}

            {onApprove && (
              <TouchableOpacity
                style={[styles.btn, styles.approveBtn]}
                onPress={() => onApprove(vendorObj)}
              >
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  titleWrapper: {
    marginLeft: 12,
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    width: '47%',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  detailValueHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  userSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  userRow: {
    gap: 4,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  contactChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
  chipText: {
    fontSize: 12,
    color: '#4B5563',
  },
  rejectedBox: {
    marginTop: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 10,
  },
  rejectedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  rejectedText: {
    fontSize: 12,
    color: '#991B1B',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailsBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  approveBtn: {
    backgroundColor: '#111827',
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Vendor;
