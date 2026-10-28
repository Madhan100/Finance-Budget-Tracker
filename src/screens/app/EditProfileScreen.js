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
import { useAuth } from '../../context/AuthContext';
import { CustomHeader } from '../../components/CustomHeader';

export const EditProfileScreen = ({ navigation }) => {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [currencySymbol, setCurrencySymbol] = useState(currentUser?.currencySymbol || '₹');
  const [monthlyBudget, setMonthlyBudget] = useState(
    (currentUser?.monthlyBudget || 25000).toString()
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (phone.trim().length < 10) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits).';
    }

    if (!monthlyBudget.trim()) {
      newErrors.monthlyBudget = 'Monthly budget target is required.';
    } else if (isNaN(Number(monthlyBudget)) || Number(monthlyBudget) <= 0) {
      newErrors.monthlyBudget = 'Please enter a positive numeric budget amount.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const success = updateProfile({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      currencySymbol,
      monthlyBudget: parseFloat(monthlyBudget),
    });

    if (success) {
      Alert.alert(
        'Profile Updated',
        `Hi ${name.trim()}, your customer profile details have been saved and updated across the app.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Edit Profile"
        subtitle="Update Personal Information"
        showBack={true}
        navigation={navigation}
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
          {/* Note Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={18} color={COLORS.primary} />
            <Text style={styles.infoBannerText}>
              Any changes saved here will immediately update your name on the Home screen,
              side Drawer, and customer records.
            </Text>
          </View>

          <View style={[styles.formCard, SHADOWS.sm]}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={t => {
                    setName(t);
                    setErrors(prev => ({ ...prev, name: null }));
                  }}
                  placeholder="Your full name"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={t => {
                    setEmail(t);
                    setErrors(prev => ({ ...prev, email: null }));
                  }}
                  placeholder="Your email address"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.phone ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={t => {
                    setPhone(t);
                    setErrors(prev => ({ ...prev, phone: null }));
                  }}
                  placeholder="e.g. +91 98421 55678"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Currency Symbol Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Currency Symbol</Text>
              <View style={styles.currencyRow}>
                {['₹', '$', '€', '£'].map(sym => (
                  <TouchableOpacity
                    key={sym}
                    style={[
                      styles.currencyPill,
                      currencySymbol === sym && styles.currencyPillActive,
                    ]}
                    onPress={() => setCurrencySymbol(sym)}
                  >
                    <Text
                      style={[
                        styles.currencyPillText,
                        currencySymbol === sym && styles.currencyPillTextActive,
                      ]}
                    >
                      {sym}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Monthly Budget */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Expense Target / Budget *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.monthlyBudget ? styles.inputWrapperError : null,
                ]}
              >
                <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
                <TextInput
                  style={styles.input}
                  value={monthlyBudget}
                  onChangeText={t => {
                    setMonthlyBudget(t);
                    setErrors(prev => ({ ...prev, monthlyBudget: null }));
                  }}
                  placeholder="e.g. 25000"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                />
              </View>
              {errors.monthlyBudget && (
                <Text style={styles.errorText}>{errors.monthlyBudget}</Text>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Ionicons name="save-outline" size={18} color={COLORS.white} />
              <Text style={styles.saveButtonText}>Save Updated Profile</Text>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  infoBannerText: {
    fontSize: 12,
    color: '#3730A3',
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  inputGroup: {
    marginBottom: SPACING.base,
  },
  label: {
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
  currencyRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  currencyPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  currencyPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  currencyPillText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  currencyPillTextActive: {
    color: COLORS.white,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    gap: 8,
    ...SHADOWS.sm,
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
