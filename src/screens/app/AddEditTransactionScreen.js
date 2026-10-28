import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';
import { CustomHeader } from '../../components/CustomHeader';

export const AddEditTransactionScreen = ({ route, navigation }) => {
  const existingTx = route?.params?.transaction;
  const initialCategory = route?.params?.initialCategory;
  const isEditing = !!existingTx;

  const { currentUser } = useAuth();
  const { addTransaction, updateTransaction, deleteTransaction } = useBudget();
  const currency = currentUser?.currencySymbol || '₹';

  const [title, setTitle] = useState(existingTx?.title || '');
  const [amount, setAmount] = useState(existingTx ? existingTx.amount.toString() : '');
  const [type, setType] = useState(existingTx?.type || 'expense');
  const [category, setCategory] = useState(
    existingTx?.category || initialCategory || (type === 'expense' ? 'food' : 'salary')
  );
  const [date, setDate] = useState(
    existingTx?.date || new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState(
    existingTx?.paymentMethod || 'UPI / GPay'
  );
  const [notes, setNotes] = useState(existingTx?.notes || '');
  const [errors, setErrors] = useState({});

  // Filter categories based on transaction type
  const availableCategories = DEFAULT_CATEGORIES.filter(c => c.type === type);

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Transaction title is required.';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long.';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required.';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount.';
    }

    if (!date.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      newErrors.date = 'Date must be in YYYY-MM-DD format.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (isEditing) {
      updateTransaction(existingTx.id, {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        category,
        date: date.trim(),
        paymentMethod,
        notes: notes.trim(),
      });
    } else {
      addTransaction({
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        category,
        date: date.trim(),
        paymentMethod,
        notes: notes.trim(),
      });
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (!isEditing) return;

    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete "${existingTx.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(existingTx.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
        subtitle={isEditing ? 'Modify entry details' : 'Record new income or expense'}
        showBack={true}
        navigation={navigation}
        rightIcon={isEditing ? 'trash-outline' : null}
        onRightPress={isEditing ? handleDelete : null}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Income / Expense Switcher */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'expense' && styles.typeOptionActiveExpense,
              ]}
              onPress={() => {
                setType('expense');
                if (category === 'salary' || category === 'freelance' || category === 'investment') {
                  setCategory('food');
                }
              }}
            >
              <Ionicons
                name="arrow-down-circle"
                size={18}
                color={type === 'expense' ? COLORS.white : COLORS.danger}
              />
              <Text
                style={[
                  styles.typeOptionText,
                  type === 'expense' && styles.typeOptionTextActive,
                ]}
              >
                Expense (-)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'income' && styles.typeOptionActiveIncome,
              ]}
              onPress={() => {
                setType('income');
                setCategory('salary');
              }}
            >
              <Ionicons
                name="arrow-up-circle"
                size={18}
                color={type === 'income' ? COLORS.white : COLORS.success}
              />
              <Text
                style={[
                  styles.typeOptionText,
                  type === 'income' && styles.typeOptionTextActive,
                ]}
              >
                Income (+)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, SHADOWS.sm]}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Transaction Title *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.title ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="text-outline"
                  size={18}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Grocery Basket, Electricity Bill, Freelance..."
                  placeholderTextColor={COLORS.textMuted}
                  value={title}
                  onChangeText={t => {
                    setTitle(t);
                    setErrors(prev => ({ ...prev, title: null }));
                  }}
                />
              </View>
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount ({currency}) *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.amount ? styles.inputWrapperError : null,
                ]}
              >
                <Text style={styles.currencyPrefix}>{currency}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={t => {
                    setAmount(t);
                    setErrors(prev => ({ ...prev, amount: null }));
                  }}
                />
              </View>
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date (YYYY-MM-DD) *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.date ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="2026-10-28"
                  placeholderTextColor={COLORS.textMuted}
                  value={date}
                  onChangeText={t => {
                    setDate(t);
                    setErrors(prev => ({ ...prev, date: null }));
                  }}
                />
              </View>
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categoryGrid}>
                {availableCategories.map(cat => {
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catPill,
                        isSelected && {
                          borderColor: cat.color,
                          backgroundColor: cat.bgColor,
                        },
                      ]}
                      onPress={() => setCategory(cat.id)}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={16}
                        color={isSelected ? cat.color : COLORS.textMuted}
                      />
                      <Text
                        style={[
                          styles.catPillText,
                          isSelected && { color: cat.color, fontWeight: '700' },
                        ]}
                      >
                        {cat.shortName || cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.methodRow}>
                {['UPI / GPay', 'Card', 'Net Banking', 'Cash'].map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodPill,
                      paymentMethod === method && styles.methodPillActive,
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <Text
                      style={[
                        styles.methodText,
                        paymentMethod === method && styles.methodTextActive,
                      ]}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes / Remarks (Optional)</Text>
              <View style={[styles.inputWrapper, { height: 70, alignItems: 'flex-start' }]}>
                <TextInput
                  style={[styles.input, { height: 60, textAlignVertical: 'top', paddingTop: 8 }]}
                  placeholder="Additional transaction details..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                type === 'income' ? styles.saveButtonIncome : styles.saveButtonExpense,
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isEditing ? 'checkmark-circle' : 'add-circle'}
                size={20}
                color={COLORS.white}
              />
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Update Transaction' : 'Save Transaction'}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.card,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 40,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.base,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  typeOptionActiveExpense: {
    backgroundColor: COLORS.danger,
  },
  typeOptionActiveIncome: {
    backgroundColor: COLORS.success,
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  typeOptionTextActive: {
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  inputGroup: {
    marginBottom: SPACING.base,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  inputWrapperError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  catPillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  methodPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  methodText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  methodTextActive: {
    color: COLORS.white,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    gap: 8,
    ...SHADOWS.sm,
  },
  saveButtonExpense: {
    backgroundColor: COLORS.primary,
  },
  saveButtonIncome: {
    backgroundColor: COLORS.success,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: SPACING.sm,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
