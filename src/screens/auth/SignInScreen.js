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

export const SignInScreen = ({ navigation }) => {
  const { login, authError, setAuthError, demoUsers } = useAuth();

  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer' | 'Admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Quick fill demo credentials
  const fillDemo = (role) => {
    setSelectedRole(role);
    setValidationErrors({});
    setAuthError(null);

    const demo = demoUsers.find(u => u.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
    }
  };

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. name@example.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = () => {
    if (!validate()) return;

    const result = login(email, password, selectedRole);
    if (!result.success) {
      // Alert dialog for invalid credentials/role mismatch
      Alert.alert('Sign In Failed', result.message);
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
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.brandIconWrapper}>
            <Ionicons name="wallet" size={32} color={COLORS.white} />
          </View>
          <Text style={styles.appName}>FinTrack Pro</Text>
          <Text style={styles.appTagline}>Finance Budget Tracker Application</Text>
        </View>

        {/* Card Form */}
        <View style={[styles.card, SHADOWS.lg]}>
          <Text style={styles.cardTitle}>Sign In to Your Account</Text>
          <Text style={styles.cardSubtitle}>
            Select your assigned role and enter your credentials
          </Text>

          {/* Role Switcher Tabs */}
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'Customer' && styles.roleTabActiveCustomer,
              ]}
              onPress={() => {
                setSelectedRole('Customer');
                setAuthError(null);
              }}
            >
              <Ionicons
                name="person"
                size={16}
                color={selectedRole === 'Customer' ? COLORS.white : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'Customer' && styles.roleTabTextActive,
                ]}
              >
                Customer Role
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'Admin' && styles.roleTabActiveAdmin,
              ]}
              onPress={() => {
                setSelectedRole('Admin');
                setAuthError(null);
              }}
            >
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={selectedRole === 'Admin' ? COLORS.white : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'Admin' && styles.roleTabTextActive,
                ]}
              >
                Admin Role
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Quick Fill Buttons */}
          <View style={styles.demoFillContainer}>
            <Text style={styles.demoLabel}>1-Tap Demo Auto Fill:</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={[styles.demoPill, { borderColor: COLORS.primary }]}
                onPress={() => fillDemo('Customer')}
              >
                <Text style={[styles.demoPillText, { color: COLORS.primary }]}>
                  ⚡ Gokul (Customer)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoPill, { borderColor: COLORS.danger }]}
                onPress={() => fillDemo('Admin')}
              >
                <Text style={[styles.demoPillText, { color: COLORS.dangerDark }]}>
                  ⚡ Madhan (Admin)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auth Error Banner */}
          {authError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                validationErrors.email ? styles.inputError : null,
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
                placeholder="e.g. gokul.customer@example.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  setValidationErrors(prev => ({ ...prev, email: null }));
                  setAuthError(null);
                }}
              />
            </View>
            {validationErrors.email && (
              <Text style={styles.validationErrorText}>
                {validationErrors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                validationErrors.password ? styles.inputError : null,
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
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={t => {
                  setPassword(t);
                  setValidationErrors(prev => ({ ...prev, password: null }));
                  setAuthError(null);
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
            {validationErrors.password && (
              <Text style={styles.validationErrorText}>
                {validationErrors.password}
              </Text>
            )}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.signInButton,
              selectedRole === 'Admin' ? styles.signInButtonAdmin : styles.signInButtonCustomer,
            ]}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>
              Sign In as {selectedRole}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Credentials Reference */}
        <View style={styles.credCheatCard}>
          <Text style={styles.cheatTitle}>Demo Accounts Reference:</Text>
          <Text style={styles.cheatText}>
            • <Text style={{ fontWeight: '700' }}>Admin:</Text> madhan.admin@example.com | Admin@123
          </Text>
          <Text style={styles.cheatText}>
            • <Text style={{ fontWeight: '700' }}>Customer:</Text> gokul.customer@example.com | Customer@123
          </Text>
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
    flexGrow: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  brandIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: SPACING.base,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.md,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  roleTabActiveCustomer: {
    backgroundColor: COLORS.primary,
  },
  roleTabActiveAdmin: {
    backgroundColor: '#DC2626',
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  roleTabTextActive: {
    color: COLORS.white,
  },
  demoFillContainer: {
    marginBottom: SPACING.base,
  },
  demoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  demoPill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '700',
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
    fontWeight: '500',
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
  validationErrorText: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: '500',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    gap: 8,
  },
  signInButtonCustomer: {
    backgroundColor: COLORS.primary,
  },
  signInButtonAdmin: {
    backgroundColor: '#DC2626',
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  signUpLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  credCheatCard: {
    marginTop: SPACING.lg,
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cheatTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  cheatText: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
