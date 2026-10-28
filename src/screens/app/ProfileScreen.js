import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';
import { CustomHeader } from '../../components/CustomHeader';
import { PersonalizedAlert } from '../../components/PersonalizedAlert';

export const ProfileScreen = ({ navigation }) => {
  const { currentUser, isCustomer, isAdmin, logout } = useAuth();
  const { totals } = useBudget();
  const currency = currentUser?.currencySymbol || '₹';

  const handleLogout = () => {
    Alert.alert(
      'Sign Out Confirmation',
      'Are you sure you want to log out? All session data will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="User Profile"
        subtitle={isCustomer ? 'Customer Account' : 'Administrator Account'}
        navigation={navigation}
      />

      <PersonalizedAlert />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Badge Banner if Customer */}
        {isCustomer && (
          <View style={styles.customerBanner}>
            <Ionicons name="checkmark-seal" size={18} color={COLORS.primary} />
            <Text style={styles.customerBannerText}>
              Verified Customer Account • Active Session
            </Text>
          </View>
        )}

        {/* Profile Card Header */}
        <View style={[styles.profileCard, SHADOWS.md]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
              }}
              style={styles.avatar}
            />
            <View
              style={[
                styles.roleIndicator,
                isAdmin ? styles.adminIndicator : styles.customerIndicator,
              ]}
            >
              <Ionicons
                name={isAdmin ? 'shield' : 'person'}
                size={12}
                color={COLORS.white}
              />
            </View>
          </View>

          {/* Correct Name, Email, and Role as required */}
          <Text style={styles.profileName}>{currentUser?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{currentUser?.email || 'email@example.com'}</Text>

          <View
            style={[
              styles.roleTag,
              isAdmin ? styles.adminRoleTag : styles.customerRoleTag,
            ]}
          >
            <Ionicons
              name={isAdmin ? 'shield-checkmark' : 'person'}
              size={13}
              color={isAdmin ? COLORS.dangerDark : COLORS.primaryDark}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.roleTagText,
                isAdmin ? styles.adminRoleTagText : styles.customerRoleTagText,
              ]}
            >
              {currentUser?.role} Role
            </Text>
          </View>

          {/* Edit Profile Action Button */}
          {isCustomer ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.white} />
              <Text style={styles.editButtonText}>Edit Profile Details</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.adminNote}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.dangerDark} />
              <Text style={styles.adminNoteText}>
                Super Administrator profile is managed by system security.
              </Text>
            </View>
          )}
        </View>

        {/* Account Details & Settings Section */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <Text style={styles.sectionTitle}>Account Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Ionicons name="call-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Contact Phone</Text>
              <Text style={styles.detailValue}>{currentUser?.phone || 'Not configured'}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Ionicons name="pricetag-outline" size={18} color={COLORS.success} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Currency Preference</Text>
              <Text style={styles.detailValue}>
                {currentUser?.currencySymbol || '₹'} (INR / Standard)
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Ionicons name="calendar-outline" size={18} color="#0284C7" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Account Created / Enrolled</Text>
              <Text style={styles.detailValue}>{currentUser?.joinedDate || 'October 2026'}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Ionicons name="speedometer-outline" size={18} color="#D97706" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Monthly Target Budget</Text>
              <Text style={styles.detailValue}>
                {currency}
                {(currentUser?.monthlyBudget || 25000).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Financial Highlights */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <Text style={styles.sectionTitle}>Financial Highlights</Text>
          <View style={styles.statsSummaryGrid}>
            <View style={styles.statsGridItem}>
              <Text style={styles.gridItemValue}>
                {currency}
                {totals.income.toLocaleString()}
              </Text>
              <Text style={styles.gridItemLabel}>Total Inflow</Text>
            </View>
            <View style={styles.statsGridItem}>
              <Text style={styles.gridItemValue}>
                {currency}
                {totals.expense.toLocaleString()}
              </Text>
              <Text style={styles.gridItemLabel}>Total Outflow</Text>
            </View>
          </View>
        </View>

        {/* Logout Action */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutButtonText}>Log Out ({currentUser?.name})</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.card,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 40,
  },
  customerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.base,
  },
  customerBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginLeft: 6,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  roleIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  customerIndicator: {
    backgroundColor: COLORS.primary,
  },
  adminIndicator: {
    backgroundColor: COLORS.danger,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  customerRoleTag: {
    backgroundColor: COLORS.primaryMuted,
  },
  adminRoleTag: {
    backgroundColor: COLORS.dangerLight,
  },
  roleTagText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerRoleTagText: {
    color: COLORS.primaryDark,
  },
  adminRoleTagText: {
    color: COLORS.dangerDark,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
    ...SHADOWS.sm,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  adminNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginTop: 4,
  },
  adminNoteText: {
    fontSize: 11,
    color: COLORS.dangerDark,
    marginLeft: 6,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  statsSummaryGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statsGridItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  gridItemValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  gridItemLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.danger,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },
});
