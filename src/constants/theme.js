// Design Tokens & Theme for Finance Budget Tracker
export const COLORS = {
  // Brand colors
  primary: '#4F46E5', // Indigo
  primaryDark: '#3730A3',
  primaryLight: '#818CF8',
  primaryMuted: '#EEF2FF',

  secondary: '#0EA5E9', // Sky blue
  secondaryLight: '#E0F2FE',

  // Status colors
  success: '#10B981', // Emerald green (Income)
  successLight: '#D1FAE5',
  successDark: '#047857',

  danger: '#EF4444', // Red (Expense)
  dangerLight: '#FEE2E2',
  dangerDark: '#B91C1C',

  warning: '#F59E0B', // Amber
  warningLight: '#FEF3C7',

  info: '#3B82F6', // Blue
  infoLight: '#DBEAFE',

  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',

  // Neutrals & Backgrounds
  background: '#F8FAFC',
  card: '#FFFFFF',
  surface: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Text colors
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textLight: '#CBD5E1',
  white: '#FFFFFF',
  black: '#000000',

  // Gradients (defined as array of strings)
  gradientPrimary: ['#4F46E5', '#7C3AED'],
  gradientSuccess: ['#10B981', '#059669'],
  gradientDanger: ['#EF4444', '#DC2626'],
  gradientDark: ['#1E293B', '#0F172A'],
  gradientCard: ['#6366F1', '#4F46E5'],
  gradientSky: ['#0EA5E9', '#2563EB'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
