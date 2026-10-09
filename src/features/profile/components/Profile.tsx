import { formatDate } from '@/src/utils';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// --- TypeScript Definitions ---
export interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  avatar?: string | null;
  vendor?: any | null;
  createdAt: string;
}

interface ProfileProps {
  profileObj: ProfileData;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({
  profileObj,
  onEditProfile,
  onChangePassword,
  onLogout,
}) => {
  if (!profileObj) return null;

  const { firstName, lastName, email, phone, role, status, emailVerified, avatar, createdAt } = profileObj;

  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <View style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.initialsText}>{initials}</Text>
              </View>
            )}

            {/* Status Indicator */}
            <View
              style={[
                styles.statusDot,
                status === 'ACTIVE' ? styles.statusActive : styles.statusInactive,
              ]}
            />
          </View>

          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.emailText}>{email}</Text>

          {/* Badges Row */}
          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{role}</Text>
            </View>

            <View
              style={[
                styles.verificationBadge,
                emailVerified ? styles.verifiedBg : styles.unverifiedBg,
              ]}
            >
              <Text
                style={[
                  styles.verificationBadgeText,
                  emailVerified ? styles.verifiedText : styles.unverifiedText,
                ]}
              >
                {emailVerified ? '✓ Email Verified' : '⚠ Email Unverified'}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Personal Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{phone || 'Not provided'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <Text style={styles.infoValue}>{status}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{formatDate(createdAt)}</Text>
          </View>
        </View>

        {/* Account Settings Actions */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Account Settings</Text>

          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.7}
            onPress={onEditProfile}
          >
            <Text style={styles.actionText}>Edit Profile</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.7}
            onPress={onChangePassword}
          >
            <Text style={styles.actionText}>Change Password</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={onLogout}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  placeholderAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#F9FAFB',
  },
  statusActive: {
    backgroundColor: '#10B981',
  },
  statusInactive: {
    backgroundColor: '#9CA3AF',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
  },
  verificationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBg: {
    backgroundColor: '#ECFDF5',
  },
  unverifiedBg: {
    backgroundColor: '#FEF3C7',
  },
  verificationBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  verifiedText: {
    color: '#059669',
  },
  unverifiedText: {
    color: '#B45309',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  actionChevron: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default Profile;
