import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export const CategoryCard = ({ category, onPress }) => {
  const { currentUser } = useAuth();
  const currency = currentUser?.currencySymbol || '₹';

  const isOverBudget = category.isOverBudget;
  const progressPercent = Math.min(100, category.budgetProgress || 0);

  return (
    <TouchableOpacity
      style={[styles.card, SHADOWS.sm]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: category.bgColor || '#F1F5F9' },
          ]}
        >
          <Ionicons
            name={category.icon || 'folder-outline'}
            size={24}
            color={category.color || COLORS.primary}
          />
        </View>

        <View style={styles.titleArea}>
          <Text style={styles.name} numberOfLines={1}>
            {category.name}
          </Text>
          <Text style={styles.countText}>
            {category.transactionCount || 0} transaction{category.transactionCount === 1 ? '' : 's'}
          </Text>
        </View>

        <View style={styles.amountArea}>
          <Text style={styles.amountText}>
            {currency}
            {(category.totalSpent || 0).toLocaleString()}
          </Text>
          <View style={styles.percentBadge}>
            <Text style={styles.percentText}>{category.percentage || 0}%</Text>
          </View>
        </View>
      </View>

      {/* Budget Progress Bar */}
      {category.budget > 0 && (
        <View style={styles.budgetSection}>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>
              Budget: {currency}
              {category.budget.toLocaleString()}
            </Text>
            {isOverBudget ? (
              <Text style={styles.overBudget}>Over Budget!</Text>
            ) : (
              <Text style={styles.budgetRemaining}>
                {currency}
                {Math.max(0, category.budget - category.totalSpent).toLocaleString()} left
              </Text>
            )}
          </View>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: isOverBudget ? COLORS.danger : category.color || COLORS.primary,
                },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.viewDetailsText}>View Category Details & Transactions</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  titleArea: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  countText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  amountArea: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  percentBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  budgetSection: {
    marginBottom: SPACING.md,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  budgetLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  budgetRemaining: {
    fontSize: 11,
    color: COLORS.successDark,
    fontWeight: '600',
  },
  overBudget: {
    fontSize: 11,
    color: COLORS.danger,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
