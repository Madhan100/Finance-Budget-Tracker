import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export const CustomDrawerContent = ({ navigation, state }) => {
  const { currentUser, isAdmin, isCustomer, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out? Your session will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            navigation.closeDrawer();
            logout();
          },
        },
      ]
    );
  };

  const navigateTo = (screenName) => {
    navigation.closeDrawer();
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      {/* Drawer Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
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
              styles.roleDot,
              isAdmin ? styles.adminDot : styles.customerDot,
            ]}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {currentUser?.name || 'User'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {currentUser?.email || 'user@example.com'}
          </Text>

          <View
            style={[
              styles.roleBadge,
              isAdmin ? styles.adminBadge : styles.customerBadge,
            ]}
          >
            <Ionicons
              name={isAdmin ? 'shield-checkmark' : 'person'}
              size={11}
              color={isAdmin ? '#B91C1C' : COLORS.primaryDark}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.roleText,
                isAdmin ? styles.adminRoleText : styles.customerRoleText,
              ]}
            >
              {currentUser?.role || 'Guest'} Role
            </Text>
          </View>
        </View>
      </View>

      {/* Navigation Links */}
      <ScrollView
        style={styles.menuList}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>MAIN NAVIGATION</Text>

        {/* 1. Home - Available to Both Admin and Customer */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('HomeTab')}
        >
          <View style={[styles.menuIconBox, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="home-outline" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.menuLabel}>Home</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* 2. Analysis - Available to Both Admin and Customer */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('AnalysisTab')}
        >
          <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="pie-chart-outline" size={20} color={COLORS.success} />
          </View>
          <Text style={styles.menuLabel}>Analysis</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* CUSTOMER-ONLY NAVIGATION ITEMS */}
        {isCustomer && (
          <>
            {/* 3. Month-wise Transactions */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('TransactionsTab')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="calendar-outline" size={20} color="#0284C7" />
              </View>
              <Text style={styles.menuLabel}>Month Transactions</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* 4. Overall Categories */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('CategoriesTab')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="grid-outline" size={20} color="#DB2777" />
              </View>
              <Text style={styles.menuLabel}>Categories</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* 5. Profile & Edit Profile */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('ProfileTab')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="person-circle-outline" size={20} color="#D97706" />
              </View>
              <Text style={styles.menuLabel}>Profile & Settings</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          </>
        )}

        {/* ADMIN-SPECIFIC ITEMS */}
        {isAdmin && (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('TransactionsTab')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="server-outline" size={20} color="#0284C7" />
              </View>
              <Text style={styles.menuLabel}>All System Records</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('CategoriesTab')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="layers-outline" size={20} color="#DB2777" />
              </View>
              <Text style={styles.menuLabel}>Categories Manager</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          </>
        )}

      </ScrollView>

      {/* Drawer Footer with Logout */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sign Out ({currentUser?.role})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  profileHeader: {
    paddingHorizontal: SPACING.base,
    paddingTop: 55,
    paddingBottom: SPACING.base,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  roleDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  adminDot: {
    backgroundColor: COLORS.danger,
  },
  customerDot: {
    backgroundColor: COLORS.success,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  customerBadge: {
    backgroundColor: '#1E293B',
  },
  adminBadge: {
    backgroundColor: '#450A0A',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  customerRoleText: {
    color: '#38BDF8',
  },
  adminRoleText: {
    color: '#F87171',
  },
  menuList: {
    flex: 1,
  },
  menuContent: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: 4,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  footer: {
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.card,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  logoutText: {
    marginLeft: SPACING.sm,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dangerDark,
  },
});
