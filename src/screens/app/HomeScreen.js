import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';
import { CustomHeader } from '../../components/CustomHeader';
import { ReportSummaryCard } from '../../components/ReportSummaryCard';
import { TransactionCard } from '../../components/TransactionCard';
import { PersonalizedAlert } from '../../components/PersonalizedAlert';

export const HomeScreen = ({ navigation }) => {
  const { currentUser, isAdmin, isCustomer } = useAuth();
  const { totals, transactions, deleteTransaction } = useBudget();
  const currency = currentUser?.currencySymbol || '₹';

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="FinTrack Pro"
        subtitle={`Welcome back, ${currentUser?.name || 'User'}`}
        navigation={navigation}
      />

      <PersonalizedAlert />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card: Total Balance with Gradient */}
        <LinearGradient
          colors={isAdmin ? ['#1E293B', '#0F172A'] : COLORS.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, SHADOWS.md]}
        >
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroSubLabel}>
                {isAdmin ? 'System Portfolio Overview' : 'Total Available Balance'}
              </Text>
              <Text style={styles.heroBalance}>
                {currency}
                {totals.balance.toLocaleString()}
              </Text>
            </View>

            <View style={styles.heroRoleBadge}>
              <Ionicons
                name={isAdmin ? 'shield-checkmark' : 'wallet-outline'}
                size={14}
                color={COLORS.white}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.heroRoleText}>{currentUser?.role}</Text>
            </View>
          </View>

          {/* Income & Expense Breakdown in Hero */}
          <View style={styles.heroBreakdownRow}>
            <View style={styles.heroStatItem}>
              <View style={[styles.heroStatIcon, { backgroundColor: 'rgba(16, 185, 129, 0.25)' }]}>
                <Ionicons name="arrow-down" size={16} color="#34D399" />
              </View>
              <View>
                <Text style={styles.heroStatLabel}>Income</Text>
                <Text style={styles.heroStatValue}>
                  +{currency}
                  {totals.income.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroStatItem}>
              <View style={[styles.heroStatIcon, { backgroundColor: 'rgba(239, 68, 68, 0.25)' }]}>
                <Ionicons name="arrow-up" size={16} color="#F87171" />
              </View>
              <View>
                <Text style={styles.heroStatLabel}>Expenses</Text>
                <Text style={styles.heroStatValue}>
                  -{currency}
                  {totals.expense.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Action Navigation Grid */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Navigation</Text>
          <View style={styles.quickGrid}>
            {/* Add Transaction Button */}
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => navigation.navigate('AddEditTransaction')}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="add" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.quickButtonLabel}>Add Record</Text>
            </TouchableOpacity>

            {/* Analysis Screen */}
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => navigation.navigate('AnalysisTab')}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="pie-chart" size={22} color={COLORS.success} />
              </View>
              <Text style={styles.quickButtonLabel}>Analysis</Text>
            </TouchableOpacity>

            {/* Month Transactions */}
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => navigation.navigate('TransactionsTab')}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="calendar" size={22} color="#0284C7" />
              </View>
              <Text style={styles.quickButtonLabel}>Months</Text>
            </TouchableOpacity>

            {/* Categories */}
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => navigation.navigate('CategoriesTab')}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="grid" size={22} color="#DB2777" />
              </View>
              <Text style={styles.quickButtonLabel}>Categories</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily, Weekly, and Monthly Reports Section (Part III & Screen 1) */}
        <View style={styles.reportSection}>
          <ReportSummaryCard />
        </View>

        {/* Admin System Management Insight Card if Admin */}
        {isAdmin && (
          <View style={[styles.adminBanner, SHADOWS.sm]}>
            <View style={styles.adminBannerHeader}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.dangerDark} />
              <Text style={styles.adminBannerTitle}>Admin Control Console</Text>
            </View>
            <Text style={styles.adminBannerText}>
              Logged in as <Text style={{ fontWeight: '700' }}>{currentUser?.name}</Text> (Super Admin).
              You have full supervisory access over all user transactions, report metrics, and categories.
            </Text>
            <View style={styles.adminStatsRow}>
              <View style={styles.adminStatChip}>
                <Text style={styles.adminStatNumber}>{transactions.length}</Text>
                <Text style={styles.adminStatLabel}>Total Records</Text>
              </View>
              <View style={styles.adminStatChip}>
                <Text style={styles.adminStatNumber}>{totals.savingsRate}%</Text>
                <Text style={styles.adminStatLabel}>System Health</Text>
              </View>
              <View style={styles.adminStatChip}>
                <Text style={styles.adminStatNumber}>Active</Text>
                <Text style={styles.adminStatLabel}>Audit Status</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Transactions List Preview */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionsTab')}>
              <Text style={styles.viewAllText}>View All ({transactions.length})</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={36} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Transactions Yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the "+ Add Record" button above to record your first income or expense.
              </Text>
            </View>
          ) : (
            recentTransactions.map(item => (
              <TransactionCard
                key={item.id}
                transaction={item}
                onPress={() =>
                  navigation.navigate('AddEditTransaction', { transaction: item })
                }
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
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.base,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  heroSubLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  heroBalance: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  heroRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  heroRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  heroBreakdownRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  heroStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  heroStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  heroStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  heroDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: SPACING.sm,
  },
  quickActionsContainer: {
    marginBottom: SPACING.base,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickIconCircle: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    ...SHADOWS.sm,
  },
  quickButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  reportSection: {
    marginBottom: SPACING.sm,
  },
  adminBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
  },
  adminBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  adminBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dangerDark,
    marginLeft: 6,
  },
  adminBannerText: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  adminStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
    paddingTop: SPACING.sm,
  },
  adminStatChip: {
    alignItems: 'center',
  },
  adminStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dangerDark,
  },
  adminStatLabel: {
    fontSize: 10,
    color: '#991B1B',
    marginTop: 2,
  },
  recentSection: {
    marginTop: SPACING.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
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
    maxWidth: 240,
  },
});
