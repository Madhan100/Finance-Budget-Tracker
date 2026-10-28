import React from 'react';
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
import { CategoryCard } from '../../components/CategoryCard';
import { PersonalizedAlert } from '../../components/PersonalizedAlert';

export const CategoriesScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { categoryStats, totals } = useBudget();
  const currency = currentUser?.currencySymbol || '₹';

  // Only expense categories per requirement: Food, Travel, Shopping, Bills, Entertainment, etc.
  const expenseCategories = categoryStats.filter(c => c.type === 'expense');

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Overall Categories"
        subtitle="Expense Classification & Limits"
        navigation={navigation}
      />

      <PersonalizedAlert />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Category Overview Banner */}
        <View style={[styles.overviewBanner, SHADOWS.sm]}>
          <View style={styles.bannerHeader}>
            <View>
              <Text style={styles.bannerTitle}>Expense Allocation</Text>
              <Text style={styles.bannerSubtitle}>
                {expenseCategories.length} active spending categories configured
              </Text>
            </View>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>
                {currency}
                {totals.expense.toLocaleString()} Total Outflow
              </Text>
            </View>
          </View>

          <Text style={styles.bannerDescription}>
            Select any category card below to inspect its itemized transactions, dates,
            amounts, and detailed spending trend.
          </Text>
        </View>

        {/* Section Title */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeading}>Categories Breakdown</Text>
          <Text style={styles.listSubheading}>Sorted by budget allocation</Text>
        </View>

        {/* Category Cards List */}
        {expenseCategories.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onPress={() =>
              navigation.navigate('CategoryDetails', {
                categoryId: cat.id,
                categoryName: cat.name,
              })
            }
          />
        ))}
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
  overviewBanner: {
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  bannerBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  bannerDescription: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  listHeaderRow: {
    marginBottom: SPACING.md,
  },
  listHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  listSubheading: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
});
