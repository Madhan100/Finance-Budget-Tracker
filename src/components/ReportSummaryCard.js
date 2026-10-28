import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';

export const ReportSummaryCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const { reports } = useBudget();
  const { currentUser } = useAuth();
  const currency = currentUser?.currencySymbol || '₹';

  const currentReport = reports[selectedPeriod] || reports.daily;

  return (
    <View style={[styles.container, SHADOWS.sm]}>
      {/* Header with Title and Segmented Period Selector */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Financial Reports</Text>
          <Text style={styles.headerSubtitle}>{currentReport.label}</Text>
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedPeriod === 'daily' && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedPeriod('daily')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedPeriod === 'daily' && styles.segmentTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedPeriod === 'weekly' && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedPeriod('weekly')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedPeriod === 'weekly' && styles.segmentTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedPeriod === 'monthly' && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedPeriod('monthly')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedPeriod === 'monthly' && styles.segmentTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3 Metric Cards: Income, Expense, Balance */}
      <View style={styles.metricsRow}>
        {/* Income Box */}
        <View style={[styles.metricCard, { backgroundColor: '#ECFDF5' }]}>
          <View style={styles.metricIconRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="arrow-up" size={14} color={COLORS.success} />
            </View>
            <Text style={styles.metricLabel}>Income</Text>
          </View>
          <Text style={[styles.metricValue, { color: COLORS.successDark }]}>
            +{currency}
            {currentReport.income.toLocaleString()}
          </Text>
        </View>

        {/* Expense Box */}
        <View style={[styles.metricCard, { backgroundColor: '#FEF2F2' }]}>
          <View style={styles.metricIconRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="arrow-down" size={14} color={COLORS.danger} />
            </View>
            <Text style={styles.metricLabel}>Expense</Text>
          </View>
          <Text style={[styles.metricValue, { color: COLORS.dangerDark }]}>
            -{currency}
            {currentReport.expense.toLocaleString()}
          </Text>
        </View>

        {/* Net Savings / Balance Box */}
        <View style={[styles.metricCard, { backgroundColor: '#EEF2FF' }]}>
          <View style={styles.metricIconRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="wallet-outline" size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.metricLabel}>Net</Text>
          </View>
          <Text
            style={[
              styles.metricValue,
              {
                color:
                  currentReport.balance >= 0
                    ? COLORS.primaryDark
                    : COLORS.dangerDark,
              },
            ]}
          >
            {currentReport.balance >= 0 ? '+' : '-'}
            {currency}
            {Math.abs(currentReport.balance).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Footer hint */}
      <View style={styles.reportFooter}>
        <Ionicons name="stats-chart-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.reportFooterText}>
          {currentReport.count} transaction{currentReport.count === 1 ? '' : 's'} recorded for this period
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  header: {
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 3,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: RADIUS.sm - 2,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.card,
    ...SHADOWS.sm,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  segmentTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  metricCard: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.xs,
  },
  reportFooterText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
    fontStyle: 'italic',
  },
});
