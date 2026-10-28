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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export const SignUpScreen = ({ navigation }) => {
  const { register, authError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Customer'); // 'Customer' | 'Admin'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (phone.trim().length < 10) {
      newErrors.phone = 'Enter a valid 10-digit phone number.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!validate()) return;

    const result = register({
      name,
      email,
      phone,
      password,
      role,
    });

    if (result.success) {
      Alert.alert(
        'Account Created',
        `Welcome to FinTrack, ${result.user.name}! Your ${role} account has been created.`,
        [{ text: 'Continue' }]
      );
    } else {
      Alert.alert('Registration Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Link */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          <Text style={styles.backButtonText}>Back to Sign In</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join FinTrack Budget Manager to track and analyze expenses
          </Text>
        </View>

        {/* Card Form */}
        <View style={[styles.card, SHADOWS.lg]}>
          {authError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          {/* Account Role Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Register As</Text>
            <View style={styles.rolePickerRow}>
              <TouchableOpacity
                style={[
                  styles.roleChoice,
                  role === 'Customer' && styles.roleChoiceActiveCustomer,
                ]}
                onPress={() => setRole('Customer')}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={role === 'Customer' ? COLORS.white : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.roleChoiceText,
                    role === 'Customer' && styles.roleChoiceTextActive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleChoice,
                  role === 'Admin' && styles.roleChoiceActiveAdmin,
                ]}
                onPress={() => setRole('Admin')}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={role === 'Admin' ? COLORS.white : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.roleChoiceText,
                    role === 'Admin' && styles.roleChoiceTextActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.name ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. Madhan Kumar"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={t => {
                  setName(t);
                  setErrors(prev => ({ ...prev, name: null }));
                }}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.email ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. user@example.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  setErrors(prev => ({ ...prev, email: null }));
                }}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.phone ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. +91 98765 43210"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={t => {
                  setPhone(t);
                  setErrors(prev => ({ ...prev, phone: null }));
                }}
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Create password (min 6 chars)"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={t => {
                  setPassword(t);
                  setErrors(prev => ({ ...prev, password: null }));
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.confirmPassword ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={t => {
                  setConfirmPassword(t);
                  setErrors(prev => ({ ...prev, confirmPassword: null }));
                }}
              />
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Register as {role}</Text>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: 50,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  rolePickerRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  roleChoice: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleChoiceActiveCustomer: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleChoiceActiveAdmin: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  roleChoiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  roleChoiceTextActive: {
    color: COLORS.white,
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
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.base,
  },
  errorBannerText: {
    fontSize: 12,
    color: COLORS.dangerDark,
    marginLeft: 6,
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.base,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  signInLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
