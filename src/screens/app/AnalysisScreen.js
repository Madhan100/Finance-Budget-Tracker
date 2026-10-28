import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';
import { CustomHeader } from '../../components/CustomHeader';
import { PersonalizedAlert } from '../../components/PersonalizedAlert';

export const AnalysisScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { totals, categoryStats, availableMonths, getTransactionsForMonth } = useBudget();
  const currency = currentUser?.currencySymbol || '₹';

  // Filter mode: 'all' or specific month key (e.g. '2026-10')
  const [filterMode, setFilterMode] = useState('all');

  // Compute filtered stats if a specific month is selected
  const activeStats = React.useMemo(() => {
    if (filterMode === 'all') {
      return totals;
    }
    const monthTx = getTransactionsForMonth(filterMode);
    let inc = 0;
    let exp = 0;
    monthTx.forEach(t => {
      if (t.type === 'income') inc += Number(t.amount);
      else exp += Number(t.amount);
    });
    return {
      income: inc,
      expense: exp,
      balance: inc - exp,
      savingsRate: inc > 0 ? Math.max(0, Math.round(((inc - exp) / inc) * 100)) : 0,
      totalCount: monthTx.length,
    };
  }, [filterMode, totals, getTransactionsForMonth]);

  // Compute category breakdown for the selected scope
  const activeCategoryBreakdown = React.useMemo(() => {
    const totalExp = activeStats.expense || 1;
    return categoryStats
      .filter(c => c.type === 'expense' && c.totalSpent > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [categoryStats, activeStats.expense]);

  const totalIncomeExpense = (activeStats.income + activeStats.expense) || 1;
  const incomePercent = Math.round((activeStats.income / totalIncomeExpense) * 100);
  const expensePercent = Math.round((activeStats.expense / totalIncomeExpense) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Financial Analysis"
        subtitle="Income, Expenses & Budget Insights"
        navigation={navigation}
      />

      <PersonalizedAlert />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Scope Filter Pills: All Time vs Months */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              filterMode === 'all' && styles.filterPillActive,
            ]}
            onPress={() => setFilterMode('all')}
          >
            <Text
              style={[
                styles.filterPillText,
                filterMode === 'all' && styles.filterPillTextActive,
              ]}
            >
              Overall All Time
            </Text>
          </TouchableOpacity>

          {availableMonths.map(m => (
            <TouchableOpacity
              key={m.key}
              style={[
                styles.filterPill,
                filterMode === m.key && styles.filterPillActive,
              ]}
              onPress={() => setFilterMode(m.key)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterMode === m.key && styles.filterPillTextActive,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 3 Main Required Cards: Total Income, Total Expenses, Current Balance */}
        <View style={styles.cardsGrid}>
          {/* 1. Total Income Card */}
          <View style={[styles.statCard, SHADOWS.sm]}>
            <View style={styles.statCardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="arrow-down-circle" size={20} color={COLORS.success} />
              </View>
              <Text style={styles.statCardBadge}>Total Inflow</Text>
            </View>
            <Text style={styles.statCardLabel}>Total Income</Text>
            <Text style={[styles.statCardValue, { color: COLORS.success }]}>
              +{currency}
              {activeStats.income.toLocaleString()}
            </Text>
          </View>

          {/* 2. Total Expense Card */}
          <View style={[styles.statCard, SHADOWS.sm]}>
            <View style={styles.statCardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="arrow-up-circle" size={20} color={COLORS.danger} />
              </View>
              <Text style={styles.statCardBadge}>Total Outflow</Text>
            </View>
            <Text style={styles.statCardLabel}>Total Expenses</Text>
            <Text style={[styles.statCardValue, { color: COLORS.danger }]}>
              -{currency}
              {activeStats.expense.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* 3. Current Balance Card */}
        <View style={[styles.balanceCard, SHADOWS.md]}>
          <View style={styles.balanceLeft}>
            <Text style={styles.balanceLabel}>Current Net Balance</Text>
            <Text style={styles.balanceValue}>
              {currency}
              {activeStats.balance.toLocaleString()}
            </Text>
            <Text style={styles.balanceSubtext}>
              {activeStats.balance >= 0 ? 'Surplus Reserve Available' : 'Deficit Alert'}
            </Text>
          </View>

          <View style={styles.savingsRateBox}>
            <Text style={styles.savingsRateNumber}>{activeStats.savingsRate}%</Text>
            <Text style={styles.savingsRateLabel}>Savings Rate</Text>
          </View>
        </View>

        {/* Income vs Expense Ratio Visual Bar */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <Text style={styles.cardHeaderTitle}>Inflow vs Outflow Distribution</Text>
          <Text style={styles.cardHeaderSubtitle}>
            Ratio of money earned against money spent
          </Text>

          <View style={styles.ratioBarContainer}>
            <View style={[styles.ratioBarIncome, { flex: Math.max(0.01, incomePercent) }]} />
            <View style={[styles.ratioBarExpense, { flex: Math.max(0.01, expensePercent) }]} />
          </View>

          <View style={styles.ratioLabelsRow}>
            <View style={styles.ratioLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.legendText}>
                Income: {incomePercent}% ({currency}{activeStats.income.toLocaleString()})
              </Text>
            </View>

            <View style={styles.ratioLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
              <Text style={styles.legendText}>
                Expense: {expensePercent}% ({currency}{activeStats.expense.toLocaleString()})
              </Text>
            </View>
          </View>
        </View>

        {/* Category Expense Analysis */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.cardHeaderTitle}>Category Expense Breakdown</Text>
              <Text style={styles.cardHeaderSubtitle}>
                Spending distribution across categories
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}>
              <Text style={styles.linkText}>See All</Text>
            </TouchableOpacity>
          </View>

          {activeCategoryBreakdown.length === 0 ? (
            <Text style={styles.noDataText}>No expenses recorded for this selection.</Text>
          ) : (
            activeCategoryBreakdown.map(item => (
              <View key={item.id} style={styles.categoryRow}>
                <View style={styles.categoryRowTop}>
                  <View style={styles.categoryNameContainer}>
                    <View
                      style={[
                        styles.catMiniIcon,
                        { backgroundColor: item.bgColor || '#F1F5F9' },
                      ]}
                    >
                      <Ionicons
                        name={item.icon || 'card-outline'}
                        size={14}
                        color={item.color || COLORS.primary}
                      />
                    </View>
                    <Text style={styles.categoryNameText}>{item.name}</Text>
                  </View>

                  <View style={styles.categoryAmtContainer}>
                    <Text style={styles.categoryAmountText}>
                      {currency}
                      {item.totalSpent.toLocaleString()}
                    </Text>
                    <Text style={styles.categoryPercentText}>({item.percentage}%)</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.catProgressBg}>
                  <View
                    style={[
                      styles.catProgressFill,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: item.color || COLORS.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </View>

        {/* Monthly Trend Comparison */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <Text style={styles.cardHeaderTitle}>Monthly Spending Comparison</Text>
          <Text style={styles.cardHeaderSubtitle}>
            Overview of spending across available recorded months
          </Text>

          {availableMonths.map(month => {
            const mTx = getTransactionsForMonth(month.key);
            let mExp = 0;
            let mInc = 0;
            mTx.forEach(t => {
              if (t.type === 'expense') mExp += Number(t.amount);
              else mInc += Number(t.amount);
            });

            return (
              <View key={month.key} style={styles.monthCompItem}>
                <View style={styles.monthCompHeader}>
                  <Text style={styles.monthCompLabel}>{month.label}</Text>
                  <Text style={styles.monthCompNet}>
                    Net: {currency}
                    {(mInc - mExp).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.monthCompBars}>
                  <View style={styles.monthBarRow}>
                    <Text style={styles.barLabel}>Inc:</Text>
                    <Text style={[styles.barValue, { color: COLORS.success }]}>
                      +{currency}{mInc.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.monthBarRow}>
                    <Text style={styles.barLabel}>Exp:</Text>
                    <Text style={[styles.barValue, { color: COLORS.danger }]}>
                      -{currency}{mExp.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
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
  filterScroll: {
    marginBottom: SPACING.base,
  },
  filterContainer: {
    gap: SPACING.sm,
  },
  filterPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.white,
  },
  cardsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardBadge: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  statCardLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  balanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  balanceLeft: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
  },
  balanceSubtext: {
    fontSize: 11,
    color: '#38BDF8',
    marginTop: 4,
    fontWeight: '500',
  },
  savingsRateBox: {
    backgroundColor: '#1E293B',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  savingsRateNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
  },
  savingsRateLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardHeaderSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  ratioBarContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  ratioBarIncome: {
    backgroundColor: COLORS.success,
  },
  ratioBarExpense: {
    backgroundColor: COLORS.danger,
  },
  ratioLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratioLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryRow: {
    marginBottom: SPACING.md,
  },
  categoryRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catMiniIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  categoryNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  categoryAmtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  categoryPercentText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  catProgressBg: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  noDataText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  monthCompItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  monthCompHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  monthCompLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  monthCompNet: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  monthCompBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});
