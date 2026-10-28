import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';
import { CustomHeader } from '../../components/CustomHeader';
import { TransactionCard } from '../../components/TransactionCard';
import { PersonalizedAlert } from '../../components/PersonalizedAlert';

export const TransactionScreen = ({ navigation }) => {
  const { currentUser, isCustomer } = useAuth();
  const {
    availableMonths,
    getTransactionsForMonth,
    deleteTransaction,
  } = useBudget();
  const currency = currentUser?.currencySymbol || '₹';

  // Selected month index (default 0 = latest, which is October 2026)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'expense' | 'income'

  const activeMonthObj = availableMonths[selectedMonthIndex] || availableMonths[0] || {
    key: '2026-10',
    label: 'October 2026',
  };

  const monthTransactions = getTransactionsForMonth(activeMonthObj.key);

  // Filter by type
  const filteredTransactions = monthTransactions.filter(t => {
    if (typeFilter === 'all') return true;
    return t.type === typeFilter;
  });

  // Calculate monthly metrics
  let monthIncome = 0;
  let monthExpense = 0;
  monthTransactions.forEach(t => {
    if (t.type === 'income') monthIncome += Number(t.amount);
    else monthExpense += Number(t.amount);
  });
  const monthNet = monthIncome - monthExpense;

  const handlePrevMonth = () => {
    if (selectedMonthIndex < availableMonths.length - 1) {
      setSelectedMonthIndex(selectedMonthIndex + 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex > 0) {
      setSelectedMonthIndex(selectedMonthIndex - 1);
    }
  };

  const confirmDelete = (tx) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${tx.title}" (${currency}${tx.amount})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(tx.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Month-wise Transactions"
        subtitle={isCustomer ? 'Customer Ledger' : 'All Accounts Ledger'}
        navigation={navigation}
        rightIcon="add-circle"
        onRightPress={() => navigation.navigate('AddEditTransaction')}
      />

      <PersonalizedAlert />

      <View style={styles.container}>
        {/* Month Navigation Selector Bar */}
        <View style={[styles.monthSelectorBar, SHADOWS.sm]}>
          <TouchableOpacity
            style={[
              styles.arrowButton,
              selectedMonthIndex >= availableMonths.length - 1 && styles.arrowDisabled,
            ]}
            onPress={handlePrevMonth}
            disabled={selectedMonthIndex >= availableMonths.length - 1}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={
                selectedMonthIndex >= availableMonths.length - 1
                  ? COLORS.textLight
                  : COLORS.textPrimary
              }
            />
          </TouchableOpacity>

          <View style={styles.monthLabelContainer}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.monthLabelText}>{activeMonthObj.label}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.arrowButton,
              selectedMonthIndex <= 0 && styles.arrowDisabled,
            ]}
            onPress={handleNextMonth}
            disabled={selectedMonthIndex <= 0}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={selectedMonthIndex <= 0 ? COLORS.textLight : COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Month Summary Bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>
              +{currency}
              {monthIncome.toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryValue, { color: COLORS.danger }]}>
              -{currency}
              {monthExpense.toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Net Flow</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: monthNet >= 0 ? COLORS.primaryDark : COLORS.dangerDark },
              ]}
            >
              {monthNet >= 0 ? '+' : '-'}
              {currency}
              {Math.abs(monthNet).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Filter Tabs: All, Expense, Income */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.typeTab,
              typeFilter === 'all' && styles.typeTabActive,
            ]}
            onPress={() => setTypeFilter('all')}
          >
            <Text
              style={[
                styles.typeTabText,
                typeFilter === 'all' && styles.typeTabTextActive,
              ]}
            >
              All ({monthTransactions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeTab,
              typeFilter === 'expense' && styles.typeTabActive,
            ]}
            onPress={() => setTypeFilter('expense')}
          >
            <Text
              style={[
                styles.typeTabText,
                typeFilter === 'expense' && styles.typeTabTextActive,
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeTab,
              typeFilter === 'income' && styles.typeTabActive,
            ]}
            onPress={() => setTypeFilter('income')}
          >
            <Text
              style={[
                styles.typeTabText,
                typeFilter === 'income' && styles.typeTabTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List with Empty State */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredTransactions.length === 0 ? (
            <View style={[styles.emptyCard, SHADOWS.sm]}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="folder-open-outline" size={40} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Transactions Recorded</Text>
              <Text style={styles.emptySubtitle}>
                No {typeFilter !== 'all' ? typeFilter : ''} transactions found for{' '}
                {activeMonthObj.label}. You can record a new transaction anytime.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => navigation.navigate('AddEditTransaction')}
              >
                <Ionicons name="add" size={18} color={COLORS.white} />
                <Text style={styles.emptyAddButtonText}>Add New Transaction</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredTransactions.map(tx => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                showActions={true}
                onPress={() =>
                  navigation.navigate('AddEditTransaction', { transaction: tx })
                }
                onDelete={() => confirmDelete(tx)}
              />
            ))
          )}
        </ScrollView>

        {/* Floating Add Transaction Button */}
        <TouchableOpacity
          style={[styles.fab, SHADOWS.lg]}
          onPress={() => navigation.navigate('AddEditTransaction')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={26} color={COLORS.white} />
          <Text style={styles.fabText}>Add</Text>
        </TouchableOpacity>
      </View>
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
  monthSelectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    opacity: 0.4,
  },
  monthLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthLabelText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 22,
    backgroundColor: COLORS.borderLight,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  typeTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  typeTabTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.base,
    paddingBottom: 90,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: SPACING.lg,
    lineHeight: 18,
    maxWidth: 260,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  emptyAddButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
});
