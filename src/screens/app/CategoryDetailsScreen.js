import React from 'react';
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

export const CategoryDetailsScreen = ({ route, navigation }) => {
  const categoryId = route?.params?.categoryId || 'food';
  const { currentUser } = useAuth();
  const { getCategoryDetails, deleteTransaction } = useBudget();
  const currency = currentUser?.currencySymbol || '₹';

  const { category, transactions } = getCategoryDetails(categoryId);

  const totalSpent = category?.totalSpent || 0;
  const budget = category?.budget || 0;
  const isOverBudget = budget > 0 && totalSpent > budget;
  const progressPercent = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

  const confirmDelete = (tx) => {
    Alert.alert(
      'Delete Transaction',
      `Delete "${tx.title}" (${currency}${tx.amount})?`,
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
        title={category?.name || 'Category Details'}
        subtitle="Itemized Spending & History"
        showBack={true}
        navigation={navigation}
        rightIcon="add"
        onRightPress={() =>
          navigation.navigate('AddEditTransaction', { initialCategory: categoryId })
        }
      />

      <PersonalizedAlert />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Hero Header Card */}
        <View style={[styles.heroCard, SHADOWS.md]}>
          <View style={styles.heroTop}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: category?.bgColor || '#EEF2FF' },
              ]}
            >
              <Ionicons
                name={category?.icon || 'folder-outline'}
                size={32}
                color={category?.color || COLORS.primary}
              />
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.categoryName}>{category?.name}</Text>
              <Text style={styles.categoryDescription}>
                {category?.description || 'Tracked expense category'}
              </Text>
            </View>
          </View>

          {/* Total Spent Display */}
          <View style={styles.spendingRow}>
            <View>
              <Text style={styles.spendingLabel}>Total Category Spending</Text>
              <Text style={styles.spendingAmount}>
                {currency}
                {totalSpent.toLocaleString()}
              </Text>
            </View>

            <View style={styles.txCountBadge}>
              <Text style={styles.txCountText}>
                {transactions.length} record{transactions.length === 1 ? '' : 's'}
              </Text>
            </View>
          </View>

          {/* Budget Limit Progress Bar */}
          {budget > 0 && (
            <View style={styles.budgetBox}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetLabelText}>
                  Target Budget: {currency}
                  {budget.toLocaleString()}
                </Text>
                {isOverBudget ? (
                  <Text style={styles.overBudgetAlert}>⚠️ Exceeded by {currency}{(totalSpent - budget).toLocaleString()}</Text>
                ) : (
                  <Text style={styles.remainingBudget}>
                    {currency}
                    {(budget - totalSpent).toLocaleString()} available
                  </Text>
                )}
              </View>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercent}%`,
                      backgroundColor: isOverBudget ? COLORS.danger : (category?.color || COLORS.primary),
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Quick Action Button */}
          <TouchableOpacity
            style={[
              styles.addTxButton,
              { backgroundColor: category?.color || COLORS.primary },
            ]}
            onPress={() =>
              navigation.navigate('AddEditTransaction', { initialCategory: categoryId })
            }
          >
            <Ionicons name="add-circle" size={18} color={COLORS.white} />
            <Text style={styles.addTxButtonText}>Add {category?.shortName} Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category Transactions</Text>
            <Text style={styles.sectionSubtitle}>
              Itemized entries updated in real-time
            </Text>
          </View>

          {transactions.length === 0 ? (
            <View style={[styles.emptyCard, SHADOWS.sm]}>
              <Ionicons name="document-text-outline" size={38} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Entries Found</Text>
              <Text style={styles.emptySubtitle}>
                There are currently no transactions recorded under {category?.name}.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() =>
                  navigation.navigate('AddEditTransaction', { initialCategory: categoryId })
                }
              >
                <Text style={styles.emptyButtonText}>Add First Record</Text>
              </TouchableOpacity>
            </View>
          ) : (
            transactions.map(item => (
              <TransactionCard
                key={item.id}
                transaction={item}
                showActions={true}
                onPress={() =>
                  navigation.navigate('AddEditTransaction', { transaction: item })
                }
                onDelete={() => confirmDelete(item)}
              />
            ))
          )}
        </View>
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
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  heroInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.base,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  spendingLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  spendingAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  txCountBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  txCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  budgetBox: {
    marginBottom: SPACING.base,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  budgetLabelText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  remainingBudget: {
    fontSize: 12,
    color: COLORS.successDark,
    fontWeight: '700',
  },
  overBudgetAlert: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '700',
  },
  progressBg: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  addTxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 6,
    ...SHADOWS.sm,
  },
  addTxButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  listSection: {
    marginTop: SPACING.xs,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginTop: SPACING.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  emptyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
});
