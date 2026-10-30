import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { CustomHeader } from '../../components/CustomHeader';
import { PersonalizedAlert } from '../../components/PersonalizedAlert';

export const AnalysisScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { transactions, availableMonths } = useBudget();
  const currency = currentUser?.currencySymbol || '₹';

  // Filter States
  const [periodFilter, setPeriodFilter] = useState('all'); // 'all', 'today', 'week', '2026-10', '2026-09', '2026-08'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'expense', 'income'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' or category id ('food', 'travel', etc.)
  const [sortBy, setSortBy] = useState('amount_desc'); // 'amount_desc', 'date_desc', 'amount_asc'
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Reference today date in sample data: 2026-10-28
  const todayStr = '2026-10-28';

  // Filter transactions based on active filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Period Filter
      if (periodFilter === 'today') {
        if (t.date !== todayStr) return false;
      } else if (periodFilter === 'week') {
        // 7-day window: 2026-10-22 to 2026-10-28
        if (t.date < '2026-10-22' || t.date > todayStr) return false;
      } else if (periodFilter !== 'all') {
        // Specific month key (e.g., '2026-10')
        if (!t.date.startsWith(periodFilter)) return false;
      }

      // 2. Type Filter
      if (typeFilter !== 'all' && t.type !== typeFilter) {
        return false;
      }

      // 3. Category Filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'amount_desc') return Number(b.amount) - Number(a.amount);
      if (sortBy === 'amount_asc') return Number(a.amount) - Number(b.amount);
      return b.date.localeCompare(a.date);
    });
  }, [transactions, periodFilter, typeFilter, selectedCategory, sortBy]);

  // Compute stats on the filtered transactions
  const activeStats = useMemo(() => {
    let inc = 0;
    let exp = 0;

    filteredTransactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') inc += amt;
      else exp += amt;
    });

    const balance = inc - exp;
    const savingsRate = inc > 0 ? Math.max(0, Math.round(((inc - exp) / inc) * 100)) : 0;

    return {
      income: inc,
      expense: exp,
      balance,
      savingsRate,
      totalCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Compute category breakdown accurately for filtered transactions
  const activeCategoryBreakdown = useMemo(() => {
    const totalExp = activeStats.expense || 1;
    const catMap = new Map();

    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const prev = catMap.get(t.category) || 0;
        catMap.set(t.category, prev + Number(t.amount));
      });

    const list = [];
    catMap.forEach((spent, catId) => {
      const catDef = DEFAULT_CATEGORIES.find(c => c.id === catId) || {
        name: catId,
        icon: 'card-outline',
        color: COLORS.primary,
        bgColor: '#F1F5F9',
      };
      const percentage = Math.round((spent / totalExp) * 100);
      list.push({
        id: catId,
        name: catDef.name,
        icon: catDef.icon,
        color: catDef.color,
        bgColor: catDef.bgColor,
        totalSpent: spent,
        percentage,
      });
    });

    return list.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filteredTransactions, activeStats.expense]);

  const totalIncomeExpense = (activeStats.income + activeStats.expense) || 1;
  const incomePercent = Math.round((activeStats.income / totalIncomeExpense) * 100);
  const expensePercent = Math.round((activeStats.expense / totalIncomeExpense) * 100);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (periodFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (sortBy !== 'amount_desc') count++;
    return count;
  }, [periodFilter, typeFilter, selectedCategory, sortBy]);

  const resetFilters = () => {
    setPeriodFilter('all');
    setTypeFilter('all');
    setSelectedCategory('all');
    setSortBy('amount_desc');
  };

  const getPeriodLabel = (key) => {
    if (key === 'all') return 'All Time';
    if (key === 'today') return 'Today';
    if (key === 'week') return 'This Week';
    const found = availableMonths.find(m => m.key === key);
    return found ? found.label : key;
  };

  const getSelectedCatName = () => {
    if (selectedCategory === 'all') return 'All Categories';
    const found = DEFAULT_CATEGORIES.find(c => c.id === selectedCategory);
    return found ? found.name : selectedCategory;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Financial Analysis"
        subtitle="Income, Expenses & Filtered Insights"
        navigation={navigation}
        rightIcon="options-outline"
        onRightPress={() => setIsFilterModalVisible(true)}
      />

      <PersonalizedAlert />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Control Header & Active Filter Pills */}
        <View style={[styles.filterBarCard, SHADOWS.sm]}>
          <View style={styles.filterBarHeader}>
            <View style={styles.filterTitleArea}>
              <Ionicons name="filter" size={18} color={COLORS.primary} />
              <Text style={styles.filterBarTitle}>Active Filter Options</Text>
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount} active</Text>
                </View>
              )}
            </View>

            <View style={styles.filterButtonsRow}>
              {activeFilterCount > 0 && (
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.filterTriggerButton}
                onPress={() => setIsFilterModalVisible(true)}
              >
                <Ionicons name="funnel-outline" size={14} color={COLORS.white} />
                <Text style={styles.filterTriggerText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Flow Type Switcher: All, Expense, Income */}
          <View style={styles.typeSwitcher}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                typeFilter === 'all' && styles.typeOptionActive,
              ]}
              onPress={() => setTypeFilter('all')}
            >
              <Text
                style={[
                  styles.typeOptionText,
                  typeFilter === 'all' && styles.typeOptionTextActive,
                ]}
              >
                All Flow
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeOption,
                typeFilter === 'expense' && styles.typeOptionActiveExpense,
              ]}
              onPress={() => setTypeFilter('expense')}
            >
              <Ionicons
                name="arrow-down-circle"
                size={13}
                color={typeFilter === 'expense' ? COLORS.white : COLORS.danger}
              />
              <Text
                style={[
                  styles.typeOptionText,
                  typeFilter === 'expense' && styles.typeOptionTextActive,
                ]}
              >
                Expenses
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeOption,
                typeFilter === 'income' && styles.typeOptionActiveIncome,
              ]}
              onPress={() => setTypeFilter('income')}
            >
              <Ionicons
                name="arrow-up-circle"
                size={13}
                color={typeFilter === 'income' ? COLORS.white : COLORS.success}
              />
              <Text
                style={[
                  styles.typeOptionText,
                  typeFilter === 'income' && styles.typeOptionTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Time Period Quick Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.periodScroll}
            contentContainerStyle={styles.periodContainer}
          >
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today (28 Oct)' },
              { id: 'week', label: 'This Week' },
              ...availableMonths.map(m => ({ id: m.key, label: m.label })),
            ].map(period => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodPill,
                  periodFilter === period.id && styles.periodPillActive,
                ]}
                onPress={() => setPeriodFilter(period.id)}
              >
                <Text
                  style={[
                    styles.periodPillText,
                    periodFilter === period.id && styles.periodPillTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Applied Filter Chips Preview */}
          <View style={styles.appliedChipsRow}>
            <View style={styles.chipPill}>
              <Ionicons name="calendar-outline" size={12} color={COLORS.primary} />
              <Text style={styles.chipText}>{getPeriodLabel(periodFilter)}</Text>
            </View>

            <View style={styles.chipPill}>
              <Ionicons name="folder-outline" size={12} color={COLORS.primary} />
              <Text style={styles.chipText}>{getSelectedCatName()}</Text>
            </View>

            <View style={styles.chipPill}>
              <Ionicons name="swap-vertical-outline" size={12} color={COLORS.primary} />
              <Text style={styles.chipText}>
                {typeFilter === 'all' ? 'All Types' : typeFilter === 'expense' ? 'Expenses' : 'Income'}
              </Text>
            </View>

            <Text style={styles.matchingRecordsText}>
              ({filteredTransactions.length} records)
            </Text>
          </View>
        </View>

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
            Ratio of money earned against money spent for selected filter
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

        {/* Filtered Category Expense Breakdown */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.cardHeaderTitle}>Category Expense Breakdown</Text>
              <Text style={styles.cardHeaderSubtitle}>
                Filtered spending by category
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}>
              <Text style={styles.linkText}>See All</Text>
            </TouchableOpacity>
          </View>

          {activeCategoryBreakdown.length === 0 ? (
            <View style={styles.emptyFilterBox}>
              <Ionicons name="search-outline" size={28} color={COLORS.textMuted} />
              <Text style={styles.noDataText}>
                No expenses found matching the current filter criteria.
              </Text>
            </View>
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

        {/* Matching Filtered Transactions Preview List */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.cardHeaderTitle}>Filtered Records Preview</Text>
              <Text style={styles.cardHeaderSubtitle}>
                Transactions matching current filter ({filteredTransactions.length})
              </Text>
            </View>
          </View>

          {filteredTransactions.length === 0 ? (
            <Text style={styles.noDataText}>No transactions match this filter.</Text>
          ) : (
            filteredTransactions.slice(0, 5).map(t => {
              const isInc = t.type === 'income';
              return (
                <View key={t.id} style={styles.txRow}>
                  <View style={styles.txLeft}>
                    <Text style={styles.txTitle} numberOfLines={1}>{t.title}</Text>
                    <Text style={styles.txDate}>{t.date} • {t.category}</Text>
                  </View>
                  <Text style={[styles.txAmount, isInc ? styles.txIncome : styles.txExpense]}>
                    {isInc ? '+' : '-'} {currency}{Number(t.amount).toLocaleString()}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Monthly Trend Comparison */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <Text style={styles.cardHeaderTitle}>Monthly Spending Comparison</Text>
          <Text style={styles.cardHeaderSubtitle}>
            Overview of spending across available recorded months
          </Text>

          {availableMonths.map(month => {
            const mTx = transactions.filter(t => t.date.startsWith(month.key));
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

      {/* COMPREHENSIVE FILTER MODAL */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="options" size={20} color={COLORS.primary} />
                <Text style={styles.modalTitle}>Filter Analysis</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* 1. Time Range Section */}
              <Text style={styles.modalSectionLabel}>1. Select Time Range</Text>
              <View style={styles.modalPillGrid}>
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'today', label: 'Today (28 Oct)' },
                  { id: 'week', label: 'This Week' },
                  ...availableMonths.map(m => ({ id: m.key, label: m.label })),
                ].map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.modalOptionPill,
                      periodFilter === p.id && styles.modalOptionPillActive,
                    ]}
                    onPress={() => setPeriodFilter(p.id)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        periodFilter === p.id && styles.modalOptionTextActive,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 2. Flow Type Section */}
              <Text style={styles.modalSectionLabel}>2. Transaction Flow</Text>
              <View style={styles.modalPillGrid}>
                {[
                  { id: 'all', label: 'All Transactions' },
                  { id: 'expense', label: 'Expenses Only (-)' },
                  { id: 'income', label: 'Income Only (+)' },
                ].map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.modalOptionPill,
                      typeFilter === item.id && styles.modalOptionPillActive,
                    ]}
                    onPress={() => setTypeFilter(item.id)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        typeFilter === item.id && styles.modalOptionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 3. Category Filter Section */}
              <Text style={styles.modalSectionLabel}>3. Filter by Category</Text>
              <View style={styles.modalPillGrid}>
                <TouchableOpacity
                  style={[
                    styles.modalOptionPill,
                    selectedCategory === 'all' && styles.modalOptionPillActive,
                  ]}
                  onPress={() => setSelectedCategory('all')}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedCategory === 'all' && styles.modalOptionTextActive,
                    ]}
                  >
                    All Categories
                  </Text>
                </TouchableOpacity>

                {DEFAULT_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.modalOptionPill,
                      selectedCategory === cat.id && {
                        backgroundColor: cat.bgColor || COLORS.surface,
                        borderColor: cat.color,
                      },
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={14}
                      color={selectedCategory === cat.id ? cat.color : COLORS.textMuted}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedCategory === cat.id && {
                          color: cat.color,
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {cat.shortName || cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 4. Sort By Section */}
              <Text style={styles.modalSectionLabel}>4. Sort Records</Text>
              <View style={styles.modalPillGrid}>
                {[
                  { id: 'amount_desc', label: 'Highest Amount First' },
                  { id: 'date_desc', label: 'Newest Date First' },
                  { id: 'amount_asc', label: 'Lowest Amount First' },
                ].map(s => (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.modalOptionPill,
                      sortBy === s.id && styles.modalOptionPillActive,
                    ]}
                    onPress={() => setSortBy(s.id)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        sortBy === s.id && styles.modalOptionTextActive,
                      ]}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalResetBtn} onPress={resetFilters}>
                <Text style={styles.modalResetBtnText}>Reset All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={() => setIsFilterModalVisible(false)}
              >
                <Text style={styles.modalApplyBtnText}>
                  Apply Filters ({filteredTransactions.length} records)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  filterBarCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  filterTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterBarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  filterBadge: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resetButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
  },
  filterTriggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  filterTriggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: SPACING.sm,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  typeOptionActive: {
    backgroundColor: COLORS.primary,
  },
  typeOptionActiveExpense: {
    backgroundColor: COLORS.danger,
  },
  typeOptionActiveIncome: {
    backgroundColor: COLORS.success,
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  typeOptionTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  periodScroll: {
    marginBottom: SPACING.sm,
  },
  periodContainer: {
    gap: 6,
  },
  periodPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodPillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  appliedChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  chipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  chipText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  matchingRecordsText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
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
  emptyFilterBox: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: 6,
  },
  noDataText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  txLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  txDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  txIncome: {
    color: COLORS.success,
  },
  txExpense: {
    color: COLORS.danger,
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: SPACING.base,
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 6,
  },
  modalPillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  modalOptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalOptionPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalOptionTextActive: {
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  modalResetBtn: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalResetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  modalApplyBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
});
