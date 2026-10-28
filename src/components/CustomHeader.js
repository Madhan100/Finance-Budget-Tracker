import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export const CustomHeader = ({
  title,
  subtitle,
  navigation,
  showBack = false,
  rightAction,
  rightIcon,
  onRightPress,
}) => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.openDrawer()}
            accessibilityLabel="Open menu"
          >
            <Ionicons name="menu-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightContainer}>
        {rightAction ? (
          rightAction
        ) : rightIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
            <Ionicons name={rightIcon} size={22} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.roleBadge,
              isAdmin ? styles.adminBadge : styles.customerBadge,
            ]}
          >
            <Ionicons
              name={isAdmin ? 'shield-checkmark' : 'person'}
              size={12}
              color={isAdmin ? '#B91C1C' : COLORS.primaryDark}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.roleText,
                isAdmin ? styles.adminRoleText : styles.customerRoleText,
              ]}
            >
              {currentUser?.role || 'Guest'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  customerBadge: {
    backgroundColor: COLORS.primaryMuted,
  },
  adminBadge: {
    backgroundColor: COLORS.dangerLight,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerRoleText: {
    color: COLORS.primaryDark,
  },
  adminRoleText: {
    color: COLORS.dangerDark,
  },
});
