import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { useAuth } from '../context/AuthContext';

export const TransactionCard = ({
  transaction,
  onPress,
  onDelete,
  showActions = false,
}) => {
  const { currentUser } = useAuth();
  const currency = currentUser?.currencySymbol || '₹';

  const categoryInfo =
    DEFAULT_CATEGORIES.find(c => c.id === transaction.category) || {
      name: transaction.category || 'General',
      icon: 'receipt-outline',
      color: COLORS.primary,
      bgColor: '#EEF2FF',
    };

  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity
      style={[styles.card, SHADOWS.sm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: categoryInfo.bgColor || '#F1F5F9' },
        ]}
      >
        <Ionicons
          name={categoryInfo.icon || 'card-outline'}
          size={22}
          color={categoryInfo.color || COLORS.primary}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        <View style={styles.subRow}>
          <Text style={styles.categoryName}>{categoryInfo.shortName || categoryInfo.name}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>{transaction.date}</Text>
        </View>
        {transaction.notes ? (
          <Text style={styles.notes} numberOfLines={1}>
            {transaction.notes}
          </Text>
        ) : null}
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            isIncome ? styles.incomeText : styles.expenseText,
          ]}
        >
          {isIncome ? '+' : '-'} {currency}
          {Number(transaction.amount).toLocaleString()}
        </Text>

        {showActions && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  details: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  dot: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginHorizontal: 4,
  },
  date: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  notes: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontStyle: 'italic',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  incomeText: {
    color: COLORS.success,
  },
  expenseText: {
    color: COLORS.danger,
  },
  deleteButton: {
    marginTop: 6,
    padding: 2,
  },
});
